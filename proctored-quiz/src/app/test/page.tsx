
import { Suspense } from "react";
import TestPage from "@/components/TestPage";

export default function TestWrapper() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading test...</div>}>
      <TestPage />
    </Suspense>
  );
}
