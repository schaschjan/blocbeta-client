import React from 'react';
import "./Avatar.css";
import {resolveMedia} from "../../helpers/helpers";

const Avatar = ({image}) => {
    if (!image) {
        return null;
    }

    return <div className="avatar" style={
        {backgroundImage: `url(${resolveMedia(image)})`}}>
    </div>
};

export default Avatar