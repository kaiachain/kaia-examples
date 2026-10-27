// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface ISurvey {
    // Survey details
    function surveyInfo() external view returns (string memory title, string memory description, address owner, uint256 reward, uint256 targetNumber, uint256 surveyNumber, uint256 timestamp, uint256 lockedUntil, uint256 version, uint256 surveyType, bool finished);

    // Survey actions
    function finish() external;
    function withdraw() external;
    function remainingSurveys() external view returns (uint256);

    // Event to signal answer submission
    event AnswerSubmitted(address indexed respondent, uint256 indexed surveyId, uint8[] answers);

    // Event to signal survey completion
    event SurveyFinished(uint256 indexed surveyId);
}
