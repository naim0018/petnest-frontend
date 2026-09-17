"use client";

import React from "react";
import FormExamples from "@/components/common/DynamicForm/FormExampleAndGuide/FormExamples";

export default function FormDemoPage() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm p-6 mx-auto">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
        Dynamic Form Demo
      </h2>
      <FormExamples />
    </div>
  );
}
