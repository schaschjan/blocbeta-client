import React, {Fragment, useContext, useRef, createContext, useState} from "react";
import "./Drawer.css";
import {Loader} from "../Loader/Loader";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import useClickOutside from "../../hooks/useClickOutside";
import {motion} from "framer-motion"

export const DrawerContext = createContext({});

export const DrawerContainer = ({children}) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return (
    <DrawerContext.Provider value={{
      isLoading,
      setLoading,
      isOpen,
      toggle: (open) => setOpen(open),
    }}>
      {children}
    </DrawerContext.Provider>
  )
};

export const Drawer = ({children}) => {
  const drawerRef = useRef();
  const {toggle} = useContext(DrawerContext);

  useClickOutside(drawerRef, () => {
    toggle(false)
  });

  return (
    <motion.div className="drawer" ref={drawerRef} positionTransition>
      {children}
    </motion.div>
  );
};
