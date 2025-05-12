import React from "react";
import useName from "../../hooks/useName";

export default function NameMeaningForm() {
  const { formData, errors, loading, handleChange, handleSubmit } = useName();

  return (
    <div className="min-h-screen -mt-24 flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Name Meaning Finder
          </h2>
          <p className="text-sm text-gray-500">
            Discover the meaning of your first, middle, and last names
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 text-sm">
                First Name <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className={`mt-1 w-full px-4 py-2 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>

          {/* Middle Name */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 text-sm">Middle Name</label>
            </div>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Enter middle name"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="block text-gray-700 text-sm">
                Last Name <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={`mt-1 w-full px-4 py-2 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-4">
            <button
              type="button"
              className="px-6 py-2 border border-blue-400 text-blue-500 rounded-lg hover:bg-blue-50"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Loading..." : "Get Meanings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
