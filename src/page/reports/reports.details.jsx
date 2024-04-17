import React from "react";
import "./universal.css";
import { DateRange } from "../../components/statistics/layout.statis";
import { useLocation, useParams } from "react-router-dom";
import { useFetchDataQuery } from "../../service/fetch.service";

export const ReportDetails = () => {
  const location = useLocation();
  const { title, resId, method, type, label } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const { data: details = {} } = useFetchDataQuery({
    url: `${method}/${type}/${resId}/${start}/${end}`,
    tags: ["report"],
  });
  return (
    <div className="w100 df flc report-conatiner">
      <div className="w100 df aic jcsb report-title">
        <p>{title}</p>
        {DateRange()}
      </div>
      <div className="w100 df aic reports-box">
        {labels?.[label]?.map((hint) => {
          return (
            <>
              {hint?.name && (
                <p
                  className="df aic report-item info"
                  style={{ width: "100%" }}>
                  {hint?.name}
                </p>
              )}
              {(label !== "orders"
                ? details?.data?.[hint?.type]
                : details?.innerData
              )?.map((rep, ind) => {
                return (
                  <label
                    className={`df aic ${
                      label === "orders" ? "flc" : "jcsb"
                    }  report-item ${rep?.st || ""}`}
                    key={`${rep?.type}_${ind}`}>
                    {label === "orders" ? (
                      <>
                        <p className="w100 df aic jcsb">
                          #{rep?.id}
                          <span>{rep?.payment_type}</span>
                        </p>
                        <p className="w100 df aic jcsb">
                          ochilgan vaqti
                          <span>{rep?.receivedAt}</span>
                        </p>
                        <p className="w100 df aic jcsb">
                          yopilgan vaqti
                          <span>{rep?.closed_at}</span>
                        </p>
                        <p className="w100 df aic jcsb">
                          offitsant
                          <span>{rep?.worker_name}</span>
                        </p>
                        <p className="w100 df aic jcsb">
                          miqdori
                          <span>{rep?.total}</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p>{rep?.type}</p>
                        <span>
                          {rep?.value
                            ?.toString()
                            ?.replace(/\d(?=(\d{3})+$)/g, "$& ") || 0}
                        </span>
                      </>
                    )}
                  </label>
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
};

const labels = {
  profit_loss: [
    {
      type: "profits",
    },
    {
      name: "Operativ faoliyatlar",
      type: "expense",
    },
  ],
  cashflow: [],
  orders: [],
  department: [],
};
