# RX Store

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

![Build status](https://github.com/rx-store/rx-store/workflows/build/badge.svg)

Rx Store is a reactive state management solution for frontend component libraries such as React & Angular, allowing you to build your application's logic using RxJs.

. https://rx-store.github.io/rx-store/

## Development

First, clone the monorepo onto your machine:

```
git clone git@github.com:rx-store/rx-store.git
```

Then, install the monorepo dependencies:

```
yarn
```

This monorepo uses [Nx](https://nx.dev/react), which allows:

- Visualizing the dependencies between packages
- Automatically compiling affected packages when there are changes
- Run CI checks only for affected packages when there are changes.

To develop locally, you may install `Nx` globally:

```
npm install -g @nrwl/cli
```

The packages are organized into `apps` folder, which are runnable, and `libs` for library code. To generate a new app or lib, see the [Nx docs](https://nx.dev/react/cli/generate).

### Running the "Examples" in the "apps" folder

Replace `react-example-counter` with the name of the project in the `apps` folder you want to run.

Develop:

```
nx serve react-example-counter
```

When editing files in the core during development, the example you are running will re-compile. Nx builds a dependency graph, and runs webpack from the top level. If changes are made in a package that the example app depends on, or any package it in turn depends on, Nx will figure it out & re-build the affected packages.

Build:

```
nx build --with-deps react-example-counter
```

By passing `--with-deps`, we are telling Nx to build a dependency graph & compile all of the package(s) the example project depends on, and all of the package(s) those in turn depend on.

### Developing on the Website / Docs

Develop:

```
nx run rx-store-website:docusaurus
```

Build:

```
nx build rx-store-website:docusaurus
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/kosich"><img src="https://avatars3.githubusercontent.com/u/3994718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kostia P</b></sub></a><br /><a href="https://github.com/rx-store/rx-store/commits?author=kosich" title="Documentation">📖</a> <a href="https://github.com/rx-store/rx-store/pulls?q=is%3Apr+reviewed-by%3Akosich" title="Reviewed Pull Requests">👀</a> <a href="#mentoring-kosich" title="Mentoring">🧑‍🏫</a></td>
    <td align="center"><a href="https://github.com/joshribakoff"><img src="https://avatars0.githubusercontent.com/u/4021306?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josh Ribakoff</b></sub></a><br /><a href="https://github.com/rx-store/rx-store/commits?author=joshribakoff" title="Code">💻</a> <a href="#maintenance-joshribakoff" title="Maintenance">🚧</a> <a href="#platform-joshribakoff" title="Packaging/porting to new platform">📦</a> <a href="#projectManagement-joshribakoff" title="Project Management">📆</a> <a href="https://github.com/rx-store/rx-store/pulls?q=is%3Apr+reviewed-by%3Ajoshribakoff" title="Reviewed Pull Requests">👀</a> <a href="#ideas-joshribakoff" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/rx-store/rx-store/commits?author=joshribakoff" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/kylecannon"><img src="https://avatars2.githubusercontent.com/u/867978?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kyle Cannon</b></sub></a><br /><a href="#infra-kylecannon" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-kylecannon" title="Maintenance">🚧</a> <a href="#platform-kylecannon" title="Packaging/porting to new platform">📦</a> <a href="#projectManagement-kylecannon" title="Project Management">📆</a> <a href="https://github.com/rx-store/rx-store/pulls?q=is%3Apr+reviewed-by%3Akylecannon" title="Reviewed Pull Requests">👀</a> <a href="#ideas-kylecannon" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/gennadypolakov"><img src="https://avatars3.githubusercontent.com/u/67854099?v=4?s=100" width="100px;" alt=""/><br /><sub><b>gennadypolakov</b></sub></a><br /><a href="https://github.com/rx-store/rx-store/commits?author=gennadypolakov" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
