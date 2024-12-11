import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";

export default function Rate({ rate }) {
    const { currentUser } = useSelector((state) => state.user);
    const [likes, setLikes] = useState(rate.likes);
    const [isLiked, setIsLiked] = useState(
        rate.likes.includes(currentUser._id)
    );

    const handleLike = async () => {
        try {
            const res = await fetch(
                `/api/rate/like-rate/${currentUser._id}/${rate._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
            setLikes(data);
            setIsLiked(!isLiked);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <p>người đánh giá:{rate.owner.name}</p>
            <p>Đánh giá:{rate.comment}</p>
            <button onClick={handleLike}>
                {isLiked ? <AiFillLike /> : <AiOutlineLike />} {likes.length}
            </button>
        </div>
    );
}