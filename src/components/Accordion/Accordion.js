import React, {useState, createContext, useContext, useEffect} from "react";
import "./Accordion.css";
import {Upward, Downward} from "./../../index";
import {classNames} from "../../helper/buildClassNames";

const AccordionContext = createContext(null);

export const AccordionItem = ({
                                header,
                                content,
                                itemId,
                                defaultRevealed = false,
                                disabled = false
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
        className={classNames(
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
    <div className={classNames("accordion__item accordion-item", isRevealed ? "accordion__item--revealed" : null, disabled ? "accordion__item--disabled" : null)}>

      <div
        onClick={() => !disabled ? toggle() : null}
        className={classNames("accordion-item__header accordion-item-header", disabled ? "accordion-item__header--disabled" : null)}>
        <span className="accordion-item-header__content">{header}</span>
        {!disabled && <ToggleButton/>}
      </div>

      <div
        className={classNames(
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
      <div className={classNames("accordion t--eta")}>{children}</div>
    </AccordionContext.Provider>
  );
};
