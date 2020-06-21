import useApi, {api, cacheKeys} from "./useApi";
import {getOption} from "../helpers";
import {store} from "../store";
import {useEffect, useState} from "react";

const useBoulderFormData = (boulderId) => {
    const [data, setData] = useState({
        status: 'resolving',
        boulder: null,
        walls: null,
        grades: null,
        holdStyles: null,
        tags: null,
        setters: null
    });

    const {status: boulderStatus, data: boulder} = useApi(
        [cacheKeys.boulders, boulderId],
        () => api.boulder.get(boulderId)
    );

    const {status: wallsStatus, data: walls} = useApi(
        cacheKeys.walls,
        api.walls.all
    );

    const {status: gradesStatus, data: grades} = useApi(
        cacheKeys.grades,
        api.grades.all
    );

    const {status: holdStylesStatus, data: holdStyles} = useApi(
        cacheKeys.holdStyles,
        api.holdStyles.all
    );

    const {status: tagsStatus, data: tags} = useApi(
        cacheKeys.tags,
        api.tags.all
    );

    const {status: settersStatus, data: setters} = useApi(
        cacheKeys.setters,
        api.setters.all
    );

    const resolveFormData = (boulder) => {
        boulder.startWall = getOption(
            walls.find((wall) => wall.id === boulder.startWall.id)
        );

        if (boulder.endWall) {
            boulder.endWall = getOption(
                walls.find((wall) => wall.id === boulder.endWall.id)
            );
        }

        boulder.setters = boulder.setters.map((boulderSetter) => {
            return getOption(
                setters.find((setter) => setter.id === boulderSetter.id),
                "username"
            );
        });

        boulder.tags = boulder.tags.map((boulderTag) => {
            return getOption(tags.find((tag) => tag.id === boulderTag.id));
        });

        boulder.grade = getOption(
            grades.find((grade) => grade.id === boulder.grade.id)
        );
        boulder.holdStyle = getOption(
            holdStyles.find((holdStyle) => holdStyle.id === boulder.holdStyle.id)
        );

        boulder.status = getOption(
            store.states.find((state) => boulder.status === state.name)
        );

        return boulder
    };

    const loading = [
        boulderStatus,
        wallsStatus,
        gradesStatus,
        holdStylesStatus,
        tagsStatus,
        settersStatus,
    ].includes("loading");

    useEffect(() => {
        if (loading) {
            return
        }

        setData({
            status: 'resolved',
            boulder: resolveFormData(boulder),
            walls,
            grades,
            holdStyles,
            tags: tags,
            setters: setters
        })

    }, [loading]);

   return data
};

export default useBoulderFormData