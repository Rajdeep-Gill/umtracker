"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function Sandbox() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["helloworld"],
    queryFn: async () => {
      const response = await client.api.helloworld.$get();

      if (!response.ok) {
        console.error("Failed to fetch sync status", response);
        throw new Error("Failed to fetch sync status");
      }

      const { hello } = await response.json();
      return hello;
    },
  });

  return (
    <div>
      <h1>Sandbox</h1>
      <h2>Hono API</h2>
      <h3>GET /api/helloworld</h3>
      <p>Response: {isLoading ? "Loading..." : data}</p>
      <p>
        {error ? (
          <span className="text-red-500">Error: {error.message}</span>
        ) : (
          "No error"
        )}
      </p>
    </div>
  );
}
