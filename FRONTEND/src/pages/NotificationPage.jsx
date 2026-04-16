import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs, withdrawFriendRequest } from "../utils/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, SendIcon, XIcon, TrashIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFounds";
import { handleImageError } from "../utils/utils";
import { useState } from "react";

export const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [dismissedNotifications, setDismissedNotifications] = useState(() => {
    const stored = localStorage.getItem("dismissedNotifications");
    return stored ? JSON.parse(stored) : [];
  });

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: outgoingReqs, isLoading: loadingOutgoing } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  const { mutate: withdrawRequestMutation, isPending: isWithdrawing } = useMutation({
    mutationFn: withdrawFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];
  const pendingOutgoing = outgoingReqs?.outgoingReqs || [];

  // Filter out dismissed notifications
  const visibleAcceptedRequests = acceptedRequests.filter(
    (notification) => !dismissedNotifications.includes(notification._id)
  );

  const handleDismissNotification = (notificationId) => {
    const updated = [...dismissedNotifications, notificationId];
    setDismissedNotifications(updated);
    localStorage.setItem("dismissedNotifications", JSON.stringify(updated));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading || loadingOutgoing ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* INCOMING REQUESTS SECTION */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePic} alt={`${request.sender.fullName}'s Avatar`} onError={handleImageError} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* PENDING OUTGOING REQUESTS */}
            {pendingOutgoing.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <SendIcon className="h-5 w-5 text-warning" />
                  Pending Requests Sent
                  <span className="badge badge-warning ml-2">{pendingOutgoing.length}</span>
                </h2>

                <div className="space-y-3">
                  {pendingOutgoing.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow opacity-75"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.recipient.profilePic} alt={`${request.recipient.fullName}'s Avatar`} onError={handleImageError} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.recipient.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  Native: {request.recipient.nativeLanguage}
                                </span>
                                <span className="badge badge-outline badge-sm">
                                  Learning: {request.recipient.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              className="btn btn-error btn-xs text-white"
                              onClick={() => withdrawRequestMutation(request._id)}
                              disabled={isWithdrawing}
                            >
                              {isWithdrawing ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <>
                                  <TrashIcon className="h-3 w-3" />
                                  Withdraw
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {visibleAcceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {visibleAcceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={notification.recipient.profilePic}
                                alt={`${notification.recipient.fullName}'s Avatar`}
                                onError={handleImageError}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                              <p className="text-sm my-1">
                                You are connected with {notification.recipient.fullName}
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                            <button
                              onClick={() => handleDismissNotification(notification._id)}
                              className="btn btn-ghost btn-xs"
                              title="Dismiss notification"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && visibleAcceptedRequests.length === 0 && pendingOutgoing.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
