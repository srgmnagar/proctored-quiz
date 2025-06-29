
import { Suspense } from "react";
import TestPage from "@/components/TestPage";

export default function TestWrapper() {
  return (
    <Suspense fallback={<div className=""></div>}>
      <TestPage />
    </Suspense>
  );
}
