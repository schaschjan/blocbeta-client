import Context from "./Context";

export const getError = (error) => {
    if (error.type === "required") {
        return "Required"
    }

    return error.message;
};

export const resolveBoulder = (boulder) => {
    boulder.startWall = Context.storage.walls.get(boulder.startWall.id);

    if (boulder.endWall) {
        boulder.endWall = Context.storage.walls.get(boulder.endWall.id);
    }

    boulder.grade = Context.storage.grades.get(boulder.grade.id);
    boulder.holdStyle = Context.storage.holdStyles.get(boulder.holdStyle.id);

    for (let [key, tag] of Object.entries(boulder.tags)) {
        boulder.tags[key] = Context.storage.tags.get(tag.id);
    }

    for (let [key, setter] of Object.entries(boulder.setters)) {
        boulder.setters[key] = Context.storage.setters.get(setter.id);
    }
};

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