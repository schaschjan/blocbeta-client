import React from "react";
import db from "./db";

export const getError = (error) => {
    if (error.type === "required") {
        return "Required"
    }

    return error.message;
};

export async function resolveBoulder(boulder) {
    boulder.startWall = await db.walls.get(boulder.startWall.id);

    if (boulder.endWall) {
        boulder.endWall = await db.walls.get(boulder.endWall.id);
    }

    boulder.grade = await db.grades.get(boulder.grade.id);
    boulder.color = await db.holdStyles.get(boulder.color.id);

    for (let [key, tag] of Object.entries(boulder.tags)) {
        boulder.tags[key] = await db.tags.get(tag.id);
    }

    for (let [key, setter] of Object.entries(boulder.setters)) {
        boulder.setters[key] = await db.setters.get(setter.id);
    }
}

export const concatToList = (items, property) => {
    const count = items.length;

    return items.map((item, i) => {
        let value = item[property];

        if (i + 1 < count) {
            return value + ', '
        }

        return value;
    })
};