import React, { useState } from "react";
import { DatePicker, Space } from "antd";

import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const App: React.FC = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleDateTimeChange = (value) => {
    if (value) {
      setSelectedDateTime(value.format("DD.MM.YYYY HH:mm"));
    } else {
      setSelectedDateTime(null);
    }
  };

  return (
    <div style={{'padding': '20px'}}>
      <DatePicker
        showTime
        format="DD.MM.YYYY HH:mm"
        defaultValue={dayjs().hour(9).startOf('hour')} 
        minuteStep={15}
      />
    </div>
  );
};

export default App;
