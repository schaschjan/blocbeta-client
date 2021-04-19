import { useContext, useMemo } from "react";
import { BoulderDBUIContext } from "../components/BoulderDBUI";
import convertToKeyValueObject from "../helper/convertToKeyValueObject";
import { parseDate } from "../helper/parseDate";
import { useRequest } from "./useRequest";

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
  const { isAdmin } = useContext(BoulderDBUIContext);

  const { data: boulders } = useRequest("/boulder");
  const { data: ascents } = useRequest("/ascent");
  const { data: walls } = useRequest("/wall");
  const { data: grades } = useRequest("/grade");
  const { data: holdTypes } = useRequest("/holdstyle");
  const { data: setters } = useRequest("/setter/current");

  const idle =
    boulders &&
    ascents &&
    boulders.length === ascents.length &&
    walls &&
    grades &&
    holdTypes &&
    setters;

  return useMemo(() => {
    if (!idle) {
      return {
        boulders: [],
        idle: false,
      };
    }

    const ascentMap = convertToKeyValueObject(ascents, "boulderId");
    const gradeMap = convertToKeyValueObject(grades);
    const holdTypeMap = convertToKeyValueObject(holdTypes);
    const wallMap = convertToKeyValueObject(walls);
    const setterMap = convertToKeyValueObject(setters);

    return {
      boulders: boulders.map((boulder) => {
        const ascent = ascentMap[boulder.id];
        const grade = gradeMap[boulder.grade];
        const startWall = wallMap[boulder.start_wall];

        return {
          ...boulder,
          points: ascent.points,
          ascents: ascent.ascents,
          grade: {
            ...grade,
            internal: isAdmin ? gradeMap[boulder.internal_grade] : null,
          },
          holdType: holdTypeMap[boulder.hold_type],
          startWall: startWall,
          endWall: boulder.end_wall ? wallMap[boulder.end_wall] : startWall,
          setters: boulder.setters.map((id) => setterMap[id]),
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
  }, [boulders, ascents, walls, grades, holdTypes, setters]);
}

export { useBoulders, filterPresentOptions };
