import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

export default async function deploySurveyFactory(
  hre: HardhatRuntimeEnvironment
) {
  const [deployer] = await ethers.getSigners();
  const { deploy } = hre.deployments;

  // console.log("Deploying contracts with the account:", deployer.address);
  // console.log("Deploying SemaphoreVerifier...");
  // let result = await deploy("SemaphoreVerifier", {
  //   contract: "SemaphoreVerifier",
  //   from: deployer.address,
  //   log: true,
  // });
  // if (!result.newlyDeployed) {
  //   console.log("SemaphoreVerifier already deployed at:", result.address);
  // }
  // const verifierAddress = result.address;

  // console.log("Deploying PoseidonT3...");
  // result = await deploy("PoseidonT3", {
  //   contract: "PoseidonT3",
  //   from: deployer.address,
  //   log: true,
  // });
  // if (!result.newlyDeployed) {
  //   console.log("PoseidonT3 already deployed at:", result.address);
  // }
  // const poseidonT3Address = result.address;

  // console.log("Deploying Semaphore...");
  // result = await deploy("Semaphore", {
  //   contract: "Semaphore",
  //   from: deployer.address,
  //   args: [verifierAddress],
  //   log: true,
  //   libraries: {
  //     PoseidonT3: poseidonT3Address,
  //   },
  // });
  // if (!result.newlyDeployed) {
  //   console.log("Semaphore already deployed at:", result.address);
  // }

  // const semaphoreAddress = result.address;
  const semaphoreAddress = "0x6be257C10E36350EBC6610204bE4e5Acf2c3A325";

  console.log("Deploying SurveyFactoryV1 as an upgradeable contract...");
  const deployment = await deploy("SurveyFactoryV1", {
    contract: "SurveyFactoryV1",
    from: deployer.address,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      owner: deployer.address,
      execute: {
        methodName: "initialize",
        args: [semaphoreAddress, deployer.address],
      },
    },
    log: true,
  });

  if (!deployment.newlyDeployed) {
    console.log("SurveyFactoryV1 already deployed at:", deployment.address);
  }
}

deploySurveyFactory.tags = [
  "SemaphoreVerifier",
  "PoseidonT3",
  "Semaphore",
  "SurveyFactoryV1",
];
