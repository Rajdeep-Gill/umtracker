import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useCheckSync = () => {
  const query = useQuery({
    queryKey: ["checkSync"],
    queryFn: async () => {
      // const response = await client.api.sync.$get();
      const response = await client.api.sync.$get();
      console.log(response);
      if (!response.ok) {
        console.error("Failed to fetch sync status", response);
        throw new Error("Failed to fetch sync status");
      }

      // const { sync } = await response.json();

      return await response.json();
    },
  });

  return query;
};
