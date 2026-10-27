export interface Question {
  question: string;
  options: string[];
}

export interface Answer {
  respondent: string;
  answers: number[];
  merkleTreeDepth: number;
  merkleTreeRoot: number;
  nullifier: number;
  points: number[];
}

export interface SurveyInfo {
  title: string;
  desc: string;
  id: string;
  remaining: number;
  reward: string;
  respondents: number;
  daysleft: number;
  finished: boolean;
}
