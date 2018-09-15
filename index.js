#!/usr/bin/env node

const { join } = require('path')
const execa = require('execa')
const Listr = require('listr')

function runAllRepoTests() {
  const repos = require('./repos')
  runRepoTests(repos)
}

function runRepoTests(repos) {
  const tasks = new Listr(
    repos.map(repo => ({
      title: repo,
      task: () => runRepoTest(repo),
    })),
    {
      concurrent: true,
      exitOnError: false,
    }
  )
  console.log('Running tests')
  return tasks.run().catch(error => {
    const divider = `\n${'='.repeat(80)}\n`
    console.error(error.errors.map(err => err.message).join(divider))
    process.exitCode = 1
  })
}

function runRepoTest(name) {
  const cwd = join(__dirname, name)
  return execa('npm', ['test'], { cwd }).catch(error => {
    error.message += getTestStats(error.stdout)
    throw error
  })
}

function getTestStats(stdout) {
  return (stdout.match(/\d+ specs?(, \d+ failures?)?/g) || []).join(' / ')
}

runAllRepoTests()
