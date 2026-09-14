import {
  LogInIcon,
  MessageCircleMore,
  MessageSquareIcon,
  Send,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/react";

import { useCreateComment, useDeleteComment } from "../hooks/useComments";

const CommentsSection = ({ productId, comments = [], currentUserId }) => {
  const { isSignedIn } = useAuth();
  const [comment, setComment] = useState("");
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment(productId);
  console.log(comments);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return; // when the user does not pass anything, then do nothing.
    createComment.mutate(
      { productId, content: comment },
      {
        onSuccess: () => {
          setComment("");
        },
      },
    );
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircleMore className="size-5 text-primary" />
        <h3 className="font-bold">Comments</h3>
        <span className="badge badge-neutral badge-sm">{comments.length}</span>
      </div>
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="input input-bordered input-sm flex-1 bg-base-200"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={createComment.isPending}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-square"
            disabled={createComment.isPending || !comment.trim()}
          >
            {createComment.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-base-200 rounded-lg p-3">
          <span className="text-sm text-base-content/60">
            Sign in to join the conversation
          </span>
          <SignInButton mode="modal">
            <button className="btn btn-primary btn-sm gap-1">
              <LogInIcon className="size-4" /> Sign In
            </button>
          </SignInButton>
        </div>
      )}
      <div className="space-y-2 max-h-80 overscroll-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <MessageSquareIcon className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No comments yet. Be the first one to add!</p>
          </div>
        ) : (
          comments.map((eachComment) => (
            <div key={eachComment.id} className="chat chat-start">
              <div className="w-8 rounded-full">
                <img
                  src={eachComment.user?.imageUrl}
                  alt={eachComment.user?.name}
                />
              </div>
              <div className="chat-header text-xs opacity-70 mb-2">
                {eachComment.user?.name}
                <time className="ml-2 text-xs opacity-50">
                  {new Date(eachComment.createdAt).toLocaleDateString()}
                </time>
              </div>
              <div className="chat-bubble chat-bubble-neutral text-sm">
                {eachComment.content}
              </div>
              {eachComment.userId === currentUserId ? (
                <div className="chat-footer">
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => {
                      confirm("Delete comment?") &&
                        deleteComment.mutate({ commentId: eachComment.id });
                    }}
                    disabled={deleteComment.isPending}
                  >
                    {deleteComment.isPending ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Trash2Icon className="size-3" />
                    )}
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
