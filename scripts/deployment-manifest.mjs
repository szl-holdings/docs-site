import { createHash } from 'node:crypto'
import {
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from 'node:fs'
import { relative, resolve, sep } from 'node:path'

export const CONTRACT = 'szl.docs-site.deployment/v1'
export const CANONICAL_URL = 'https://holdings.a-11-oy.com/docs-site/'
export const EXPECTED_REPOSITORY = 'szl-holdings/docs-site'
export const EXPECTED_REF = 'refs/heads/main'
export const EXPECTED_WORKFLOW = '.github/workflows/deploy-pages.yml'
export const MANIFEST_NAME = 'deployment.json'
export const ARTIFACT_ROOT_SCHEME = 'sha256-path-nul-bytes-nul-sha256-lf-v1'

const SHA256 = /^[0-9a-f]{64}$/
const GIT_SHA = /^[0-9a-f]{40}$/
const POSITIVE_INTEGER = /^[1-9][0-9]*$/
const ALLOWED_EVENTS = new Set(['push', 'workflow_dispatch'])

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertExactKeys(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`)
  const actual = Object.keys(value).sort()
  const expected = [...keys].sort()
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} field set mismatch`)
}

function normalizedRelative(root, path) {
  const value = relative(root, path).split(sep).join('/')
  assert(value && !value.startsWith('../') && !value.includes('/../'), `unsafe artifact path: ${value}`)
  assert(
    !value.startsWith('/') &&
    !/[\\%:?#\u0000-\u001f\u007f]/.test(value) &&
    !value.split('/').some((segment) => segment === '.' || segment === '..' || segment === ''),
    `unsafe artifact path: ${value}`
  )
  return value
}

function validateArtifactPath(value) {
  assert(typeof value === 'string' && value.length > 0, 'deployment artifact path is invalid')
  assert(
    !value.startsWith('/') &&
    !/[\\%:?#\u0000-\u001f\u007f]/.test(value) &&
    !value.split('/').some((segment) => segment === '.' || segment === '..' || segment === ''),
    `deployment artifact path is unsafe: ${value}`
  )
}

function artifactRoot(files) {
  const rootHash = createHash('sha256')
  for (const file of files) {
    rootHash.update(file.path, 'utf8')
    rootHash.update('\0')
    rootHash.update(String(file.bytes), 'utf8')
    rootHash.update('\0')
    rootHash.update(file.sha256, 'ascii')
    rootHash.update('\n')
  }
  return rootHash.digest('hex')
}

function walkFiles(root, directory = root, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    const stat = lstatSync(path)
    assert(!stat.isSymbolicLink(), `artifact symlink is forbidden: ${normalizedRelative(root, path)}`)
    if (stat.isDirectory()) {
      walkFiles(root, path, files)
    } else {
      assert(stat.isFile(), `unsupported artifact entry: ${normalizedRelative(root, path)}`)
      files.push(path)
    }
  }
  return files
}

export function inventoryArtifact(distPath) {
  const root = resolve(distPath)
  assert(existsSync(root) && lstatSync(root).isDirectory(), 'built artifact directory is missing')

  const files = walkFiles(root)
    .map((path) => ({ path, relative: normalizedRelative(root, path) }))
    .filter(({ relative }) => relative !== MANIFEST_NAME)
    .sort((a, b) => (a.relative < b.relative ? -1 : a.relative > b.relative ? 1 : 0))
    .map(({ path, relative: artifactPath }) => {
      const bytes = readFileSync(path)
      return {
        path: artifactPath,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex')
      }
    })

  assert(files.length > 0, 'built artifact inventory is empty')
  const seen = new Set()
  for (const file of files) {
    assert(!seen.has(file.path), `duplicate artifact path: ${file.path}`)
    seen.add(file.path)
  }

  return {
    algorithm: 'sha256',
    root_scheme: ARTIFACT_ROOT_SCHEME,
    file_count: files.length,
    total_bytes: files.reduce((total, file) => total + file.bytes, 0),
    root_sha256: artifactRoot(files),
    files
  }
}

export function contextFromEnvironment(env = process.env) {
  return {
    repository: env.GITHUB_REPOSITORY,
    revision: env.GITHUB_SHA,
    tree: env.SOURCE_TREE_SHA,
    ref: env.GITHUB_REF,
    ref_protected: env.GITHUB_REF_PROTECTED,
    event: env.GITHUB_EVENT_NAME,
    workflow_ref: env.GITHUB_WORKFLOW_REF,
    workflow_sha: env.GITHUB_WORKFLOW_SHA,
    run_id: env.GITHUB_RUN_ID,
    run_attempt: env.GITHUB_RUN_ATTEMPT,
    server_url: env.GITHUB_SERVER_URL
  }
}

export function validateContext(context) {
  assertExactKeys(context, [
    'repository',
    'revision',
    'tree',
    'ref',
    'ref_protected',
    'event',
    'workflow_ref',
    'workflow_sha',
    'run_id',
    'run_attempt',
    'server_url'
  ], 'deployment context')
  assert(context.repository === EXPECTED_REPOSITORY, 'deployment repository is not canonical')
  assert(GIT_SHA.test(context.revision ?? ''), 'deployment revision must be an exact lowercase Git SHA')
  assert(GIT_SHA.test(context.tree ?? ''), 'deployment tree must be an exact lowercase Git SHA')
  assert(context.ref === EXPECTED_REF, 'deployment ref must be protected main')
  assert(context.ref_protected === 'true', 'deployment ref is not reported protected')
  assert(ALLOWED_EVENTS.has(context.event), 'deployment event is not admitted')
  const expectedWorkflowRef = `${EXPECTED_REPOSITORY}/${EXPECTED_WORKFLOW}@${EXPECTED_REF}`
  assert(context.workflow_ref === expectedWorkflowRef, 'deployment workflow ref is not canonical')
  assert(context.workflow_sha === context.revision, 'workflow revision does not match source revision')
  assert(POSITIVE_INTEGER.test(context.run_id ?? ''), 'deployment run id is invalid')
  assert(POSITIVE_INTEGER.test(context.run_attempt ?? ''), 'deployment run attempt is invalid')
  assert(context.server_url === 'https://github.com', 'deployment server is not canonical GitHub')
  return context
}

export function buildManifest(distPath, context) {
  validateContext(context)
  const artifact = inventoryArtifact(distPath)
  return {
    contract: CONTRACT,
    source: {
      repository: context.repository,
      revision: context.revision,
      tree: context.tree,
      ref: context.ref,
      ref_protected: true
    },
    workflow: {
      path: EXPECTED_WORKFLOW,
      ref: context.workflow_ref,
      revision: context.workflow_sha,
      event: context.event,
      run_id: Number(context.run_id),
      run_attempt: Number(context.run_attempt),
      run_url: `${context.server_url}/${context.repository}/actions/runs/${context.run_id}/attempts/${context.run_attempt}`
    },
    publication: {
      provider: 'github-pages',
      canonical_url: CANONICAL_URL
    },
    artifact
  }
}

export function writeManifest(distPath, context) {
  const root = resolve(distPath)
  const path = resolve(root, MANIFEST_NAME)
  assert(!existsSync(path), `${MANIFEST_NAME} already exists; refusing to overwrite release evidence`)
  const manifest = buildManifest(root, context)
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' })
  return manifest
}

function assertManifestShape(manifest) {
  assertExactKeys(manifest, ['contract', 'source', 'workflow', 'publication', 'artifact'], 'deployment manifest')
  assert(manifest.contract === CONTRACT, 'deployment contract is unsupported')
  assertExactKeys(manifest.source, ['repository', 'revision', 'tree', 'ref', 'ref_protected'], 'deployment source')
  assertExactKeys(manifest.workflow, [
    'path',
    'ref',
    'revision',
    'event',
    'run_id',
    'run_attempt',
    'run_url'
  ], 'deployment workflow')
  assertExactKeys(manifest.publication, ['provider', 'canonical_url'], 'deployment publication')
  assertExactKeys(manifest.artifact, [
    'algorithm',
    'root_scheme',
    'file_count',
    'total_bytes',
    'root_sha256',
    'files'
  ], 'deployment artifact')
  assert(Array.isArray(manifest.artifact.files), 'deployment artifact files must be an array')
  const seen = new Set()
  let previous = ''
  for (const file of manifest.artifact.files) {
    assertExactKeys(file, ['path', 'bytes', 'sha256'], 'deployment artifact file')
    validateArtifactPath(file.path)
    assert(!seen.has(file.path), `duplicate deployment artifact path: ${file.path}`)
    assert(previous === '' || previous < file.path, 'deployment artifact paths are not in canonical order')
    seen.add(file.path)
    previous = file.path
    assert(Number.isSafeInteger(file.bytes) && file.bytes >= 0, `artifact byte count is invalid: ${file.path}`)
    assert(SHA256.test(file.sha256 ?? ''), `artifact digest is invalid: ${file.path}`)
  }
  assert(Number.isSafeInteger(manifest.artifact.file_count) && manifest.artifact.file_count > 0, 'deployment artifact file count is invalid')
  assert(manifest.artifact.file_count === manifest.artifact.files.length, 'deployment artifact file count is inconsistent')
  assert(Number.isSafeInteger(manifest.artifact.total_bytes) && manifest.artifact.total_bytes >= 0, 'deployment artifact total bytes is invalid')
  assert(
    manifest.artifact.total_bytes === manifest.artifact.files.reduce((total, file) => total + file.bytes, 0),
    'deployment artifact total bytes is inconsistent'
  )
  assert(manifest.artifact.algorithm === 'sha256', 'deployment artifact algorithm is unsupported')
  assert(manifest.artifact.root_scheme === ARTIFACT_ROOT_SCHEME, 'deployment artifact root scheme is unsupported')
  assert(SHA256.test(manifest.artifact.root_sha256 ?? ''), 'deployment artifact root digest is invalid')
  assert(manifest.artifact.root_sha256 === artifactRoot(manifest.artifact.files), 'deployment artifact root digest is inconsistent')
}

export function verifyManifest(distPath, context) {
  validateContext(context)
  const root = resolve(distPath)
  const path = resolve(root, MANIFEST_NAME)
  assert(existsSync(path) && lstatSync(path).isFile(), `${MANIFEST_NAME} is missing`)
  const manifest = JSON.parse(readFileSync(path, 'utf8'))
  assertManifestShape(manifest)

  const expected = buildManifest(root, context)
  assert(JSON.stringify(manifest) === JSON.stringify(expected), 'deployment manifest does not match source or artifact bytes')
  return manifest
}

export function verifyRemoteManifest(manifest, expectedRevision) {
  assertManifestShape(manifest)
  assert(GIT_SHA.test(expectedRevision ?? ''), 'expected live revision must be an exact lowercase Git SHA')
  assert(manifest.contract === CONTRACT, 'live deployment contract is unsupported')
  assert(manifest.source.repository === EXPECTED_REPOSITORY, 'live deployment repository is not canonical')
  assert(manifest.source.revision === expectedRevision, 'live deployment revision does not match expected source')
  assert(GIT_SHA.test(manifest.source.tree ?? ''), 'live deployment tree identity is invalid')
  assert(manifest.source.ref === EXPECTED_REF && manifest.source.ref_protected === true, 'live deployment is not bound to protected main')
  assert(manifest.workflow.path === EXPECTED_WORKFLOW, 'live deployment workflow path is not canonical')
  assert(manifest.workflow.revision === expectedRevision, 'live workflow revision does not match expected source')
  assert(manifest.workflow.ref === `${EXPECTED_REPOSITORY}/${EXPECTED_WORKFLOW}@${EXPECTED_REF}`, 'live workflow ref is not canonical')
  assert(ALLOWED_EVENTS.has(manifest.workflow.event), 'live deployment event is not admitted')
  assert(Number.isSafeInteger(manifest.workflow.run_id) && manifest.workflow.run_id > 0, 'live deployment run id is invalid')
  assert(Number.isSafeInteger(manifest.workflow.run_attempt) && manifest.workflow.run_attempt > 0, 'live deployment run attempt is invalid')
  assert(
    manifest.workflow.run_url ===
      `https://github.com/${EXPECTED_REPOSITORY}/actions/runs/${manifest.workflow.run_id}/attempts/${manifest.workflow.run_attempt}`,
    'live deployment run URL is not canonical'
  )
  assert(manifest.publication.provider === 'github-pages', 'live deployment provider is not GitHub Pages')
  assert(manifest.publication.canonical_url === CANONICAL_URL, 'live deployment URL is not canonical')
  return manifest
}

export function parseRemoteManifest(manifestBytes, expectedManifestSha256, expectedRevision) {
  assert(Buffer.isBuffer(manifestBytes), 'live deployment manifest must be exact bytes')
  assert(SHA256.test(expectedManifestSha256 ?? ''), 'expected deployment-manifest digest is invalid')
  const actualSha256 = createHash('sha256').update(manifestBytes).digest('hex')
  assert(actualSha256 === expectedManifestSha256, `live deployment manifest mismatch: ${actualSha256}`)
  return verifyRemoteManifest(JSON.parse(manifestBytes.toString('utf8')), expectedRevision)
}

export function witnessCacheKey(revision, runId, runAttempt, poll) {
  assert(GIT_SHA.test(revision ?? ''), 'witness revision is invalid')
  assert(POSITIVE_INTEGER.test(String(runId ?? '')), 'witness run id is invalid')
  assert(POSITIVE_INTEGER.test(String(runAttempt ?? '')), 'witness run attempt is invalid')
  assert(Number.isSafeInteger(poll) && poll > 0, 'witness poll is invalid')
  return new URLSearchParams({
    revision,
    run: String(runId),
    attempt: String(runAttempt),
    poll: String(poll)
  })
}
