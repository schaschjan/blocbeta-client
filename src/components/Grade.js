import React from 'react';
import {resolveGrade} from "../Helpers";

export default function Grade(props) {

    const grade = resolveGrade(props.id);

    return <div style={{color: grade.color}}>{grade.name}</div>
}