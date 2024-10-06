import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Input,
  VStack,
  HStack,
  Heading,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Collapse,
  Textarea,
} from "@chakra-ui/react";
import api from "./mockApi";
import { Search2Icon } from "@chakra-ui/icons";

interface Task {
  id: number;
  title: string;
  content: "string";
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

  const [show, setShow] = useState(Array(tasks.length).fill(false));

  const handleToggle = (index: number) => {
    setShow((prev) => {
      const newShow = [...prev];
      newShow[index] = !newShow[index];
      return newShow;
    });
  };

  // Fetch tasks from mock API
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await api.get("/tasks");
      setTasks(response.data);
      console.log(response.data);
    };
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      const response = await api.post("/tasks", {
        title: newTaskTitle,
        description: newTaskDescription, // Gửi mô tả task
        completed: false,
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setNewTaskDescription(""); // Reset mô tả
    }
  };

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
      <Box maxW="1920px" mx="auto" px={"15px"}>
        <Tabs variant="soft-rounded" colorScheme="green">
          <Flex gap={"24px"} minHeight={"100vh"} padding={"30px 0"}>
            <Box
              w="380px"
              backgroundColor={"rgb(244, 244, 244)"}
              borderRadius={"16px"}
              boxShadow={"rgba(0, 0, 0, 0.08) 0px 0px 0px"}
              padding={"30px 20px"}
            >
              <TabList>
                <Box w={"full"}>
                  {/* search */}
                  <Box position={"relative"} mb={"32px"}>
                    <Input placeholder="Search task" pl={"40px"} />
                    <Search2Icon
                      position={"absolute"}
                      left={"12px"}
                      top={"50%"}
                      transform={"translate(0, -50%)"}
                    />
                  </Box>

                  <Text fontSize="18px" fontWeight={"500"} mb={"24px"}>
                    Task
                  </Text>

                  <Tab w={"full"}>Today</Tab>
                  <Tab w={"full"}>Upcoming</Tab>

                  {/* Form input to add new task */}
                  {/* <HStack mb={"32px"}>
              <Input
                placeholder="New Task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Button colorScheme="teal" onClick={addTask}>
                Add Task
              </Button>
            </HStack> */}
                </Box>
              </TabList>
            </Box>
            <Box flex={1}>
              <TabPanels>
                <TabPanel padding={"0"}>
                  <Heading mb={4}>Today</Heading>
                  <Flex gap={"12px"} mb={"32px"}>
                    <Button
                      w="full"
                      onClick={() => setFilter("all")}
                      variant={filter === "all" ? "solid" : "outline"}
                    >
                      All
                    </Button>
                    <Button
                      w="full"
                      onClick={() => setFilter("completed")}
                      variant={filter === "completed" ? "solid" : "outline"}
                    >
                      Completed
                    </Button>
                    <Button
                      w="full"
                      onClick={() => setFilter("incomplete")}
                      variant={filter === "incomplete" ? "solid" : "outline"}
                    >
                      Incomplete
                    </Button>
                  </Flex>
                  <VStack spacing={4}>
                    {/* Task list */}
                    {filteredTasks.map((task, index) => (
                      <HStack
                        key={task.id}
                        justify="space-between"
                        flexDirection={"column"}
                        w="100%"
                      >
                        <Flex
                          alignItems={"center"}
                          w={"full"}
                          border={"1px solid rgb(244, 244, 244)"}
                          borderRadius={"6px"}
                          p={"8px"}
                        >
                          <Checkbox
                            isChecked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            w={"full"}
                          >
                            {task.title}
                          </Checkbox>
                          {task.content.trim() !== "" ? (
                            <Button
                              size="sm"
                              onClick={() => handleToggle(index)}
                            >
                              Show {show[index] ? "Less" : "More"}
                            </Button>
                          ) : null}
                        </Flex>
                        {task.content.trim() !== "" ? (
                          <Collapse
                            startingHeight={0}
                            in={show[index]}
                            style={{ width: "100%" }}
                          >
                            <Text
                              as="div"
                              whiteSpace="pre-wrap"
                              border={"1px solid rgb(244, 244, 244)"}
                              borderRadius={"6px"}
                              p={"24px"}
                            >
                              {task.content}
                            </Text>
                          </Collapse>
                        ) : null}
                      </HStack>
                    ))}
                  </VStack>
                </TabPanel>
                <TabPanel padding={"0"}>
                  <Heading mb={10}>Upcoming</Heading>
                  
                </TabPanel>
              </TabPanels>
            </Box>
          </Flex>
        </Tabs>
      </Box>
    </Box>
  );
};

export default App;
