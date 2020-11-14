import React, { useState, useRef } from "react";
import "./SwipeOut.css";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";
import { classNames } from "../../helper/classNames";

const SwipeOut = ({ children, actions, width, closeOnClick = true }) => {
  const wrapper = useRef();
  const dragWidth = -width;
  const dragFull = { x: dragWidth };
  const dragReset = { x: 0 };
  const contentOffsetX = useMotionValue(0);
  const animation = useAnimation();
  const [revealed, setRevealed] = useState(false);

  useClickOutside(wrapper, () => {
    animation.start(dragReset);
    setRevealed(false);
  });

  return (
    <div
      className={classNames(
        "swipe-out",
        revealed ? "swipe-out--revealed" : null
      )}
      ref={wrapper}
    >
      <motion.div
        drag={"x"}
        x={contentOffsetX}
        dragConstraints={{ left: dragWidth, right: 0 }}
        dragElastic={0}
        onDrag={() => {
          setRevealed(false);
        }}
        animate={animation}
        onDragEnd={() => {
          if (contentOffsetX.get() > dragWidth / 2) {
            animation.start(dragReset);
            setRevealed(false);
          } else if (contentOffsetX.get() < dragWidth / 2) {
            animation.start(dragFull);
            setRevealed(true);
          }
        }}
      >
        <div className="swipe-out__facade">{children}</div>
      </motion.div>

      <div className="swipe-out__actions">{actions}</div>
    </div>
  );
};

export default SwipeOut;
