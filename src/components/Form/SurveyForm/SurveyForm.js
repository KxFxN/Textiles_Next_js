"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Checkbox,
  Button,
  Progress,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export default function Component({ QuestionData }) {
  const router = useRouter();
  const [showAlertError, setShowAlertError] = useState(false);
  const [categories, setCategories] = useState(QuestionData.categories);
  const [scores, setScores] = useState(QuestionData.scores);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [Back, setBack] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(responses);
  }, [responses]);

  const handleOptionChange = (questionId, score) => {
    setResponses((prev) => ({
      ...prev,
      [currentCategoryIndex]: {
        ...(prev[currentCategoryIndex] || {}),
        [questionId]: score,
      },
    }));
  };

  const isPageComplete = () => {
    if (categories.length === 0) return false;
    const currentCategory = categories[currentCategoryIndex];
    return currentCategory.questions.every(
      (question) => responses[currentCategoryIndex]?.[question.id] !== undefined
    );
  };

  const submitResponses = async (responses) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/result`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            responses,
          }),
        }
      );

      if (!response.ok) throw new Error("error");

      router.push("/result");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    if (isPageComplete()) {
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
      } else {
        submitResponses(responses);
      }
    } else {
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handlePreviousPage = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    } else {
      router.back();
    }
  };

  const currentCategory = categories[currentCategoryIndex];
  const progressPercentage =
    ((currentCategoryIndex + 1) / categories.length) * 100;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-green-100 p-4"
      role="main"
      aria-label="Entrepreneur Potential Assessment"
    >
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            แบบประเมินศักยภาพสำหรับผู้ประกอบการ จำนวน {categories.length} หัวข้อ
          </h1>
          <p className="text-sm text-gray-600">
            เมื่อเริ่มทำแบบประเมิน จะมีคำถามทั้งหมด {categories.length} หัวข้อ
            โดยใช้เวลาประมาณ 15-20 นาทีในการทำแบบประเมินให้เสร็จ
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2 mb-6"
          role="list"
          aria-label="Assessment Topics"
        >
          {[
            { name: "องค์กรและผู้นำองค์กร", icon: "🏢" },
            { name: "ด้านการจัดการธุรกิจ", icon: "📊" },
            { name: "ด้านการตลาด", icon: "🎯" },
            { name: "ด้านการผลิต", icon: "🏭" },
            { name: "ด้านบัญชีและการเงิน", icon: "💰" },
            { name: "ด้านทรัพยากรมนุษย์", icon: "👥" },
            { name: "ด้านนวัตกรรม", icon: "💡" },
            { name: "ด้านความยั่งยืน", icon: "🌱" },
          ].map((topic, index) => (
            <div
              key={index}
              className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center"
              role="listitem"
              aria-label={`Topic ${index + 1}`}
            >
              <span className="mr-1" aria-hidden="true">
                {topic.icon}
              </span>
              {topic.name}
            </div>
          ))}
        </div>

        <div
          className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-6 font-medium"
          role="heading"
          aria-level="2"
        >
          แบบประเมินศักยภาพหัวข้อที่ {currentCategoryIndex + 1} :{" "}
          {currentCategory.name}
        </div>

        <Progress
          value={progressPercentage}
          className="mb-6"
          classNames={{
            base: "w-full",
            track: "drop-shadow-md border border-default",
            indicator: "bg-gradient-to-r from-blue-500 to-green-500",
            label: "tracking-wider font-medium text-default-600",
            value: "text-blue-700 font-semibold",
          }}
          showValueLabel={true}
          aria-label={`Progress ${progressPercentage}%`}
        />

        <Table
          aria-label={`Assessment Category ${currentCategoryIndex + 1}`}
          classNames={{
            base: "max-w-full",
            table: "min-w-full",
          }}
          removeWrapper
        >
          <TableHeader>
            <TableColumn className="bg-[#eefff1] py-2 px-4 text-green-500 font-semibold text-center">
              <h2 className="text-xl">คำถาม</h2>
            </TableColumn>
            {scores.map((score, index) => (
              <TableColumn
                key={index}
                className="bg-blue-50 text-center py-2 px-2 text-sm text-gray-600 font-semibold"
              >
                {score.text}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {currentCategory.questions.map((question, qIndex) => (
              <TableRow
                key={question.id}
                className={qIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <TableCell className="py-4 px-4 text-gray-800 bg-[#f6fff7]">
                  {qIndex + 1}. {question.text}
                </TableCell>
                {scores.map((score, index) => (
                  <TableCell
                    key={index}
                    className="text-center p-0 w-[120px] h-[60px]"
                  >
                    <div
                      className="w-full h-full flex items-center justify-center hover:bg-blue-100 cursor-pointer"
                      onClick={() =>
                        handleOptionChange(question.id, score.score)
                      }
                      role="button"
                      aria-label={`Select score ${score.score} for question ${
                        qIndex + 1
                      }`}
                    >
                      <div className="w-6 h-6 relative">
                        <Checkbox
                          id={`checkbox-${question.id}-${score.score}`}
                          isSelected={
                            responses[currentCategoryIndex]?.[question.id] ===
                            score.score
                          }
                          onValueChange={() =>
                            handleOptionChange(question.id, score.score)
                          }
                          aria-label={`Select score ${
                            score.score
                          } for question ${qIndex + 1}`}
                          color="primary"
                          size="md"
                        />
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {showAlertError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
            aria-label="Please answer all questions before proceeding"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">
              {" "}
              Please answer all questions before proceeding.
            </span>
          </div>
        )}

        <div
          className="mt-6 flex justify-end gap-3"
          role="group"
          aria-label="Navigation buttons"
        >
          <Button
            onClick={handlePreviousPage}
            color="default"
            variant="bordered"
            className="px-6"
            aria-label="Previous page"
          >
            ย้อนกลับ
          </Button>
          <Button
            onClick={handleNextPage}
            color="success"
            className="px-6 text-white"
            aria-label={
              currentCategoryIndex < categories.length - 1
                ? "Next page"
                : "Complete assessment"
            }
          >
            {currentCategoryIndex < categories.length - 1
              ? "ถัดไป"
              : "เสร็จสิ้น"}
          </Button>
        </div>
      </div>
    </div>
  );
}
