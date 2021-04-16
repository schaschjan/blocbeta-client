import React, { useState, useRef, createContext, useEffect } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";
import { joinClassNames } from "../../helper/classNames";
import styles from "./SwipeOut.module.css";

const SwipeOutContext = createContext({});

function SwipeOut({ children, hiddenChildren }) {
  const rootRef = useRef();
  const contentRef = useRef();

  const [revealed, setRevealed] = useState(false);
  const [width, setWidth] = useState(0);

  const dragWidth = -width;
  const dragFull = { x: dragWidth };
  const dragReset = { x: 0 };
  const x = useMotionValue(0);
  const animation = useAnimation();

  const close = () => {
    animation.start(dragReset);
    setRevealed(false);
  };

  const open = () => {
    animation.start(dragFull);
    setRevealed(true);
  };

  useClickOutside(rootRef, () => {
    close();
  });

  useEffect(() => {
    if (contentRef.current) {
      setWidth(contentRef.current.offsetWidth);
    }
  }, [contentRef]);

  return (
    <SwipeOutContext.Provider
      value={{
        close,
        open,
      }}
    >
      <div
        className={joinClassNames(
          styles.root,
          revealed ? styles.isRevealed : null
        )}
        ref={rootRef}
      >
        <motion.div
          drag={"x"}
          x={x}
          dragConstraints={{ left: dragWidth, right: 0 }}
          dragElastic={0}
          animate={animation}
          onDragEnd={() => {
            if (x.get() > dragWidth / 2) {
              close();
            } else if (x.get() < dragWidth / 2) {
              open();
            }
          }}
        >
          <div className={styles.facade}>{children}</div>
        </motion.div>

        <motion.div className={styles.content} ref={contentRef}>
          {hiddenChildren}
        </motion.div>
      </div>
    </SwipeOutContext.Provider>
  );
}

export { SwipeOut, SwipeOutContext };
