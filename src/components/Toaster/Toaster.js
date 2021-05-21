import React, { createContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Toaster.module.css";
import { extractErrorMessage } from "../../hooks/useApi";
import { joinClassNames } from "../../helper/classNames";
import typography from "../../css/typography.module.css";

export const ToastContext = createContext({});

export const toast = (
  title,
  description = null,
  type = "info",
  timeout = 2000
) => {
  return {
    title,
    description,
    type,
    timeout,
  };
};

export const successToast = (message) => {
  return toast("Success", message, "success");
};

export const errorToast = (error) => {
  return toast("A error occurred", extractErrorMessage(error), "error");
};

export const ToastContainer = ({ children }) => {
  const [queue, setQueue] = useState([]);

  const dispatch = (newToast) => {
    setQueue([...queue, newToast]);
  };

  useEffect(() => {
    console.log(queue);

    if (!queue.length > 0) {
      return;
    }

    queue.forEach((toast) => {
      setTimeout(() => {
        queue.shift();

        setQueue([...queue]);
      }, toast.timeout);
    });
  }, [queue]);

  return (
    <ToastContext.Provider value={{ dispatch }}>
      <ul className={styles.list}>
        <AnimatePresence initial={false}>
          {queue.map((item, index) => (
            <Toast {...item} key={index} />
          ))}
        </AnimatePresence>
      </ul>

      {children}
    </ToastContext.Provider>
  );
};

const Toast = ({ type = "info", title, description }) => (
  <motion.li
    positionTransition
    initial={{ opacity: 0, y: 50, scale: 0.3 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    className={joinClassNames(styles.root, styles[`is${type.capitalize()}`])}
  >
    <h3 className={joinClassNames(styles.title, typography.epsilon)}>
      {title}
    </h3>

    {description && (
      <p className={joinClassNames(styles.description, typography.eta)}>
        {description}
      </p>
    )}
  </motion.li>
);
