import React, { useState, useEffect } from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

import { ExpandingInput } from "./ExpandingInput";

import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import { CHROME_KEYS } from "../constants";
import { useSkipFirstRender } from "../hooks";

import "./Goals.css";

export default function Goals() {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const [goalOne, setGoalOne] = useState("");
  const [goalOneComplete, setGoalOneComplete] = useState(false);

  const [goalTwo, setGoalTwo] = useState("");
  const [goalTwoComplete, setGoalTwoComplete] = useState(false);

  const [duration, setDuration] = useState("today");

  useEffect(() => {
    async function fetchData() {
      const {
        goalOne,
        goalOneComplete,
        goalTwo,
        goalTwoComplete,
        duration,
      } = await getChromeStorage(CHROME_KEYS.GOALS);
      setGoalOne(goalOne);
      setGoalOneComplete(goalOneComplete);
      setGoalTwo(goalTwo);
      setGoalTwoComplete(goalTwoComplete);
      setDuration(duration);
    }
    fetchData();
  }, []);

  useSkipFirstRender(() => {
    handleFormSubmit();
  }, [goalOneComplete, goalTwoComplete]);

  function handleFormSubmit(e) {
    document.activeElement.blur();
    e && e.preventDefault();
    setEditing(false);
    setChromeStorage(CHROME_KEYS.GOALS, {
      goalOne,
      goalOneComplete,
      goalTwo,
      goalTwoComplete,
    });
  }

  const goalOneDisabled = goalOneComplete;
  const goalTwoDisabled = (!goalOne && !goalTwo) || goalTwoComplete;

  // fn that takes a goal and a setState fn, and returns a fn
  // that accepts a boolean. That fn checks to make sure there's
  // a goal to toggle, and if so, calls the setState fn
  const toggleGoalComplete = (goal, setter) => bool => goal && setter(!bool);
  const onChange = setter => e => setter(e.target.value);

  const goals = [
    {
      onClick: toggleGoalComplete(goalOne, setGoalOneComplete),
      onChange: onChange(setGoalOne),
      value: goalOne,
      placeholder: "What are you striving for?",
      disabled: goalOneDisabled,
      goalCompleted: goalOneComplete,
      show: true,
    },
    {
      onClick: toggleGoalComplete(goalTwo, setGoalTwoComplete),
      onChange: onChange(setGoalTwo),
      value: goalTwo,
      placeholder: "Going for two?",
      disabled: goalTwoDisabled,
      goalCompleted: goalTwoComplete,
      show: editing || hovering || goalOne || goalTwo,
    },
  ];

  return (
    <div className="goals-container">
      <div className="duration">{duration}</div>
      <div className="goals">
        <form
          // calling handleFormSubmit directly for textual changes
          // (instead of relying on useEffect) to avoid too many
          // consecutive calls to chrome storage
          autoComplete={false}
          onSubmit={handleFormSubmit}
          onBlur={handleFormSubmit}
          onFocus={() => setEditing(true)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {goals.map(g => (
            <Goal {...g} />
          ))}
          {/* forms with more than one input el need a submit button for 'enter' to trigger onSubmit */}
          <button style={{ display: "none" }} type="submit" />
        </form>
      </div>
    </div>
  );
}

function Goal({ onClick, goalCompleted, show, ...rest }) {
  const RadioButton = goalCompleted
    ? CheckCircleOutlineIcon
    : RadioButtonUncheckedIcon;

  const goalCssClass = show ? "goal" : "goal hidden";

  return (
    // second goal is always showing when there's a first goal
    // should only show on hover
    // gut then the placeholder-show selector is going to expand
    // the div if goal one is less than 29vw
    <div className={goalCssClass}>
      <div onClick={() => onClick(goalCompleted)}>
        <RadioButton />
      </div>
      <ExpandingInput {...rest} />
    </div>
  );
}
