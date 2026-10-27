# safe-api-kit

A minimal example of proposing, confirming, and executing a **Safe{Wallet} multisig transaction on the Kaia Kairos testnet** using the Safe API Kit and Protocol Kit.

The script sends **1 wei** from the Safe to a receiver address, going through the full 2-of-2 multisig flow:

1. **Create & sign** the transaction with Owner 1
2. **Propose** it to the Safe Transaction Service
3. **Confirm** it with Owner 2's signature
4. **Execute** it on-chain from Owner 1 (this is the step that costs gas)

## Prerequisites

### 1. A 2-owner Safe multisig wallet

Create a Safe with **2 owners and a threshold of 2** on the Kaia Kairos testnet:

1. Go to [app.safe.global](https://app.safe.global) and connect your wallet.
2. Choose **Kaia Kairos Testnet** as the network.
3. Create a new Safe, add both owner addresses, and set the threshold to **2 out of 2**.
4. Note the deployed Safe address — this goes into `SAFE_ADDRESS`.

You need the **private keys of both owners**, since the script signs with each of them programmatically.

### 2. Native KAIA balance in Owner 1's wallet

Owner 1 is the account that both proposes and **executes** the transaction in step 4, so it pays the gas for the on-chain execution. It must hold test KAIA.

The **Safe itself** also needs a small balance, because the sample transaction transfers 1 wei out of it.

Owner 2 only produces an off-chain signature and **does not need any balance**.

Fund both from the [Kaia Kairos faucet](https://faucet.kaia.io).

### 3. A Safe API key

The Safe Transaction Service requires an API key. Create one at [developer.safe.global](https://developer.safe.global) and put it in `SAFE_API_KEY`.

### 4. Node.js

Node **v22.23.1** (see [.nvmrc](.nvmrc)). Node ≥ 20.12 is the real minimum, since the script uses the built-in `process.loadEnvFile()` to read `.env` — there is no `dotenv` dependency.

```bash
nvm use
```

## Setup

```bash
npm install
cp .env.example .env
```

Then fill in [.env](.env.example):

| Variable | Required | Description |
| --- | --- | --- |
| `RPC_URL` | yes | Kaia Kairos RPC endpoint |
| `CHAIN_ID` | yes | `1001` for Kairos |
| `SAFE_API_KEY` | yes | API key from developer.safe.global |
| `SAFE_ADDRESS` | yes | Address of your 2-of-2 Safe |
| `OWNER_1_ADDRESS` | yes | Owner 1 — proposes and executes, needs test KAIA |
| `OWNER_1_PRIVATE_KEY` | yes | Private key of Owner 1 |
| `OWNER_2_PRIVATE_KEY` | yes | Private key of Owner 2 — signs only, no balance needed |
| `EXPLORER_TX_URL` | no | Explorer prefix for the printed tx link |
| `TO_ADDRESS` | no | Receiver of the 1 wei transfer (defaults to `OWNER_1_ADDRESS`) |

`.env` is gitignored. The script exits with a clear error if any required variable is missing.

## Run

```bash
node app.js
```

Expected output:

```
Transaction hash is 0x2f54efe951e52537ed8242e34d558adc51019a7f669651450dc4edf998ff7d5a
{
  signature: '0x1b04bdc8711ed6c8525543f69048bdcfb494b4093c9e6f71add0bbd89907b623...'
}
Transaction executed:
https://kairos.kaiascan.io/tx/0xb55cc6f8adad19ef0c7ea70bca3f691bf61b24e9ddc61d94cecab9529a8d3b02
```

The first hash is the **Safe transaction hash** (the multisig transaction as tracked by the Safe Transaction Service). The final link is the **on-chain execution transaction** on Kaiascan.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `insufficient funds` during step 4 | Owner 1 has no test KAIA — fund it from the faucet |
| Execution reverts | The Safe itself holds less than 1 wei, or the threshold is not met |
| Proposal fails with 401/403 | `SAFE_API_KEY` is missing, expired, or wrong |
| `Signer is not an owner` | The key in `OWNER_1_PRIVATE_KEY` / `OWNER_2_PRIVATE_KEY` is not an owner of `SAFE_ADDRESS` |

## Security note

This is testnet example code. Private keys sit in plain text in `.env` — never point it at a mainnet Safe or reuse these keys for anything holding real value.
