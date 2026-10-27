# Hardhat Utils on a Private Network

Deploys a `KaiaGreeter` contract to a private Kaia network (or Kairos/mainnet) using Hardhat, `hardhat-deploy`, and `@klaytn/hardhat-utils`.

Docs: [Deploy smart contracts on a private network](https://docs.kaia.io/build/smart-contracts/deployment-and-verification/deploy/private-network/)

Originally published at [ayo-klaytn/kaia-hardhat-utils-example](https://github.com/ayo-klaytn/kaia-hardhat-utils-example).

## Quickstart

```bash
git clone https://github.com/kaiachain/kaia-examples
cd kaia-examples/smart-contracts/hardhat-utils-private-network
npm install
cp .env.example .env   # set PRIVATE_KEY and optionally RPC_URL

npx hardhat deploy --network localhost   # private network at http://localhost:8545
```

`RPC_URL` overrides the default endpoint for the `localhost`, `kairos`, and `kaia` networks in `hardhat.config.js`.
