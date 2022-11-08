## Getting Started

```sh
gh repo clone remix-run/remix
gh repo clone mcansh/stubbbbbs
cd remix
git checkout logan/testing-helpers
yarn
yarn build --tsc
npm i -g yalc
cd build/node_modules/@remix-run
# fish shell syntax
for i in testing server-runtime react; yalc publish $i; end
cd -
cd ../stubbbbbs
npm i
# fish shell syntax
for i in testing server-runtime react; yalc link @remix-run/$i; end
npm run storybook
```
