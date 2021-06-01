import React, { Fragment, useState } from "react";
import { Button } from "../Button/Button";
import { Counter } from "../Counter/Counter";
import styles from "./BookButton.module.css";

const BookButton = ({
  isFull,
  isDisabled,
  isBlocked,
  timeSlot,
  blockHandler,
  unBlockHandler,
}) => {
  const [quantity, setQuantity] = useState(timeSlot.min_quantity);

  if (isDisabled) {
    return <Button variant="text">disabled</Button>;
  }

  if (isBlocked) {
    return (
      <Button
        variant="primary"
        size="small"
        modifier="inverted"
        onClick={() => unBlockHandler(timeSlot.reservation)}
      >
        Cancel!
      </Button>
    );
  }

  if (isFull) {
    return <Button variant="text">Fully booked</Button>;
  }

  return (
    <Fragment>
      <Counter
        max={
          timeSlot.available < timeSlot.max_quantity
            ? timeSlot.available
            : timeSlot.max_quantity
        }
        min={timeSlot.min_quantity}
        value={quantity}
        onChange={(count) => setQuantity(count)}
      />

      <Button
        className={styles.root}
        variant="primary"
        size="small"
        onClick={() => blockHandler(timeSlot, quantity)}
      >
        Book!
      </Button>
    </Fragment>
  );
};

export { BookButton };
