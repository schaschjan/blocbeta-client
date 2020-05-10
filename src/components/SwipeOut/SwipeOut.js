import React, { useState } from "react";
import "./SwipeOut.css";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";
import classnames from "classnames";

const SwipeOut = ({ children, actions, width }) => {
  const ref = React.useRef();
  const dragWidth = -width;
  const dragFull = { x: dragWidth };
  const dragReset = { x: 0 };
  const contentOffsetX = useMotionValue(0);
  const animation = useAnimation();
  const [revealed, setRevealed] = useState(false);

  useClickOutside(ref, () => {
    animation.start(dragReset);
    setRevealed(false);
  });

  return (
    <div
      className={classnames(
        "swipe-out",
        revealed ? "swipe-out--revealed" : null
      )}
      ref={ref}
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
