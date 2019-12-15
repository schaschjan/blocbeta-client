import React from 'react';
import Button from "../components/Button";
import {Input} from "../components/Form";
import Select from "../components/Select";

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
                <Input type="text"/>
                <span className="form-field-help">Help me</span>
            </div>

            <div className="m-1">
                <Input type="text" error="Field is required"/>
                <span className="form-field-help">Help me</span>
            </div>

            <div className="m-1">
                <Select
                    defaultValue={{value: 'chocolate', label: 'Chocolate'}}
                    options={[
                        {value: 'chocolate', label: 'Chocolate'},
                        {value: 'strawberry', label: 'Strawberry'},
                        {value: 'vanilla', label: 'Vanilla'},
                    ]}
                />
            </div>

            <div className="m-1">
                <p>
                    Hi John, your current scores are Lorem ipsum dolor sit amet, <a href="/styleguide">consectetur</a> adipiscing elit, sed
                    do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation
                </p>
            </div>
        </div>
    )
}