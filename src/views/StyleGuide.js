import React from 'react';
import Button from "../components/Button";
import {Field} from "../components/Form";

export default function StyleGuide() {

    return (
        <div>
            <div className="m-1">
                <Button type="primary">
                    Primary
                </Button>
            </div>

            <div className="m-1">
                <Button type="primary" disabled>
                    Primary
                </Button>
            </div>

            <div className="m-1">
                <Button type="secondary">
                    Secondary
                </Button>
            </div>

            <div className="m-1">
                <Button type="secondary" disabled>
                    Secondary
                </Button>
            </div>

            <div className="m-1">
                <Field type="text"/>
            </div>
        </div>
    )
}