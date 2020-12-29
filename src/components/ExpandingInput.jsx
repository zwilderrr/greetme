import React, { useState, useEffect, useRef } from "react";
import { BLANK_GOAL_WIDTH } from "../constants";

const styles = {
  position: "absolute",
  bottom: "-100vw",
};

export function ExpandingInput({ value, ...rest }) {
  const blankGoalWidthInVW = BLANK_GOAL_WIDTH + "vw";
  const shadowRef = useRef(null);
  const [width, setWidth] = useState(blankGoalWidthInVW);

  useEffect(() => {
    const nextWidth = getInputWidth(value, shadowRef);
    setWidth(nextWidth);
  }, [value]);

  function getInputWidth(value, shadowRef) {
    if (!value || !shadowRef.current) return blankGoalWidthInVW;

    const viewportWidth = window.innerWidth;
    const shadowGoalWidth = shadowRef.current.getBoundingClientRect().width;
    const widthInVW = (shadowGoalWidth / viewportWidth) * 100 + 2;

    if (widthInVW < BLANK_GOAL_WIDTH) {
      return blankGoalWidthInVW;
    }
    return widthInVW + "vw";
  }

  return (
    <>
      <input style={{ width }} value={value} {...rest} />
      <div ref={shadowRef} style={styles}>
        {value}
      </div>
    </>
  );
}
