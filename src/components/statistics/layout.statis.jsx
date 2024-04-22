import React, { memo, useEffect } from "react";
import "./statistics.css";
import { DonutChart } from "./statistics";
import { useFetchDataQuery } from "../../service/fetch.service";
import { useDispatch, useSelector } from "react-redux";
import { acNavStatus } from "../../redux/navbar.status";
import { useNavigate } from "react-router-dom";
import AnimatedNumber from "animated-number-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { acGetNewData } from "../../redux/search";

import { FaMoneyBillAlt } from "react-icons/fa";
import { GiCardExchange } from "react-icons/gi";
import { FcDebt } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import { IoWallet } from "react-icons/io5";
import { CgArrowsExchange } from "react-icons/cg";
const { RangePicker } = DatePicker;

export const Statistics = memo(() => {
  const { data, defaultPie, billsData, sd_v } = DataBill();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(acNavStatus([0]));
  }, [dispatch]);

  const formatValue = (value) =>
    value
      .toFixed(0)
      ?.toString()
      ?.replace(/\d(?=(\d{3})+$)/g, "$&,");

  return (
    <div className="w100 df aic jcc statistic_box">
      <div className="w100 df aic statistic_header">
        <span className="df aic">
          <IoWallet />{" "}
          <small>
            <small>
              <AnimatedNumber
                value={sd_v?.balance || 0}
                formatValue={formatValue}
              />
            </small>
          </small>
        </span>
        {DateRange()}
      </div>
      <div className="wrapper_item">
        <div className="row">
          {statsData.map((item) => (
            <div
              key={`${item.id}_${item?.bg}`}
              className={`dashboard-stat ${item?.bg}`}
              onClick={() =>
                navigate(
                  `statistic/${item?.path}?title=${item?.label}&&point=${item?.point}`
                )
              }>
              <div className="df flc aic visual">
                {item?.extra ? (
                  <small>{item?.extra}</small>
                ) : (
                  <small style={{ opacity: 0 }}>
                    <LuTrendingUp />
                  </small>
                )}
                {item.icon}
              </div>
              <div className="details">
                <div className="number">
                  <AnimatedNumber
                    value={sd_v?.[item?.type] || 0}
                    formatValue={formatValue}
                  />
                </div>
                <div className="desc">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="df aic jcc statistic_product">
        <DonutChart
          data={defaultPie}
          billsData={billsData}
          hint="amount"
          ty="type"
        />
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
    </div>
  );
});

const statsData = [
  {
    id: 3,
    type: "income",
    label: "Kirimlar",
    icon: <FaMoneyBillAlt />,
    extra: <LuTrendingDown />,
    bg: "green",
    path: "incomes",
    point: "",
  },
  {
    id: 2,
    type: "expense",
    label: "Chiqimlar",
    icon: <FaMoneyBillAlt />,
    extra: <LuTrendingUp />,
    bg: "red",
    path: "expenses",
    point: "/get/expenseTransactions",
  },
  {
    id: 4,
    type: "debts",
    label: "Yetkazuvchilarga qarzlar",
    icon: <FcDebt />,
    bg: "purple",
    path: "debts",
    point: "/get/debts/supplires",
  },
  {
    id: 5,
    type: "credits",
    label: "Yetkazuchilardagi haqlar",
    icon: <GiCardExchange />,
    bg: "blue",
    path: "credits",
    point: "/get/credits/suppliers",
  },
];

export const DataBill = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || null;
  const { date } = useSelector((state) => state.uSearch);
  const { data = [] } = useFetchDataQuery({
    url: `/generate/ordersReport/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  const { data: bd = [] } = useFetchDataQuery({
    url: `/get/resOrders/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  const { data: st_v = [] } = useFetchDataQuery({
    url: `/get/moneyInfo/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  const { data: db = [] } = useFetchDataQuery({
    url: `/get/debts/supplires/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });
  const { data: dp = [] } = useFetchDataQuery({
    url: `/get/credits/supplires/${user?.id}/${date?.start}/${date?.end}`,
    tags: ["report"],
  });

  const defaultPie =
    bd?.innerData?.length > 0
      ? data?.data
      : [{ type: "Malumot yo'q", cl: "#333", amount: 0 }];

  return {
    data: data?.data,
    defaultPie: defaultPie,
    billsData: bd?.innerData,
    sd_v: st_v?.data,
    db: db?.data,
    dp: dp?.data,
  };
};

export const DateRange = () => {
  const { date } = useSelector((state) => state.uSearch);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uploadData = (e, fieldName) => {
    const newValue = e;
    if (fieldName === "date") {
      const rewordValue = JSON.parse(newValue);
      navigate(`?start=${rewordValue.start}&&end=${rewordValue.end}`);
    } else {
      navigate(`?${fieldName}=${newValue}`);
    }
    if (fieldName === "date")
      return dispatch(acGetNewData(fieldName, JSON.parse(newValue)));
    const time = {
      start: date?.start,
      end: date?.end,
    };
    if (fieldName === "start" || fieldName === "end") {
      time[fieldName] = newValue;
      dispatch(acGetNewData("date", time));
    } else {
      dispatch(acGetNewData(fieldName, newValue));
    }
  };
  return (
    <label className="df aic" style={{ gap: "5px" }}>
      {window.innerWidth > 768 ? (
        <RangePicker
          defaultValue={[dayjs(date.start), dayjs(date.end)]}
          aria-label="select data from to end"
          onChange={(date, dateString) =>
            uploadData(
              JSON.stringify({
                start: dateString?.[0],
                end: dateString?.[1],
              }),
              "date"
            )
          }
        />
      ) : (
        <>
          <DatePicker
            defaultValue={dayjs(date.start)}
            aria-label="select data from"
            onChange={(date, dateString) => uploadData(dateString, "start")}
          />{" "}
          <CgArrowsExchange style={{ color: "#eee" }} />{" "}
          <DatePicker
            defaultValue={dayjs(date.end)}
            aria-label="select data to"
            onChange={(date, dateString) => uploadData(dateString, "end")}
          />
        </>
      )}
    </label>
  );
};
