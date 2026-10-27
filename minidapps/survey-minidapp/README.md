# Decentralized Statistics

This is a platform that enables the transparent statistics and surveys, allowing the contributors to get the rewards for participating in surveys. It's obviously contrast to a centralized statistics office.

This platform is inspired by a talk from [Ethcon Korea 2024](https://2024.ethcon.kr/), `The best way: correct number of the statistics`

## Prerequisite

node >= v.22

## Initialization

```shell
$> npm install
```

## Contract Deploy

start local hardhat node

```shell
$> npx hardhat node
```

contract deploy to local network

```shell
$> cd contract
$> npx hardhat compile
$> npx hardhat deploy --network localhost
```

create `.env` file in root directory

```
SURVEY_FACTORY_V1_CONTRACT_ADDRESS=[factory address]
NEXT_PUBLIC_SURVEY_FACTORY_V1_CONTRACT_ADDRESS=[factory address]
NODE_URL=http://localhost:8545
```

## Start application

```shell
$> npm run dev # in the root directory
```
