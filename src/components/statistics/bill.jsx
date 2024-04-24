import React, { useEffect } from "react";
import "./statistics.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { LineChartC } from "./statistics";
import { Collapse, theme } from "antd";
import { useFetchDataQuery } from "../../service/fetch.service";

import { IoIosArrowForward } from "react-icons/io";
import { DonutChart } from "./statistics";
import { GoDotFill } from "react-icons/go";
import { MdTableBar } from "react-icons/md";
import { DataBill, DateRange } from "./layout.statis";
import { acAddBill } from "../../redux/active";
import { acNavStatus } from "../../redux/navbar.status";
import { IoMdArrowDropright } from "react-icons/io";
import { CalculateTotalQuantity } from "../../service/calc.service";
import { CalculateTotalCH } from "../../service/calc.service";

export const BillsReport = () => {
  const { data = [], billsData = [], defaultPie } = DataBill();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w100 df flc bills-report">
      <div className="w100 df aic jcc bills-report-header">
        <DonutChart data={defaultPie} billsData={billsData} hint={"total"} />
        <div className="df flc item-info">
          {data?.every((item) => item?.amount === 0) ? (
            <p>
              <GoDotFill style={{ color: "#353535" }} />
              <span>Ma'lumot yo'q</span>
            </p>
          ) : (
            data?.map((item) => {
              return (
                <p
                  key={`${item?.type}_${item?.id}`}
                  style={{ opacity: item?.amount <= 0 ? 0.2 : 1 }}>
                  <GoDotFill style={{ color: item?.cl }} />
                  <b>{item?.type}</b>
                </p>
              );
            })
          )}
        </div>
      </div>
      <div className="w100 df aic bills-report-box">
        {billsData?.map((bill) => {
          const time = new Date(bill?.receivedAt);
          const close =
            bill?.closed_at !== "0000-00-00" ? new Date(bill?.closed_at) : null;
          return (
            <div
              className="df flc jcc bills-item"
              onClick={() => {
                dispatch(acAddBill(bill));
                navigate(
                  `/one-bill-report/${bill?.id}?title=#${bill?.id}%20-%20buyurtma`
                );
              }}
              key={bill?.id}>
              <div className="bills-item__title">
                <b>#{bill?.id?.split("_")[0]}</b>
                <b>
                  {bill?.total?.toString()?.replace(/\d(?=(\d{3})+$)/g, "$& ")}
                </b>
              </div>
              <div className="bills-item__value">
                <span>
                  {`${time?.toLocaleDateString("us-US", {
                    day: "numeric",
                    month: "long",
                  })}`}
                  , {time?.getFullYear()},{" "}
                  {time.getHours() === 0
                    ? `0${time.getHours()}`
                    : time.getHours()}
                  :
                  {time.getMinutes() === 0
                    ? `0${time.getMinutes()}`
                    : time.getMinutes()}{" "}
                  {close &&
                    `- ${
                      close.getHours() === 0
                        ? `0${close.getHours()}`
                        : close.getHours()
                    }:${
                      close.getMinutes() === 0
                        ? `0${close.getMinutes()}`
                        : close.getMinutes()
                    }`}
                </span>
                <span>{bill?.worker_name}</span>
              </div>
              <i>
                <IoIosArrowForward />
              </i>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BillReportById = () => {
  const bills = useSelector((state) => state?.activeB);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(acNavStatus([0]));
  }, [dispatch]);
  const time = new Date(bills?.receivedAt);
  const close =
    bills?.closed_at !== "0000-00-00" ? new Date(bills?.closed_at) : null;

  const parsedD = bills?.product_data ? JSON?.parse(bills?.product_data) : [];
  const ingD = Object.values(parsedD)?.[0]?.pd;

  console.log("pd", parsedD, ingD);
  return (
    <div className="w100 df aic flc single-bill-report">
      <div className="w100 df aic _bill-info">
        <label>
          <small>Buyurtma raqami</small>
          <p>#{bills?.id}</p>
        </label>
        <label>
          <small>Vaqti</small>
          <p>
            {`${time?.toLocaleDateString("us-US", {
              day: "numeric",
              month: "long",
            })}`}
            , {time?.getFullYear()},{" "}
            {time.getHours() === 0 ? `0${time.getHours()}` : time.getHours()}:
            {time.getMinutes() === 0
              ? `0${time.getMinutes()}`
              : time.getMinutes()}{" "}
            {close &&
              `- ${
                close.getHours() === 0
                  ? `0${close.getHours()}`
                  : close.getHours()
              }:${
                close.getMinutes() === 0
                  ? `0${close.getMinutes()}`
                  : close.getMinutes()
              }`}
          </p>
        </label>
        <label>
          <small>Offitsant</small>
          <p>{bills?.worker_name}</p>
        </label>
        <label>
          <small>Stoll/Xona</small>
          <p className="df aic" style={{ gap: "5px" }}>
            {bills?.t_location} <MdTableBar /> {bills?.table_name}
          </p>
        </label>
        <label>
          <small>Chegirma</small>
          <p>{bills?.discount}%</p>
        </label>
        <label>
          <small>Service</small>
          <p>{bills?.service}%</p>
        </label>
        <label>
          <small>Jami summa</small>
          <p>{bills?.total?.toString()?.replace(/\d(?=(\d{3})+$)/g, "$& ")}</p>
        </label>
      </div>
      <div className="w100 df aic _bill-details">
        {ingD?.map((product, ind) => {
          return (
            <div className="df aic _details_item" key={`${product?.id}_${ind}`}>
              <pre>
                <p style={{ textTransform: "capitalize" }}>{product?.name}</p>
                <small>
                  {product?.price
                    ?.toString()
                    ?.replace(/\d(?=(\d{3})+$)/g, "$&,")}
                  x {product?.quantity}
                </small>
              </pre>
              <span>
                {(product?.price * product?.quantity)
                  ?.toString()
                  ?.replace(/\d(?=(\d{3})+$)/g, "$&,")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StatisticsExpenses = () => {
  const user = JSON?.parse(localStorage?.getItem("user"))?.user || {};
  const { date } = useSelector((state) => state.uSearch);
  const lc = useLocation();
  const { name } = useParams();
  const searchParams = new URLSearchParams(lc.search);
  const point = searchParams.get("point");
  const { data: e = [] } = useFetchDataQuery({
    url: `${point}/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  console.log("e", e?.data);
  const initialBillsData = (e?.data || []).flatMap(
    (item) => item?.details || []
  );

  const keys = {
    expenses: {
      name: "name",
      amount: "amount",
    },
    debts: {
      name: "supplier",
      amount: "debt",
    },
    credits: {
      name: "supplier",
      amount: "credit",
    },
  };
  console.log("initialBillsData", initialBillsData);
  const billsData = [...initialBillsData]; // Create a copy of initialBillsData
  console.log("billsData", billsData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(acNavStatus([0]));
  }, [dispatch]);

  return (
    <div className="w100 df flc bills-report">
      <div className="w100 df aic jcc bills-report-header">
        <DonutChart
          data={e?.data}
          billsData={billsData}
          hint={keys?.[name]?.amount}
          short={true}
          ty=""
        />
        <div className="df flc item-info">
          {e?.data?.every((item) => item?.[keys?.[name]?.amount] === 0) ? (
            <p>
              <GoDotFill style={{ color: "#353535" }} />
              <span>Ma'lumot yo'q</span>
            </p>
          ) : (
            e?.data?.map((item, ind) => {
              return (
                <p
                  key={`${item?.[keys?.[name]?.name]}_${ind}`}
                  style={{
                    opacity: item?.[keys?.[name]?.amount] <= 0 ? 0.2 : 1,
                  }}>
                  <GoDotFill style={{ color: item?.cl }} />
                  <b>{item?.[keys?.[name]?.name]}</b>
                </p>
              );
            })
          )}
        </div>
      </div>
      <div className="w100 df aic bills-report-box">
        {e?.data?.map((expense, ind) => {
          return (
            <div
              className="df aic jcsb bills-item"
              key={`${expense?.[keys?.[name]?.name]}_${ind}`}
              onClick={() =>
                navigate(
                  `/statistic-details?title=${expense?.[keys?.[name]?.name]}`
                )
              }>
              <big>{expense?.[keys?.[name]?.name]}</big>
              <big style={{ color: expense?.cl }}>
                <NumericFormat
                  value={expense?.[keys?.[name]?.amount]}
                  displayType="text"
                  thousandSeparator={","}
                />
              </big>
              <i>
                <IoIosArrowForward />
              </i>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StatisticsIncome = () => {
  const user = JSON?.parse(localStorage?.getItem("user"))?.user || {};
  const { date } = useSelector((state) => state.uSearch);
  const { data: e = [] } = useFetchDataQuery({
    url: `/get/incomeFromSales/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  const { data: l = [] } = useFetchDataQuery({
    url: `/get/incomeForPeriod/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(acNavStatus([0]));
  }, [dispatch]);

  const data = [
    {
      date: "00:00",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "03:30",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "07:00",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "10:30",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "14:00",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "17:30",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "21:00",
      incomes: 0,
      other_incomes: 0,
    },
    {
      date: "23:59",
      incomes: 0,
      other_incomes: 0,
    },
  ];

  return (
    <>
      <div className="w100 df flc full_analystic">
        <div className="w100 df flc full_analystic-header">
          <div className="w100 df aic jcsb">
            <span className="df flc">
              <small style={{ color: "#a1a1a1" }}>Umumiy summa</small>
              <NumericFormat
                value={CalculateTotalCH(
                  e?.data,
                  "incomeFromSales",
                  "other_income"
                )}
                displayType="text"
                thousandSeparator={","}
              />
            </span>
            {DateRange()}
          </div>
          <label className="w100 df aic" style={{ gap: "var(--gap3)" }}>
            <p className="df aic" style={{ gap: "5px" }}>
              <GoDotFill style={{ color: "#80ed99" }} />
              <span>Chiqimlar</span>
            </p>
            <p className="df aic" style={{ gap: "5px" }}>
              <GoDotFill style={{ color: "#c1121f" }} />
              <span>Kirimlar</span>
            </p>
          </label>
        </div>
        <div className="w100 full_analystic-chart">
          <LineChartC data={l?.data || data} />
        </div>
      </div>
      <div className="w100 df  full_analystic-box">
        {[
          {
            label: "Satuvdan kelgan pul",
            type: "incomeFromSales",
            cl: "#80ed99",
          },
          { label: "Boshqa kelgan pul", type: "other_income", cl: "#c1121f" },
        ]?.map((label, ind) => {
          return (
            <div
              className="df aic flc _analystic-box-item"
              key={`${label?.cl}_${ind}`}>
              <label className="w100 df aic">
                <p>{label?.label}</p>
                <NumericFormat
                  value={CalculateTotalQuantity(
                    e?.data?.[label.type] || [],
                    "amount"
                  )}
                  displayType="text"
                  thousandSeparator={","}
                  style={{ color: label.cl }}
                />
                <IoIosArrowForward style={{ color: label.cl }} />
              </label>
              {(e?.data?.[label.type] || [])?.map((item, ind) => {
                return (
                  <p key={`${item?.type}_${ind}`} className="w100 df aic jcsb">
                    <small>{item?.type}</small>
                    <small>
                      <NumericFormat
                        value={item?.amount}
                        displayType="text"
                        thousandSeparator={","}
                      />
                    </small>
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export const StatisticDetails = () => {
  // const bills = useSelector((state) => state?.activeB);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(acNavStatus([0]));
  }, [dispatch]);
  const getItems = (panelStyle) => [
    {
      key: "1",
      label: (
        <span className=" df aic jcsb dropdown-label">
          <span className="df flc">
            Ecommerce{" "}
            <small style={{ color: "#aaa8" }}>04.04.2024, 15:05</small>
          </span>
          <NumericFormat
            value={23455554}
            displayType="text"
            thousandSeparator={","}
          />
        </span>
      ),
      children: (
        <p className="w100 df flc dropdown-list">
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
        </p>
      ),
      style: panelStyle,
    },
    {
      key: "2 ",
      label: (
        <span className=" df aic jcsb dropdown-label">
          <span className="df flc">
            Ecommerce{" "}
            <small style={{ color: "#aaa8" }}>04.04.2024, 15:05</small>
          </span>
          <NumericFormat
            value={23455554}
            displayType="text"
            thousandSeparator={","}
          />
        </span>
      ),
      children: (
        <p className="w100 df flc dropdown-list">
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
        </p>
      ),
      style: panelStyle,
    },
    {
      key: "3",
      label: (
        <span className=" df aic jcsb dropdown-label">
          <span className="df flc">
            Ecommerce{" "}
            <small style={{ color: "#aaa8" }}>04.04.2024, 15:05</small>
          </span>
          <NumericFormat
            value={23455554}
            displayType="text"
            thousandSeparator={","}
          />
        </span>
      ),
      children: (
        <p className="w100 df flc dropdown-list">
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
          <p>
            <span>title</span> <span>value</span>
          </p>
        </p>
      ),
      style: panelStyle,
    },
  ];
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 8,
    background: "#252525",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  return (
    <div className="w100 df flc statistic-details">
      <Collapse
        bordered={true}
        expandIcon={({ isActive }) => (
          <IoMdArrowDropright rotate={isActive ? 90 : 0} />
        )}
        style={{
          background: "#494949",
          padding: "3%",
        }}
        items={getItems(panelStyle)}
      />
    </div>
  );
};
