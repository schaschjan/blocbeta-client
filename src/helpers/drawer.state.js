import {useGlobalState} from "./useGlobalState";

export const useDrawerState = () => {
    const [open, toggle] = useGlobalState("ui.drawer");
    const [header, setHeader] = useGlobalState("ui.drawer.header");
    const [content, setContent] = useGlobalState("ui.drawer.content");

    return {
        open,
        header: header,
        content: content,
        close: () => toggle(false),
        toggle: () => toggle(!open),
        setHeader: (data) => setHeader(data),
        setContent: (data) => setContent(data),
    };
};
