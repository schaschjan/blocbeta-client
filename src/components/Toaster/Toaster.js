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
  return toast("A error occurred", extractErrorMessage(error), "danger");
};

export const ToastContainer = ({ children }) => {
  const [toast, dispatch] = useState(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    setTimeout(() => {
      dispatch(null);
    }, toast.timeout);
  }, [toast]);

  return (
    <ToastContext.Provider
      value={{
        dispatch,
      }}
    >
      <AnimatePresence>{toast && <Toast {...toast} />}</AnimatePresence>

      {children}
    </ToastContext.Provider>
  );
};

const Toast = ({ type = "info", title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
    </motion.div>
  );
};
