
import React, { useEffect, useRef, useState } from "react";
import { removeBackground, loadImage } from "@/utils/image/removeBackground";

const LOGO_URL = "/lovable-uploads/fe17b3fb-d2e8-4bf8-a7d2-95b2aa5c2ece.png";

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
    return () => { isMounted = false };
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
