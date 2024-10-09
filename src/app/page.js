import React from "react";
import SurveyForm from "@/components/Form/SurveyForm/SurveyForm";
import { GetQuestion } from "./action/Question";

export default async function page() {
  const Question = await GetQuestion();

  return (
    <div>
      <SurveyForm QuestionData={Question.data[0]}/>
    </div>
  );
}
