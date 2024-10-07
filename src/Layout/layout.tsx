import { Outlet } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Box, Input, Flex, Text, Divider } from "@chakra-ui/react";
import { BellIcon, DragHandleIcon, Search2Icon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import api from "../mockApi";

export default function Layout() {
  const refMain = useRef<HTMLDivElement>(null);

  const [tagsLits, setTagsLits] = useState<any[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/tags");
        console.log(response.data);
        setTagsLits(response.data); 
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchTags();

    console.log(tagsLits);
  }, []);

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
                    <DragHandleIcon /> Old Tasks
                  </NavLink>
                </Box>
              </Flex>

              <Divider mb={"20px"} />
              <Text fontSize="18px" fontWeight={"500"} mb={"24px"}>
                Tag
              </Text>

              <Flex>
                {tagsLits.map((tag: any, index) => (
                  <Box key={index} backgroundColor={tag?.color}>
                    {tag?.namee}
                  </Box>
                ))}
              </Flex>
            </Box>
            <Box flex={1}>
              <Outlet></Outlet>
            </Box>
          </Flex>
        </Box>
      </Box>
    </div>
  );
}
