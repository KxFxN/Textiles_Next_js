import { NextResponse } from "next/server";
import { ensureDbConnected } from "@/lib/dbConnect";
import Scores from "@/Model/Score";
import Users from "@/Model/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req) {
  try {
    await ensureDbConnected();

    const result = await Scores.find()
      .populate({
        path: "user",
        model: Users,
        select: "-password",
      })
      .sort({ updatedAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      data: result,
      status: 200,
      msg: "GET request processed successfully",
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "Internal server error",
    });
  }
}

export async function POST(req) {
  try {
    const { responses } = await req.json();

    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) {
      return NextResponse.json({
        success: false,
        status: 401,
        msg: "Unauthorized: No token provided",
      });
    }
    const decodedToken = await verifyToken(token.value);
    if (!decodedToken) {
      return NextResponse.json({
        success: false,
        status: 401,
        msg: "Unauthorized: Invalid token",
      });
    }

    await ensureDbConnected();

    // Initialize overall scores object
    const newScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Calculate scores for each category and update overall scores
    const categoryScores = Object.entries(responses).map(
      ([categoryId, questions]) => {
        // Calculate total score for this category
        const categoryTotalScore = Object.values(questions).reduce(
          (sum, score) => sum + score,
          0
        );

        // Add each score to the overall scores
        Object.entries(questions).forEach(([_, score]) => {
          if (score >= 1 && score <= 5) {
            newScores[score] += score;
          }
        });

        return {
          categoryId: parseInt(categoryId),
          totalScore: categoryTotalScore,
        };
      }
    );

    // Calculate total and max scores
    const maxScoreValue = Math.max(...Object.values(newScores));
    const totalScoreValue = Object.values(newScores).reduce(
      (sum, value) => sum + value,
      0
    );

    // Check if user has already submitted a score and update or create new
    const updatedScore = await Scores.findOneAndUpdate(
      { user: decodedToken.userId },
      {
        scores: newScores,
        categoryScores,
        totalScore: totalScoreValue,
        maxScore: maxScoreValue,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedScore,
      status: 200,
      msg: "Score updated successfully",
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      msg: "Internal server error",
    });
  }
}
