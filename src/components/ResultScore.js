"use client";

import React from "react";
import Link from "next/link";
import ResultChart from "@/components/Chart/ResultChart";

const categories = [
  "องค์กรและผู้นำองค์กร",
  "ด้านการจัดการธุรกิจ",
  "ด้านการตลาด",
  "ด้านการผลิต",
  "ด้านบัญชีและการเงิน",
  "ด้านการบริหารทรัพยากรมนุษย์",
  "ด้านนวัตกรรม",
  "ด้านความยั่งยืน",
];

// export default function Result({ scores, count }) {
export default function Result() {
  const handleDownloadPDF = () => {
    console.log("Download PDF");
    // Implement PDF download logic here
  };

  const scores = {
    user: {
      _id: "6704253de8cae24a2837be5c",
      companyName: "Tech Solutions",
      firstName: "John",
      lastName: "Doe",
      email: "sakarin14184@gmail.com",
      role: "user",
      position: "Software Engineer",
      department: "Engineering",
      phone: "+1234567890",
      isActive: true,
      createdAt: "2024-10-07T18:15:25.761Z",
      updatedAt: "2024-10-07T18:15:25.761Z",
      __v: 0,
    },
    scores: {
      1: 6,
      2: 10,
      3: 12,
      4: 20,
      5: 40,
    },
    categoryScores: [
      {
        categoryId: 0,
        totalScore: 26,
      },
      {
        categoryId: 1,
        totalScore: 25,
      },
      {
        categoryId: 2,
        totalScore: 14,
      },
      {
        categoryId: 3,
        totalScore: 23,
      },
    ],
    totalScore: 88,
    maxScore: 40,
    createdAt: {
      $date: "2024-10-09T13:05:58.488Z",
    },
    updatedAt: {
      $date: "2024-10-09T13:05:58.488Z",
    },
    __v: 0,
  };

  const count = {
    totalQuestions: 28,
    categoryCounts: [
      {
        categoryName:
          "การสร้างแรงจูงใจให้กับพนักงาน (Motivating people as they work)",
        questionCount: 7,
      },
      {
        categoryName:
          "การพัฒนาพนักงานให้มีความสามารถมากขึ้น (Developing people as they work)",
        questionCount: 8,
      },
      {
        categoryName:
          "การกำกับ ควบคุม ดูแลพนักงานให้สามารถทำงานได้ตามเป้าหมาย (Directing people as they work)",
        questionCount: 6,
      },
      {
        categoryName:
          "การคัดเลือกและจัดคนให้หมาะกับงาน (Identifying the best people for the job)",
        questionCount: 7,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-5xl w-full">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-green-500">ผลสรุป</span>
            แบบประเมินศักยภาพทั้งหมด 8 หัวข้อ
          </h1>
          <div className="text-sm text-gray-500 mt-2">
            <span>บริษัท : {scores.user.companyName}</span>
            <span>บริษัท : Allmass</span>
            <span className="mx-4">|</span>
            <span>
              โดย {scores.user.firstName} {scores.user.lastName}
            </span>
            <span className="mx-4">|</span>
            <span>
              เมื่อวันที่{" "}
              {new Date(scores.createdAt).toLocaleDateString("th-TH")}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <ResultChart
              responses={scores.scores}
              calculateTotalScore={scores.totalScore}
              maxScore={scores.maxScore}
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              คะแนนของคุณ :{" "}
              <span className="text-blue-700">
                {scores.totalScore} / {count.totalQuestions * 5} คะแนน
              </span>
            </h2>
            {scores.categoryScores.map((category, index) => {
              const categoryData = count.categoryCounts[index];
              const questionCount = categoryData.questionCount;
              const fullScore = Math.round(questionCount * 5);

              return (
                <div
                  key={index}
                  className="flex justify-between mb-2 text-gray-700"
                >
                  <span>
                    หัวข้อที่ {index + 1}.{categories[index]}
                  </span>
                  <span className="font-semibold">
                    : {category.totalScore} / {fullScore} คะแนน
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <Link
            href="/"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300"
          >
            เริ่มทำแบบประเมินใหม่
          </Link>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 px-8 rounded-full transition duration-300 border border-green-200"
          >
            ดาวน์โหลด PDF
          </button>
        </div>
      </div>
    </div>
  );
}
