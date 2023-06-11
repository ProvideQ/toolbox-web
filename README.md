# ProvideQ
This repository contains the web frontend for the ProvideQ toolbox. 

## Development setup
1. Install [Node.js 16](https://nodejs.org/) (check with `node -v`)
2. Make sure that the [Yarn package manager is enabled](https://yarnpkg.com/getting-started/install) (check with `yarn -v`)
3. Clone this repository
4. Install dependencies: `yarn install`
5. Optional:
   By default, Next.js will collect
   [anonymous telemetry data](https://nextjs.org/telemetry).
   You can disable the data collection using `yarn exec next telemetry disable`.
5. Use `yarn dev` to spin up a local development server

## Releasing a new version
1. Create a release branch from develop: `git checkout -b release/x.y.z`.
2. Bump the version number in the `package.json` file to the new version number
   and commit it to the release branch.
3. Push to GitHub and create a pull request to merge the release branch into
   `main`.
4. Make sure to test your new version!
5. Write a changelog.
   The PR can help you identify differences between the last release (`main`)
   and the next one (your release branch).
6. Merge the PR into main.
7. [Create a new GitHub release](https://github.com/ProvideQ/toolbox-web/releases/new) with a new tag named like your
   version number `x.y.z` and use the changelog as the description.
9. Pull the main branch (`git checkout main && git pull`), merge it into the
   develop branch (`git checkout develop && git pull && git merge main`) and
   push it (`git push`).

## License
Copyright (c) 2022 - 2023 ProvideQ

This project is available under the [MIT License](./LICENSE)
