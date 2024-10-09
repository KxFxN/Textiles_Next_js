// // models/Score.js
// import mongoose, { Schema, model, Model } from "mongoose";

// const ScoreDetailsSchema = new Schema(
//   {
//     1: { type: Number, required: true },
//     2: { type: Number, required: true },
//     3: { type: Number, required: true },
//     4: { type: Number, required: true },
//     5: { type: Number, required: true },
//   },
//   { _id: false }
// );

// const ScoreSchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//       required: [true, "User reference is required"],
//     },
//     scores: {
//       type: ScoreDetailsSchema,
//       required: [true, "Scores are required"],
//     },
//     totalScore: {
//       type: Number,
//       required: [true, "Total score is required"],
//     },
//     maxScore: {
//       type: Number,
//       required: [true, "Max score is required"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Scores = mongoose.models.scores || model("scores", ScoreSchema);

// module.exports = Scores;

import mongoose, { Schema, model } from "mongoose";

// Schema for tracking scores 1-5
const ScoreDetailsSchema = new Schema(
  {
    1: { type: Number, required: true },
    2: { type: Number, required: true },
    3: { type: Number, required: true },
    4: { type: Number, required: true },
    5: { type: Number, required: true },
  },
  { _id: false }
);

// Schema for individual category scores
const CategoryScoreSchema = new Schema(
  {
    categoryId: {
      type: Number,
      required: [true, "Category ID is required"],
    },
    totalScore: {
      type: Number,
      required: [true, "Category total score is required"],
    },
  },
  { _id: false }
);

// Main score schema
const ScoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User reference is required"],
    },
    scores: {
      type: ScoreDetailsSchema,
      required: [true, "Scores are required"],
    },
    categoryScores: {
      type: [CategoryScoreSchema],
      required: [true, "Category scores are required"],
    },
    totalScore: {
      type: Number,
      required: [true, "Total score is required"],
    },
    maxScore: {
      type: Number,
      required: [true, "Max score is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Scores = mongoose.models.scores || model("scores", ScoreSchema);

export default Scores;
