import React from "react";
import {Meta} from "../App";
import {PageHeader} from "../components/PageHeader/PageHeader";

export default function NotFound(props) {
    return (
        <div className="container">
            <Meta title='Not found'/>
            <PageHeader title='Not found'/>
        </div>
    );
}
