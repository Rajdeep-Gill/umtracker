// import { InferRequestType, InferResponseType } from "hono";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { client } from "@/lib/hono";

import { InferRequestType, InferResponseType } from "hono";

// type ResponseType = InferResponseType<typeof client.api.sync.calendar.$post>;
// type RequestType = InferRequestType<
//   typeof client.api.sync.calendar.$post
// >["json"];

// export const useUpdateSync = () => {
//   const queryClient = useQueryClient();
//   const mutation = useMutation<ResponseType, Error, RequestType>({
//     mutationFn: async (json) => {
//       const response = await client.api.sync.calendar.$post({ json });
//       return await response.json();
//     },
//     onSuccess: () => {
//       toast.success("Account created");
//       queryClient.invalidateQueries({ queryKey: ["accounts"] });
//     },
//     onError: (error) => {
//       toast.error("Failed to create account");
//       console.error("Failed to create account", error);
//     },
//   });

//   return mutation;
// };

export const useUpdateSync = () => {
  const queryClient = useQueryClient();
  const fetchSyncAPI = async (url: string) => {
    const response = await fetch("/api/sync/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
      credentials: "include",
    });

    queryClient.invalidateQueries({ queryKey: ["checkSync"] });
    return await response.json();
  };

  return fetchSyncAPI;
};

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.sync.calendar.$post>;
type RequestType = InferRequestType<
  typeof client.api.sync.calendar.$post
>["json"];
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateSync2 = () => {};
