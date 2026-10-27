# Kaia Examples

Runnable code examples that accompany the [Kaia Docs](https://docs.kaia.io). Each folder is a self-contained project with its own README, dependencies, and `.env.example`.

```bash
git clone https://github.com/kaiachain/kaia-examples
cd kaia-examples/<category>/<example>
```

## Examples

| Example | Stack | Docs page | Originally from |
|---|---|---|---|
| [smart-contracts/foundry-starterkit](smart-contracts/foundry-starterkit) | Foundry | [Kaia Contracts Wizard](https://docs.kaia.io/build/smart-contracts/tools/kaia-contracts-wizard/) | [ayo-klaytn/kaia-foundry-starterkit](https://github.com/ayo-klaytn/kaia-foundry-starterkit) |
| [smart-contracts/hardhat-utils-private-network](smart-contracts/hardhat-utils-private-network) | Hardhat, hardhat-deploy | [Deploy on a private network](https://docs.kaia.io/build/smart-contracts/deployment-and-verification/deploy/private-network/) | [ayo-klaytn/kaia-hardhat-utils-example](https://github.com/ayo-klaytn/kaia-hardhat-utils-example) |
| [oracles/pyth-price-feeds-hardhat](oracles/pyth-price-feeds-hardhat) | Hardhat, Ignition, Pyth | [Pyth real-time price](https://docs.kaia.io/build/tutorials/pyth-real-time-price/) | [ayo-klaytn/pyth-kaia-hardhat-example](https://github.com/ayo-klaytn/pyth-kaia-hardhat-example) |
| [indexers/goldsky-usdt-subgraph](indexers/goldsky-usdt-subgraph) | Goldsky | [Goldsky](https://docs.kaia.io/build/tools/indexers/goldsky/) | [gist](https://gist.github.com/ayo-klaytn/cd53e0c560eb374bdbe981d12b8986f1) |
| [wallets/safe-api-kit](wallets/safe-api-kit) | Node.js, Safe API Kit | [Safe API Kit](https://docs.kaia.io/build/wallets/safe-wallet/safe-wallet-api-kit/) | [praveen-kaia/kaia-safe-api-kit](https://github.com/praveen-kaia/kaia-safe-api-kit) |
| [dapps/buy-me-a-coffee](dapps/buy-me-a-coffee) | Hardhat, Next.js | [Buy Me a Coffee](https://docs.kaia.io/build/tutorials/buy-me-a-coffee/) | [ayo-klaytn/buy-me-a-coffee](https://github.com/ayo-klaytn/buy-me-a-coffee) |
| [minidapps/survey-minidapp](minidapps/survey-minidapp) | Next.js, Hardhat, Semaphore, LIFF | [Survey Mini dApp](https://docs.kaia.io/minidapps/survey-minidapp/intro/) | [kjeom/ExampleMiniDapp](https://github.com/kjeom/ExampleMiniDapp) |
| [minidapps/unity-liff](minidapps/unity-liff) | Unity WebGL, LIFF | [Convert to LINE LIFF](https://docs.kaia.io/minidapps/unity/convert-unity-liff/) | [gist](https://gist.github.com/ayo-klaytn/2aad97e1e263b00f5403177a7ad1fff1) |
| [service-chain/value-transfer](service-chain/value-transfer) | Node.js, caver-js | [Service chain value transfer](https://docs.kaia.io/nodes/service-chain/quick-start/value-transfer/) | [klaytn/servicechain-value-transfer-examples](https://github.com/klaytn/servicechain-value-transfer-examples) |

## Adding an example

- Put it under the category that matches its docs section (`smart-contracts`, `oracles`, `indexers`, `wallets`, `dapps`, `minidapps`, `service-chain`, …).
- Include a README with a link to the docs page, prerequisites, and run commands.
- Commit `.env.example` only — never real keys or `.env` files.
- Default to the Kairos testnet (chain ID 1001).
- Link the docs page to `https://github.com/kaiachain/kaia-examples/tree/main/<category>/<example>`.
