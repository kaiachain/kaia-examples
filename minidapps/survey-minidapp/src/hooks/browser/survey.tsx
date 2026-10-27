import surveyAbi from "../../contracts/SurveyV1.sol/SurveyV1.json";
import { ethers } from "ethers";
import { Answer } from "../../types/index.ts";
import { Identity } from "@semaphore-protocol/identity";
import { liff } from "@line/liff";
import { Web3Provider } from "@kaiachain/ethers-ext/v6";

const getSurveyV1 = (surveyAddress: string, signer: ethers.JsonRpcSigner) =>
  new ethers.Contract(surveyAddress, surveyAbi.abi, signer);

export const submitAnswer = async (
  surveyAddress: string,
  provider: Web3Provider,
  // provider: ethers.BrowserProvider,
  answer: Answer
) => {
  const signer = await provider.getSigner(0);
  const survey = getSurveyV1(surveyAddress, signer);
  try {
    const tx = await survey.submitAnswer(answer, { gasLimit: 5000000 });
    const receipt = await tx.wait();
    return receipt;
  } catch (e: any) {
    console.log("error", e);
    return e.message;
  }
};

export const createIdentity = async (
  web3: Web3Provider,
  // web3: ethers.BrowserProvider,
  address: string,
  liffObject: typeof liff
) => {
  const idToken = liffObject.getDecodedIDToken();
  if (!idToken) {
    throw Error("Failed to get ID token");
  }

  try {
    const uid = idToken.sub;
    const msg = "hello destat" + uid + address;
    const hexMsg = ethers.hexlify(ethers.toUtf8Bytes(msg));
    // const secret = await web3.send("kaia_signLegacy", [address, hexMsg]);
    const secret = await web3.send("personal_sign", [hexMsg, address]);
    return new Identity(secret);
  } catch (e) {
    console.log("error", e);
    throw Error("Failed to create identity");
  }
};
