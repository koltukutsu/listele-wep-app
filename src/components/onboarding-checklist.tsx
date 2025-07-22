"use client"

import { useState, useEffect } from "react";
import { Check, Circle } from "lucide-react";

const tasks = [
  { id: 1, text: "Customize your project's title", configKey: "title" },
  { id: 2, text: "Explain the value you provide", configKey: "benefits" },
  { id: 3, text: "Share your page with the world", configKey: "publish" },
];

interface OnboardingChecklistProps {
    config: any;
    setConfig: (config: any) => void;
}

export function OnboardingChecklist({ config, setConfig }: OnboardingChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    if (config.title !== "Geleceği İnşa Etmeye Hazır mısın?") {
        if (!completedTasks.includes(1)) {
            setCompletedTasks(prev => [...prev, 1]);
        }
    }
  }, [config.title, completedTasks]);

  const toggleTask = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border">
      <h3 className="font-bold text-lg mb-2">Your Launch Checklist</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="flex items-center mb-2 cursor-pointer" onClick={() => toggleTask(task.id)}>
            {completedTasks.includes(task.id) ? (
              <Check className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 mr-2" />
            )}
            <span className={completedTasks.includes(task.id) ? "line-through text-gray-500" : ""}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
} 