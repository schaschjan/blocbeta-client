import React, {useMemo, createContext} from "react";
import {usePersistentState} from  "./../index.js"

export const BlocBetaUIContext = createContext({});

export const BlocBetaUI = ({children}) => {

  const [user, setUser] = usePersistentState("user", null);
  const [currentLocation, setCurrentLocation] = usePersistentState("location", null);
  const [expiration, setExpiration] = usePersistentState("expiration", null);

  const contextualizedPath = (path) => {
    if (!currentLocation) {
      return;
    }

    return `/${currentLocation.url}${path}`
  };

  const isAuthenticated = useMemo(() => {
    if (!user || !currentLocation || !expiration) {
      return false
    }

    return new Date().getTime() / 1000 <= expiration;
  }, [user, expiration, currentLocation]);

  const isAdmin = useMemo(() => {
    if (!currentLocation || !user || !user.roles) {
      return false;
    }

    return user.roles.includes(
      `ROLE_ADMIN@${currentLocation.id}`
    );
  }, [currentLocation, user]);

  const reset = () => {
    setUser(null);
    setCurrentLocation(null);
    setExpiration(null);

    localStorage.clear();
  };

  return (
    <BlocBetaUIContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      user,
      setUser,
      expiration,
      setExpiration,
      contextualizedPath,
      isAdmin,
      isAuthenticated,
      reset,
    }}>
      {children}
    </BlocBetaUIContext.Provider>
  )
};