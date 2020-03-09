import {useGlobalState} from "./useGlobalState";

export const useDrawerState = () => {
    const [open, toggle] = useGlobalState("ui.drawer");
    const [content, setContent] = useGlobalState("ui.drawer.content");

    return {
        open,
        content: content,
        close: () => toggle(false),
        toggle: () => toggle(!open),
        setContent: (data) => setContent(data),
    };
};
