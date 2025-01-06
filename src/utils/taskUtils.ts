import { Child } from '../types/types';

export const getAllUniqueTasks = (children: Child[]) => {
  const taskMap = new Map<
    string,
    {
      category: string;
      subject: string;
      title: string;
    }
  >();
  children.forEach((child) => {
    child.tasks.forEach((task) => {
      const key = `${task.subject}-${task.title}`;
      if (!taskMap.has(key)) {
        taskMap.set(key, {
          category: task.category,
          subject: task.subject,
          title: task.title,
        });
      }
    });
  });
  return Array.from(taskMap.entries()).map(([key, value]) => ({
    key,
    ...value,
  }));
};

export const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      button: "bg-blue-100 text-blue-500 hover:bg-blue-200",
      completed: "bg-blue-400",
      border: "border-blue-100 hover:border-blue-200",
      tab: "bg-blue-100 text-blue-700",
      activeTab: "bg-blue-200 text-blue-800",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      button: "bg-green-100 text-green-500 hover:bg-green-200",
      completed: "bg-green-400",
      border: "border-green-100 hover:border-green-200",
      tab: "bg-green-100 text-green-700",
      activeTab: "bg-green-200 text-green-800",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      button: "bg-red-100 text-red-500 hover:bg-red-200",
      completed: "bg-red-400",
      border: "border-red-100 hover:border-red-200",
      tab: "bg-red-100 text-red-700",
      activeTab: "bg-red-200 text-red-800",
    },
  };
  return colorMap[color as keyof typeof colorMap];
}; 