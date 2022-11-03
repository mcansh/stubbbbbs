## Getting Started

```sh
gh repo clone remix-run/remix
gh repo clone mcansh/stubbbbbs
cd remix
yarn
yarn build
npm i -g yalc
cd build/node_modules/@remix-run/testing
yalc publish
cd -
cd ../stubbbbbs
yalc add @remix-run/testing
npm i
npm run storybook
```
