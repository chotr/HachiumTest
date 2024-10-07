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
import { useEffect, useState } from "react";
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

export default function TaskItem({ task, index, dateTask }: TaskProps) {
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
  const [tagsLits, setTagsLits] = useState<any[]>([]);

  const queryClient = useQueryClient();

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

    return filteredTasks;
  });

  // Mutation delete task
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
    };

    if (newTask.title !== "") {
      const response = await api.post("/tasks", _newTask);

      if (
        response.status.toString() === "201" ||
        response.status.toString() === "200"
      ) {
        setTask({
          title: "",
          content: "",
          completed: false,
          date: "",
          checkedTime: "",
          tag: [],
        });

        queryClient.invalidateQueries("tasks");
        // setSelectedTags([]);
        onCloseModal1();
      }
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    const task = tasksList.find((t: any) => t.id === id);

    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${id}`, updatedTask);
      //   setIsChecked(!isChecked);
      queryClient.invalidateQueries("tasks");
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
          {task.tag.map((itemTag: any) => {
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
        <DeleteIcon
          color={"gray"}
          cursor={"pointer"}
          onClick={() => handleDeleteTask()}
        />
        <EditIcon color={"blue"} cursor={"pointer"}  onClick={onOpenModal1}/>
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
              value={task.title}
              onChange={(e) => setTask({ ...newTask, title: e.target.value })}
            ></Input>
            <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Content
            </Text>

            <Textarea
              placeholder="Enter your task content"
              minHeight={"200px"}
              mb={"16px"}
              value={task.content}
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

            {/* <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Choose tag
            </Text> */}

            {/* <Flex flexWrap={"wrap"} gap={"8px"}>
                {tagsList?.map((tag: any, index: number) => (
                  <Checkbox
                    key={index}
                    backgroundColor={tag?.color}
                    height={"30px"}
                    padding={"0 10px"}
                    fontSize={"14px"}
                    borderRadius={"6px"}
                    style={{ display: "flex", alignItems: "center" }}
                    onChange={() => handleCheckboxChange(tag)}
                  >
                    {tag?.name}
                  </Checkbox>
                ))}
              </Flex> */}
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
}
