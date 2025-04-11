import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SkillShare
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Learn and teach skills in a collaborative environment
        </p>
        <div className="space-x-4">
          <a
            href="/courses"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </a>
        </div>
      </div>
    </div>
  );
}
