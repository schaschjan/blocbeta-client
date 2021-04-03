import { useQuery } from "react-query";
import { allIdle, cache, queryDefaults, useApi } from "./useApi";
import { useContext, useMemo } from "react";
import { BoulderDBUIContext } from "../components/BoulderDBUI";
import convertToKeyValueObject from "../helper/convertToKeyValueObject";
import { parseDate } from "../helper/parseDate";

function filterPresentOptions(boulders, column, uniqueProperty = "id") {
  if (!boulders || !boulders.length) {
    return [];
  }

  const map = new Map();

  boulders.forEach((boulder) => {
    if (column === "setters") {
      boulder[column].map((item) => map.set(item.id, item));
    } else {
      map.set(boulder[column][uniqueProperty], boulder[column]);
    }
  });

  return Array.from(map.values());
}

function useBoulders() {
  const { currentLocation, isAdmin } = useContext(BoulderDBUIContext);

  const boulderQuery = useQuery(
    [cache.boulder, currentLocation.id],
    useApi("boulder"),
    queryDefaults
  );

  const ascentsQuery = useQuery(
    [cache.ascents, currentLocation.id],
    useApi("ascents"),
    queryDefaults
  );

  const wallsQuery = useQuery(
    [cache.walls, currentLocation.id],
    useApi("walls"),
    queryDefaults
  );

  const gradesQuery = useQuery(
    [cache.grades, currentLocation.id],
    useApi("grades"),
    queryDefaults
  );

  const holdTypesQuery = useQuery(
    [cache.holdTypes, currentLocation.id],
    useApi("holdTypes"),
    queryDefaults
  );

  const settersQuery = useQuery(
    [cache.currentSetters, currentLocation.id],
    useApi("currentSetters"),
    queryDefaults
  );

  const idle = allIdle(
    boulderQuery,
    ascentsQuery,
    wallsQuery,
    gradesQuery,
    holdTypesQuery,
    settersQuery
  );

  return useMemo(() => {
    if (!idle) {
      return {
        boulders: [],
        idle: false,
      };
    }

    const ascents = convertToKeyValueObject(ascentsQuery.data, "boulderId");
    const grades = convertToKeyValueObject(gradesQuery.data);
    const holdTypes = convertToKeyValueObject(holdTypesQuery.data);
    const walls = convertToKeyValueObject(wallsQuery.data);
    const setters = convertToKeyValueObject(settersQuery.data);

    return {
      boulders: boulderQuery.data.map((boulder) => {
        const ascent = ascents[boulder.id];
        const grade = grades[boulder.grade];
        const startWall = walls[boulder.start_wall];

        return {
          ...boulder,
          points: ascent.points,
          ascents: ascent.ascents,
          grade: {
            ...grade,
            internal: isAdmin ? grades[boulder.internal_grade] : null,
          },
          holdType: holdTypes[boulder.hold_type],
          startWall: startWall,
          endWall: boulder.end_wall ? walls[boulder.end_wall] : startWall,
          setters: boulder.setters.map((id) => setters[id]),
          ascent: ascent
            ? {
                id: ascent.me ? ascent.me.id : null,
                boulderId: ascent.boulderId,
                type: ascent.me ? ascent.me.type : null,
              }
            : null,
          created_at: parseDate(boulder.created_at),
        };
      }),
      idle: true,
    };
  }, [
    boulderQuery,
    ascentsQuery,
    wallsQuery,
    gradesQuery,
    holdTypesQuery,
    settersQuery,
  ]);
}

export { useBoulders, filterPresentOptions };
