import Name from "../model/name.model.js";
import axios from "axios";

const createName = async (req, res) => {
  const { firstName, middleName, lastName } = req.body;
  try {
    const name = await Name.create({
      firstName,
      middleName,
      lastName,
    });
    res.status(201).json(name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNameMeaning = async (req, res) => {
  const { firstName, middleName, lastName } = req.body;
  const apiKey = process.env.Gemini_API;

  if (!apiKey) {
    return res
      .status(500)
      .json({ message: "Gemini API key is not configured" });
  }

  try {
    const names = [firstName, middleName, lastName].filter((name) => name); // Remove empty names
    const fullName = names.join(" ");
    const prompt = `Explain the meanings of the first name, middle name, and last name separately for the full name: ${fullName}. Provide 2–3 lines of explanation for each part, including the origin, meaning, and cultural or historical relevance. Return the result as a JSON array, where each object contains 'name', 'meaning', 'origin', and 'culturalRelevance' fields.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    // Clean up the response to extract JSON
    const jsonMatch =
      result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*}/);
    const meanings = jsonMatch
      ? JSON.parse(jsonMatch[1] || jsonMatch[0])
      : JSON.parse(result);

    res.status(200).json(meanings);
  } catch (error) {
    console.error(
      "Error fetching name meanings:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Error fetching name meanings", error: error.message });
  }
};

export { createName, getNameMeaning };
