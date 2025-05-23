import Name from "../model/name.model.js";
import axios from "axios";
import PDFDocument from "pdfkit";

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
    const names = [firstName, middleName, lastName].filter((name) => name);
    const fullName = names.join(" ");
    const prompt = `Explain the meanings of the first name, middle name, and last name separately for the full name: ${fullName}. Provide 2–3 lines of explanation for each part, including the origin, meaning, and cultural or historical relevance. Additionally, for each name part, provide exactly three words that describe the name (e.g., "Classic, Common, Timeless"). Return the result as a JSON array, where each object contains 'name', 'meaning', 'origin', 'culturalRelevance', and 'descriptiveWords' (an array of three strings) fields.`;

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
    const jsonMatch =
      result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*}/);
    const meanings = jsonMatch
      ? JSON.parse(jsonMatch[1] || jsonMatch[0])
      : JSON.parse(result);

    // Store name and meanings in the database
    let name = await Name.findOne({ firstName, middleName, lastName });
    if (name) {
      name.meanings = meanings;
      await name.save();
    } else {
      name = await Name.create({
        firstName,
        middleName,
        lastName,
        meanings,
      });
    }

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

const generateNamePDF = async (req, res) => {
  const { firstName, middleName, lastName } = req.body;

  try {
    // Retrieve name and meanings from database
    const name = await Name.findOne({ firstName, middleName, lastName });
    if (!name || !name.meanings || name.meanings.length === 0) {
      return res
        .status(404)
        .json({ message: "Name or meanings not found in database" });
    }

    // Generate PDF
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=name_meaning_${firstName}_${lastName}.pdf`
    );
    doc.pipe(res);

    // Header
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("Name Meaning Report", { align: "center" });
    doc.moveDown(1.5);

    // Full Name (exclude middleName if empty)
    const fullName = [firstName, middleName, lastName]
      .filter((name) => name && name.trim() !== "")
      .join(" ");
    doc
      .font("Helvetica")
      .fontSize(16)
      .text(`Full Name: ${fullName}`, { align: "left" });
    doc.moveDown(1);

    // Individual Name Meanings
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Individual Name Meanings", { align: "left", underline: true });
    doc.moveDown(0.5);

    // Filter meanings to match provided names
    const filteredMeanings = name.meanings.filter((item, index) => {
      if (index === 0 && firstName) return true; // First name
      if (index === 1 && middleName && middleName.trim() !== "") return true; // Middle name
      if (
        index === (middleName && middleName.trim() !== "" ? 2 : 1) &&
        lastName
      )
        return true; // Last name
      return false;
    });

    filteredMeanings.forEach((item, index) => {
      const nameType =
        index === 0
          ? "First Name"
          : index === 1 && middleName && middleName.trim() !== ""
          ? "Middle Name"
          : "Last Name";
      doc.font("Helvetica-Bold").fontSize(12).text(`${nameType}: ${item.name}`);
      doc.font("Helvetica").fontSize(10).text(`Meaning: ${item.meaning}`);
      doc.text(`Origin: ${item.origin}`);
      doc.text(`Cultural Relevance: ${item.culturalRelevance}`);
      doc.text(`Descriptive Words: ${item.descriptiveWords.join(", ")}`);
      doc.moveDown(1);
    });

    // Full Name Meaning Observation
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("Full Name Meaning Observation", {
        align: "left",
        underline: true,
      });
    doc.moveDown(0.5);

    const observationParts = filteredMeanings.map((item, index) => {
      const nameType =
        index === 0
          ? "first name"
          : index === 1 && middleName && middleName.trim() !== ""
          ? "middle name"
          : "last name";
      return `The ${nameType} "${
        item.name
      }" contributes ${item.meaning.toLowerCase()}, reflecting ${item.culturalRelevance.toLowerCase()}.`;
    });
    const fullNameObservation = `The full name "${fullName}" combines unique qualities: ${observationParts.join(
      " "
    )} Together, it suggests a harmonious blend of character, heritage, and cultural significance.`;

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(fullNameObservation, { align: "left" });
    doc.moveDown(1);

    // Footer
    doc
      .font("Helvetica-Oblique")
      .fontSize(8)
      .text(
        `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
};

export { createName, getNameMeaning, generateNamePDF };
