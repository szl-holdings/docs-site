import process from 'node:process'
import { contextFromEnvironment, verifyManifest } from './deployment-manifest.mjs'

const distPath = process.argv[2] ?? 'docs/.vitepress/dist'

try {
  const manifest = verifyManifest(distPath, contextFromEnvironment())
  console.log(
    `deployment-manifest: VERIFIED ${manifest.source.revision} ` +
    `${manifest.artifact.file_count} files root=${manifest.artifact.root_sha256}`
  )
} catch (error) {
  console.error(`deployment-manifest: ${error.message}`)
  process.exitCode = 1
}
