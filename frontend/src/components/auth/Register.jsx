import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Webcam from "react-webcam";


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
    available_time: ""
  });

  const [files, setFiles] = useState({
    license_file: null,
    profile_photo: null
  });

  const [faceVerification, setFaceVerification] = useState({
    isCapturing: false,
    capturedImage: null,
    isVerified: false
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const specializations = [
    "General Practice", "Surgery", "Internal Medicine", "Cardiology",
    "Dermatology", "Orthopedics", "Oncology", "Emergency Medicine", "Exotic Animals", "Other"
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "available_days") {
      setFormData(prev => ({
        ...prev,
        available_days: checked
          ? [...prev.available_days, value]
          : prev.available_days.filter(day => day !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const startFaceCapture = () => {
    setFaceVerification({ ...faceVerification, isCapturing: true });
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFaceVerification({
      ...faceVerification,
      capturedImage: imageSrc,
      isCapturing: false,
      isVerified: true
    });
  };

  const retakePhoto = () => {
    setFaceVerification({
      isCapturing: true,
      capturedImage: null,
      isVerified: false
    });
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      setErr("Please fill in all required fields");
      return;
    }
    if (step === 2 && (!formData.license_number || !formData.specialization || !files.license_file)) {
      setErr("Please complete all professional verification fields");
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

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'available_days') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (files.license_file) {
        submitData.append('license_file', files.license_file);
      }

      if (files.profile_photo) {
        submitData.append('profile_photo', files.profile_photo);
      }

      if (faceVerification.capturedImage) {
        const response = await fetch(faceVerification.capturedImage);
        const blob = await response.blob();
        submitData.append('face_image', blob, 'face_image.jpg');
      }

      const res = await axios.post("http://localhost:5000/api/auth/vet-register", submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
        </div>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <h3>Basic Information</h3>

              <div className="input-group">
                <label>Full Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Password *</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength="8" />
              </div>

              <div className="input-group">
                <label>Phone *</label>
                <input name="phone" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Clinic Location *</label>
                <input name="location" value={formData.location} onChange={handleChange} required />
              </div>

              <button type="button" onClick={nextStep}>Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Professional Verification</h3>

              <div className="input-group">
                <label>License Number *</label>
                <input name="license_number" value={formData.license_number} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label>Specialization *</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} required>
                  <option value="">Select...</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>License Document *</label>
                <input name="license_file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
              </div>

              <div className="input-group">
                <label>Available Days</label>
                <div className="checkbox-group">
                  {daysOfWeek.map(day => (
                    <label key={day}>
                      <input
                        type="checkbox"
                        name="available_days"
                        value={day}
                        checked={formData.available_days.includes(day)}
                        onChange={handleChange}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Available Hours</label>
                <input name="available_time" value={formData.available_time} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label>Profile Photo (optional)</label>
                <input name="profile_photo" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
              </div>

              <div className="button-group">
                <button type="button" onClick={prevStep}>← Back</button>
                <button type="button" onClick={nextStep}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Face Verification</h3>
              <p>Please take a photo to verify your identity</p>

              {!faceVerification.capturedImage && !faceVerification.isCapturing && (
                <button type="button" onClick={startFaceCapture}>Start Camera</button>
              )}

              {faceVerification.isCapturing && (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                  />
                  <button type="button" onClick={capturePhoto}>Capture</button>
                  <button type="button" onClick={() => setFaceVerification({ ...faceVerification, isCapturing: false })}>Cancel</button>
                </div>
              )}

              {faceVerification.capturedImage && (
                <div>
                  <img src={faceVerification.capturedImage} alt="Face Captured" />
                  <button type="button" onClick={retakePhoto}>Retake</button>
                </div>
              )}

              <div className="button-group">
                <button type="button" onClick={prevStep}>← Back</button>
                <button type="submit" disabled={!faceVerification.isVerified || loading}>
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
