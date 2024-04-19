import React, { useState, useEffect } from "react";
import "./sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu_customer, Category } from "./menu";

import logo from "../../assets/images/logo.png";

export const Sidebar = () => {
  // const login = useSelector((state) => state?.permission);
  const isShrinkView = useSelector((state) => state.shrink);
  const dWidth = useSelector((state) => state.dWidth);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [dFromTop, setDFromTop] = useState(0);
  const location = useLocation().pathname;
  const [categoryToActivate, setCategoryToActivate] = useState({});

  const handleCategoryClick = (e, c) => {
    setCategoryToActivate(c);
    findDFromTop(e.target);
  };

  useEffect(() => {
    setActiveCategoryId((prevCategoryId) =>
      prevCategoryId === categoryToActivate?.id ? null : categoryToActivate?.id
    );
  }, [categoryToActivate]);

  function findDFromTop(element) {
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      const elementWidth = rect.width;
      const elementHeight = rect.height;
      const left = rect.left + scrollLeft + elementWidth / 2;
      const top = rect.top + scrollTop + elementHeight / 2;

      if (dWidth) {
        setDFromTop(left);
      } else {
        setDFromTop(top);
      }
    }

    return null;
  }

  return (
    <div className={isShrinkView ? "shrink" : "sidebar_container"}>
      <div style={{ borderBottom: "1px solid #eee4" }}>
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
                onClick={(e) => handleCategoryClick(e, { id: item?.id })}
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
