import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { useEffect, useState } from "react"




const DatePickerComponent = ({onChange}) => {

const [values, setValues] = useState([]);


    const handleChange = (newvalues) => {
      setValues(newvalues);
      onChange(newvalues);
      console.log(newvalues);
    }

return(
  <DatePicker 
  multiple
  plugins={[
    <DatePanel />
  ]}
  numberOfMonths={3}
  showOtherDays
  value={values}
  onChange={
    handleChange
  }
/>  

) ;
};

export default DatePickerComponent


