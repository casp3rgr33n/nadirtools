"use client";

import React, { useEffect, useRef } from "react";

interface AdUnitProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "horizontal" | "vertical" | "rectangle";
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdUnit({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style,
  className = ""
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (adRef.current && !adRef.current.dataset.adLoaded) {
        // Mark as loaded to prevent duplicate pushes
        adRef.current.dataset.adLoaded = "true";
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  // Use a default minHeight to prevent Cumulative Layout Shift (CLS)
  // 250px is a standard minimum for AdSense auto/rectangle units
  const adStyle: React.CSSProperties = {
    display: "block",
    minHeight: "250px",
    background: "rgba(255, 255, 255, 0.02)", // Subtle placeholder while loading
    borderRadius: "8px",
    overflow: "hidden",
    ...style
  };

  // We use placeholder client ID until the user configures theirs.
  const adClientId = "ca-pub-YOUR_ADSENSE_ID_HERE";

  return (
    <div className={`ad-unit-wrapper ${className}`} style={{ width: "100%", margin: "1.5rem 0" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={adClientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
