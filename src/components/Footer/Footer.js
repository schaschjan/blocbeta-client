import React from 'react';
import "./Footer.css";
import HyperLink from "../HyperLink/HyperLink";

export const Footer = () => {
    return (
        <ul className="footer">
            <li>
                <HyperLink href="mailto:support@blocbeta.com">Help</HyperLink>
            </li>
            <li>
                <HyperLink
                    href="https://github.com/blocbeta/blocbeta-client/issues/new?template=Feature_request.md">
                    Request Feature
                </HyperLink>
            </li>
            <li>
                <HyperLink href="https://blocbeta.com">About</HyperLink>
            </li>
            <li>
                <HyperLink href={"github"}>Support the platform</HyperLink>
            </li>
            <li>
                <HyperLink href="https://github.com/blocbeta/blocbeta-client">Github</HyperLink>
            </li>
        </ul>
    )
};