import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
}

interface CollapsedState {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

function useWindowWidthAndCollapsed(): [WindowSize, CollapsedState] {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
  });

  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.getItem("collapsed")
      ? localStorage.getItem("collapsed") === "true"
      : false
  );

  const toggleCollapsed = () => {
    setCollapsed((prevState) => !prevState);
    localStorage.setItem("collapsed", (!collapsed).toString());
  };

  useEffect(() => {
    function handleResize() {
      const newWidth = window.innerWidth;
      setWindowSize({ width: newWidth });

      if (newWidth <= 1024) {
        setCollapsed(true);
        localStorage.setItem("collapsed", "true");
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [
    windowSize,
    {
      collapsed,
      toggleCollapsed,
    },
  ];
}

export default useWindowWidthAndCollapsed;
