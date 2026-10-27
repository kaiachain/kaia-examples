const Caver = require('caver-js');
const fs = require('fs')
const path = require('path');

const conf = JSON.parse(fs.readFileSync('../common/bridge_info.json', 'utf8'));
const deployed = JSON.parse(fs.readFileSync('transfer_conf.json', 'utf8'));

const bridgeAbi = JSON.parse(fs.readFileSync('../build/Bridge.abi', 'utf8'));

// registerOperator and setOperatorThreshold can only be called by the bridge owner.
// erc20-deploy.js transfers ownership to the operators of the first bridge (conf.bridges[0]),
// whose keys are kept by that SCN in <datadir>/child_bridge_account and <datadir>/parent_bridge_account.
// Copy those folders and pass their paths as CHILD_OWNER_KEYSTORE and PARENT_OWNER_KEYSTORE.
// If they are not set, the sender keys in bridge_info.json are used.
function addOwner(caver, keystoreDir, senderKey) {
  if (!keystoreDir) {
    return caver.klay.accounts.wallet.add(senderKey).address;
  }

  const files = fs.readdirSync(keystoreDir);
  const keyFile = files.find(f => f.startsWith('UTC--'));
  if (keyFile == undefined) {
    throw new Error(`no keystore file (UTC--*) in ${keystoreDir}`);
  }
  const keystore = JSON.parse(fs.readFileSync(path.join(keystoreDir, keyFile), 'utf8'));

  // kscn stores the keystore password in a file named after the account address.
  const address = '0x' + keystore.address.replace(/^0x/, '').toLowerCase();
  const pwdFile = files.find(f => f.toLowerCase() === address);
  if (pwdFile == undefined) {
    throw new Error(`no password file for ${address} in ${keystoreDir}`);
  }
  const password = fs.readFileSync(path.join(keystoreDir, pwdFile), 'utf8').replace(/\r?\n$/, '');

  const account = caver.klay.accounts.decrypt(keystore, password);
  return caver.klay.accounts.wallet.add(account.privateKey).address;
}

async function addOperators(name, url, keystoreDir, senderKey, bridgeAddr, operators, threshold) {
  const caver = new Caver(url);
  const from = addOwner(caver, keystoreDir, senderKey);
  const bridge = new caver.klay.Contract(bridgeAbi, bridgeAddr);

  const owner = await bridge.methods.owner().call();
  if (owner.toLowerCase() !== from.toLowerCase()) {
    console.log(`Error: the ${name} bridge ${bridgeAddr} is owned by ${owner}, but the signer is ${from}.`);
    console.log(`Set ${name.toUpperCase()}_OWNER_KEYSTORE to the ${name}_bridge_account folder of the SCN that owns the bridge.`);
    process.exit(1);
  }

  // register operator
  for (const operator of operators) {
    if (await bridge.methods.operators(operator).call()) {
      console.log(`${name}: operator ${operator} is already registered`);
      continue;
    }
    await bridge.methods.registerOperator(operator).send({ from: from, gas: 100000000, value: 0 });
    console.log(`${name}: registered operator ${operator}`);
  }

  // setOperatorThreshold (vote type 0 is value transfer)
  await bridge.methods.setOperatorThreshold(0, threshold).send({ from: from, gas: 100000000, value: 0 });
  console.log(`${name}: operator threshold set to ${threshold}`);
}

(async function AddOperator4HA() {
  const testcase = process.argv[1].substring(process.argv[1].lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "");
  console.log(`------------------------- ${testcase} START -------------------------`)

  // Value transfer is executed only when at least `threshold` operators request it.
  // Defaults to the number of bridges, the same as erc20-deploy.js.
  const threshold = Number(process.env.THRESHOLD || conf.bridges.length);
  if (threshold < 1 || threshold > conf.bridges.length) {
    console.log(`Error: THRESHOLD must be between 1 and ${conf.bridges.length}`);
    process.exit(1);
  }

  await addOperators("child", conf.url.child, process.env.CHILD_OWNER_KEYSTORE, conf.sender.child.key,
    deployed.contract.child.bridge, conf.bridges.map(b => b.child.operator), threshold);
  await addOperators("parent", conf.url.parent, process.env.PARENT_OWNER_KEYSTORE, conf.sender.parent.key,
    deployed.contract.parent.bridge, conf.bridges.map(b => b.parent.operator), threshold);

  console.log("############################################################################");
  console.log("Restart kscn on the SCN that owns the bridge so its subbridge re-reads the operator nonce.");
  console.log(`Then run below 3 commands in the Javascript console of the new child bridge nodes`);
  console.log(`subbridge.registerBridge("${deployed.contract.child.bridge}", "${deployed.contract.parent.bridge}")`)
  console.log(`subbridge.subscribeBridge("${deployed.contract.child.bridge}", "${deployed.contract.parent.bridge}")`)
  console.log(`subbridge.registerToken("${deployed.contract.child.bridge}", "${deployed.contract.parent.bridge}", "${deployed.contract.child.token}", "${deployed.contract.parent.token}")`)
  console.log("############################################################################");

  console.log(`------------------------- ${testcase} END -------------------------`)
})();
