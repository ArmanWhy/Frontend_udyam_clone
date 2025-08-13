import { useLocation } from "react-router-dom";

export default function ProgressBar() {
  const location = useLocation();

  // Map routes to step IDs
  const routeToStep = {
    "/": "aadhaar",
    "/step2": "pan",
    "/success": "done"
  };

  const currentStepId = routeToStep[location.pathname] || "aadhaar";

  const steps = [
    { id: "aadhaar", label: "Step 1: Aadhaar Verification" },
    { id: "pan", label: "Step 2: PAN Entry" },
    { id: "done", label: "Complete" }
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStepId);

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((s, index) => {
        const isActive = index <= currentIndex;
        return (
          <div key={s.id} className="flex-1 flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-2 ${
                isActive ? "bg-green-500 border-green-500 text-white"
                         : "bg-gray-200 border-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm ${
                isActive ? "text-green-700 font-medium" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentIndex ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
