import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import useAuthUser from "./useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../utils/api";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let streamClientInstance = null; // Persistent client instance

export const useStreamChat = () => {
  const [client, setClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initializeClient = async () => {
      if (!tokenData?.token || !authUser) return;

      // If client is already initialized, just set it
      if (streamClientInstance) {
        setClient(streamClientInstance);
        return;
      }

      setIsConnecting(true);

      try {
        console.log("Initializing Stream Chat client...");

        const newClient = StreamChat.getInstance(STREAM_API_KEY);

        await newClient.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        streamClientInstance = newClient;
        setClient(newClient);
        console.log("Stream Chat client connected successfully");
      } catch (error) {
        console.error("Error initializing Stream Chat client:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initializeClient();
  }, [tokenData, authUser]);

  return { client, isConnecting };
};
