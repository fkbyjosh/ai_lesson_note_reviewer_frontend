
import React, { useEffect, useRef, useState } from "react";
import { removeBackground, loadImage } from "@/utils/image/removeBackground";

// Update to the new logo source from the uploaded image
const LOGO_URL = "/lovable-uploads/4debb91c-8b45-4adc-9339-a1ba21d79fd2.png";

const Logo = ({
  className = "h-10 w-auto",
  ariaLabel = "Family Care Schools logo",
}: {
  className?: string;
  ariaLabel?: string;
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  // Only run client-side
  useEffect(() => {
    let isMounted = true;
    const doRemove = async () => {
      setProcessing(true);
      try {
        const response = await fetch(LOGO_URL);
        const blob = await response.blob();
        const img = await loadImage(blob);
        const transparentBlob = await removeBackground(img);
        if (isMounted) {
          const url = URL.createObjectURL(transparentBlob);
          setSrc(url);
        }
      } catch (e) {
        setSrc(LOGO_URL); // fallback to original
      } finally {
        setProcessing(false);
      }
    };
    doRemove();
    return () => {
      isMounted = false;
    };
  }, []);

  if (processing && !src) {
    return (
      <div className={`bg-cream rounded-full ${className} flex items-center justify-center`}>
        <span className="sr-only">{ariaLabel}</span>
        <div className="animate-pulse w-8 h-8 bg-gray-200 rounded-full" />
      </div>
    );
  }
  return (
    <img
      src={src ?? LOGO_URL}
      alt={ariaLabel}
      className={`object-contain ${className}`}
      style={{ background: "transparent" }}
      loading="lazy"
    />
  );
};

export default Logo;

