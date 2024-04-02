import React, { memo } from "react";
import "./statistics.css";
import { DemoDualAxes, DemoPie } from "./statistics";
import { useFetchDataQuery } from "../../service/fetch.service";

export const Statistics = memo(() => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { data = [] } = useFetchDataQuery({
    url: `/generate/ordersReport/${user?.id}/2024-01-01/2024-04-03`,
    tags: ["report"],
  });
  return (
    <div className="statistic_box">
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
        <DemoPie data={data?.data || []} />
      </div>
      <div className="full_analystic">
        <DemoDualAxes />
      </div>
    </div>
  );
});
