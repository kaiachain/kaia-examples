import SafeApiKit from '@safe-global/api-kit'
import Safe from '@safe-global/protocol-kit'
import {
  OperationType
} from '@safe-global/safe-core-sdk-types'

// Loads .env into process.env (built into Node >= 20.12 / 21.7, no dependency needed)
process.loadEnvFile()

const {
  RPC_URL,
  CHAIN_ID,
  SAFE_API_KEY,
  SAFE_ADDRESS,
  OWNER_1_ADDRESS,
  OWNER_1_PRIVATE_KEY,
  OWNER_2_PRIVATE_KEY,
  EXPLORER_TX_URL
} = process.env

const REQUIRED = [
  'RPC_URL',
  'CHAIN_ID',
  'SAFE_API_KEY',
  'SAFE_ADDRESS',
  'OWNER_1_ADDRESS',
  'OWNER_1_PRIVATE_KEY',
  'OWNER_2_PRIVATE_KEY'
]

const missing = REQUIRED.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`Missing required environment variables in .env: ${missing.join(', ')}`)
  process.exit(1)
}

// Receiver address of sample transaction who receives 1 wei
const TO_ADDRESS = process.env.TO_ADDRESS || OWNER_1_ADDRESS


const apiKit = new SafeApiKit({
  chainId: BigInt(CHAIN_ID),
  apiKey: SAFE_API_KEY
})


const protocolKitOwner1 = await Safe.init({
  provider: RPC_URL,
  signer: OWNER_1_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS
})

// 1. Create transaction
const safeTransactionData = {
  to: TO_ADDRESS,
  value: '1', // 1 wei
  data: '0x',
  operation: OperationType.Call
}

const safeTransaction = await protocolKitOwner1.createTransaction({
  transactions: [safeTransactionData]
})

const safeTxHash = await protocolKitOwner1.getTransactionHash(safeTransaction)
const signature = await protocolKitOwner1.signHash(safeTxHash)

// 2. Propose transaction to the service
try {
  await apiKit.proposeTransaction({
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress: OWNER_1_ADDRESS,
    senderSignature: signature.data
  })
} catch(err) {
  console.log(err)
}

console.log("Transaction hash is "+safeTxHash)
const transaction = await apiKit.getTransaction(safeTxHash)
// const transactions = await service.getPendingTransactions()
// const transactions = await service.getIncomingTransactions()
// const transactions = await service.getMultisigTransactions()
// const transactions = await service.getModuleTransactions()
// const transactions = await service.getAllTransactions()

// 3. Confirmation from Owner 2
const protocolKitOwner2 = await Safe.init({
  provider: RPC_URL,
  signer: OWNER_2_PRIVATE_KEY,
  safeAddress: SAFE_ADDRESS
})

const signature2 = await protocolKitOwner2.signHash(safeTxHash)

// Confirm the Safe transaction
const signatureResponse = await apiKit.confirmTransaction(
  safeTxHash,
  signature2.data
)

console.log(signatureResponse)

// 4. Execute transaction
const safeTxn = await apiKit.getTransaction(safeTxHash);
const executeTxReponse = await protocolKitOwner1.executeTransaction(safeTxn)

const receipt = await executeTxReponse.transactionResponse?.wait();

console.log('Transaction executed:');
console.log(`${EXPLORER_TX_URL || 'https://kairos.kaiascan.io/tx/'}${receipt?.transactionHash}`);
