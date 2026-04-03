import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../utils/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFounds";
import { UsersIcon } from "lucide-react";

export const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        <div className="flex items-center gap-3 mb-10">
          
          <h2 className="text-3xl font-bold tracking-tight">Your Friends</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
