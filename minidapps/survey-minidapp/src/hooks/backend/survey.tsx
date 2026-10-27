import { ethers } from "ethers";
import { provider } from "../common/provider.tsx";
import surveyAbi from "../../contracts/SurveyV1.sol/SurveyV1.json";
import { getSurveyV1s } from "./factory.tsx";
import { Answer, Question } from "../../types/index.ts";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";

export const getGroupMembers = async (groupId: string) => {
  const semaphoreSubgraph = new SemaphoreSubgraph(
    process.env.SEMAPHORE_SUBGRAPH_URL as string
  );
  try {
    const members = await semaphoreSubgraph.getGroupMembers(groupId);
    return members;
  } catch (e) {
    console.log("error", e);
    return [];
  }
};

const getSurveyV1 = (address: string) => {
  if (!ethers.isAddress(address)) {
    throw Error("Invalid survey address");
  }
  return new ethers.Contract(address, surveyAbi.abi, provider);
};

const getManagerConnectedSurveyV1 = (address: string) => {
  if (!ethers.isAddress(address)) {
    throw Error("Invalid survey address");
  }
  const manager = new ethers.Wallet(
    process.env.MANAGER_PRIVATE_KEY as string,
    provider
  );
  return new ethers.Contract(address, surveyAbi.abi, manager);
};

export const getAllSurveyV1s = async () => {
  const surveyAddresses = await getSurveyV1s();
  const surveys = surveyAddresses.map(async (address: string) => {
    const survey = getSurveyV1(address);
    const info = await survey.surveyInfo();
    return info;
  });
  const infos = await Promise.all(surveys);
  return infos.map((info) => {
    return decodeSurveyInfo(info, surveyAddresses[infos.indexOf(info)]);
  });
};

export const getSurvey = async (address: string) => {
  const survey = getSurveyV1(address);
  const info = await survey.surveyInfo();
  return decodeSurveyInfo(info, address);
};

export const getSurveyQuestions = async (address: string) => {
  const survey = getSurveyV1(address);
  const questions = await survey.getQuestions();
  return questions.map((question: any) => {
    return decodeQuestion(question);
  });
};

export const getAnswers = async (address: string) => {
  const survey = getSurveyV1(address);
  const answers = await survey.getAnswers();
  return answers.map((answer: any) => {
    return decodeAnswer(answer);
  });
};

export const countAnswers = async (address: string, questions: Question[]) => {
  const answers = await getAnswers(address);
  const answerCnt: number[][] = Array.from({ length: questions.length }, () =>
    new Array(questions[0].options.length).fill(0)
  );
  answers.map((answer: Answer) => {
    // answer.answers.map((ans: number, i: number) => {
    answer.answers.map((ans: number, i: number) => {
      answerCnt[i][ans] += 1;
    });
  });
  return answerCnt;
};

const decodeQuestion = (question: any) => {
  return {
    question: question[0],
    options: question[1],
  };
};

const decodeAnswer = (answer: any) => {
  return {
    respondent: answer[0],
    answers: answer[1],
    merkleTreeDepth: answer[2],
    merkleTreeRoot: answer[3],
    nullifier: answer[4],
    points: answer[5],
  };
};

const decodeSurveyInfo = (info: any[], contractAddr: string) => {
  return {
    title: info[0],
    desc: info[1],
    id: contractAddr,
    remaining: remainedSurvey(info[4], info[5]),
    reward: ethers.formatEther(info[3]),
    respondents: info[5],
    daysleft: daysLeft(info[7]),
    finished: info[10],
  };
};

const remainedSurvey = (targetNumber: number, respondents: number) => {
  return targetNumber - respondents;
};

const daysLeft = (duration: bigint) => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return Number(duration - now) / 86400;
};

export const getGroupId = async (surveyAddress: string) => {
  const survey = getSurveyV1(surveyAddress);
  const groupId = await survey.groupId();
  return groupId.toString();
};

export const isValidToken = async (idToken: string) => {
  const valid = await fetch(process.env.VALIDATE_ID_TOKEN_SERVER as string, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!valid.ok) throw Error("Invalid token");

  return valid.json();
};

const verifyLineIdentity = async (
  userId: string,
  address: string,
  signature: ethers.SignatureLike
) => {
  // When you used kaia_signLegacy or kaia_sign, you should use the following code
  // const hexMsg = ethers.hexlify(
  //   ethers.toUtf8Bytes("hello destat" + userId + address)
  // );
  // const verifiedAddr = await provider.send("klay_recoverFromMessage", [
  //   address,
  //   hexMsg,
  //   signature,
  //   "latest",
  // ]);

  const msg = "hello destat" + userId + address;
  const verifiedAddr = ethers.verifyMessage(msg, signature);
  if (verifiedAddr.toLowerCase() !== address.toLowerCase())
    throw Error("Invalid signature");
};

export const joinGroup = async (
  surveyAddress: string,
  commitment: bigint,
  signature: ethers.SignatureLike,
  idToken: string,
  address: string
) => {
  const survey = getManagerConnectedSurveyV1(surveyAddress);

  const profile = await isValidToken(idToken);
  await verifyLineIdentity(profile.userId, address, signature);

  const tx = await survey.joinGroup(commitment);
  const receipt = await tx.wait();
  return receipt;
};
