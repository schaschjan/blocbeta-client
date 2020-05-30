import React from "react";
import "./Avatar.css";
import { resolveMedia } from "../../helpers";
import Icon from "../Icon/Icon";

const Avatar = ({ user }) => {
  if (!user.media) {
    return (
      <div className="avatar avatar--fallback">
        <Icon name="avatar" />
      </div>
    );
  }

  return (
    <div className="avatar" style={{ backgroundImage: `url(${resolveMedia(user.media)})` }}/>
  );
};

export default Avatar;
