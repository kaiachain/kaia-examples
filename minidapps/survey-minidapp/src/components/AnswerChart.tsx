"use client";
import React from "react";
import { Question } from "../types";
import { colors, barSize } from "./common";

export default function AnswerChart({
  questions,
  answers,
  targetNumber,
}: {
  questions: Question[];
  answers: number[][];
  targetNumber: number;
}) {
  const pctg = (answer: number) => {
    return barSize[Math.round((answer / Number(targetNumber)) * 100)];
  };

  return (
    <div className="flex flex-col justify-start h-auto rounded-lg mb-24 px-7 pt-4 pb-7 bg-purple-50 lg:w-3/5 w-80">
      <h3 className="font-extrabold text-2xl">Answers</h3>
      {answers.map((answer: number[], i: number) => (
        <div key={i}>
          <h3 className="font-semibold font-serif mt-2 ml-2">
            {questions[i].question}
          </h3>
          {answer.map((ans, j) => (
            <div key={j} className="flex flex-col ml-4">
              <div key={j} className="flex flex-row items-center mt-3">
                <span className="font-semibold">{questions[i].options[j]}</span>
              </div>
              <div
                className={`flex flex-row ${pctg(answer[j])} ${
                  colors[j]
                } h-8 rounded-lg relative`}
              >
                <span className="absolute top-1 left-2">{answer[j]}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
