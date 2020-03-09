/* eslint-disable */

import React, { Component } from "react";
import * as moment from "moment";
import { Input, Icon, Drawer, InputAdornment } from "@material-ui/core";
import "./App.css";
import { PinOutlined, PinFilled } from "./pinIcons";
import BackgroundImage from "./BackgroundImage";

import { fetchImage, sendDownloadRequest, getErrorImage } from "./API";

const GOAL_TIMELINES = ["today", "this week", "this month"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      editingName: false,
      time: moment().format("h:mma"),
      showTime: true,
      showName: true,
      showStandardTime: true,
      showZoom: false,
      showNotes: false,
      showGoals: true,
      goalTimelineIndex: 0,
      imageQuery: "",
      savedBackground: false,
      backgroundImage: "",
      // goalWidth: "18vw",
      imageLoading: true,
      monospace: false
    };

    this.clockInterval = undefined;
    this.notesInterval = undefined;
    this.hiddenGoalOneRef = React.createRef();
    this.hiddenGoalTwoRef = React.createRef();
  }

  componentDidMount = async () => {
    chrome.storage.sync.get(null, res => {
      const nextState = { shouldFetchImage: true };
      Object.keys(res).forEach(k => (nextState[k] = res[k]));

      // avoid a new background fetch when a person unselects a starred image
      if (nextState.savedBackground) {
        nextState.shouldFetchImage = false;
      } else {
        // prevent previously saved background from rendering
        nextState.backgroundImage = "";
      }

      this.setState(nextState);
    });

    this.addStorageListener();
    this.startClock();
  };

  addStorageListener() {
    chrome.storage.onChanged.addListener(res => {
      const nextState = {};
      Object.keys(res).forEach(k => (nextState[k] = res[k]["newValue"]));
      this.setState(nextState);
    });
  }

  getChromeStorage = () => {
    const storage = {};
    chrome.storage.sync.get(null, res => {
      Object.keys(res).forEach(k => (storage[k] = res[k]));
    });
    return storage;
  };

  setChromeStorage = update => {
    chrome.storage.sync.set(update);
  };

  startClock = () => {
    this.clockInterval = setInterval(() => {
      const timeFormat = this.state.showStandardTime ? "h:mma" : "HH:mm";
      this.setState({
        time: moment().format(timeFormat)
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.clockInterval);
  }

  onUpdateField = async update => {
    if (Object.keys(update)[0] === "savedBackground") {
      if (update.savedBackground) {
        // unsplash requires a call to update the image's download count when a download type action is called
        this.triggerDownload();
      }
    }

    this.setChromeStorage(update);
  };

  triggerDownload = () => {
    const { downloadLocation } = this.state;
    try {
      sendDownloadRequest(downloadLocation);
    } catch (e) {
      console.log(e);
    }
  };

  getGreeting = () => {
    const currentHour = moment().hour();
    if (currentHour < 12) {
      return "Good morning, ";
    } else if (currentHour < 17) {
      return "Good afternoon, ";
    } else {
      return "Good evening, ";
    }
  };

  formatName = () => {
    const { name, editingName } = this.state;
    if (editingName) {
      return name;
    }
    if (!name) {
      return "";
    }
    return this.getGreeting() + name;
  };

  getImage = async () => {
    if (this.state.savedBackground) {
      return;
    }

    this.setState({ imageLoading: true, backgroundImage: "" });

    const imageQuery = this.state.imageQuery || "";
    const windowWidth = window.innerWidth;

    try {
      const nextState = await fetchImage(imageQuery, windowWidth);
      this.setState(nextState);
    } catch (e) {
      const background_error_image = getErrorImage(windowWidth);
      this.setState(background_error_image);
    }
  };

  handleDrawerOpen = () => {
    // onBlur event is not called when closing the screen,
    // and for a lot of typing, setStorage limits will be exceeded
    this.onUpdateField({ showNotes: true });
    this.notesInterval = setInterval(() => {
      this.onUpdateField({ notes: this.state.notes });
    }, 1000);
  };

  handleDrawerClose = () => {
    this.onUpdateField({ showNotes: false });
    clearInterval(this.notesInterval);
  };

  handleTextFieldSave = e => {
    const { notes, imageQuery, name, goalOne, goalTwo } = this.state;
    if (e.type === "mouseleave") {
      this.onUpdateField({ notes, imageQuery, name, goalOne, goalTwo });
    }

    if (e.type === "keydown") {
      if (
        e.key === "Meta" ||
        e.key === "Alt" ||
        e.key === "Control" ||
        e.key === "Escape"
      ) {
        this.onUpdateField({ notes, imageQuery, name, goalOne, goalTwo });
      }
    }
  };

  calculateGoalWidthAndSave = () => {
    const { goalOne, goalTwo } = this.state;
    let hiddenGoalOneWidth = 0;
    let hiddenGoalTwoWidth = 0;

    if (this.hiddenGoalOneRef.current) {
      hiddenGoalOneWidth = this.hiddenGoalOneRef.current.offsetWidth;
    }
    if (this.hiddenGoalTwoRef.current) {
      hiddenGoalTwoWidth = this.hiddenGoalTwoRef.current.offsetWidth;
    }

    let widestGoal = Math.max(hiddenGoalOneWidth, hiddenGoalTwoWidth);

    // no goals
    if (widestGoal === 0) {
      this.onUpdateField({ goalOne, goalTwo, goalWidth: "18vw" });
      return;
    }

    let widestGoalVW = Math.ceil((widestGoal / window.innerWidth) * 100);

    // small goals
    if (widestGoalVW < 13) {
      widestGoalVW = 13;
    }

    widestGoalVW += 1;

    this.onUpdateField({ goalOne, goalTwo, goalWidth: `${widestGoalVW}vw` });
  };

  render() {
    const {
      backgroundImage,
      photographer,
      profileLink,
      photoLocation,
      photoLink,
      downloadLocation,
      time,
      notes,
      name,
      imageQuery,
      shouldFetchImage,
      savedBackground,
      showName,
      editingName,
      showTime,
      showStandardTime,
      showZoom,
      showNotes,
      showGoals,
      goalOne,
      goalTwo,
      goalOneCompleted,
      goalTwoCompleted,
      goalWidth,
      imageLoading,
      loadedImage,
      monospace
    } = this.state;
    let { goalTimelineIndex } = this.state;

    // prevent a fetch on every render
    if (!savedBackground && shouldFetchImage) {
      this.setState({ shouldFetchImage: false }, () => this.getImage());
    }

    // catch all drawer close events
    if (this.notesInterval && !showNotes) {
      clearInterval(this.notesInterval);
      this.notesInterval = null;
    }

    const backgroundLoading = imageLoading || !backgroundImage;
    const goalTimeline = GOAL_TIMELINES[goalTimelineIndex];

    return (
      <div
        onKeyDown={this.handleTextFieldSave}
        onMouseLeave={this.handleTextFieldSave}
      >
        <BackgroundImage
          backgroundLoading={backgroundLoading}
          backgroundImage={backgroundImage}
          loadedImage={loadedImage}
          showZoom={showZoom}
          setLoadingToFalse={img =>
            this.setState({ imageLoading: false, loadedImage: img })
          }
        />
        <div className="fade-in">
          <div className="upper-left">
            {this.state.savedBackground ? (
              <PinFilled
                className="settings-toggle pin-icon"
                onClick={() =>
                  this.onUpdateField({
                    savedBackground: false
                  })
                }
                viewBox="0 0 24 24"
              />
            ) : (
              <PinOutlined
                viewBox="0 0 24 24"
                className="settings-toggle pin-icon"
                onClick={() =>
                  this.onUpdateField({
                    savedBackground: true,
                    backgroundImage,
                    profileLink,
                    photographer,
                    photoLocation,
                    downloadLocation
                  })
                }
              />
            )}
            <Icon
              className={`settings-toggle reload-icon ${
                backgroundLoading ? "rotate" : "rotate-in"
              }`}
              onClick={this.getImage}
            >
              refresh
            </Icon>
            <Input
              disabled={savedBackground}
              autoComplete={false}
              disableUnderline={true}
              value={imageQuery}
              style={{ color: savedBackground ? "lightgray" : "white" }}
              placeholder="search for..."
              /** shouldn't be updating state directly, but letting the
                storageListener do it results in the curser jumpting to the end of
                the text input regardless of where the user clicked */
              onChange={e => this.setState({ imageQuery: e.target.value })}
              onKeyUp={async e => {
                e.key === "Enter" && this.getImage();
              }}
              inputProps={{ maxLength: 30 }}
            />
          </div>
          <div className="upper-right">
            <div
              className={`settings-toggle settings-text ${showName &&
                "selected"}`}
              onClick={() => this.onUpdateField({ showName: !showName })}
            >
              name
            </div>
            <div
              className={`settings-toggle settings-text ${showTime &&
                "selected"}`}
              onClick={() => this.onUpdateField({ showTime: !showTime })}
            >
              clock
            </div>
            <div
              className={`settings-toggle settings-text ${showStandardTime &&
                showTime &&
                "selected"}`}
              onClick={() =>
                showTime &&
                this.onUpdateField({ showStandardTime: !showStandardTime })
              }
            >
              12hr
            </div>
            <div
              className={`settings-toggle settings-text ${showGoals &&
                "selected"}`}
              onClick={() => this.onUpdateField({ showGoals: !showGoals })}
            >
              goals
            </div>
            <div
              className={`settings-toggle settings-text ${showZoom &&
                "selected"}`}
              onClick={() => this.onUpdateField({ showZoom: !showZoom })}
            >
              fly
            </div>
          </div>
          <div
            className={`fade-in ${
              showGoals ? "content-wrapper-with-goals" : "content-wrapper"
            }`}
          >
            <div className="content">
              {showTime ? (
                <div className="time fade-in">{time}</div>
              ) : (
                <div className="time-hide" />
              )}
              {showName && (
                <Input
                  className={`name ${!editingName && "fade-in"}`}
                  value={this.formatName()}
                  placeholder="What's your name?"
                  onChange={e => this.setState({ name: e.target.value })}
                  disableUnderline={true}
                  onClick={() => this.setState({ editingName: true })}
                  onBlur={() =>
                    this.setState({ editingName: false }, () =>
                      this.onUpdateField({ name })
                    )
                  }
                  classes={{ input: "name" }}
                  fullWidth={true}
                  inputProps={{
                    maxLength: 30,
                    onKeyUp: e => {
                      if (e.key === "Enter") {
                        e.target.blur();
                        this.setState({ editingName: false }, () =>
                          this.onUpdateField({ name })
                        );
                      }
                    }
                  }}
                />
              )}
              {showGoals && (
                <div className="goals-container">
                  <div className="goals-timeline-wrapper">
                    <div
                      className="goals-timeline"
                      style={{ width: goalTimelineIndex < 1 ? "5vw" : "8vw" }}
                      onClick={() => {
                        let { goalTimelineIndex } = this.state;
                        goalTimelineIndex =
                          goalTimelineIndex == 2 ? 0 : (goalTimelineIndex += 1);
                        this.onUpdateField({ goalTimelineIndex });
                      }}
                    >
                      <Input
                        disableUnderline={true}
                        disabled={true}
                        value={goalTimeline}
                      />
                    </div>
                    <div className="goals">
                      <div className="goal">
                        <div className="goal-one">
                          <Input
                            startAdornment={
                              <InputAdornment
                                className="checkbox"
                                position="start"
                                onClick={() => {
                                  (goalOne || goalOneCompleted) &&
                                    this.onUpdateField({
                                      goalOneCompleted: !goalOneCompleted
                                    });
                                }}
                              >
                                {goalOneCompleted ? (
                                  <Icon>check_circle_outline</Icon>
                                ) : (
                                  <Icon>radio_button_unchecked</Icon>
                                )}
                              </InputAdornment>
                            }
                            value={goalOne}
                            placeholder="What are you striving for?"
                            disableUnderline={true}
                            disabled={goalOneCompleted}
                            inputProps={{
                              style: {
                                textDecoration:
                                  goalOneCompleted && "line-through",
                                width: goalWidth || "18vw"
                              },
                              onChange: e =>
                                this.setState({ goalOne: e.target.value }),
                              onKeyUp: e =>
                                e.key === "Enter" && e.target.blur(),
                              onBlur: () => this.calculateGoalWidthAndSave()
                            }}
                          />
                        </div>
                      </div>
                      <div className="goal">
                        <div className="goal-two">
                          <Input
                            startAdornment={
                              <InputAdornment
                                className="checkbox"
                                position="start"
                                onClick={() => {
                                  (goalTwo || goalTwoCompleted) &&
                                    this.onUpdateField({
                                      goalTwoCompleted: !goalTwoCompleted
                                    });
                                }}
                              >
                                {goalTwoCompleted ? (
                                  <Icon>check_circle_outline</Icon>
                                ) : (
                                  <Icon>radio_button_unchecked</Icon>
                                )}
                              </InputAdornment>
                            }
                            value={goalTwo}
                            placeholder="What are you striving for?"
                            disableUnderline={true}
                            disabled={
                              (!goalOne && !goalTwo) || goalTwoCompleted
                            }
                            inputProps={{
                              style: {
                                textDecoration:
                                  goalTwoCompleted && "line-through",
                                width: goalWidth || "18vw"
                              },
                              onChange: e =>
                                this.setState({ goalTwo: e.target.value }),
                              onKeyUp: e =>
                                e.key === "Enter" && e.target.blur(),
                              onBlur: () => this.calculateGoalWidthAndSave()
                            }}
                          />
                        </div>
                      </div>
                      <span ref={this.hiddenGoalOneRef} className="hidden-goal">
                        {goalOne}
                      </span>
                      <span ref={this.hiddenGoalTwoRef} className="hidden-goal">
                        {goalTwo}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="credit">
            <a href={photoLink}>Photo </a>by{" "}
            <a href={`${profileLink}?utm_source=greetme&utm_medium=referral`}>
              {photographer}
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/?utm_source=greetme&utm_medium=referral">
              Unsplash
            </a>
            {photoLocation && `. ${photoLocation}`}
          </div>
        </div>
        <div>
          <div
            className="settings-toggle settings-text notes-open-icon fade-in"
            onClick={this.handleDrawerOpen}
          >
            <Icon>chevron_left_icon</Icon>
          </div>
          <Drawer
            open={showNotes}
            variant="persistent"
            anchor="right"
            PaperProps={{ elevation: 16 }}
            className="drawer"
            style={{ display: !showNotes && "none" }}
            onKeyUp={e =>
              e.key === "Escape" &&
              this.onUpdateField({ showNotes: false, notes: e.target.value })
            }
          >
            <div className="notes-header">
              <div className="notes-close-icon fade-in">
                <Icon onClick={() => this.onUpdateField({ showNotes: false })}>
                  chevron_right_icon
                </Icon>
              </div>
              <div className="notes-title">notes</div>
              <div
                onClick={() => this.onUpdateField({ monospace: !monospace })}
                className={`notes-font-icon settings-text ${monospace &&
                  "selected"}`}
              >
                {"</div>"}
              </div>
            </div>
            <textarea
              className={`notes ${monospace && "monospace"}`}
              onChange={e => this.setState({ notes: e.target.value })}
              onBlur={e => this.onUpdateField({ notes })}
              value={notes}
              autoComplete={false}
              autofocus={true}
              maxLength={102000}
            />
          </Drawer>
        </div>
      </div>
    );
  }
}

export default App;
