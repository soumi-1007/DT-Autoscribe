const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: Number, required: true },
  selectedIndex: { type: Number },
  freeText: { type: String },
  marksAwarded: { type: Number, default: 0 }
});

const attemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
});

module.exports = mongoose.model('Attempt', attemptSchema);
