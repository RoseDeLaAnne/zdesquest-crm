import React, { useState } from 'react';
import { Input } from 'antd';

const PhoneInput = () => {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const phoneNumber = input.replace(/\D/g, ''); // Remove all non-numeric characters

    // Check if the phone number is empty or not
    if (phoneNumber.length === 0) {
      setPhone('');
      return;
    }

    // Format the phone number based on the desired pattern
    let formattedPhoneNumber = '+7 (';

    for (let i = 0; i < Math.min(phoneNumber.length, 10); i++) {
      if (i === 3) formattedPhoneNumber += ') ';
      if (i === 6 || i === 8) formattedPhoneNumber += '-';
      formattedPhoneNumber += phoneNumber[i];
    }

    // Update the state with the formatted phone number
    setPhone(formattedPhoneNumber);
  };

  return (
    <Input
      value={phone}
      onChange={handlePhoneChange}
      placeholder="+7 (000) 000-00-00"
      maxLength={16}
    />
  );
};

export default PhoneInput;
