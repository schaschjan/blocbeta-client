import React, {useMemo, createContext, useEffect} from "react";
import {usePersistentState} from "./../index.js"
import packageJson from '../../package.json';

export const BlocBetaUIContext = createContext({});

export const BlocBetaUI = ({children}) => {

  const [user, setUser] = usePersistentState("user", null);
  const [currentLocation, setCurrentLocation] = usePersistentState("location", null);
  const [expiration, setExpiration] = usePersistentState("expiration", null);

  const [version, setVersion] = usePersistentState("version", packageJson.version);

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
    if (!currentLocation || !user) {
      return false;
    }

    // legacy storage version checks
    if (!user.roles) {
      return false;
    }

    if (!Array.isArray(user.roles)) {
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

  useEffect(() => {

    fetch("/meta.json")
      .then((response) => response.json())
      .then((meta) => {
        const latestVersion = meta.version;

        if (latestVersion === version) {
          return;
        }

        console.log("💣💣💣 PRUNING CACHES 💣💣💣");

        if (caches) {
          caches.keys().then(function (names) {
            for (let name of names) caches.delete(name);
          });
        }

        setVersion(latestVersion);

        if (typeof window !== "undefined") {
          window.location.reload();
        }
      })

  }, [version]);

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
