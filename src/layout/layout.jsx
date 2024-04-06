import React from "react";
import "./layout..css";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sideBar/sidebar";
import { useSelector, useDispatch } from "react-redux";
import { Navbar } from "../components/navbar/navbar";
import { acActive } from "../redux/active";
export const Layout = () => {
  const shrinkMod = useSelector((state) => state.shrink);
  const active = useSelector((state) => state.media);
  const dispatch = useDispatch();

  return (
    <div className="layout">
      <aside
        className={
          shrinkMod ? (active ? `short_aside active` : "short_aside") : "aside"
        }>
        <Sidebar />
      </aside>
      <main
        className={shrinkMod ? "long_main" : "main"}
        onClick={() => dispatch(acActive())}>
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};
