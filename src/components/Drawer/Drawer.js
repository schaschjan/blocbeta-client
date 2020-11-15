import React, {
  Fragment,
  useContext,
  createContext,
  useRef,
  useState,
  useEffect,
} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { classNames } from "../../helper/classNames";
import "./Drawer.css";

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
    <Fragment>
      <div
        className={classNames(`drawer`, isOpen ? "drawer--open" : null)}
        ref={drawerRef}
      >
        {children}
      </div>

      <div
        className={classNames(
          "drawer-overlay",
          isOpen ? "drawer-overlay--visible" : null
        )}
      />
    </Fragment>
  );
};

export { DrawerContext, DrawerContainer, Drawer };
