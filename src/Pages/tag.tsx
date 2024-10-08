import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import api from "../mockApi";
import { Box, Heading, VStack } from "@chakra-ui/react";
import TaskItem from "../component/taskItem";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  content: "string";
  date: string;
  completed: boolean;
  checkedTime: "";
  tag: string[];
}

const TagContentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");

  const {
    data: tasksList,
    isLoading,
    error,
  } = useQuery(
    ["tasks", id],
    async () => {
      const response = await api.get("/tasks");

      return response.data;
    },
    {
      select: (data) => {
        if (id) {
          return data.filter((task: Task) => task.tag.includes(id));
        }
        return data;
      },
    }
  );

  const { data: tagsList } = useQuery("tags", async () => {
    const response = await api.get("/tags");

    return response.data;
  });

  useEffect(() => {
    const titlePage = tagsList?.find((tag: any) => tag.id === id) || "";
    setTitle(titlePage.name);
  }, [id]);

  if (!id) {
    return <p>Error: No tag ID provided.</p>;
  }
  return (
    <Box>
      <Heading mb={10}>
        {title}{" "}
        <Box
          as={"span"}
          ml={"10px"}
          display={"inline-flex"}
          fontSize={"20px"}
          fontWeight={"500"}
          border={"1px solid rgb(235, 235, 235)"}
          borderRadius={"8px"}
          p={"10px"}
          transform={"translate(0, -8px)"}
        >
          {" "}
          {tasksList?.length}{" "}
        </Box>
      </Heading>
      <VStack spacing={5}>
        {tasksList?.lenght !== 0 ? (
          tasksList?.map((task: Task, index: number) => (
            <Box key={task.id} w="full">
              <TaskItem task={task} index={index} />
            </Box>
          ))
        ) : (
          <Box>Emty</Box>
        )}
      </VStack>
    </Box>
  );
};

export default TagContentPage;
