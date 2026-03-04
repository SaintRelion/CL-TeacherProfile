import { useEffect, useState } from "react";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 1023px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");

    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return { isMobile };
}