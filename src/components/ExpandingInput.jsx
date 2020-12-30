import React, { useState, useEffect, useRef } from "react";

const shadowDivStyles = {
  position: "fixed",
  bottom: "-50vh",
  left: 0,
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const inputStyles = {
  textOverflow: "ellipsis",
};

export function ExpandingInput({
  value,
  placeholderWidthInVW,
  styles: propStyles,
  ...rest
}) {
  const shadowRef = useRef(null);
  const [width, setWidth] = useState();

  useEffect(() => {
    const nextWidth = getInputWidth(value, shadowRef);
    setWidth(nextWidth);
  }, [value]);

  function getInputWidth(value, shadowRef) {
    if (!value || !shadowRef.current) return placeholderWidthInVW + "vw";

    const viewportWidth = window.innerWidth;
    const shadowDivWidth = shadowRef.current.getBoundingClientRect().width;
    const shadowDivWidthInVW = (shadowDivWidth / viewportWidth) * 100 + 2;

    return shadowDivWidthInVW + "vw";
  }

  return (
    <>
      <input
        style={{ ...inputStyles, ...propStyles, width }}
        value={value}
        {...rest}
      />
      <div ref={shadowRef} style={{ ...propStyles, ...shadowDivStyles }}>
        {value}
      </div>
    </>
  );
}
