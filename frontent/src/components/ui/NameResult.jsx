import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function NameMeaningResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const meanings = state?.meanings || [];
  const fullName = state?.fullName || {};

  // Construct display name, filtering out empty values
  const displayName = [
    fullName?.firstName,
    fullName?.middleName,
    fullName?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    try {
      const response = await fetch(
        "https://genname.onrender.com/api/name/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: fullName.firstName,
            middleName: fullName.middleName,
            lastName: fullName.lastName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `name_meaning_${fullName.firstName}_${fullName.lastName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      toast.error("Failed to generate PDF: " + error.message);
    }
  };

  // Generate Full Name Meaning Observation
  const generateFullNameObservation = () => {
    if (!meanings || meanings.length === 0) return "No observation available.";

    const observationParts = meanings.map((item, index) => {
      const nameType =
        index === 0
          ? "first name"
          : index === 1 && fullName.middleName
          ? "middle name"
          : "last name";
      return `The ${nameType} "${
        item.name
      }" contributes ${item.meaning.toLowerCase()}, reflecting ${item.culturalRelevance.toLowerCase()}.`;
    });

    return `The full name "${displayName}" combines unique qualities: ${observationParts.join(
      " "
    )} Together, it suggests a harmonious blend of character, heritage, and cultural significance.`;
  };

  if (!meanings || meanings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 md:p-10 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            No Results Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please go back and enter a valid name.
          </p>
          <div className="justify-center flex space-x-4">
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
            <button
              className="px-6 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed"
              disabled
            >
              Generate PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create name labels based on provided names
  const nameLabels = [];
  if (fullName.firstName) nameLabels.push("First");
  if (fullName.middleName) nameLabels.push("Middle");
  if (fullName.lastName) nameLabels.push("Last");

  // Ensure meanings array aligns with provided names
  const filteredMeanings = meanings.filter((item, index) => {
    if (index === 0 && fullName.firstName) return true;
    if (index === 1 && fullName.middleName) return true;
    if (index === (fullName.middleName ? 2 : 1) && fullName.lastName)
      return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          Name Meaning
        </h2>
        <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 mb-8 text-sm md:text-base">
          <span className="font-medium">Your name:</span>{" "}
          <span className="text-gray-900 font-semibold">{displayName}</span>
        </div>
        <div className="space-y-6 text-sm md:text-base text-gray-700">
          {filteredMeanings.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-800 mb-1">
                {item.name} ({nameLabels[index]} Name):
              </h3>
              <p className="text-gray-600">
                <strong>Meaning:</strong> {item.meaning}
              </p>
              <p className="text-gray-600">
                <strong>Origin:</strong> {item.origin}
              </p>
              <p className="text-gray-600">
                <strong>Cultural Relevance:</strong> {item.culturalRelevance}
              </p>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-800">
                  3 words to describe your name
                </h4>
                <div className="flex space-x-4 mt-1">
                  <div>
                    <h5 className="text-gray-600">
                      {nameLabels[index]} name ({item.name})
                    </h5>
                    <ul className="list-disc pl-5">
                      {item.descriptiveWords?.map((word, idx) => (
                        <li key={idx} className="text-gray-600">
                          {word}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {index < filteredMeanings.length - 1 && (
                <hr className="border-t border-gray-200 mt-4" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4 text-sm md:text-base text-gray-700">
          <h3 className="font-semibold text-gray-800">
            Full Name Meaning Observation
          </h3>
          <p className="text-gray-600">{generateFullNameObservation()}</p>
          <hr className="border-t border-gray-200" />
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={handleGeneratePDF}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
}
