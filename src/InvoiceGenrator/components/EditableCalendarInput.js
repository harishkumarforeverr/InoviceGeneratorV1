import React, { FC } from "react";
import { Text } from "@react-pdf/renderer";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import compose from "../styles/compose";
import { DatePicker } from "antd";
const EditableCalendarInput = ({
  className,
  value,
  // selected,
  onChange: onChangeHandler,
  pdfMode,
}) => {
  return (
    <>
      {pdfMode ? (
        <Text style={compose("span " + (className ? className : ""))}>
          {value}
        </Text>
      ) : (
        <DatePicker
          className={"input " + (className ? className : "")}
          // selected={selected}
          // onChange={(date) => {
          //   console.log(date);
          // }}

          onChange={(date, dateString) => {
            console.log(date._d, dateString);
            onChangeHandler(dateString);
          }}
          // onChange={onChange ? (date) => onChange(date) : (date) => null}
          dateFormat="MMM dd, yyyy"
        />
      )}
    </>
  );
};
// const EditableCalendarInput = ({ onChange: OK, selected }) => {
//   return (
//     <DatePicker
// onChange={(date, dateString) => {
//   console.log(date, dateString);
// }}
//       onChange={(date, dateString) => {
//         OK(date);
//       }}
//       // selected={selected}
//     />
//   );
// };
export default EditableCalendarInput;
