import React, { useState, useEffect } from "react";

function PostReactions({ postId }) {
  const [likeCount, setLikeCount] = useState(0);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [brilliantCount, setBrilliantCount] = useState(0);
  const [activeReaction, setActiveReaction] = useState({
    like: false,
    helpful: false,
    brilliant: false,
  });

  function handleReactionCount(reactionType) {
    setActiveReaction((prevActiveState) => ({
      ...prevActiveState,
      [reactionType]: !prevActiveState[reactionType],
    }));
    if (reactionType === "like") {
      setLikeCount((prevCount) =>
        activeReaction.like ? prevCount - 1 : prevCount + 1
      );
      console.log(activeReaction);
    } else if (reactionType === "helpful") {
      setHelpfulCount((prevCount) =>
        activeReaction.helpful ? prevCount - 1 : prevCount + 1
      );
      console.log(activeReaction);
    } else {
      setBrilliantCount((prevCount) =>
        activeReaction.brilliant ? prevCount - 1 : prevCount + 1
      );
      console.log(activeReaction);
    }
  }
  // save reaction count to the database
  useEffect(() => {
    async function updateReaction() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/add-reaction`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
              likeCount,
              helpfulCount,
              brilliantCount,
            }),
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
    updateReaction();
  }, [likeCount, helpfulCount, brilliantCount]);

  return (
    <div>
      <ul className="reactions-container">
        <li
          style={activeReaction.like ? { color: "white" } : null}
          onClick={() => handleReactionCount("like")}
        >
          ({likeCount}) Like
        </li>
        <li
          style={activeReaction.helpful ? { color: "white" } : null}
          onClick={() => handleReactionCount("helpful")}
        >
          ({helpfulCount}) Helpful
        </li>
        <li
          style={activeReaction.brilliant ? { color: "white" } : null}
          onClick={() => handleReactionCount("brilliant")}
        >
          ({brilliantCount}) Brilliant
        </li>
      </ul>
    </div>
  );
}

export default PostReactions;
