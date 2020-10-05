import React, {useState, createContext, useContext, useEffect} from "react";
import "./Accordion.css";
import {buildClassNames} from "../../index";
import {Upward, Downward} from "./../../index";

const AccordionContext = createContext(null);

export const AccordionItem = ({
                                header,
                                content,
                                itemId,
                                defaultRevealed = false,
                              }) => {
  const {revealedItem, setRevealedItem} = useContext(AccordionContext);
  const isRevealed = revealedItem === itemId;

  const toggle = () =>
    isRevealed ? setRevealedItem(null) : setRevealedItem(itemId);

  useEffect(() => {
    if (defaultRevealed) {
      setRevealedItem(itemId);
    }
  }, [defaultRevealed]);

  const ToggleButton = () => {
    return (
      <button
        onClick={() => toggle()}
        className={buildClassNames(
          "accordion-item-header__toggle",
          isRevealed
            ? "accordion-item-header__toggle--revealed"
            : "accordion-item-header__toggle--hidden"
        )}
      >
        {isRevealed ? <Upward/> : <Downward/>}
      </button>
    );
  };

  return (
    <div className={buildClassNames("accordion__item accordion-item", isRevealed ? "accordion__item--revealed" : null)}
         onClick={() => toggle()}>
      <div className="accordion-item__header accordion-item-header">
        <span className="accordion-item-header__content">{header}</span>
        <ToggleButton/>
      </div>

      <div
        className={buildClassNames(
          "accordion-item__content",
          isRevealed
            ? "accordion-item__content--revealed"
            : "accordion-item__content--hidden"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export const Accordion = ({children, className}) => {
  const [revealedItem, setRevealedItem] = useState(null);

  return (
    <AccordionContext.Provider
      value={{
        revealedItem,
        setRevealedItem,
      }}
    >
      <div className={buildClassNames("accordion t--eta")}>{children}</div>
    </AccordionContext.Provider>
  );
};
