import React, {createContext, useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion"
import "./Toaster.css";
import {extractErrorMessage} from "../../hooks/useApi";

export const ToastContext = createContext({});

export const toast = (title, description = null, type = "info", timeout = 2000) => {
  return {
    title,
    description,
    type,
    timeout
  }
};

export const successToast = (message) => {

  return toast(
    "Success",
    message,
    "success"
  )
};


export const errorToast = (error) => {

  return toast(
    "A error occurred",
    extractErrorMessage(error),
    "danger"
  )
};

export const ToastContainer = ({children}) => {
  const [toast, dispatch] = useState(null);

  useEffect(() => {
    if (!toast) {
      return
    }

    setTimeout(() => {
      dispatch(null)

    }, toast.timeout);

  }, [toast]);

  return (
    <ToastContext.Provider value={{
      dispatch
    }}>
      <AnimatePresence>
        {toast && <Toast {...toast}/>}
      </AnimatePresence>

      {children}
    </ToastContext.Provider>
  )
};

const Toast = (toast) => {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className={`toast toast--${toast.type}`}>
      <h3 className="toast__title t--epsilon">{toast.title}</h3>

      {toast.description && (
        <p className="toast__description t--eta">{toast.description}</p>
      )}
    </motion.div>
  )
};
