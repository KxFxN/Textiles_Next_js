"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const SurveyForm = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlertError, setShowAlertError] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "1.ท่านมีการวางแผนการพัฒนาทักษะของพนักงานของท่านอย่างเป็นระบบ เพื่อให้สอดรับกับทิศทางขององค์กร",
    },
    { id: 2, text: "2.คำถามที่ 2" },
    { id: 3, text: "3.คำถามที่ 3" },
    { id: 4, text: "4.คำถามที่ 4" },
    { id: 5, text: "5.คำถามที่ 5" },
    { id: 6, text: "6.คำถามที่ 6" },
    { id: 7, text: "7.คำถามที่ 7" },
    { id: 8, text: "8.คำถามที่ 8" },
    { id: 9, text: "9.คำถามที่ 9" },
    { id: 10, text: "10.คำถามที่ 10" },
    { id: 11, text: "11.คำถามที่ 11" },
    { id: 12, text: "12.คำถามที่ 12" },
    { id: 13, text: "13.คำถามที่ 13" },
    { id: 14, text: "14.คำถามที่ 14" },
    { id: 15, text: "15.คำถามที่ 15" },
    // { id: 16, text: "16.คำถามที่ 16" },
    // { id: 17, text: "17.คำถามที่ 17" },
    // { id: 18, text: "18.คำถามที่ 18" },
    // { id: 19, text: "19.คำถามที่ 19" },
    // { id: 20, text: "20.คำถามที่ 20" },
    // { id: 21, text: "21.คำถามที่ 21" },
    // { id: 22, text: "22.คำถามที่ 22" },
    // { id: 23, text: "23.คำถามที่ 23" },
    // { id: 24, text: "24.คำถามที่ 24" },
    // { id: 25, text: "25.คำถามที่ 25" },
    // { id: 26, text: "26.คำถามที่ 26" },
    // { id: 27, text: "27.คำถามที่ 27" },
    // { id: 28, text: "28.คำถามที่ 28" },
    // { id: 29, text: "29.คำถามที่ 29" },
    // { id: 30, text: "30.คำถามที่ 30" },
  ]);

  const [responses, setResponses] = useState({});

  const options = [
    "5.เห็นด้วยอย่างยิ่ง",
    "4.ค่อนข้างเห็นด้วย",
    "3.ไม่แน่ใจ",
    "2.ไม่ค่อยเห็นด้วย",
    "1.ไม่เห็นด้วยอย่างยิ่ง",
  ];
  const scores = {
    "5.เห็นด้วยอย่างยิ่ง": 5,
    "4.ค่อนข้างเห็นด้วย": 4,
    "3.ไม่แน่ใจ": 3,
    "2.ไม่ค่อยเห็นด้วย": 2,
    "1.ไม่เห็นด้วยอย่างยิ่ง": 1,
  };

  const totalPages = useMemo(
    () => Math.ceil(questions.length / 10),
    [questions]
  );

  const handleOptionChange = (questionId, optionValue) => {
    setResponses((prev) => {
      const currentScore = prev[questionId];
      const newScore = scores[optionValue];

      if (currentScore === newScore) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [questionId]: newScore };
    });
  };

  const isPageComplete = () => {
    const pageQuestions = questions.slice(
      (currentPage - 1) * 10,
      currentPage * 10
    );
    return pageQuestions.every(
      (question) => responses[question.id] !== undefined
    );
  };

  const resultToDB = async (responses) => {
    const newScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.values(responses).forEach((score) => {
      if (score >= 1 && score <= 5) {
        newScores[score] += score;
      }
    });

    const maxScoreValue = Math.max(...Object.values(newScores));
    const totalScoreValue = Object.values(responses).reduce(
      (sum, value) => sum + value,
      0
    );

    const data = {
      scores: newScores,
      totalScore: totalScoreValue,
      maxScore: maxScoreValue,
    };

    try {
      const res = await fetch("/api/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save the survey result");
      }

      router.push("/result");

      return await res.json();
    } catch (error) {
      console.error("Error saving survey result:", error);
    }
  };

  const handleNextPage = () => {
    if (isPageComplete()) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      } else {
        resultToDB(responses);
      }
    } else {
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentQuestions = questions.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div className="p-4">
      {showAlertError && (
        <div role="alert" className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-black">
            กรุณาตอบคำถามให้ครบทุกข้อก่อนไปหน้าถัดไป
          </span>
        </div>
      )}

      <div className="flex items-center justify-center py-10">
        <ul className="steps w-[70%]">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              data-content={`${currentPage > index + 1 ? "✓" : index + 1}`}
              className={`step ${currentPage > index ? "step-primary" : ""}`}
            ></li>
          ))}
        </ul>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">คำถาม</th>
            {options.map((option, index) => (
              <th
                key={index}
                className="border text-base font-normal p-2 w-28  max-w-[120px]"
              >
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentQuestions.map((question) => (
            <tr key={question.id} className="border-b">
              <td className="border p-2 ">{question.text}</td>
              {options.map((option) => (
                <td
                  key={option}
                  className={`border text-center cursor-pointer ${
                    responses[question.id] === scores[option]
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleOptionChange(question.id, option)}
                >
                  <div className="flex justify-center items-center h-full">
                    <label className="cursor-pointer inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={responses[question.id] === scores[option]}
                        onChange={() => {}}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        {currentPage > 1 && (
          <button
            onClick={handlePreviousPage}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            ย้อนกลับ
          </button>
        )}
        <span>
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {currentPage < totalPages ? "ถัดไป" : "เสร็จสิ้น"}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
