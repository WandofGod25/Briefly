'use client';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Layout Page</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">This is a test component</h2>
        <p className="text-gray-600 mb-4">
          If you can see this with proper styling, Tailwind CSS is working correctly.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">Box 1</div>
          <div className="bg-green-100 p-4 rounded-lg text-center">Box 2</div>
        </div>
        <button className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
} 