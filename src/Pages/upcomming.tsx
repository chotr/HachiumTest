import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../mockApi";

interface Task {
  id: number;
  title: string;
  content: "string";
  date: string;
  completed: boolean;
}

export default function Upcomming() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [show, setShow] = useState(Array(tasks.length).fill(false));

  // Fetch tasks from mock API
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await api.get("/tasks");
      const today = new Date().toISOString().split("T")[0];

      const filteredTasks = response.data.filter(
        (task: Task) => new Date(task.date) > new Date(today)
      );

      setTasks(filteredTasks);
    };
    fetchTasks();
  }, []);

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
    return tasks.reduce((acc: any, task: any) => {
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
      <Heading mb={10}>Upcomming</Heading>

      <Flex gap={"12px"} mb={"32px"}>
        <Button
          w="full"
          onClick={() => setFilter("all")}
          //   variant={filter === "all" ? "solid" : "outline"}
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
          //   variant={filter === "completed" ? "solid" : "outline"}
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
          //   variant={filter === "incomplete" ? "solid" : "outline"}
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
        {Object.keys(groupedTasks).map((date) => (
          <Box key={date} w={"full"}>
            <Box fontWeight="bold" fontSize="18px" mb="8px">
              {date}
            </Box>

            {groupedTasks[date].map((task: Task, index: number) => (
              <HStack
                key={task.id}
                justify="space-between"
                flexDirection="column"
                w="100%"
                mb="16px"
              >
                <Flex
                  alignItems="center"
                  w="full"
                  border="1px solid rgb(244, 244, 244)"
                  borderRadius="6px"
                  p="8px"
                  justifyContent="space-between"
                  gap="10px"
                >
                  <Box>{task.title}</Box>
                  {task.content.trim() !== "" && (
                    <Button size="sm" onClick={() => handleToggle(index)}>
                      Show {show[index] ? "Less" : "More"}
                    </Button>
                  )}
                </Flex>

                {task.content.trim() !== "" && (
                  <Collapse
                    startingHeight={0}
                    in={show[index]}
                    style={{ width: "100%" }}
                  >
                    <Text
                      as="div"
                      whiteSpace="pre-wrap"
                      border="1px solid rgb(244, 244, 244)"
                      borderRadius="6px"
                      p="24px"
                    >
                      {task.content}
                    </Text>
                  </Collapse>
                )}
              </HStack>
            ))}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
