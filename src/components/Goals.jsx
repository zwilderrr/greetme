import React, { useState, useEffect } from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { ExpandingInput } from "./ExpandingInput";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import {
  CHROME_KEYS,
  MAX_GOAL_WIDTH,
  GOAL_ONE_PLACEHOLDER_WIDTH,
  GOAL_TWO_PLACEHOLDER_WIDTH,
  DURATIONS,
} from "../constants";
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
  }, [goalOneComplete, goalTwoComplete, duration]);

  function handleFormSubmit(e) {
    document.activeElement.blur();
    e && e.preventDefault();
    setEditing(false);
    setChromeStorage(CHROME_KEYS.GOALS, {
      goalOne,
      goalOneComplete,
      goalTwo,
      goalTwoComplete,
      duration,
    });
  }

  function handleToggleDuration() {
    let nextIndex = DURATIONS.indexOf(duration) + 1;
    if (nextIndex === DURATIONS.length) {
      nextIndex = 0;
    }
    setDuration(DURATIONS[nextIndex]);
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
      placeholderWidth: GOAL_ONE_PLACEHOLDER_WIDTH,
      styles: {
        maxWidth: MAX_GOAL_WIDTH,
      },
      show: true,
    },
    {
      onClick: toggleGoalComplete(goalTwo, setGoalTwoComplete),
      onChange: onChange(setGoalTwo),
      value: goalTwo,
      placeholder: "Going for two?",
      disabled: goalTwoDisabled,
      goalCompleted: goalTwoComplete,
      placeholderWidth: GOAL_TWO_PLACEHOLDER_WIDTH,
      styles: {
        maxWidth: MAX_GOAL_WIDTH,
      },
      show: editing || goalTwo || (goalOne && hovering),
    },
  ];

  return (
    <div className="goals-container">
      <div className="duration" onClick={handleToggleDuration}>
        {duration}
      </div>
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
  const radioButtonCssClass = "radio-button" + (!rest.value ? " dim" : "");

  return (
    <div className={goalCssClass}>
      <div
        className={radioButtonCssClass}
        onClick={() => onClick(goalCompleted)}
      >
        <RadioButton />
      </div>
      <ExpandingInput {...rest} />
    </div>
  );
}
