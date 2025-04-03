"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox"; // ✅ Corrected import

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-orbitron",
});

export default function Home() {
  const router = useRouter();
  const [numQuestions, setNumQuestions] = useState(10);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://opentdb.com/api_category.php");
        setCategories(
          response.data.trivia_categories.map((cat: { id: number; name: string }) => ({
            value: cat.id.toString(),
            label: cat.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleStartTest = () => {
    router.push(
      `/test?numQuestions=${numQuestions}&category=${selectedCategory}&difficulty=${difficulty}`
    );
  };

  return (
    <div
      style={{
        background: "radial-gradient(circle at center, rgb(57 43 106) 0%, #100C24 100%)",
        backdropFilter: "blur(50px)",
      }}
      className={`h-screen bg-[#100C24] flex justify-center items-center px-4 ${orbitron.variable}`}
    >
      <main className="text-white w-full md:max-w-[70%] px-6">
        <div className="text-center flex flex-col gap-9">
          <h1 className="text-xl sm:text-5xl font-semibold text-white mb-5 font-orbitron">
            <span className="bg-gradient-to-r from-[#61daff] to-[#E100FF] text-transparent bg-clip-text">
              Customize Your Quiz Experience
            </span>
          </h1>
  
          <div className="flex gap-10 justify-center sm:justify-between font-Sora">
            {/* Number of Questions Input */}
            <div className="flex flex-col w-full sm:w-1/3 min-w-[100px]">
              <label  className="font-extralight ">Number of Questions:</label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="border border-gray-500  text-white p-2  w-full"
              />
            </div>
  
            {/* Category Selection */}
            <div className="flex flex-col w-full sm:w-1/3 min-w-[140px]">
              <label className="text-sm">Category:</label>
              <Combobox
                options={[{ value: "", label: "Any Category" }, ...categories]}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Select Category"
              />
            </div>
  
            {/* Difficulty Selection */}
            <div className="flex flex-col w-full sm:w-1/3 min-w-[120px]">
              <label className="text-sm">Difficulty:</label>
              <Combobox
                options={[
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ]}
                value={difficulty}
                onValueChange={setDifficulty}
                placeholder="Select Difficulty"
              />
            </div>
          </div> {/* ✅ Closing the div for inputs */}
  
          {/* ✅ Keeping Button inside flex column container */}
          <Button
            onClick={handleStartTest}
            className="bg-gradient-to-r from-[#61b5ff] to-[#E100FF] text-white font-orbitron font-semibold hover:scale-105 text-xl px-8 py-5 rounded-sm hover:bg-blue-600 transition mx-auto"
          >
            Start Test
          </Button>
        </div> {/* ✅ Closing text-center flex container */}
      </main> {/* ✅ Closing main properly */}
    </div>
  );
  
}
