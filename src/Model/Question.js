import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const CategorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    questions: [QuestionSchema],
  },
  { _id: false }
);

const ScoreSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
  },
  { _id: false }
);

const QuestionSetSchema = new mongoose.Schema(
  {
    categories: [CategorySchema],
    scores: [ScoreSchema],
  },
  { timestamps: true }
);

const QuestionSet = mongoose.models.QuestionSet || mongoose.model('QuestionSet', QuestionSetSchema);

export default QuestionSet;
