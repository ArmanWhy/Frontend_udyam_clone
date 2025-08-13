export default function Header() {
  return (
    <header className="bg-purple-800 text-white py-3 px-4 flex items-center">
      <img src="/logo.png" alt="MSME Logo" className="h-10 mr-4" />
      <div>
        <h1 className="text-lg font-bold">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</h1>
        <h2 className="text-sm">Ministry of Micro, Small & Medium Enterprises</h2>
      </div>
    </header>
  );
}
