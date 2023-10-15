import React, { useState } from 'react';
import { Input } from 'antd';

const TypingInput = () => {
  const [placeholder, setPlaceholder] = useState('');
  const text = 'Type Something Here...';
  let index = 0;

  const updatePlaceholder = () => {
    setPlaceholder(text.substring(0, index));
    index = (index + 1) % (text.length + 1);
    setTimeout(updatePlaceholder, 150);
  };

  React.useEffect(() => {
    updatePlaceholder();
  }, []);

  return <Input placeholder={placeholder} />;
};

export default TypingInput;
