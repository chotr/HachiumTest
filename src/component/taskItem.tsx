import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../mockApi";
import formatCustomDate from "../Utils/formatTime";

interface Task {
  id: number;
  title: string;
  content: "string";
  date: string;
  completed: boolean;
  checkedTime: "";
}

type DateTask = "prev" | "today" | "next";

interface TaskProps {
  task: any;
  index: number;
  dateTask?: DateTask;
}

export default function TaskItem({ task, index, dateTask }: TaskProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await api.get("/tasks");
      const today = new Date().toISOString().split("T")[0];

      const filteredTasks = response.data.filter((task: Task) => {
        if (dateTask?.trim() === "prev") {
          return new Date(task.date) < new Date(today);
        }
        if (dateTask?.trim() === "today") {
          return task.date === today;
        }
        if (dateTask?.trim() === "next") {
          return new Date(task.date) > new Date(today);
        }
        return task.date === today;
      });

      setTasks(filteredTasks);
    };
    fetchTasks();
  }, []);

  const handleToggle = (index: number) => setShow(!show);

  // Toggle task completion
  const toggleTaskCompletion = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    }
  };

  if (dateTask?.trim() === "prev") {
    console.log(tasks);

    return (
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
            pointerEvents={"none"}
            disabled
          >
            {task.title}
          </Checkbox>
          {task.content.trim() !== "" ? (
            <Button size="sm" onClick={() => handleToggle(index)}>
              Show {show ? "Less" : "More"}
            </Button>
          ) : null}
        </Flex>
        {task.content.trim() !== "" ? (
          <Collapse startingHeight={0} in={show} style={{ width: "100%" }}>
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

        {task.checkedTime.trim() !== "" && (
          <Text fontSize={"14px"} w="full" opacity={"0.5"}>
            Completed time: {formatCustomDate(task.checkedTime)}{" "}
          </Text>
        )}
      </HStack>
    );
  }

  if (dateTask?.trim() === "next") {
    return (
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
              Show {show ? "Less" : "More"}
            </Button>
          )}
        </Flex>

        {task.content.trim() !== "" && (
          <Collapse startingHeight={0} in={show} style={{ width: "100%" }}>
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
    );
  }

  return (
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
          <Button size="sm" onClick={() => handleToggle(index)}>
            Show {show ? "Less" : "More"}
          </Button>
        ) : null}
      </Flex>
      {task.content.trim() !== "" ? (
        <Collapse startingHeight={0} in={show} style={{ width: "100%" }}>
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
  );
}
