import mongoose from "mongoose";

const CommunicationLogSchema = new mongoose.Schema({
  custName: String,
  custEmail: String,
  status: String,
  messageSubject: String,
  messageBody: String,
  suggestedImageType: String,
  timestamp: {
    type: Number,
    default: Date.now
  }
});

const CommunicationLog = mongoose.model(
  "CommunicationLog",
  CommunicationLogSchema,
);

export default CommunicationLog;
