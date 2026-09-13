import { MessageCircleMore, Send } from "lucide-react";
import { useState } from "react";

import { useCreateComment } from "../hooks/useComments";

const CommentsSection = ({ productId, comments }) => {
  console.log(comments);
  const [comment, setComment] = useState("");
  const createComment = useCreateComment();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Comment: " + comment);
    createComment.mutate({ productId, content: comment });
  };
  return (
    <div>
      <div className="flex">
        <MessageCircleMore className="size-5" />
        <h1 className="space-x-3">Comments {comments.length}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* New Comment Input */}
        <label className="input input-bordered flex items-center gap-2 bg-base-200">
          <input
            type="text"
            placeholder="Add a comment..."
            className="grow"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit">
            <Send />
          </button>
        </label>
      </form>
      {comments.map((comment) => (
        <div key={comment.id}>{comment.content}</div>
      ))}
    </div>
  );
};

export default CommentsSection;
