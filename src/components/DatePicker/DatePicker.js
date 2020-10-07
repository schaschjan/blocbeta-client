import {SingleDatePicker} from "react-dates";
import React, {useState} from "react";
import 'react-dates/lib/css/_datepicker.css';
import "./DatePicker.css"
import {useMediaQuery} from "react-responsive/src";

export default ({onChange, ...rest}) => {

  const isSmall = useMediaQuery({
    query: '(max-width: 1280px)'
  });

  const [selectFocused, setSelectFocused] = useState(false);

  return (
    <SingleDatePicker
      numberOfMonths={1}
      daySize={isSmall ? 40 : 65}
      displayFormat="dddd D.M.YYYY"
      focused={selectFocused}
      onFocusChange={({focused}) => setSelectFocused({focused})}
      {...rest}
    />
  )
};