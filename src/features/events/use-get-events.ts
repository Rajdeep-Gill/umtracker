import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetEvents = () => {
  const query = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await client.api.events.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
  });

  return query;
};

export const useGetEventsByCourseCode = (courseCode: string) => {
  const query = useQuery({
    queryKey: ["events", courseCode],
    queryFn: async () => {
      console.log("courseCode", courseCode);
      const response = await client.api.events[":courseCode"].$get({
        param: { courseCode },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    },
  });

  return query;
};
