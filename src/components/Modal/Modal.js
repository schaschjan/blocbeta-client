import React from "react";
import "./Modal.css";
import { motion } from "framer-motion";
import {classNames} from "../../helper/buildClassNames";

const Modal = ({ children, contentRef, open = false }) => {
  const variants = {
    open: {
      opacity: 1,
      applyAtStart: {
        display: "block",
      },
    },
    closed: {
      opacity: 0,
      applyAtEnd: {
        display: "none",
      },
    },
  };

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      variants={variants}
      className={classNames("modal", open ? "modal--open" : null)}
    >
      <div className={"modal__content"} ref={contentRef}>
        {children}
      </div>
    </motion.div>
  );
};

export default Modal;
