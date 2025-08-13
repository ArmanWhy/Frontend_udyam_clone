import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Button from "../components/forms/Button";

export default function Success() {
  const navigate = useNavigate();

  const handleRegisterAnother = () => {
    navigate("/"); // Or "/step1" if that's your route for Step 1
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto bg-white rounded shadow mt-8 p-6 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Registration Complete!
        </h1>
        <p className="mb-6 text-gray-700">
          Your details have been successfully saved.
        </p>
        <Button onClick={handleRegisterAnother}>
          Register Another
        </Button>
      </div>
    </div>
  );
}
