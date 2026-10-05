import React, { use, useEffect, useState } from "react";
import { getPosts } from "../Services/PostService";
import LodingScreen from "../Components/LodingScreen";


export default function FeedPage() {
    const [openMenu, setOpenMenu] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                const post = await getPosts(token);
                setPosts(post);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    return <>
        {loading ?<LodingScreen/>: posts.map( (post) => <div key={post.id} className="w-full bg-slate-100 py-0.5">
        
        <div className="w-full max-w-2xl mx-auto px-4">

            <div className="bg-white w-full rounded-md shadow-md h-auto py-3 px-3 my-5">

            {/* Post Header */}
            <div className="flex justify-between items-start">

                <div className="flex">
                <img
                    className="rounded-full w-10 h-10 mr-3"
                    src={post.user.photo}
                    alt={post.user.name}
                />

                <div>
                    <h3 className="text-md font-semibold">
                    {post.user.name}
                    </h3>

                <div className="flex items-center gap-2 ">
                    <p className="text-xs text-gray-500">
                        {post.createdAt.split(".", 1)[0].replace("T", " ")}
                    </p>

                    <span className="text-gray-400">•</span>

                    <p className="text-xs text-gray-500 capitalize">
                        {post.privacy}
                    </p>
                </div>
                </div>
                </div>

            {/* Post Options */}
            <div className="flex items-center gap-2">

                {/* Bookmark */}
                <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <svg
                        className={`w-5 h-5 ${
                            post.bookmarked
                                ? "fill-blue-500 stroke-blue-500"
                                : "fill-none stroke-gray-500"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 3h12a2 2 0 0 1 2 2v16l-8-4-8 4V5a2 2 0 0 1 2-2z" />
                    </svg>
                </button>

                {/* More */}
                <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <svg
                        className="w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                    </svg>
                </button>

            </div>

            </div>

            {/* Post Content */}
            <div className="mt-3">
                {post.body && <p>{post.body}</p>}
                {post.image && <img className="w-full h-80 rounded-md mt-3 object-cover" src={post.image} alt={post.user.name}/>}
                
            </div>

            {/* Reactions */}
            <div className="w-full h-8 flex items-center px-3 my-3">

                <div className="bg-blue-500 z-10 w-5 h-5 rounded-full flex items-center justify-center">
                <svg
                    className="w-3 h-3 fill-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b0b0b0"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                </div>

                <div className="bg-red-500 w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                <svg
                    className="w-3 h-3 fill-current stroke-current text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b0b0b0"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                </div>

                <div className="w-full flex justify-between">
                <p className="ml-3 text-gray-500">
                    {post.likesCount}
                </p>

                <p className="ml-3 text-gray-500">
                    {post.commentsCount} comments
                </p>
                </div>

            </div>

            <hr />

            {/* Actions */}
            <div className="grid grid-cols-3 w-full px-5 my-3">

                {/* Like */}
                <button className="flex flex-row justify-center items-center w-full space-x-3">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#838383"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
                >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 1.98-1.7l1.38-9a2 2 0 0 0-2-2H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className="font-semibold text-lg text-gray-600">
                    Like
                </span>
                </button>

                {/* Comment */}
                <button className="flex flex-row justify-center items-center w-full space-x-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#838383"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>

                <span className="font-semibold text-lg text-gray-600">
                    Comment
                </span>
                </button>

                {/* Share */}
                <button className="flex flex-row justify-center items-center w-full space-x-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#838383"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>

                <span className="font-semibold text-lg text-gray-600">
                    Share
                </span>
                {post.sharesCount > 0 && (
                    <span className="text-sm text-gray-500">
                        {post.sharesCount}
                    </span>
                )}
                </button>

            </div>


        {/* Comments */}
        <div className="mt-4 px-3 my-4 mt-9">

            {/* ==================== Top Comment  ==================== */}
            {post.topComment && (
                <div className="flex items-start space-x-2 mb-4">

                    {/* Avatar */}
                    <img
                        src={post.topComment.commentCreator.photo}
                        alt={post.topComment.commentCreator.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />

                    <div className="flex-1">

                        {/* Comment */}
                        <div className="flex items-start">

                            <div className="bg-gray-100 rounded-xl px-3 py-2">
                                <span className="text-sm font-semibold">
                                    {post.topComment.commentCreator.name}
                                </span>

                                <p className="text-xs text-gray-700">
                                    {post.topComment.content}
                                </p>
                            </div>

                        </div>

                        {/* Comment Actions */}
                <div className="flex items-center gap-2 mt-1 ml-2 text-xs">

                    <button className="font-semibold text-gray-600 hover:underline">
                        Like
                    </button>

                    <span className="text-gray-400">·</span>

                    <button className="font-semibold text-gray-600 hover:underline">
                        Reply
                    </button>

                    <span className="text-gray-400">·</span>

                    <span className="text-gray-500">
                        {post.topComment.likes?.length || 0}{" "}
                        {post.topComment.likes?.length === 1 ? "like" : "likes"}
                    </span>

                    <span className="text-gray-400">·</span>

                    <span className="text-gray-400">
                        {post.topComment.createdAt
                            .split(".", 1)[0]
                            .replace("T", " ")}
                    </span>

                </div>

                    </div>
                </div>
            )}


        </div>

            </div>
            
        </div>
        </div> ) }

        

    </>;
}