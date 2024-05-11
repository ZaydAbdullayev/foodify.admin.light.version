import React from "react";
import "./sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu_customer } from "./menu";

import logo from "../../assets/images/logo.png";

export const Sidebar = () => {
  // const login = useSelector((state) => state?.permission);
  const isShrinkView = useSelector((state) => state.shrink);
  const location = useLocation().pathname;

  return (
    <div className={isShrinkView ? "shrink" : "sidebar_container"}>
      <div style={{ borderBottom: "1px solid var(--cl48)" }}>
        {isShrinkView ? (
          <img src={logo} alt="" />
        ) : (
          <div>
            <img src={logo} alt="" />
            Foodify
          </div>
        )}
      </div>
      <ul className="menu_box">
        {Menu_customer?.map((item) => {
          return (
            <div
              key={item?.id}
              className="menu_container"
              style={item?.permission ? {} : { display: "none" }}>
              <Link
                to={item.path}
                className={
                  location.startsWith(item.path)
                    ? "menu_box_item active_menu"
                    : "menu_box_item"
                }
                aria-label="links section">
                <span>{item?.icon}</span>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
