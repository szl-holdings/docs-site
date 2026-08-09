import process from 'node:process'
import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const EXPECTED_REPOSITORY = 'szl-holdings/docs-site'
const EXPECTED_REF = 'refs/heads/main'
const GIT_SHA = /^[0-9a-f]{40}$/

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function readJson(url, token, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      'user-agent': 'szl-docs-protected-source-verifier'
    },
    redirect: 'error',
    signal: AbortSignal.timeout(20_000)
  })
  assert(response.ok, `GitHub source read returned HTTP ${response.status}`)
  return response.json()
}

export async function verifyProtectedSource(env = process.env, fetchImpl = fetch) {
  const repository = env.GITHUB_REPOSITORY
  const revision = env.GITHUB_SHA
  const ref = env.GITHUB_REF
  const refProtected = env.GITHUB_REF_PROTECTED
  const token = env.GITHUB_TOKEN

  assert(repository === EXPECTED_REPOSITORY, 'release repository is not canonical')
  assert(GIT_SHA.test(revision ?? ''), 'release revision must be an exact lowercase Git SHA')
  assert(ref === EXPECTED_REF, 'release ref must be main')
  assert(refProtected === 'true', 'release ref is not reported protected')
  assert(typeof token === 'string' && token.length > 0, 'GitHub source-read token is unavailable')

  const apiBase = `https://api.github.com/repos/${EXPECTED_REPOSITORY}`
  const repositoryState = await readJson(apiBase, token, fetchImpl)
  assert(repositoryState.default_branch === 'main', 'repository default branch is not main')

  const current = await readJson(`${apiBase}/commits/main`, token, fetchImpl)
  assert(current.sha === revision, `release source is stale: main=${current.sha ?? 'unknown'} source=${revision}`)
  assert(current.commit?.verification?.verified === true, 'current main commit signature is not verified')
  assert(current.commit?.verification?.reason === 'valid', 'current main commit signature is not valid')
  assert(GIT_SHA.test(current.commit?.tree?.sha ?? ''), 'current main tree identity is unavailable')
  return current
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : ''
if (import.meta.url === invokedPath) {
  try {
    const current = await verifyProtectedSource()
    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(process.env.GITHUB_OUTPUT, `source_tree=${current.commit.tree.sha}\n`, 'utf8')
    }
    console.log(`protected-source: VERIFIED current signed main ${current.sha}`)
  } catch (error) {
    console.error(`protected-source: ${error.message}`)
    process.exitCode = 1
  }
}
