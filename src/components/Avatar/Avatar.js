import React from "react";
import "./Avatar.css";
import Icon from "../Icon/Icon";

const Avatar = ({ image }) => {
  if (!image) {
    return (
      <div className="avatar avatar--fallback">
        <Icon name="avatar" />
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
