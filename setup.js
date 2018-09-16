#!/usr/bin/env node

const { join } = require('path')
const execa = require('execa')
const Listr = require('listr')

const TEST_BRANCH = 'cross-spawn-test'

function setupAllRepos() {
  Promise.resolve(require('./repos'))
    .then(cloneRepos)
    .then(_ => checkoutBranch('cordova-cli', TEST_BRANCH))
    .then(_ => checkoutBranch('cordova-common', TEST_BRANCH))
    .then(installDependencies)
    .then(linkRepos)
    .then(logRepoStatus)
}

function cloneRepos(repos) {
  const tasks = new Listr(
    repos.map(repo => ({
      title: repo,
      task: () => cloneRepo(repo),
    })),
    {
      concurrent: true,
      renderer: process.env.TRAVIS ? 'verbose' : 'default',
    }
  )
  console.log('Cloning repositories')
  return tasks.run()
}

function cloneRepo(name) {
  const url = `https://github.com/apache/${name}.git`
  return execa('git', ['clone', '--depth', 1, '--no-single-branch', url])
}

function checkoutBranch(repo, branch) {
  const cwd = join(__dirname, repo)
  return execa('git', ['checkout', branch], { cwd })
}

function linkRepos() {
  console.log('Linking repositories')
  return execa('spodr', ['update', '--link', '--linkdep'], { stdio: 'inherit' })
}

function installDependencies() {
  console.log('Installing dependecies')
  return execa('spodr', ['update', '--deps', '-j1'], { stdio: 'inherit' })
}

function logRepoStatus() {
  return execa('spodr', ['status', '--name-only'], { stdio: 'inherit' })
}

setupAllRepos()
