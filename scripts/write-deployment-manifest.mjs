import { createHash } from 'node:crypto'
import { appendFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { contextFromEnvironment, MANIFEST_NAME, writeManifest } from './deployment-manifest.mjs'

const distPath = process.argv[2] ?? 'docs/.vitepress/dist'

try {
  const manifest = writeManifest(distPath, contextFromEnvironment())
  const manifestSha256 = createHash('sha256')
    .update(readFileSync(resolve(distPath, MANIFEST_NAME)))
    .digest('hex')
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `deployment_manifest_sha256=${manifestSha256}\n`, 'utf8')
  }
  console.log(
    `deployment-manifest: WROTE ${manifest.source.revision} ` +
    `${manifest.artifact.file_count} files root=${manifest.artifact.root_sha256} ` +
    `manifest=${manifestSha256}`
  )
} catch (error) {
  console.error(`deployment-manifest: ${error.message}`)
  process.exitCode = 1
}
