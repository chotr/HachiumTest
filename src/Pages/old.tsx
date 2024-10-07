import { Box, Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../mockApi";
import TaskItem from "../component/taskItem";

interface Task {
  id: number;
  title: string;
  content: string;
  date: string;
  completed: boolean;
  checkedTime:""
}

export default function Old() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks from mock API
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await api.get("/tasks");
      const today = new Date().toISOString().split("T")[0];

      const filteredTasks = response.data.filter(
        (task: Task) => new Date(task.date) < new Date(today)
      );

      setTasks(filteredTasks);
    };
    fetchTasks();
  }, []);

  // Toggle task completion
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

  return (
    <Box>
      <Heading mb={10}>Old Tasks</Heading>

      <Flex gap={"12px"} mb={"32px"}>
        <Button
          w="full"
          onClick={() => setFilter("all")}
          backgroundColor={
            filter === "all" ? "rgb(235, 235, 235)" : "transparent"
          }
          border={"1px solid rgb(235, 235, 235)"}
          _hover={{ backgroundColor: "rgb(235, 235, 235)" }}
        >
          All
        </Button>
        <Button
          w="full"
          onClick={() => setFilter("completed")}
          backgroundColor={
            filter === "completed" ? "rgb(235, 235, 235)" : "transparent"
          }
          border={"1px solid rgb(235, 235, 235)"}
          _hover={{ backgroundColor: "rgb(235, 235, 235)" }}
        >
          Completed
        </Button>
        <Button
          w="full"
          onClick={() => setFilter("incomplete")}
          backgroundColor={
            filter === "incomplete" ? "rgb(235, 235, 235)" : "transparent"
          }
          border={"1px solid rgb(235, 235, 235)"}
          _hover={{ backgroundColor: "rgb(235, 235, 235)" }}
        >
          Incomplete
        </Button>
      </Flex>
      <VStack spacing={4}>
        {/* Task list */}
        {filteredTasks.map((task: Task, index: number) => (
          <Box w={'full'} key={index}>
            <TaskItem task={task} index={index} dateTask="prev" />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
