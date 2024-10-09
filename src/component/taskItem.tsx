import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import api from "../mockApi";
import formatCustomDate from "../Utils/formatTime";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Calendar from "react-calendar";

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

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const TaskItem = React.memo(({ task, index, dateTask }: TaskProps) => {
  const [show, setShow] = useState(false);
  const {
    isOpen: inpenModal1,
    onOpen: onOpenModal1,
    onClose: onCloseModal1,
  } = useDisclosure();
  const [value, onChange] = useState<Value>(task.date);
  const [isOpenCal, setOpencal] = useState(false);
  const [newTask, setTask] = useState({
    title: task.title,
    content: task.content,
    completed: task.completed,
    date: task.date,
    checkedTime: task.checkedTime,
    tag: task.tag,
  });
  const [tagsLits, setTagsLits] = useState<any[]>(task.tag);
  const today = new Date().toISOString().split("T")[0];
  const queryClient = useQueryClient();

  const {
    data: tasksList,
    isLoading,
    error,
  } = useQuery(
    "tasks",
    async () => {
      const response = await api.get("/tasks");

      return response.data;
    },
    {
      select: (data) =>
        data.filter((task: Task) => {
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
        }),
    }
  );

  const deleteTaskMutation = useMutation(
    async (taskId) => {
      await api.delete(`/tasks/${taskId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
      onError: (error) => {
        console.error("Error deleting task:", error);
      },
    }
  );

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id);
  };

  const { data: tagsList } = useQuery("tags", async () => {
    const response = await api.get("/tags");
    setTagsLits(response.data);

    return response.data;
  });

  const handleToggle = (index: number) => setShow(!show);

  const handleChangeDate = (date: any) => {
    const formattedDate = date.toISOString().split("T")[0];

    onChange(formattedDate);
    setOpencal(false);
    setTask({
      ...newTask,
      date: formattedDate,
    });
  };

  const editTask = async () => {
    const _newTask = {
      ...newTask,
      tag: [...tagsLits],
    };

    if (newTask.title !== "") {
      const response = await api.put(`/tasks/${task.id}`, _newTask);

      if (
        response.status.toString() === "201" ||
        response.status.toString() === "200"
      ) {
        queryClient.invalidateQueries("tasks");
        onCloseModal1();
      }
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasksList.find((t: any) => t.id === id);

    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${id}`, updatedTask);
      //   setIsChecked(!isChecked);
      queryClient.invalidateQueries("tasks");
    }
  };

  const handleCheckboxChange = (tag: any) => {
    setTagsLits((prev: any) => {
      if (prev.includes(tag.id)) {
        return prev.filter((item: any) => item !== tag.id);
      } else {
        return [...prev, tag.id];
      }
    });
  };

  if (isLoading) return <Text>Loading tasks...</Text>;
  if (error) return <Text>Error loading tasks</Text>;

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
        gap={"15px"}
      >
        {dateTask?.trim() === "prev" && (
          <Checkbox
            isChecked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
            w={"full"}
            pointerEvents={"none"}
            disabled
          >
            {task.title}
          </Checkbox>
        )}

        {/* box today */}
        {dateTask?.trim() === "today" ||
          (!dateTask && (
            <Checkbox
              isChecked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              w={"full"}
              wordBreak={"break-word"}
            >
              <Box as={"span"} fontSize={{ base: "14px", md: "16px" }}>
                {task.title}
              </Box>
            </Checkbox>
          ))}

        {/* box feature */}
        {dateTask?.trim() === "next" && (
          <Box mr={"auto"} fontSize={{ base: "14px", md: "16px" }}>
            {task.title}
          </Box>
        )}

        {task.content.trim() !== "" ? (
          <Button
            flexShrink={"0"}
            size="sm"
            fontSize={{ base: "12px", md: "14px" }}
            onClick={() => handleToggle(index)}
          >
            Show {show ? "Less" : "More"}
          </Button>
        ) : null}

        {dateTask?.trim() !== "prev" && (
          <>
            <DeleteIcon
              color={"gray"}
              cursor={"pointer"}
              onClick={() => handleDeleteTask()}
            />
            <EditIcon
              color={"blue"}
              cursor={"pointer"}
              onClick={onOpenModal1}
            />
          </>
        )}
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
                filter={dateTask?.trim() === "prev" ? "grayscale(0.3)": ""}
              >
                {infoTag?.name}
              </Box>
            );
          }

          return null;
        })}
      </Flex>

      <Modal isOpen={inpenModal1} onClose={onCloseModal1} size={"5xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add your task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Title{" "}
              <Box as={"span"} color={"red"}>
                *
              </Box>
            </Text>

            <Input
              type="text"
              placeholder="Enter your task title"
              mb={"16px"}
              value={newTask.title}
              onChange={(e) => setTask({ ...newTask, title: e.target.value })}
            ></Input>
            <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Content
            </Text>

            <Textarea
              placeholder="Enter your task content"
              minHeight={"200px"}
              mb={"16px"}
              value={newTask.content}
              onChange={(e) => setTask({ ...newTask, content: e.target.value })}
            ></Textarea>

            <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Date
            </Text>
            <Box position={"relative"} mb={"16px"}>
              <Input
                type="text"
                placeholder="Enter date"
                value={value?.toLocaleString()}
                mb={"16px"}
                onClick={() => {
                  setOpencal(!isOpenCal);
                }}
                readOnly
                cursor={"pointer"}
                userSelect={"none"}
              />
              {isOpenCal && (
                <Box position={"absolute"} bottom={"100%"}>
                  <Calendar onChange={handleChangeDate} value={value} />
                </Box>
              )}
            </Box>

            <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Choose tag
            </Text>

            <Flex flexWrap={"wrap"} gap={"8px"}>
              {tagsList?.map((tag: any, index: number) => (
                <Checkbox
                  key={index}
                  backgroundColor={tag?.color}
                  height={"30px"}
                  padding={"0 10px"}
                  fontSize={"14px"}
                  borderRadius={"6px"}
                  style={{ display: "flex", alignItems: "center" }}
                  isChecked={tagsLits.includes(tag.id)}
                  onChange={() => handleCheckboxChange(tag)}
                >
                  {tag?.name}
                </Checkbox>
              ))}

              {/* {task?.tag?.map((tag: string) => {
                const infoTag = tagsList?.find(
                  (tagOther: any) => tagOther.id.trim() === tag
                );

                {
                  infoTag && (
                    <Checkbox
                      key={index}
                      backgroundColor={infoTag?.color}
                      height={"30px"}
                      padding={"0 10px"}
                      fontSize={"14px"}
                      borderRadius={"6px"}
                      style={{ display: "flex", alignItems: "center" }}
                      // onChange={() => handleCheckboxChange(tag)}
                    >
                      {infoTag?.name}
                    </Checkbox>
                  );
                }

                return null;
              })} */}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onCloseModal1}>
              Close
            </Button>
            <Button
              backgroundColor={"#76a7d5"}
              color={"white"}
              _hover={{ backgroundColor: "#edab93" }}
              onClick={() => editTask()}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
});

export default TaskItem;
