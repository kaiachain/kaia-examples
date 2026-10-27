import { expect } from "chai";
import hre from "hardhat";

interface Question {
  question: string;
  options: string[];
}

interface Answer {
  respondent: string;
  commit: string;
  answers: number[];
}

describe("SurveyV1", function () {
  const provider = hre.ethers.provider;
  let survey: any;
  const questions: Question[] = [
    { question: "What is the meaning of life?", options: ["42", "43", "44"] },
    {
      question: "What is your favorite color?",
      options: ["Red", "Green", "Blue", "Yellow"],
    },
  ];

  beforeEach(async function () {
    const surveyFactoryV1 = await hre.ethers.getContractFactory(
      "SurveyFactoryV1"
    );
    const surveyFactory = await surveyFactoryV1.deploy();
    await surveyFactory.waitForDeployment();

    const tx = await surveyFactory.createSurvey(
      "test survey",
      "test",
      questions,
      10,
      5,
      {
        value: hre.ethers.parseEther("100"),
      }
    );
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error("Transaction receipt is null");
    }
    const surveyContractAddress = surveyFactory.interface.parseLog(
      receipt.logs[0]
    )?.args[0];

    const surveyContract = await hre.ethers.getContractFactory("SurveyV1");
    survey = await surveyContract.attach(surveyContractAddress);
  });

  it("should emit SurveyCreated event", async function () {
    const surveyFactoryV1 = await hre.ethers.getContractFactory(
      "SurveyFactoryV1"
    );
    const surveyFactory = await surveyFactoryV1.deploy();
    await surveyFactory.waitForDeployment();

    const tx = await surveyFactory.createSurvey(
      "test survey",
      "test",
      questions,
      10,
      5,
      {
        value: hre.ethers.parseEther("100"),
      }
    );
    await expect(tx).to.emit(surveyFactory, "SurveyCreated");
  });

  it("Should create a survey", async function () {
    expect(survey.target).to.not.be.null;
    expect(await provider.getBalance(survey.target)).to.equal(
      hre.ethers.parseEther("95")
    );
  });

  it("Should match the questions", async function () {
    const questionsFromContract = await survey.getQuestions();
    for (let i = 0; i < questions.length; i++) {
      expect(questionsFromContract[i].question).to.equal(questions[i].question);
      expect(questionsFromContract[i].options).to.deep.equal(
        questions[i].options
      );
    }
  });

  it("Summission should get back reward to the respondent", async function () {
    const respondent = await provider.getSigner(1);

    const before = await provider.getBalance(respondent.address);
    await survey.connect(respondent).submitAnswer({
      respondent: respondent.address,
      commit: "testcommit",
      answers: [1, 3],
    });
    // const answers = await survey.getAnswers();
    const after = await provider.getBalance(respondent.address);
    expect(after).to.be.greaterThan(before);
  });

  it("Should return survey information", async function () {
    const surveyInfo = await survey.surveyInfo();
    expect(surveyInfo[0]).to.equal("test survey");
    expect(surveyInfo[1]).to.equal("test");
    expect(surveyInfo[3]).to.equal(hre.ethers.parseEther("9.5"));
  });
});
