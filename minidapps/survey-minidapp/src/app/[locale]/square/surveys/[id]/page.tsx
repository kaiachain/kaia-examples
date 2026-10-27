import React from "react";
import {
  countAnswers,
  getSurvey,
  getSurveyQuestions,
} from "../../../../../hooks/backend/survey.tsx";
import SubmitAnswerForm from "../../../../../components/SubmitAnswerForm.tsx";
import AnswerChart from "../../../../../components/AnswerChart.tsx";

export default async function Survey({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const info = await getSurvey(id);
  const questions = await getSurveyQuestions(id);
  const answers = await countAnswers(id, questions);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold p-10">{info.title}</h2>
      <div className="flex flex-col items-start bg-purple-50 rounded-xl p-4 mt-2 lg:w-3/5 w-80">
        <h3 className="text-xl font-bold">Contract Address</h3>
        <p className="mt-1 w-full break-words">{id}</p>
        <h3 className="text-xl font-bold mt-2">Description</h3>
        <p className="w-full break-words mt-1">{info.desc}</p>
      </div>
      <SubmitAnswerForm questions={questions} id={id} />
      <AnswerChart
        questions={questions}
        answers={answers}
        targetNumber={info.remaining + info.respondents}
      />
    </div>
  );
}
