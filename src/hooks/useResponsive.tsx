import { useEffect, useState } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

export function useResponsive() {
  const getDevice = (): DeviceType => {
    const width = window.innerWidth;
    if (width <= 767) return "mobile";
    if (width <= 1023) return "tablet";
    return "desktop";
  };

  const [device, setDevice] = useState<DeviceType>(getDevice);

  useEffect(() => {
    const handleResize = () => setDevice(getDevice());

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    device,
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
  };
}