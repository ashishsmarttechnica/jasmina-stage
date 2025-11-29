import { useState, useEffect } from "react";

export default function useTabUnderlineAnimation(activeTab, peopleRef, companyRef) {
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [hoverStyle, setHoverStyle] = useState({
    width: 0,
    left: 0,
    opacity: 0,
  });

  useEffect(() => {
    const updateUnderline = () => {
      const activeButton = activeTab === "people" ? peopleRef.current : companyRef.current;
      if (activeButton) {
        const { width, left } = activeButton.getBoundingClientRect();
        const parentLeft = activeButton.parentElement?.getBoundingClientRect().left || 0;
        setUnderlineStyle({
          width,
          left: left - parentLeft,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeTab, peopleRef, companyRef]);

  const handleHover = (buttonRef) => {
    if (buttonRef.current) {
      const { width, left } = buttonRef.current.getBoundingClientRect();
      const parentLeft = buttonRef.current.parentElement?.getBoundingClientRect().left || 0;
      setHoverStyle({
        width,
        left: left - parentLeft,
        opacity: 1,
      });
    }
  };

  const handleHoverLeave = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return { underlineStyle, hoverStyle, handleHover, handleHoverLeave };
}
