# Buy Me a Coffee

A Hardhat smart contract and Next.js frontend for a "buy me a coffee" tipping dApp on Kaia.

Docs: [Build a Buy Me a Coffee dApp](https://docs.kaia.io/build/tutorials/buy-me-a-coffee/)

Originally published at [ayo-klaytn/buy-me-a-coffee](https://github.com/ayo-klaytn/buy-me-a-coffee).

## Layout

- `smart-contract/` – `BuyMeACoffee.sol`, deploy and withdraw scripts (Hardhat)
- `frontend/` – Next.js app that talks to the deployed contract

## Quickstart

```bash
git clone https://github.com/kaiachain/kaia-examples
cd kaia-examples/dapps/buy-me-a-coffee

cd smart-contract
npm install
cp .env.example .env   # set BAOBAB_URL (Kairos RPC) and PRIVATE_KEY
npx hardhat run scripts/deploy.js --network baobab

cd ../frontend
npm install
npm run dev
```

> This example predates the Klaytn → Kaia rebrand. The `baobab` network and `BAOBAB_URL` variable point to the Kairos testnet (chain ID 1001), e.g. `https://public-en-kairos.node.kaia.io`.
