import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import TextInput from "../components/forms/TextInput";
import Button from "../components/forms/Button";
import ProgressBar from "../components/forms/ProgressBar";
import axios from "axios";

export default function Step2() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from Step1
  const { aadhaarNumber, nameOfEntrepreneur } = location.state || {};

  const [schema, setSchema] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Redirect if Step1 data missing
  useEffect(() => {
    if (!aadhaarNumber || !nameOfEntrepreneur) {
      navigate("/");
    }
  }, [aadhaarNumber, nameOfEntrepreneur, navigate]);

  // Fetch step 2 schema on mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/formSchema`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.schema)) {
          const step2 = res.data.schema.find((s) => s.step === 2);
          setSchema(step2);

          // Initialize form state keys dynamically
          const initForm = {};
          step2.fields.forEach((f) => {
            initForm[f.name] = "";
          });
          setForm(initForm);
        } else {
          setMessage("Failed to load form schema");
        }
      })
      .catch(() => setMessage("Failed to load form schema"));
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async () => {
    const errs = validateFields(schema.fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setMessage("Submitting registration...");

    try {
      // Usually there's only one field in Step2: PAN
      const panField = schema.fields.find((f) => f.name.toLowerCase().includes("pan"));

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/registration`, {
        aadhaarNumber,
        nameOfEntrepreneur,
        panNumber: form[panField?.name],
      });

      if (res.data.success) {
        setMessage("✅ Registration successful!");
        navigate("/success");
      } else {
        setMessage(res.data.message || "❌ Registration failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto bg-white rounded shadow mt-8 p-6">
        <ProgressBar />
        {message && <p className="text-blue-700 mb-4">{message}</p>}

        {/* Render Step 2 fields */}
        {schema.fields.map((field) => (
          <TextInput
            key={field.name}
            label={field.label}
            value={form[field.name] || ""}
            onChange={(v) => handleChange(field.name, v)}
            placeholder={field.placeholder}
            error={errors[field.name]}
          />
        ))}

        <Button className="mt-4" onClick={handleSubmit}>
          Submit Registration
        </Button>
      </div>
    </div>
  );
}
