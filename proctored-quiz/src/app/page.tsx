"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

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

  const [categoryError, setCategoryError] = useState("");

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
    let valid = true;


    if (!selectedCategory) {
      setCategoryError("Please select a category.");
      valid = false;
    } else {
      setCategoryError("");
    }

    if (!valid) return;

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
          <h1 className="text-3xl sm:text-5xl font-semibold text-white mb-3 font-orbitron">
            <span className="bg-gradient-to-r from-[#61daff] to-[#E100FF] text-transparent bg-clip-text">
              Customize Your Quiz Experience
            </span>
          </h1>

          <div className="flex flex-col gap-8 justify-center items-center">
            {/* Number of Questions Input */}
            <div className="flex flex-col gap-1 w-full sm:w-1/3 min-w-[300px]">
              <label
                style={{ fontWeight: 100 }}
                className="font-extralight font-orbitron text-md"
              >
                Number of Questions:
              </label>

              <input
                type="number"
                min="1"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="border border-gray-500 text-white p-2 w-full bg-transparent"
              />
            </div>

            {/* Category Selection */}
            <div className="flex flex-col gap-1 w-full sm:w-1/3 min-w-[140px]">
              <label className="text-md font-extralight font-orbitron">Category:</label>
              <Combobox
                options={[{ value: "", label: "Any Category" }, ...categories]}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                placeholder="Select Category"
              />
              {categoryError && <p className="text-red-400 text-sm mt-1">{categoryError}</p>}
            </div>

            {/* Difficulty Selection */}
            <div className="flex flex-col gap-1 w-full sm:w-1/3 min-w-[120px]">
              <label className="text-md font-extralight font-orbitron">Difficulty:</label>
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
          </div>

          <Button
            onClick={handleStartTest}
            className="bg-gradient-to-r from-[#61b5ff] to-[#E100FF] text-white font-orbitron font-semibold hover:scale-105 text-xl px-8 py-5 rounded-sm hover:bg-blue-600 transition mx-auto"
          >
            Start Test
          </Button>
        </div>
      </main>
    </div>
  );
}
