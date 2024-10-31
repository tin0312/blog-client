import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";

function PostReactions({ postId, likeCount, helpfulCount, brilliantCount }) {
  const { user } = useAuth();
  const [likeCtn, setLikeCtn] = useState(0);
  const [helpfulCtn, setHelpfulCtn] = useState(0);
  const [brilliantCtn, setBrilliantCtn] = useState(0);
  const [activeReaction, setActiveReaction] = useState({});

  useEffect(() => {
    setLikeCtn(likeCount);
    setHelpfulCtn(helpfulCount);
    setBrilliantCtn(brilliantCount);
  }, [likeCount, helpfulCount, brilliantCount]);

  function handleReactionCount(reactionType) {
    if (user) {
      setActiveReaction((prevActiveState) => {
        const newActiveReaction = {
          ...prevActiveState,
          [reactionType]: !prevActiveState[reactionType],
        };
        localStorage.setItem(user?.username, JSON.stringify(newActiveReaction));
        return newActiveReaction;
      });
      if (reactionType === "like") {
        setLikeCtn((prevCount) =>
          activeReaction.like ? prevCount - 1 : prevCount + 1
        );
      } else if (reactionType === "helpful") {
        setHelpfulCtn((prevCount) =>
          activeReaction.helpful ? prevCount - 1 : prevCount + 1
        );
      } else {
        setBrilliantCtn((prevCount) =>
          activeReaction.brilliant ? prevCount - 1 : prevCount + 1
        );
      }
    }
  }

  useEffect(() => {
    async function updateReaction() {
      try {
        await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/add-reaction`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              likeCount: likeCtn,
              helpfulCount: helpfulCtn,
              brilliantCount: brilliantCtn,
            }),
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
    updateReaction();
  }, [likeCtn, helpfulCtn, brilliantCtn]);

  useEffect(() => {
    if (user) {
      const savedActiveReaction = JSON.parse(
        localStorage.getItem(user.username)
      );
      if (savedActiveReaction) {
        setActiveReaction(savedActiveReaction);
      } else {
        setActiveReaction({
          like: false,
          helpful: false,
          brilliant: false,
        });
      }
    }
  }, [user]);

  return (
    <div>
      <ul className="reactions-container">
        <li
          style={activeReaction.like ? { color: "white" } : null}
          onClick={() => handleReactionCount("like")}
        >
          ({likeCtn}) Like
        </li>
        <li
          style={activeReaction.helpful ? { color: "white" } : null}
          onClick={() => handleReactionCount("helpful")}
        >
          ({helpfulCtn}) Helpful
        </li>
        <li
          style={activeReaction.brilliant ? { color: "white" } : null}
          onClick={() => handleReactionCount("brilliant")}
        >
          ({brilliantCtn}) Brilliant
        </li>
      </ul>
    </div>
  );
}

export default PostReactions;
