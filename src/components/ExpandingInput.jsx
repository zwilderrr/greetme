import React, { useState, useEffect, useRef } from "react";

const shadowDivStyles = {
  position: "fixed",
  bottom: "-50vh",
  left: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
};

export function ExpandingInput({
  value,
  maxWidthInVW,
  minWidthInVW,
  styles: propStyles,
  ...rest
}) {
  const minWidthVW = minWidthInVW + "vw";
  const shadowRef = useRef(null);
  const [width, setWidth] = useState(minWidthVW);

  useEffect(() => {
    const nextWidth = getInputWidth(value, shadowRef);
    setWidth(nextWidth);
  }, [value]);

  function getInputWidth(value, shadowRef) {
    if (!value || !shadowRef.current) return minWidthVW;

    const viewportWidth = window.innerWidth;
    const shadowDivWidth = shadowRef.current.getBoundingClientRect().width;
    const shadowDivWidthInVW = (shadowDivWidth / viewportWidth) * 100 + 2;

    if (shadowDivWidthInVW < minWidthInVW) {
      return minWidthVW;
    }

    return Math.min(shadowDivWidthInVW, maxWidthInVW) + "vw";
  }

  return (
    <>
      <input style={{ width, ...propStyles }} value={value} {...rest} />
      <div ref={shadowRef} style={{ ...propStyles, ...shadowDivStyles }}>
        {value}
      </div>
    </>
  );
}
