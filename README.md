## Getting Started

```sh
gh repo clone remix-run/remix
gh repo clone mcansh/stubbbbbs
cd remix
git checkout logan/testing-helpers
yarn
yarn build --tsc
npm i -g yalc
cd build/node_modules/@remix-run/testing
yalc publish
cd -
cd ../stubbbbbs
npm i
yalc add @remix-run/testing
npm run storybook
```
