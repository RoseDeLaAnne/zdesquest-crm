import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const TypingAnimationInput = ({ titles, speed, waitingTime }) => {
    const [placeholder, setPlaceholder] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let placeholderContent = '';
        let i = 0;

        const reverseTyping = () => {
            if (placeholderContent.length > 0) {
                placeholderContent = placeholderContent.slice(0, -1);
                setPlaceholder(placeholderContent + '|');
                setTimeout(reverseTyping, speed);
            } else {
                setTimeout(() => {
                    setPlaceholder('');
                    setIsTyping(true);
                }, waitingTime); // Start typing again after delay
            }
        };

        const typing = () => {
            const currentTitle = titles[currentIndex];
            if (i < currentTitle.length) {
                placeholderContent += currentTitle.charAt(i);
                setPlaceholder(placeholderContent + '|');
                i++;
                setTimeout(typing, speed);
            } else {
                setTimeout(() => {
                    setIsTyping(false);
                    setTimeout(reverseTyping, waitingTime); // Start reverse typing after delay
                }, waitingTime); // Wait before starting reverse typing
            }
        };

        if (isTyping) {
            typing();
        } else {
            setCurrentIndex((currentIndex + 1) % titles.length); // Cycle through titles
        }
    }, [titles, speed, waitingTime, isTyping, currentIndex]);

    return <Input className="animated-input" placeholder={placeholder} />;
};

export default TypingAnimationInput;
