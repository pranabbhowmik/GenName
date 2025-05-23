import mongoose from "mongoose";

const nameSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    meanings: [
      {
        name: { type: String, required: true },
        meaning: { type: String, required: true },
        origin: { type: String, required: true },
        culturalRelevance: { type: String, required: true },
        descriptiveWords: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

const Name = mongoose.model("Name", nameSchema);
export default Name;
