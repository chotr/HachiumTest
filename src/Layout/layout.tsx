import { Outlet } from "react-router";
import { useRef } from "react";
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
import { BellIcon, DragHandleIcon, Search2Icon } from "@chakra-ui/icons";
import { Link, NavLink } from "react-router-dom";

export default function Layout() {
  const refMain = useRef<HTMLDivElement>(null);

  return (
    <div ref={refMain} className="">
      {/* <div
        ref={refCursor}
        className='h-2 w-2 rounded-full bg-dark-primary absolute  select-none z-10 top-0 left-0'
      >
      </div>
      <div
        ref={refFollowCursor}
        className='h-10 w-10 rounded-full border border-dark-primary absolute z-10 select-none top-0 left-0'
      >
      </div> */}
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

              <Box mb={"12px"}>
                <NavLink
                  to={"/"}
                  style={({ isActive }) => ({
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: isActive ? "rgb(235, 235, 235)" : "transparent",
                    borderRadius:"8px",
                    transition: 'all 0.2s ease-in-out',
                  })}
                >
                  <BellIcon /> Today
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
                    backgroundColor: isActive ? "rgb(235, 235, 235)" : "transparent",
                    borderRadius:"8px",
                    transition: 'all 0.2s ease-in-out',
                  })}
                >
                  <DragHandleIcon /> Upcoming
                </NavLink>
              </Box>
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
