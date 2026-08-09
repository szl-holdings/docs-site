import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyProtectedSource } from './verify-protected-source.mjs'

const revision = 'a'.repeat(40)
const tree = 'c'.repeat(40)
const env = Object.freeze({
  GITHUB_REPOSITORY: 'szl-holdings/docs-site',
  GITHUB_SHA: revision,
  GITHUB_REF: 'refs/heads/main',
  GITHUB_REF_PROTECTED: 'true',
  GITHUB_TOKEN: 'test-token-never-sent'
})

function response(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return body }
  }
}

function githubFetch({ head = revision, verified = true, reason = 'valid', defaultBranch = 'main' } = {}) {
  return async (url) => {
    if (url.endsWith('/commits/main')) {
      return response({
        sha: head,
        commit: { tree: { sha: tree }, verification: { verified, reason } }
      })
    }
    return response({ default_branch: defaultBranch })
  }
}

test('accepts only the current validly signed protected default branch', async () => {
  const current = await verifyProtectedSource(env, githubFetch())
  assert.equal(current.sha, revision)
  assert.equal(current.commit.tree.sha, tree)
})

test('rejects a stale workflow source after main advances', async () => {
  await assert.rejects(
    verifyProtectedSource(env, githubFetch({ head: 'b'.repeat(40) })),
    /release source is stale/
  )
})

test('rejects unsigned, invalid, unprotected, or non-main sources', async () => {
  await assert.rejects(verifyProtectedSource(env, githubFetch({ verified: false, reason: 'unsigned' })), /not verified/)
  await assert.rejects(verifyProtectedSource(env, githubFetch({ reason: 'unknown_key' })), /not valid/)
  await assert.rejects(verifyProtectedSource({ ...env, GITHUB_REF_PROTECTED: 'false' }, githubFetch()), /not reported protected/)
  await assert.rejects(verifyProtectedSource({ ...env, GITHUB_REF: 'refs/heads/release' }, githubFetch()), /must be main/)
  await assert.rejects(verifyProtectedSource(env, githubFetch({ defaultBranch: 'trunk' })), /default branch is not main/)
})

test('fails closed when GitHub source evidence is unavailable', async () => {
  await assert.rejects(
    verifyProtectedSource(env, async () => response({}, 503)),
    /returned HTTP 503/
  )
})
