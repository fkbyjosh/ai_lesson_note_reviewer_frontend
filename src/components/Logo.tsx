
import React from "react";

const LOGO_URL = "/lovable-uploads/87a85e5d-349b-49c1-ba73-7f24c4321fac.png";

const Logo = ({
  className = "h-10 w-auto",
  ariaLabel = "Family Care Schools logo",
}: {
  className?: string;
  ariaLabel?: string;
}) => (
  <img
    src={LOGO_URL}
    alt={ariaLabel}
    className={`object-contain ${className}`}
    style={{ background: "transparent" }}
    loading="lazy"
  />
);

export default Logo;

