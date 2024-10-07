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
import { useQuery } from "react-query";

interface Task {
  id: string;
  title: string;
  content: "string";
  date: string;
  completed: boolean;
  checkedTime: "";
  tag: [];
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
  const [isChecked, setIsChecked] = useState(task.completed);
  const [tagsLits, setTagsLits] = useState<any[]>([]);

  const { data: tasksList } = useQuery("tasks", async () => {
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

    return filteredTasks;
  });

  const { data: tagsList } = useQuery("tags", async () => {
    const response = await api.get("/tags");
    setTagsLits(response.data);

    return response.data;
  });

  const handleToggle = (index: number) => setShow(!show);

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    const task = tasksList.find((t: any) => t.id === id);

    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${id}`, updatedTask);
      setIsChecked(!isChecked);
    }
  };

  if (dateTask?.trim() === "prev") {
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
          border={"1px solid rgb(235, 235, 235)"}
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
          border="1px solid rgb(235, 235, 235)"
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

        <Flex w={"full"} flexWrap={"wrap"} gap={"8px"}>
          {task.tag.map((itemTag: any) => 
          {
            const infoTag = tagsList.find(
              (tagOther: any) => tagOther.id.trim() === itemTag
            );

            if (infoTag) {
              return (
                <Box
                  key={index}
                  backgroundColor={infoTag?.color}
                  height={"30px"}
                  padding={"0 10px"}
                  fontSize={"14px"}
                  borderRadius={"6px"}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {infoTag?.name}
                </Box>
              );
            }

            return null;
          }
          )}
        </Flex>
      </HStack>
    );
  }

  

  return (
    <HStack
      key={task.id}
      justify="space-between"
      flexDirection={"column"}
      gap={"8px"}
      w="100%"
    >
      <Flex
        alignItems={"center"}
        w={"full"}
        border={"1px solid rgb(235, 235, 235)"}
        borderRadius={"6px"}
        p={"8px"}
      >
        <Checkbox
          isChecked={isChecked}
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

      <Flex w={"full"} flexWrap={"wrap"} gap={"8px"}>
        {task.tag.map((itemTag: any, index: number) => {
          const infoTag = tagsList?.find(
            (tagOther: any) => tagOther.id.trim() === itemTag
          );

          if (infoTag) {
            return (
              <Box
                key={index}
                backgroundColor={infoTag?.color}
                height={"30px"}
                padding={"0 10px"}
                fontSize={"14px"}
                borderRadius={"6px"}
                style={{ display: "flex", alignItems: "center" }}
              >
                {infoTag?.name}
              </Box>
            );
          }

          return null;
        })}
      </Flex>
    </HStack>
  );
}
