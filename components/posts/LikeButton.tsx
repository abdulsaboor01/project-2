"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, initialLiked }: Props) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [animating, setAnimating] = useState(false);

  async function toggle() {
    if (!session) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    const data = await res.json();
    setLikes(data.likes);
    setLiked(data.liked);
  }

  return (
    <button
      onClick={toggle}
      disabled={!session}
      className={`group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
        liked
          ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-500 border border-red-200 hover:shadow-md hover:shadow-red-100 hover:-translate-y-px"
          : "bg-white text-gray-500 border border-gray-200 hover:border-red-200 hover:text-red-400 hover:bg-red-50 hover:-translate-y-px"
      } disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none`}
    >
      <span className={`text-lg transition-all duration-300 ${animating ? "scale-150" : "scale-100"} ${liked ? "text-red-500" : "text-gray-400 group-hover:text-red-400"}`}>
        {liked ? "♥" : "♡"}
      </span>
      <span>{likes}</span>
      <span className="text-xs opacity-60">{likes === 1 ? "like" : "likes"}</span>
      {!session && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Sign in to like
        </span>
      )}
    </button>
  );
}
