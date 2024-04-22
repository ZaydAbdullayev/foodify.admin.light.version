import React from "react";
import "./universal.css";
import { DateRange } from "../../components/statistics/layout.statis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const ReportMain = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const { date } = useSelector((state) => state.uSearch);
  const navigate = useNavigate();
  const sd = ["Asds", "fasfs", "fasfs", "fasfs"];
  const reportsD = [
    {
      name: "Foyda va Zarar hisoboti",
      type: "profit_loss",
      path: `/report/Foyda%20va%20Zarar%20hisoboti/view/profit_loss/get/profitLoss/${user?.id}/?start=${date?.start}&&end=${date?.end}`,
    },
    {
      name: "Pul oqimi hisoboti",
      type: "cashflow",
      path: ``,
    },
    {
      name: "Buyurtmalar hisoboti",
      type: "orders",
      path: `/report/Buyurtmalar%20hisoboti/view/orders/get/resOrders/${user?.id}?start=${date?.start}&&end=${date?.end}`,
    },
    {
      name: "Bo'limlar hisoboti",
      type: "department",
      path: `/report/Bo'limlar%20hisoboti/view/department/get/departmentSales/${user?.id}?start=${date?.start}&&end=${date?.end}`,
    },
  ];
  return (
    <div className="w100 df flc report-conatiner">
      <div className="w100 df aic jcsb report-title">
        <p>Reports</p>
        {DateRange()}
      </div>
      <div className="w100 df aic reports-box">
        {reportsD?.map((rep, ind) => {
          return (
            <label
              className="df aic jcsb report-item"
              key={`${rep?.type}_${ind}`}
              onClick={() => navigate(rep?.path)}>
              <p>{rep?.name}</p>
            </label>
          );
        })}
      </div>
    </div>
  );
};
