import {
  Box,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../mockApi";
import TaskItem from "../component/taskItem";
import { useQuery } from "react-query";

interface Task {
  id: number;
  title: string;
  content: "string";
  date: string;
  completed: boolean;
  checkedTime:""
}

export default function Upcomming() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [show, setShow] = useState(Array(tasks.length).fill(false));

  const { data: tasksList, isLoading, error } = useQuery('tasks', async () => {
    const response = await api.get("/tasks");
    const today = new Date().toISOString().split("T")[0];
    const filteredTasks = response.data.filter(
      (task: Task) => new Date(task.date) > new Date(today)
    );

    setTasks(filteredTasks);
    
    return response.data;
  });

  const handleToggle = (index: number) => {
    setShow((prev) => {
      const newShow = [...prev];
      newShow[index] = !newShow[index];
      return newShow;
    });
  };

  //   // Toggle task completion
  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const groupTasksByDate = (tasks: any) => {
    return tasks.reduce((acc: any, task: Task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push(task);
      return acc;
    }, {});
  };

  const groupedTasks = groupTasksByDate(filteredTasks);

  return (
    <Box>
      <Heading mb={10}>Upcomming Tasks</Heading>

      <VStack spacing={5}>
        {/* Task list */}
        {Object.keys(groupedTasks).map((date) => (
          <Box key={date} w={"full"}>
            <Box fontWeight="bold" fontSize="18px" mb="8px">
              {date}
            </Box>

            {groupedTasks[date].map((task: Task, index: number) => (
              <Box mb="20px" key={index}>
                <TaskItem task={task} index={index} dateTask={"next"} />
              </Box>
            ))}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
