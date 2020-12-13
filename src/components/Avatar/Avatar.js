import React from "react";
import "./Avatar.css";
import AvatarIcon from "../Icon/Avatar";

const Avatar = ({ image }) => {
  if (!image) {
    return (
      <div className="avatar avatar--fallback">
        <AvatarIcon />
      </div>
    );
  }

  return (
    <div
      className="avatar"
      style={{ backgroundImage: `url(${image}?w=80&h=80&fit=crop)` }}
    />
  );
};

export default Avatar;
