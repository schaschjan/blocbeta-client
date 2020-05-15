import React from "react";
import "./Avatar.css";
import { resolveMedia } from "../../helpers";
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
      style={{ backgroundImage: `url(${resolveMedia(image)})` }}
    ></div>
  );
};

export default Avatar;
