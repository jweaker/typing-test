import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";
import { useGlobalContext } from "./contexts";

import Invoices from "./screens/Invoices";

export default function App() {
  const { collapsed, isArabic } = useGlobalContext();
  return (
    <div className={"App" + (isArabic ? " direction-rtl" : "")}>
      <SideBar />
      <div
        className={
          collapsed
            ? `routesContainer${isArabic ? "R" : ""} routesContainer-collapsed${
                isArabic ? "R" : ""
              }`
            : `routesContainer${isArabic ? "R" : ""}`
        }
      >
        <Routes>
          <Route path="/" element={<Invoices />} />
        </Routes>
      </div>
    </div>
  );
}
