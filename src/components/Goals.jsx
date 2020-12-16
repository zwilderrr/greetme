import React, { useState, useEffect } from "react";
import { setChromeStorage, getChromeStorage } from "../api/chrome-api";
import { CHROME_KEYS } from "../constants";

import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";

import "./Goals.css";

export default function Goals() {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  const [goalOne, setGoalOne] = useState("");
  const [goalOneComplete, setGoalOneComplete] = useState(undefined);

  const [goalTwo, setGoalTwo] = useState("");
  const [goalTwoComplete, setGoalTwoComplete] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      const {
        goalOne,
        goalOneComplete,
        goalTwo,
        goalTwoComplete,
      } = await getChromeStorage(CHROME_KEYS.GOALS);
      setGoalOne(goalOne);
      setGoalOneComplete(goalOneComplete);
      setGoalTwo(goalTwo);
      setGoalTwoComplete(goalTwoComplete);
    }
    fetchData();
  }, []);

  // using useEffect to trigger formSubmit for goalComplete toggle,
  // but not for goal text changes, so that I can await the
  // setGoalComplete update. In the case of goal text changes,
  // there's enough time between onChange and onSubmit for
  // handleFormSubmit to have the most recent state values
  useEffect(() => {
    // prevent submitting form with default state values
    if (goalOneComplete !== undefined) {
      handleFormSubmit();
    }
  }, [goalOneComplete, goalTwoComplete]);

  function handleFormSubmit(e) {
    document.activeElement.blur();
    e && e.preventDefault();
    setChromeStorage(CHROME_KEYS.GOALS, {
      goalOne,
      goalOneComplete,
      goalTwo,
      goalTwoComplete,
    });
    setEditing(false);
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
    <>
      <form
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
        {/* forms with more than one input el need a submit button for onSubmit to work */}
        <button style={{ display: "none" }} type="submit" />
      </form>
    </>
  );
}

function Goal({ onClick, goalCompleted, show, ...rest }) {
  const RadioButton = goalCompleted
    ? CheckCircleOutlineIcon
    : RadioButtonUncheckedIcon;

  const cssClass = show ? "goal" : "goal hidden";

  return (
    <div className={cssClass}>
      <div onClick={() => onClick(goalCompleted)}>
        <RadioButton />
      </div>
      <input {...rest} />
    </div>
  );
}
