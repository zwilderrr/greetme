import React, { useState, useEffect } from "react";
import Background from "./components/Background";
import Content from "./components/Content";
import Notes from "./components/Notes";
import "./App.css";

export default function App() {
  return (
    <>
      <Background />
      <Content />
      <Notes />
    </>
  );
}
