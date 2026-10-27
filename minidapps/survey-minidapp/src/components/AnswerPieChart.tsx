"use client";
import React, { useState } from "react";
import { Question } from "../types";
// import { PieChart } from "react-minimal-pie-chart";

const colors = [
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
];

export default function AnswerPieChart({
  questions,
  answers,
}: {
  questions: Question[];
  answers: number[][];
}) {
  return (
    <div className="flex flex-col justify-center items-center w-96 h-auto rounded-lg bg-white mb-24 p-10">
      {/* {answers.map((answer: number[], i: number) => (
        <div key={i}>
          <h3>{questions[i].question}</h3>
          {answer.reduce((sum, cnt) => sum + cnt, 0) === 0 ? (
            <p>No answer yet</p>
          ) : (
            <PieChart
              data={answer.map((cnt: number, j: number) => ({
                name: questions[i].options[j],
                value: cnt,
                color: colors[j % colors.length],
              }))}
              label={({ dataEntry }) =>
                `${dataEntry.value} (${Math.round(dataEntry.percentage)}%)`
              }
              labelStyle={{
                fontSize: "5px",
                fontFamily: "sans-serif",
              }}
              labelPosition={110}
              radius={30}
              animate
              lineWidth={40}
              style={{ height: "350px", width: "350px" }}
            />
          )}
        </div>
      ))}
      <div></div> */}
    </div>
  );
}
