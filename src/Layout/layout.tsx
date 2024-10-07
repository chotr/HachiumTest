import { Outlet } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Input,
  Flex,
  Text,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  styled,
  Checkbox,
} from "@chakra-ui/react";
import {
  BellIcon,
  DragHandleIcon,
  RepeatClockIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import api from "../mockApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery, useQueryClient } from "react-query";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Layout() {
  const [tagsLits, setTagsLits] = useState<any[]>([]);
  const refMain = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, onChange] = useState<Value>(new Date());
  const [isOpenCal, setOpencal] = useState(false);
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

  const { data: tagsList } = useQuery("tags", async () => {
    const response = await api.get("/tags");
    setTagsLits(response.data);
    return response.data;
  });

  const handleCheckboxChange = (tag: object) => {
    setSelectedTags((prev: any) => {
      if (prev.includes(tag)) {
        return prev.filter((item: any) => item !== tag);
      } else {
        return [...prev, tag];
      }
    });

    setTask({...newTask, tag: selectedTags})
  };

  // Add new task
  const addTask = async () => {
    if (newTask.title !== "") {
      const response = await api.post("/tasks", newTask);

      if (response.status.toString() === "201") {
        setTask({
          title: "",
          content: "",
          completed: false,
          date: "",
          checkedTime: "",
          tag: [],
        });

        queryClient.invalidateQueries("tasks");

        onClose();
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

  return (
    <div ref={refMain}>
      <Box>
        <Box maxW="1920px" mx="auto" px={"15px"}>
          <Flex gap={"24px"} minHeight={"100vh"} padding={"30px 0"}>
            <Box
              w="380px"
              backgroundColor={"rgb(244, 244, 244)"}
              borderRadius={"16px"}
              boxShadow={"rgba(0, 0, 0, 0.08) 0px 0px 0px"}
              padding={"30px 20px"}
            >
              {/* search */}
              <Box position={"relative"} mb={"16px"}>
                <Input
                  placeholder="Search task"
                  pl={"40px"}
                  borderRadius={"10px"}
                />
                <Search2Icon
                  position={"absolute"}
                  left={"12px"}
                  top={"50%"}
                  transform={"translate(0, -50%)"}
                />
              </Box>

              <Box
                borderRadius={"10px"}
                border={"1px solid rgb(235, 235, 235)"}
                p={"10px 20px"}
                mb={"32px"}
                backgroundColor={"#fffbfb"}
                cursor={"pointer"}
                onClick={onOpen}
              >
                + Add a new task
              </Box>

              <Text fontSize="18px" fontWeight={"500"} mb={"24px"}>
                Task
              </Text>

              <Flex flexDirection={"column"} gap={"16px"} mb={"24px"}>
                <Box>
                  <NavLink
                    to={"/"}
                    style={({ isActive }) => ({
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: isActive
                        ? "rgb(235, 235, 235)"
                        : "transparent",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out",
                    })}
                  >
                    <BellIcon /> Today Tasks
                  </NavLink>
                </Box>

                <Box>
                  <NavLink
                    to={"/upcomming"}
                    style={({ isActive }) => ({
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: isActive
                        ? "rgb(235, 235, 235)"
                        : "transparent",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out",
                    })}
                  >
                    <DragHandleIcon /> Upcoming Taks
                  </NavLink>
                </Box>

                <Box>
                  <NavLink
                    to={"/old"}
                    style={({ isActive }) => ({
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: isActive
                        ? "rgb(235, 235, 235)"
                        : "transparent",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out",
                    })}
                  >
                    <RepeatClockIcon /> Old Tasks
                  </NavLink>
                </Box>
              </Flex>

              <Divider mb={"20px"} />
              <Text fontSize="18px" fontWeight={"500"} mb={"24px"}>
                Tag
              </Text>

              <Flex flexWrap={"wrap"} gap={"8px"}>
                {tagsLits.map((tag: any, index) => (
                  <Box
                    key={index}
                    backgroundColor={tag?.color}
                    height={"30px"}
                    padding={"0 10px"}
                    fontSize={"14px"}
                    borderRadius={"6px"}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {tag?.name}
                  </Box>
                ))}
                <Box
                  backgroundColor={"rgb(235, 235, 235)"}
                  height={"30px"}
                  padding={"0 10px"}
                  fontSize={"14px"}
                  borderRadius={"6px"}
                  style={{ display: "flex", alignItems: "center" }}
                  cursor={"pointer"}
                >
                  + Add tag
                </Box>
              </Flex>
            </Box>
            <Box flex={1}>
              <Outlet></Outlet>
            </Box>
          </Flex>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size={"5xl"}>
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
                Content{" "}
                <Box as={"span"} color={"red"}>
                  *
                </Box>
              </Text>

              <Textarea
                placeholder="Enter your task content"
                minHeight={"200px"}
                mb={"16px"}
                onChange={(e) =>
                  setTask({ ...newTask, content: e.target.value })
                }
              ></Textarea>

              <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
                Date{" "}
                <Box as={"span"} color={"red"}>
                  *
                </Box>
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
                {tagsLits.map((tag: any, index) => (
                  <Checkbox
                    key={index}
                    backgroundColor={tag?.color}
                    height={"30px"}
                    padding={"0 10px"}
                    fontSize={"14px"}
                    borderRadius={"6px"}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {tag?.name}
                  </Checkbox>
                ))}
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
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
    </div>
  );
}
