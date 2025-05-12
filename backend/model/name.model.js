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
  },
  { timestamps: true }
);

const Name = mongoose.model("Name", nameSchema);
export default Name;
