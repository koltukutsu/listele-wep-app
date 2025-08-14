"use client";

import { useState, useEffect } from "react";
import { Progress } from "~/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface LaunchChecklistProps {
  config: any; // The project config object
}

const CHECKLIST_ITEMS = [
  {
    key: "name_and_title",
    text: "Edit project name and title",
    isCompleted: (config: any) => 
      config.name && config.name !== "My New Project" && 
      config.title && config.title !== "Ready to Build the Future?",
  },
  {
    key: "value_prop_and_desc",
    text: "Edit value proposition and description",
    isCompleted: (config: any) =>
      (config.benefits && config.benefits.some((b: any) => b.title !== "New Value Proposition" && b.description !== "Description")) ||
      (config.description && config.description !== "Leave your email to be among the first to join you on this journey."),
  },
  {
    key: "share",
    text: "Share your page with the world!",
    isCompleted: (config: any) => false, // This will be manually triggered or based on a share event in the future
  },
];

export function LaunchChecklist({ config }: LaunchChecklistProps) {
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  useEffect(() => {
    const newCompleted = CHECKLIST_ITEMS
      .filter(item => item.isCompleted(config))
      .map(item => item.key);
    setCompletedItems(newCompleted);
  }, [config]);

  const completionPercentage = (completedItems.length / CHECKLIST_ITEMS.length) * 100;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-lime-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Launch Checklist</h3>
      <Progress value={completionPercentage} className="mb-6 h-2 [&>*]:bg-lime-500" />
      <ul className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = completedItems.includes(item.key);
          return (
            <li key={item.key} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 className="h-6 w-6 text-lime-500" />
              ) : (
                <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
              )}
              <span className={`text-base ${isDone ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-800 dark:text-gray-200"}`}>
                {item.text}
              </span>
            </li>
          );
        })}
      </ul>
      {completionPercentage === 100 && (
         <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-semibold">Great job! Your project is ready for launch! 🚀</p>
      )}
    </div>
  );
} 