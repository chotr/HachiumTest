import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
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
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../mockApi";
import TaskItem from "../component/taskItem";
import { useQuery, useQueryClient } from "react-query";
import Calendar from "react-calendar";

interface Task {
  id: string;
  title: string;
  content: string;
  date: string;
  completed: boolean;
  checkedTime: "";
}

type ValuePiece = Date | string | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Tag {
  name: string;
  color: string;
}

export default function Today() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [value, onChange] = useState<Value>(
    new Date().toISOString().split("T")[0]
  );
  const [isOpenCal, setOpencal] = useState(false);
  const {
    isOpen: inpenModal1,
    onOpen: onOpenModal1,
    onClose: onCloseModal1,
  } = useDisclosure();
  const [newTask, setTask] = useState({
    title: "",
    content: "",
    completed: false,
    date: new Date().toISOString().split("T")[0],
    checkedTime: "",
    tag: [],
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

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
      select: (data) => data.filter((task: Task) => task.date === today),
    },
  );

  const { data: tagsList } = useQuery("tags", async () => {
    const response = await api.get("/tags");

    return response.data;
  });

  const handleCheckboxChange = useCallback((tag: any) => {
    setSelectedTags((prev: any) => {
      if (prev.includes(tag.id)) {
        return prev.filter((item: any) => item !== tag.id);
      } else {
        return [...prev, tag.id];
      }
    });
  }, [setSelectedTags]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (!tasksList) return [];
    return tasksList.filter((task: Task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    });
  }, [tasksList, filter]);

  const addTask = async () => {
    const _newTask = {
      ...newTask,
      tag: [...selectedTags],
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
          date: today,
          checkedTime: "",
          tag: [],
        });

        queryClient.invalidateQueries("tasks");
        setSelectedTags([]);
        onCloseModal1();
      }
    }
  };

  const handleChangeDate = (date: any) => {
    const formattedDate = date.toISOString().split("T")[0];

    onChange(formattedDate);
    setOpencal(false);
    setTask({
      ...newTask,
      date: formattedDate,
    });
  };

  if (isLoading) return <Text>Loading tasks...</Text>;
  if (error) return <Text>Error loading tasks</Text>;

  return (
    <Box>
      <Heading mb={10}>Today Tasks</Heading>

      <Box
        borderRadius={"10px"}
        border={"1px solid rgb(235, 235, 235)"}
        p={"10px 20px"}
        mb={"32px"}
        backgroundColor={"white"}
        cursor={"pointer"}
        onClick={onOpenModal1}
        _hover={{ backgroundColor: "rgb(235, 235, 235)" }}
        transition={"all 0.2s ease-in-out"}
      >
        + Add a new task
      </Box>

      <Flex gap={"12px"} mb={"32px"}>
        <Button
          w="full"
          onClick={() => setFilter("all")}
          backgroundColor={
            filter === "all" ? "rgb(235, 235, 235)" : "transparent"
          }
          border={"1px solid rgb(235, 235, 235)"}
          _hover={{ backgroundColor: "rgb(235, 235, 235)" }}
          fontSize={{ base: "16px", md: "18px" }}
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
              onChange={(e) => setTask({ ...newTask, title: e.target.value })}
            ></Input>
            <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
              Content
            </Text>

            <Textarea
              placeholder="Enter your task content"
              minHeight={"200px"}
              mb={"16px"}
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
                  onChange={() => handleCheckboxChange(tag)}
                >
                  {tag?.name}
                </Checkbox>
              ))}
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
              onClick={() => addTask()}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
