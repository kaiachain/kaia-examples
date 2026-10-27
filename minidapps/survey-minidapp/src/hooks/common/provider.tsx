const { JsonRpcProvider } = require("@kaiachain/ethers-ext/v6");

export const provider = new JsonRpcProvider(process.env.NODE_URL);
