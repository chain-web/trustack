# Welcome!

Welcome!

To get you started on a good foot, we've created an easy overview of the most important things to get you started contributing code to trustack.

## General Prerequisites

We use devcontainer as dev env, so you need [config vscode devcontainer](https://code.visualstudio.com/docs/devcontainers/containers#_installation) at first.

then you can open trustack directory then click open with devcontainer.

Tips: you should open terminal at vscode to run commands.

## Building packages when you make changes

In the root directory:

- `pnpm run setup` will install and build all the packages
- `pnpm -r run build` (-r for recursive) will build all the packages
- `pnpm -r run dev` (-r for recursive) will build all the packages, without running `tsc`
- `pnpm run watch` will continuously build any packages that have been modified, without running `tsc` (Fastest)

In a package directory, like `packages/webui`:

- `pnpm run build` will build the package
- `pnpm run dev` will open a dev server
