import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { collectWorkflowContractIssues, verifyWorkflowContract } from './verify-workflow-contract.mjs'

const root = resolve('.')
const current = Object.freeze({
  packageJson: readFileSync(resolve(root, 'package.json'), 'utf8'),
  experienceWorkflow: readFileSync(resolve(root, '.github/workflows/experience.yml'), 'utf8'),
  deployWorkflow: readFileSync(resolve(root, '.github/workflows/deploy-pages.yml'), 'utf8')
})

test('current hosted workflows execute the checked-in browser suite before publication', () => {
  assert.deepEqual(collectWorkflowContractIssues(current), [])
  assert.deepEqual(verifyWorkflowContract(root), { workflows: 2 })
})

test('fails when hosted browser execution is removed', () => {
  const withoutBrowser = {
    ...current,
    experienceWorkflow: current.experienceWorkflow.replace('npm run test:browser:built', 'npm run docs:build')
  }
  assert.match(collectWorkflowContractIssues(withoutBrowser).join('\n'), /experience\.yml -> missing npm run test:browser:built/)
})

test('fails when Pages upload can run before browser validation', () => {
  const upload = current.deployWorkflow.match(/^\s*- uses: actions\/upload-pages-artifact@.*$/m)?.[0]
  assert.ok(upload)
  const reordered = current.deployWorkflow
    .replace(`${upload}\n`, '')
    .replace('      - name: Install hosted browser', `${upload}\n      - name: Install hosted browser`)
  const issues = collectWorkflowContractIssues({ ...current, deployWorkflow: reordered }).join('\n')
  assert.match(issues, /deploy-pages\.yml -> actions\/upload-pages-artifact@ is out of required order/)
})
