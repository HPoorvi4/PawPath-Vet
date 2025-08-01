import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Register.css";

export default function VetRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    specialization: "",
    license_number: "",
    available_days: [],
    available_time: "",
  });

  const [files, setFiles] = useState({
    license_file: null,
    profile_photo: null,
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const specializations = [
    "General Practice",
    "Surgery",
    "Internal Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Oncology",
    "Emergency Medicine",
    "Exotic Animals",
    "Other",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedDays = checked
        ? [...prev.available_days, value]
        : prev.available_days.filter((day) => day !== value);
      return { ...prev, available_days: updatedDays };
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const validateStep1 = () => {
    const { name, email, password, phone, location } = formData;
    if (!name || !email || !password || !phone || !location) {
      setErr("Please fill in all required fields");
      return false;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { license_number, specialization } = formData;
    if (!license_number || !specialization || !files.license_file) {
      setErr("Please complete all professional verification fields");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    setErr("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setErr("");
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    if (!validateStep2()) {
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "available_days") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (files.license_file) {
        submitData.append("license_file", files.license_file);
      }

      if (files.profile_photo) {
        submitData.append("profile_photo", files.profile_photo);
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/vet-register",
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        alert("Registration successful! Your account is pending approval.");
        navigate("/login");
      } else {
        setErr(res.data.message || "Registration failed");
      }
    } catch (error) {
      if (error.response) {
        setErr(error.response.data.message || "Registration failed");
      } else if (error.request) {
        setErr("Network error. Please check your connection.");
      } else {
        setErr("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card vet-register-card">
        <div className="register-header">
          <h2>Veterinarian Registration</h2>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
            <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
          </div>
        </div>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <h3>Basic Information</h3>

              <div className="input-group">
                <label>Full Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Password *</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
              </div>

              <div className="input-group">
                <label>Phone *</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Clinic Location *</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="button" onClick={nextStep}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Professional Verification</h3>

              <div className="input-group">
                <label>Specialization *</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>License Number *</label>
                <input
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>License Document *</label>
                <input
                  name="license_file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Available Days</label>
                <div className="checkbox-group">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={day}
                        checked={formData.available_days.includes(day)}
                        onChange={handleCheckboxChange}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Available Time</label>
                <select
                  name="available_time"
                  value={formData.available_time}
                  onChange={handleChange}
                >
                  <option value="">Select Time Slot</option>
                  <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                  <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                  <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                </select>
              </div>

              <div className="input-group">
                <label>Profile Photo (optional)</label>
                <input
                  name="profile_photo"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={prevStep}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}