import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import {ThemeSelector} from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { handleImageError } from "../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getOutgoingFriendReqs } from "../utils/api";

export const Navbar = () => {
  const { authUser } = useAuthUser();
 
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;
  const outgoingCount = outgoingReqs?.outgoingReqs?.length || 0;
  const totalCount = incomingCount + outgoingCount;

  // const queryClient = useQueryClient();
  // const { mutate: logoutMutation } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto  sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
         
            <div className="pl-0">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary  tracking-wider">
                  Streamify
                </span>
              </Link>
            </div>
          

          <div className="flex items-center gap-3 sm:gap-4 ml-auto indicator">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {totalCount > 0 && (
                  <span className="indicator-item badge badge-primary badge-sm">
                    {totalCount}
                  </span>
                )}
              </button>
            </Link>
          </div>

          {/* TODO */}
          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt={`${authUser?.fullName}'s Avatar`}
               onError={handleImageError}
               rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
