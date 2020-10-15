import React, {useState, useEffect} from "react"
import "./Couter.css"
import {Plus} from "../Icon/Plus";
import {Minus} from "../Icon/Minus";
import {buildClassNames} from "../../index";

export const Counter = ({onChange, max, min = 1, value = 1, ...rest}) => {
  const [count, setCount] = useState(value);

  useEffect(() => {
    onChange(count);
  }, [count]);

  return (
    <div className="counter">
      <button className={buildClassNames("counter__button", count <= min ? "counter__button--disabled" : null)}
              onClick={() => {
                if (count >= min) {
                  setCount(count - 1)
                }
              }}>
        <Minus/>
      </button>

      <input className="counter__input"
             max={max}
             min={min}
             value={count}
             {...rest}/>

      <button className={buildClassNames("counter__button", count >= max ? "counter__button--disabled" : null)}
              onClick={() => {
                if (count <= max) {
                  setCount(count + 1)
                }
              }}>
        <Plus/>
      </button>
    </div>
  )
};