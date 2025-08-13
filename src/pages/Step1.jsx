import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import TextInput from "../components/forms/TextInput";
import Button from "../components/forms/Button";
import ProgressBar from "../components/forms/ProgressBar";
import axios from "axios";

export default function Step1() {
  const [schema, setSchema] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch hardcoded form schema from backend once on mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/formSchema`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.schema)) {
          const step1 = res.data.schema.find((s) => s.step === 1);
          setSchema(step1);

          // Initialize form state keys dynamically with empty strings
          const initForm = {};
          step1.fields.forEach((f) => {
            initForm[f.name] = "";
          });
          setForm(initForm);
        } else {
          setMessage("Failed to load form schema");
        }
      })
      .catch(() => setMessage("Failed to load form schema"));
  }, []);

  // Helper to handle input changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validator based on regex from schema for given fields
  const validateFields = (fields) => {
    const errs = {};
    fields.forEach((f) => {
      const val = form[f.name]?.trim() || "";
      if (!val) {
        errs[f.name] = `${f.label} is required`;
      } else if (f.validation) {
        const re = new RegExp(f.validation);
        if (!re.test(val)) {
          errs[f.name] = `${f.label} format invalid`;
        }
      }
    });
    return errs;
  };

  if (!schema) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-center text-gray-600 text-lg">Loading form...</p>
      </div>
    );
  }

  // Fields excluding OTP - show initially
  const initialFields = schema.fields.filter(
    (f) => f.name.toLowerCase() !== "otp"
  );
  // OTP field - show after Send OTP
  const otpField = schema.fields.find((f) => f.name.toLowerCase() === "otp");

  // Send OTP handler
  const handleSendOtp = async () => {
    const errs = validateFields(initialFields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    try {
      const aadhaarField = initialFields.find((f) =>
        f.name.toLowerCase().includes("aadhaarnumber")
      );
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send`, {
        aadhaarNumber: form[aadhaarField.name],
      });
      setOtpSent(true);
      setMessage(`OTP sent (simulation): ${res.data.otp}`);
    } catch {
      setMessage("Failed to send OTP");
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    if (!otpField) {
      setMessage("OTP field missing in schema");
      return;
    }
    const errs = validateFields([otpField]);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const aadhaarField = initialFields.find((f) =>
      f.name.toLowerCase().includes("aadhaarnumber")
    );
    const nameField = initialFields.find((f) =>
      f.name.toLowerCase().includes("nameofentrepreneur")
    );

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify`, {
        aadhaarNumber: form[aadhaarField.name],
        otp: form[otpField.name],
      });
      if (res.data.success) {
        setMessage("OTP Verified!");
        navigate("/step2", {
          state: {
            aadhaarNumber: form[aadhaarField.name],
            nameOfEntrepreneur: form[nameField?.name] || "",
          },
        });
      } else {
        setMessage("Invalid OTP");
      }
    } catch {
      setMessage("OTP verification failed");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto bg-white rounded shadow mt-8 p-6">
        <ProgressBar />
        {message && <p className="text-blue-700 mb-4">{message}</p>}

        {/* Render initial fields (Aadhaar, Name) */}
        {initialFields.map((field) => (
          <TextInput
            key={field.name}
            label={field.label}
            value={form[field.name] || ""}
            onChange={(v) => handleChange(field.name, v)}
            placeholder={field.placeholder}
            error={errors[field.name]}
          />
        ))}

        {!otpSent && (
          <Button className="mt-4" onClick={handleSendOtp}>
            Send OTP
          </Button>
        )}

        {otpSent && otpField && (
          <>
            <TextInput
              label={otpField.label}
              value={form[otpField.name] || ""}
              onChange={(v) => handleChange(otpField.name, v)}
              placeholder={otpField.placeholder}
              error={errors[otpField.name]}
            />
            <Button className="mt-4" onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
