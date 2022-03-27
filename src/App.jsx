import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./screens/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
