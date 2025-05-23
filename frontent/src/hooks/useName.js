import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useName = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  });
  const [meanings, setMeanings] = useState([]);
  const [errors, setErrors] = useState({}); // Change to object for field-specific errors
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = "Last name must be at least 3 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://genname.onrender.com/api/name/name-meaning", // Changed to HTTP
        // test URL localhost:5000/api/name/name-meaning
        // "http://localhost:5000/api/name/name-meaning",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const backendErrors = {};
          errorData.errors.forEach((err) => {
            backendErrors[err.path] = err.message;
          });
          setErrors(backendErrors);
        } else {
          setErrors({
            general: errorData.message || "Failed to fetch name meanings",
          });
        }
        toast.error("Failed to fetch name meanings");
        return;
      }

      const data = await response.json();
      console.log("API Response Data:", data);
      setMeanings(data);
      setErrors({});

      const navigationState = {
        meanings: data,
        fullName: { ...formData },
      };
      console.log("Navigating with state:", navigationState);
      navigate("/result", { state: navigationState });
      toast.success("Name meanings fetched successfully");
    } catch (err) {
      console.error("Error in handleSubmit:", err.message);
      setErrors({
        general:
          "An error occurred while fetching name meanings: " + err.message,
      });
      toast.error("An error occurred while fetching name meanings");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    meanings,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
};

export default useName;
