// // models/Question.js
// import mongoose, { Schema, model } from "mongoose";

// const OptionSchema = new Schema(
//   {
//     text: { type: String, required: true },
//     score: { type: Number, required: true, min: 1, max: 5 },
//   },
//   { _id: false }
// );

// const QuestionSchema = new Schema(
//   {
//     id: { type: Number, required: true, unique: true },
//     text: { type: String, required: true },
//     options: {
//       type: [OptionSchema],
//       required: true,
//       validate: [arrayLimit, "{PATH} must contain exactly 5 options"],
//     },
//   },
//   { timestamps: true }
// );

// function arrayLimit(val) {
//   return val.length === 5;
// }

// const Questions =
//   mongoose.models.questions || model("questions", QuestionSchema);

// export default Questions;
