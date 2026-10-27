// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./semaphore/interfaces/ISemaphore.sol";
import "./SurveyV1.sol";

event SurveyCreated(address surveyAddress);

contract SurveyFactoryV1 is Initializable, ReentrancyGuard {
    uint256 public constant KAIA_DECIMALS = 18;
    uint256 public constant KAIA_MULTIPLIER = 10 ** KAIA_DECIMALS;
    uint256 public constant MIN_SURVEY_POOL = 50 * KAIA_MULTIPLIER;
    uint256 public constant MIN_SURVEY_REWARD = KAIA_MULTIPLIER / 10;
    uint256 public burnRate = 500; // 5% burn rate

    ISemaphore public semaphore;

    address[] public surveys;
    address public owner;
    address public manager;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function initialize(ISemaphore _semaphore, address _manager) public initializer {
        semaphore = ISemaphore(_semaphore);
        owner = msg.sender;
        manager = _manager;
    }

    function createSurvey(string memory _title, string memory _description, SurveyV1.Question[] memory _questions, uint256 _targetNumber, uint256 _lockedUntil) payable public nonReentrant{
        require(msg.value >= MIN_SURVEY_POOL, "At least 50 kaia required to create a survey");
        require(msg.value / (10000 - burnRate) * 10000 / _targetNumber >= MIN_SURVEY_REWARD, "At least 0.1 kaia required per target number");

        SurveyV1 survey = new SurveyV1{value:msg.value}(_title, _description, _questions, _targetNumber, _lockedUntil, burnRate, semaphore, manager);
        surveys.push(address(survey));
        emit SurveyCreated(address(survey));
    }

    function getSurveys() public view returns (address[] memory) {
        return surveys;
    }

    function getSurveyCount() public view returns (uint256) {
        return surveys.length;
    }

    function setBurnRate(uint256 _burnRate) external onlyOwner {
        require(_burnRate <= 1000, "Burn rate too high");
        burnRate = _burnRate;
    }

    receive() external payable {}
}