# IOTA Frontend UI

[![Lint and Test](https://github.com/scc331-iot-grp5/iota-frontend-ui/actions/workflows/lint-and-test.yml/badge.svg?branch=main)](https://github.com/scc331-iot-grp5/iota-frontend-ui/actions/workflows/lint-and-test.yml)

This repository contains the Frontend UI for the project. It's built in NextJS, with the added
flavours of TypeScript and Jest!!!

## How to Use

| Command        | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| `yarn dev`     | starts the local development server on port `3000`. use `-p` to pick another port |
| `yarn lint`    | lints source files for style & simple errors                                      |
| `yarn build`   | prepares a production-ready build - good for ci, not so useful for us             |
| `yarn start`   | runs the pre-built production build - requires `yarn build` be run first          |
| `yarn test`    | runs test frameworks in interactive mode - start it up and just get coding        |
| `yarn test:ci` | runs the tests in a way suitable for... you guessed it! CI                        |
