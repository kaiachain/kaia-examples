# Goldsky USDT Subgraph

Goldsky Instant Subgraph config and ABI for indexing USDT transfers on Kaia mainnet.

Docs: [Goldsky](https://docs.kaia.io/build/tools/indexers/goldsky/)

Originally published as a [gist](https://gist.github.com/ayo-klaytn/cd53e0c560eb374bdbe981d12b8986f1).

## Files

- `abi.json` – USDT contract ABI
- `usdt-demo-config.json` – Instant Subgraph config (references `./abi.json`)

## Deploy

```bash
git clone https://github.com/kaiachain/kaia-examples
cd kaia-examples/indexers/goldsky-usdt-subgraph

goldsky login
goldsky subgraph deploy usdt-demo/1.0 --from-abi usdt-demo-config.json
```
