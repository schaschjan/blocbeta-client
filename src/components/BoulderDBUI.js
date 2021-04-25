import React, { useMemo, createContext, useEffect, useState } from "react";
import packageJson from "../../package.json";
import usePersistentState from "../hooks/usePersistentState";
import { getApiHost, useHttp } from "../hooks/useRequest";

export const BoulderDBUIContext = createContext({});

export const BoulderDBUI = ({ children }) => {
  const [user, setUser] = usePersistentState("user", null);
  const [currentLocation, setCurrentLocation] = usePersistentState(
    "location",
    null
  );
  const [expiration, setExpiration] = usePersistentState("expiration", null);
  const [version, setVersion] = usePersistentState(
    "version",
    packageJson.version
  );
  const [instructions, setInstructions] = useState([]);
  const globalHttp = useHttp(false);

  const contextualizedApiPath = (path) => "/api" + contextualizedPath(path);

  const contextualizedPath = (path) => {
    if (!currentLocation) {
      return;
    }

    return `/${currentLocation.url}${path}`;
  };

  const isAuthenticated = useMemo(() => {
    if (!user || !currentLocation || !expiration) {
      return false;
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

    return user.roles.includes(`ROLE_ADMIN@${currentLocation.id}`);
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
      });
  }, [version]);

  const telemetry = async () => {
    if (currentLocation) {
      await globalHttp.get(`/${currentLocation.url}/ping`);
    }

    const { data } = await globalHttp.post("/telemetry", { version: "1.0.0" });

    data.updates.map((update) => {
      const { version, instructions } = update;

      console.log(version, instructions);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      telemetry();
    }
  }, []);

  return (
    <BoulderDBUIContext.Provider
      value={{
        version,
        currentLocation,
        setCurrentLocation,
        user,
        setUser,
        expiration,
        setExpiration,
        contextualizedPath,
        contextualizedApiPath,
        isAdmin,
        isAuthenticated,
        reset,
      }}
    >
      {children}
    </BoulderDBUIContext.Provider>
  );
};
