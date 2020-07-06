import React from "react";
import Container from "../../components/Container/Container";
import {Meta} from "../../App";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import Wrapper from "../../components/Wrapper/Wrapper";
import useApi, {api, cacheKeys} from "../../hooks/useApi";
import {Loader} from "../../components/Loader/Loader";
import {alphaSort} from "../../helpers";
import Button from "../../components/Button/Button";

const Setup = () => {

    const {status, data: locations} = useApi(
        cacheKeys.locations,
        api.locations.public
    );

    if (status === "loading") return <Loader/>;

    return (
        <Container>
            <Meta title="Setup your account"/>
            <PageHeader title="Setup your account"/>

            <Wrapper>
                Choose your gym:

                {alphaSort(locations, "name").map(location => {
                    return <span>{location.name}</span>
                })}
            </Wrapper>
        </Container>
    )
};

export default Setup