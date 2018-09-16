# Cordova `cross-spawn` Test

## Test Instructions

- Check out and change into this repository
```
git clone https://github.com/raphinesse/cordova-cross-spawn-test.git && cd cordova-cross-spawn-test
```
- Configure which repos you want to test by editing `repos.js`
- Install dependencies and setup test repositories
```
npm i
```
- Run tests for all repositories using `cordova-common@master`. This is to check that these tests pass on your machine _without_ the `cross-spawn` change.
```
npm t
```
- Now run the tests for all repositories using `cordova-common@cross-spawn`
```
git -C cordova-common checkout cross-spawn
npm t
```
