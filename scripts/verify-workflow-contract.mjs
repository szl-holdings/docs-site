import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const INSTALL_BROWSER = 'npx --no-install playwright install --with-deps chromium'
const RUN_BROWSER = 'npm run test:browser:built'
const UPLOAD_PAGES = 'actions/upload-pages-artifact@'

function requireOrdered(source, markers, label, issues) {
  let previous = -1
  for (const marker of markers) {
    const index = source.indexOf(marker)
    if (index === -1) {
      issues.push(`${label} -> missing ${marker}`)
      return
    }
    if (index <= previous) {
      issues.push(`${label} -> ${marker} is out of required order`)
      return
    }
    previous = index
  }
}

/** Verify that browser validation is hosted and gates the Pages artifact. */
export function collectWorkflowContractIssues({ packageJson, experienceWorkflow, deployWorkflow }) {
  const issues = []
  let parsedPackage
  try {
    parsedPackage = JSON.parse(packageJson)
  } catch {
    return ['package.json -> invalid JSON']
  }
  if (parsedPackage.scripts?.['test:browser:built'] !== 'playwright test') {
    issues.push('package.json -> test:browser:built must run the checked-in Playwright suite')
  }

  requireOrdered(
    experienceWorkflow,
    ['npm ci --no-audit --no-fund', 'npm run docs:build', INSTALL_BROWSER, RUN_BROWSER],
    'experience.yml',
    issues
  )
  requireOrdered(
    deployWorkflow,
    ['npm ci --no-audit --no-fund', 'npm run docs:build', INSTALL_BROWSER, RUN_BROWSER, UPLOAD_PAGES],
    'deploy-pages.yml',
    issues
  )
  return issues
}

export function verifyWorkflowContract(rootPath = resolve('.')) {
  const input = {
    packageJson: readFileSync(resolve(rootPath, 'package.json'), 'utf8'),
    experienceWorkflow: readFileSync(resolve(rootPath, '.github/workflows/experience.yml'), 'utf8'),
    deployWorkflow: readFileSync(resolve(rootPath, '.github/workflows/deploy-pages.yml'), 'utf8')
  }
  const issues = collectWorkflowContractIssues(input)
  if (issues.length) throw new Error(`hosted browser contract failed\n${issues.join('\n')}`)
  return { workflows: 2 }
}

const invokedPath = process.argv[1] ? fileURLToPath(import.meta.url) : ''
if (process.argv[1] && resolve(process.argv[1]) === resolve(invokedPath)) {
  try {
    const result = verifyWorkflowContract()
    console.log(`hosted-browser-contract: OK (${result.workflows} workflows)`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
