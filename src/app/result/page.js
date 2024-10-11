import React from "react";
import Result from "@/components/ResultScore";
import { GetResultByUserID } from "../action/Result";
import { GetQuestionCount, GetQuestionCountLength } from "../action/Question";

export default async function page() {
  const ResultScore = await GetResultByUserID();
  const QuestionCount = await GetQuestionCount();

  return <Result scores={ResultScore.data[0]} count={QuestionCount.data} />;
}
