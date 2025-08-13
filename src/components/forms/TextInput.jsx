export default function TextInput({ label, value, onChange, placeholder, error }) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border p-2 rounded w-full focus:outline-none focus:ring-2 ${
          error ? "border-red-500" : "border-gray-300 focus:ring-blue-400"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
