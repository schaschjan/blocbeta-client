import React, {
  Fragment,
  useContext,
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { classNames, joinClassNames } from "../../helper/classNames";
import "./Drawer.css";
import { AnimatePresence, motion } from "framer-motion";

const DrawerContext = createContext({});

const DrawerContainer = ({ children }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        toggle: (visible) => setOpen(visible),
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

const Drawer = ({ children, onClose }) => {
  const { isOpen, toggle } = useContext(DrawerContext);

  const drawerRef = useRef();

  useClickOutside(drawerRef, () => {
    toggle(false);

    if (onClose) {
      onClose();
    }
  });

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return null;
    }

    document.body.style.overflow = isOpen ? "hidden" : "scroll";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ x: 320 }}
            animate={{
              x: 0,
            }}
            exit={{
              x: 320,
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={joinClassNames(`drawer`)}
            ref={drawerRef}
          >
            {children}
          </motion.div>

          <motion.div
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.8,
            }}
            exit={{
              opacity: 0,
            }}
            className={classNames(
              "drawer-overlay",
              isOpen ? "drawer-overlay--visible" : null
            )}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export { DrawerContext, DrawerContainer, Drawer };
