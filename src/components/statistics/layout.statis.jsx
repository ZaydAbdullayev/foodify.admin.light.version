import React, { memo } from "react";
import "./statistics.css";
import { DemoDualAxes, DemoPie } from "./statistics";

export const Statistics = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  return (
    <div className="statistic_box">
      <h1>{user?.user?.username}ning barcha hisobotlar</h1>
      <div className="wrapper_item">
        <div className="row">
          <div className="dashboard-stat red">
            <div className="visual">
              <i className="fa fa-usd"></i>
            </div>
            <div className="details">
              <div className="number">
                <span>312</span>
              </div>
              <div className="desc">Total Profit</div>
            </div>
          </div>
          <div className="dashboard-stat blue" href="#">
            <div className="visual">
              <i className="fa fa-bar-chart-o"></i>
            </div>
            <div className="details">
              <div className="number">
                <span>12.5</span>
              </div>
              <div className="desc">New Order</div>
            </div>
          </div>
          <div className="dashboard-stat hoki" href="#">
            <div className="visual">
              <i className="fa fa-credit-card"></i>
            </div>
            <div className="details">
              <div className="number">
                <span>+ 53%</span>
              </div>
              <div className="desc">Popularity</div>
            </div>
          </div>
          <div className="dashboard-stat purple" href="#">
            <div className="visual">
              <i className="fa fa-comments"></i>
            </div>
            <div className="details">
              <div className="number">
                <span>689</span>
              </div>
              <div className="desc">New Feedback</div>
            </div>
          </div>
        </div>
      </div>
      <div className="statistic_product">
        <DemoPie />
      </div>
      <div className="full_analystic">
        <DemoDualAxes />
      </div>
    </div>
  );
});
