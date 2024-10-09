"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Radio,
  RadioGroup,
  Button,
  Progress,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

export default function SurveyForm() {
  const router = useRouter();

  const [isError, setIsError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAlertError, setShowAlertError] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [questions] = useState([
    {
      id: 1,
      text: "User Interface (UI) คืออะไร ?",
      options: [
        {
          text: "ขั้นตอนการเข้าใช้งานติดต่อสื่อสารผู้ใช้",
          score: 1,
        },
        {
          text: "การทำ Wireframe ให้ผู้ใช้งานเกิดประสบการณ์ร่วมและสะดวกที่สุด",
          score: 2,
        },
        {
          text: '"หน้าตา" ที่ใช้เป็นตัวติดต่อสื่อสารกับผู้ใช้ ทำให้ผู้ใช้งานต้องใช้',
          score: 3,
        },
        {
          text: "การทำ Wireframe ให้ผู้ใช้งานเกิดประสบการณ์ร่วมและสะดวกที่สุด",
          score: 4,
        },
        {
          text: '"หน้าตา" ที่ใช้เป็นตัวติดต่อสื่อสารกับผู้ใช้ ทำให้ผู้ใช้งานต้องใช้',
          score: 5,
        },
      ],
    },
    {
      id: 2,
      text: "คำถามที่ 2",
      options: [
        { text: "ตัวเลือก 1", score: 1 },
        { text: "ตัวเลือก 2", score: 2 },
        { text: "ตัวเลือก 3", score: 3 },
        { text: "ตัวเลือก 4", score: 4 },
        { text: "ตัวเลือก 5", score: 5 },
      ],
    },
    {
      id: 3,
      text: "คำถามที่ 3",
      options: [
        { text: "ตัวเลือก 1", score: 1 },
        { text: "ตัวเลือก 2", score: 2 },
        { text: "ตัวเลือก 3", score: 3 },
        { text: "ตัวเลือก 4", score: 4 },
        { text: "ตัวเลือก 5", score: 5 },
      ],
    },
    {
      id: 4,
      text: "คำถามที่ 4",
      options: [
        { text: "ตัวเลือก 1", score: 1 },
        { text: "ตัวเลือก 2", score: 2 },
        { text: "ตัวเลือก 3", score: 3 },
        { text: "ตัวเลือก 4", score: 4 },
        { text: "ตัวเลือก 5", score: 5 },
      ],
    },
    {
      id: 5,
      text: "คำถามที่ 5",
      options: [
        { text: "ตัวเลือก 1", score: 1 },
        { text: "ตัวเลือก 2", score: 2 },
        { text: "ตัวเลือก 3", score: 3 },
        { text: "ตัวเลือก 4", score: 4 },
        { text: "ตัวเลือก 5", score: 5 },
      ],
    },
    // เพิ่มคำถามอื่นๆ ตามต้องการ
  ]);

  const [responses, setResponses] = useState(() => {
    return questions.reduce((acc, question) => {
      acc[question.id] = null;
      return acc;
    }, {});
  });

  const totalQuestions = questions.length;

  const handleOptionChange = (questionId, optionScore) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: optionScore,
    }));
  };

  const isQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion && responses[currentQuestion.id] !== null;
  };

  const submitResponses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to save the survey result");
      }

      const data = await res.json();

      if (!data.success) {
        setIsError(data.msg);
        return;
      }

      router.push("/result");
    } catch (error) {
      console.error("Error saving survey result:", error);
    }
  };

  const handleNextQuestion = () => {
    if (isQuestionAnswered()) {
      if (currentQuestionIndex < totalQuestions - 1) {
        setSlideDirection(1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        submitResponses();
      }
    } else {
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setSlideDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100
  );

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
    }),
  };

  const transition = {
    x: { type: "tween", ease: "easeInOut", duration: 0.3 },
  };

  if (questions.length === 0) {
    return <div>ไม่มีคำถามที่พร้อมใช้งาน</div>;
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {showAlertError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">ข้อผิดพลาด!</strong>
          <span className="block sm:inline"> กรุณาตอบคำถามก่อนไปข้อถัดไป</span>
        </motion.div>
      )}

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">ข้อผิดพลาด!</strong>
          <span className="block sm:inline"> {isError} </span>
        </motion.div>
      )}

      <Card className="p-10 w-full max-w-2xl">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">แบบทดสอบก่อนเรียน</h2>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </CardHeader>
        <CardBody>
          <Progress
            aria-label="ความคืบหน้าของแบบทดสอบ"
            value={progressPercentage}
            className="mb-4"
          />

          <div className="h-[300px] overflow-hidden relative">
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={currentQuestionIndex}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full absolute top-0 left-0"
              >
                <h3 className="text-xl font-bold mb-4">
                  {currentQuestion.text}
                </h3>

                <RadioGroup
                  value={responses[currentQuestion.id]?.toString() || ""}
                  onValueChange={(value) =>
                    handleOptionChange(currentQuestion.id, parseInt(value))
                  }
                >
                  {currentQuestion.options.map((option, index) => (
                    <Radio key={index} value={option.score.toString()}>
                      {option.text}
                    </Radio>
                  ))}
                </RadioGroup>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-between">
            {currentQuestionIndex > 0 && (
              <Button
                onClick={handlePreviousQuestion}
                color="default"
                className="transition-transform hover:scale-105"
              >
                ย้อนกลับ
              </Button>
            )}
            <Button
              onClick={handleNextQuestion}
              color="primary"
              className="ml-auto transition-transform hover:scale-105"
            >
              {currentQuestionIndex < totalQuestions - 1
                ? "คำถามต่อไป"
                : "เสร็จสิ้น"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
