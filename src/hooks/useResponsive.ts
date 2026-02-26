import { useEffect, useState } from "react";

const breakpoints = {
  md: 768,
  lg: 1024,
};

export const useResponsive = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < breakpoints.md;
  const isTablet = width >= breakpoints.md && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg;
  const isSmallScreen = width < breakpoints.lg; // ✅ ADD THIS

  return {
    width,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen, // ✅ RETURN IT
  };
};