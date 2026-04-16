import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useStreamChat } from "../hooks/useStreamChat";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

export const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { client, isConnecting } = useStreamChat();
  const { authUser } = useAuthUser();

  useEffect(() => {
    const initChannel = async () => {
      if (!client || !authUser || isConnecting) return;

      try {
        console.log("Setting up channel...");

        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing channel:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChannel();
  }, [client, authUser, targetUserId, isConnecting]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !client || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <Chat client={client}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
