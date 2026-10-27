import React from "react";
import { barSize } from "./common";

export default function LinearChart({
  remains,
  respondents,
}: {
  remains: number;
  respondents: number;
}) {
  const pctg = (answer: number) => {
    return barSize[Math.round((answer / Number(remains + respondents)) * 100)];
  };
  return <div></div>;
}
