export function resolveGrade(id) {
    return window.grades[id]
}

export function resolveColor(id) {
    return window.colors[id]
}

export function resolveWall(id) {
    return window.walls[id]
}

export function resolveTag(id) {
    return window.tags[id]
}

export function resolveSetter(id) {
    return window.setters[id]
}

export function getBoulders() {

    const boulders = Object.values(window.boulders);

    for (let boulder of boulders) {
        const grade = resolveGrade(boulder.grade.id);
        const color = resolveColor(boulder.color.id);
        const startWall = resolveWall(boulder.startWall.id);

        if (!boulder.endWall) {
            boulder.endWall = null;
        } else {
            boulder.endWall = resolveWall(boulder.endWall.id);
        }

        const tags = [];

        for (let tag of boulder.tags) {
            tags.push(resolveTag(tag.id))
        }

        const setters = [];

        for (let setter of boulder.setters) {
            setters.push(resolveSetter(setter.id))
        }

        boulder.grade = grade.name;
        boulder.color = color.name;
        boulder.startWall = startWall;
        boulder.tags = tags;
        boulder.setters = setters;

        for (let tag of boulder.tags) {
            resolveTag(tag.id);
        }
    }

    return boulders
}