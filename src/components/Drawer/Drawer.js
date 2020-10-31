import React, {Fragment, useRef, createContext, useState} from "react";
import useClickOutside from "../../hooks/useClickOutside";
import {classNames} from "../../helper/buildClassNames";
import "./Drawer.css";

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

export const useDrawer = () => {
  const [isOpen, setOpen] = useState(false);

  const Drawer = ({children}) => {
    const drawerRef = useRef();

    useClickOutside(drawerRef, () => {
      setOpen(false);
    });

    return (
      <Fragment>
        <div className={classNames(`drawer`, isOpen ? "drawer--open" : null)} ref={drawerRef}>
          {children}
        </div>

        <div className={classNames("drawer-overlay", isOpen ? "drawer-overlay--visible" : null)}/>
      </Fragment>
    );
  };

  return {
    openDrawer: () => setOpen(true),
    closeDrawer: () => setOpen(false),
    Drawer
  };
};
