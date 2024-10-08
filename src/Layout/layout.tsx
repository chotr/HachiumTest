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
  Checkbox,
} from "@chakra-ui/react";
import {
  BellIcon,
  CloseIcon,
  DragHandleIcon,
  HamburgerIcon,
  RepeatClockIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import api from "../mockApi";
import "react-calendar/dist/Calendar.css";
import { useMutation, useQuery, useQueryClient } from "react-query";

type ValuePiece = Date | string | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Tag {
  name: string;
  color: string;
}

export default function Layout() {
  const refMain = useRef<HTMLDivElement>(null);

  const {
    isOpen: inpenModal2,
    onOpen: onOpenModal2,
    onClose: onCloseModal2,
  } = useDisclosure();
  const [newTag, setNewTag] = useState({
    name: "",
    color: "wheat",
  });
  const queryClient = useQueryClient();
  const [navOpen, setNavOpen] = useState(true);

  const { data: tagsList } = useQuery("tags", async () => {
    const response = await api.get("/tags");

    return response.data;
  });

  const mutation = useMutation<Tag, Error, Tag>(
    async (newTag) => {
      return await api.post("/tags", newTag);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("tags");
        onCloseModal2();
      },
    }
  );

  const handleAddTag = () => {
    if (newTag.name.trim() !== "" && newTag.color.trim() !== "") {
      mutation.mutate(newTag);
    }
  };


  const toggleNav = () => setNavOpen(!navOpen);

  return (
    <div ref={refMain}>
      <Box>
        <Box maxW="1920px" mx="auto" px={"15px"}>
          <Box
            w={"fit-content"}
            ml={"auto"}
            mb={"-50px"}
            transform={"translate(0, 25px)"}
            style={{ alignItems: "center", gap: "10px" }}
            cursor={"pointer"}
            display={{ base: "flex", xl: "none" }}
            onClick={() => toggleNav()}
          >
            <Box
              w={"40px"}
              h={"40px"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              border={"1px solid rgb(235, 235, 235)"}
              borderRadius={"6px"}
            >
              <HamburgerIcon />
            </Box>{" "}
            Menu
          </Box>
          <Flex gap={"24px"} minHeight={"100vh"} padding={"30px 0"}>
            <Box
              w="100%"
              maxWidth={"380px"}
              backgroundColor={"rgb(244, 244, 244)"}
              borderRadius={"16px"}
              boxShadow={"rgba(0, 0, 0, 0.08) 0px 0px 0px"}
              padding={"30px 20px"}
              position={{ base: "absolute", xl: "relative" }}
              height={{ base: "calc(100vh - 30px)", xl: "auto" }}
              top={{ base: "15px", xl: "unset" }}
              zIndex={"999"}
              transition={"all 0.4s ease-in-out"}
              transform={{
                base: navOpen
                  ? "translate(calc(-100% - 15px), 0)"
                  : "translate(0, 0)",
                xl: "unset",
              }}
            >
              <Box
                w={"40px"}
                h={"40px"}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                display={{ base: "flex", xl: "none" }}
                border={"1px solid rgb(235, 235, 235)"}
                borderRadius={"6px"}
                marginBottom={"20px"}
                ml={"auto"}
                onClick={() => {
                  setNavOpen(true);
                }}
                cursor={"pointer"}
              >
                <CloseIcon />
              </Box>
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

              

              <Text fontSize="18px" fontWeight={"500"} mb={"24px"}>
                Task
              </Text>

              <Flex flexDirection={"column"} gap={"16px"} mb={"24px"}>
                <Box>
                  <NavLink
                    to={"/"}
                    className={'nav-link'}

                    style={({ isActive }) => ({
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: isActive
                        ? "rgb(235, 235, 235)"
                        : "transparent",
                      borderRadius: "8px",
                      transition: "all 0.2s ease-in-out"
                    })}

                  >
                    <BellIcon /> Today Tasks
                  </NavLink>
                </Box>

                <Box>
                  <NavLink
                    to={"/upcomming"}
                    className={'nav-link'}
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
                    className={'nav-link'}
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
                {tagsList?.map((tag: any, index: number) => (
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
                  onClick={onOpenModal2}
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
 

        <Modal isOpen={inpenModal2} onClose={onCloseModal2} size={"2xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add your tag</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
                Tag name
              </Text>

              <Input
                type="text"
                placeholder="Enter tag name"
                mb={"16px"}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              ></Input>

              <Text fontSize={"18px"} fontWeight={"500"} mb={"10px"}>
                Tag color
              </Text>

              <Input
                type="color"
                mb={"16px"}
                value={"#f5deb3"}
                p={"0"}
                onChange={(e) =>
                  setNewTag({ ...newTag, color: e.target.value })
                }
              ></Input>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onCloseModal2}>
                Close
              </Button>
              <Button
                backgroundColor={"#76a7d5"}
                color={"white"}
                _hover={{ backgroundColor: "#edab93" }}
                onClick={() => handleAddTag()}
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
