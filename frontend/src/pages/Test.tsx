// import React, { useState } from 'react';
// import { Input } from 'antd';

// const TypingInput = () => {
//   const [placeholder, setPlaceholder] = useState('');
//   const text = 'Type Something Here...';
//   let index = 0;

//   const updatePlaceholder = () => {
//     setPlaceholder(text.substring(0, index));
//     index = (index + 1) % (text.length + 1);
//     setTimeout(updatePlaceholder, 150);
//   };

//   React.useEffect(() => {
//     updatePlaceholder();
//   }, []);

//   return <Input placeholder={placeholder} />;
// };

// export default TypingInput;

import React, { useState } from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

const TimePickerComponent = () => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeSelect = (time) => {
    console.log(time)
    // You can perform any operations on the selected time before setting it
    const newTime = time.clone(); // Cloning the time to avoid mutation
    // Manipulate newTime as needed
    setSelectedTime(time);
  };

  return (
    <div style={{ width: 200 }}>
      <TimePicker
        onSelect={handleTimeSelect}
        value={selectedTime}
      />
    </div>
  );
};

export default TimePickerComponent;
