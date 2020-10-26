import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import './index.css';

if (process.env.NODE_ENV !== "development") {
  // Sentry.init({
  //   dsn: "https://5c2038be7efd46a1b62ccba060e777a3@o456197.ingest.sentry.io/5448905",
  //   integrations: [
  //     new Integrations.BrowserTracing(),
  //   ],
  //   tracesSampleRate: 1.0,
  // });
}

export default Sentry.withProfiler(App);

ReactDOM.render(<App/>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// components
export {default as Label} from "./components/Label/Label"
export {default as Header} from "./components/Header/Header"
export {default as NavItem} from "./components/NavItem/NavItem"
export {default as FormElement} from "./components/FormElement/FormElement"
export {default as Button} from "./components/Button/Button"
export {default as Input} from "./components/Input/Input"
export {default as Select} from "./components/Select/Select"
export {default as FormRow} from "./components/FormRow/FormRow"
export {Accordion, AccordionItem} from "./components/Accordion/Accordion"

// icons
export {default as Burger} from "./components/Icon/Burger"
export {default as Downward} from "./components/Icon/Downward"
export {default as Upward} from "./components/Icon/Upward"

// hooks
export {useForm, composeFormElement} from "./hooks/useForm"
export {default as usePersistentState} from "./hooks/usePersistentState"
