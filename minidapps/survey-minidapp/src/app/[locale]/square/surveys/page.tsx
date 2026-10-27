import React, { use } from "react";
import SurveyCard from "../../../../components/SurveyCard";
import { getAllSurveyV1s } from "../../../../hooks/backend/survey";
import { surveysTranslations } from "../../../../messages";
import Friends from "../../../../components/Friends";

export const metadata = {
  title: "Surveys",
};

export default async function SurveysPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const data = await getAllSurveyV1s();
  const { locale } = await params;

  const messages = surveysTranslations[locale] || surveysTranslations.en;

  const hotTopics = data
    .sort((a, b) => b.respondents - a.respondents)
    .slice(0, 10);

  const endingSoon = data.filter((survey) => survey.daysleft < 2);

  return (
    <div className="flex flex-col mt-5">
      <Friends />
      {hotTopics.length !== 0 ? (
        <div>
          <h1 className="flex flex-col items-center text-3xl font-bold font-sans text-red-400 mx-5">
            {messages.hotTopics}
          </h1>
          <div className="flex min-h-80 gap-5 overflow-x-scroll my-5 scrollbar-hide">
            {hotTopics.map((survey) => (
              <SurveyCard
                key={survey.id}
                title={survey.title}
                desc={survey.desc}
                id={survey.id}
                remaining={survey.remaining}
                reward={survey.reward}
                respondents={survey.respondents}
                daysLeft={survey.daysleft}
                finished={survey.finished}
              />
            ))}
          </div>
        </div>
      ) : null}

      {endingSoon.length !== 0 ? (
        <div>
          <h1 className="flex flex-col items-center text-3xl font-bold font-sans text-red-400 mx-5 animate-bounce">
            {messages.endingSoon}
          </h1>
          <div className="flex min-h-80 gap-5 overflow-x-scroll my-5 scrollbar-hide">
            {endingSoon.map((survey) => (
              <SurveyCard
                key={survey.id}
                title={survey.title}
                desc={survey.desc}
                id={survey.id}
                remaining={survey.remaining}
                reward={survey.reward}
                respondents={survey.respondents}
                daysLeft={survey.daysleft}
                finished={survey.finished}
              />
            ))}
          </div>
        </div>
      ) : null}

      <h1 className="flex flex-col items-center text-3xl font-bold font-sans text-violet-800 mx-5 mt-8">
        {messages.surveys}
      </h1>
      <div className="flex flex-wrap gap-5 justify-center mt-5 mb-10">
        {data.map((survey) => (
          <SurveyCard
            key={survey.id}
            title={survey.title}
            desc={survey.desc}
            id={survey.id}
            remaining={survey.remaining}
            reward={survey.reward}
            respondents={survey.respondents}
            daysLeft={survey.daysleft}
            finished={survey.finished}
          />
        ))}
      </div>
    </div>
  );
}
