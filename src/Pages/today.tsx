import { Box, Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../mockApi";
import TaskItem from "../component/taskItem";
import { useQuery, useQueryClient } from "react-query";

interface Task {
  id: string;
  title: string;
  content: string;
  date: string;
  completed: boolean;
  checkedTime: "";
}

export default function Today() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const queryClient = useQueryClient();

  // Fetch danh sách tasks với query key 'tasks'
  const { data: tasksList, isLoading, error } = useQuery('tasks', async () => {
    const response = await api.get("/tasks");
    const today = new Date().toISOString().split("T")[0];
    const filteredTasksList = response.data.filter((task: Task) => task.date === today);

    setTasks(filteredTasksList);
    
    return response.data;
  });


  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    queryClient.invalidateQueries("tasks");
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <Box>
      <Heading mb={10}>Today Tasks</Heading>

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
      <VStack spacing={5}>
        {/* Task list */}
        {filteredTasks?.map((task: Task, index: number) => (
          <Box key={index} w="full">
            <TaskItem task={task} index={index} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
