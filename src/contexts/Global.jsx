import React, { useContext, createContext, useState, useEffect } from "react";
const MyContext = createContext({ collapsed: false, setCollapsed: () => {} });
export function useGlobalContext() {
  return useContext(MyContext);
}
export function GlobalContextProvider({ children }) {
  // const [connection, setConnection] = useState();
  const [collapsed, setCollapsed] = useState(false);
  //eslint-disable-next-line
  const [isArabic, setIsArabic] = useState(true);
  useEffect(() => {}, []);

  const value = { collapsed, setCollapsed, isArabic };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
