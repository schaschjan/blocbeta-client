import React from 'react';
import "./Avatar.css";

const Avatar = ({image}) => {

    if (!image) {
        // todo: resolve image url
    }

    return <div className="avatar" style={
        {backgroundImage: image}}>
    </div>
};

export default Avatar