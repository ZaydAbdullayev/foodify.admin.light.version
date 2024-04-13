import React from "react";
import "./statistics.css";
import { Tooltip as Tt } from "antd";
import { useNavigate } from "react-router-dom";
import AnimatedNumber from "animated-number-react";
import { CalculateTotalQuantity } from "../../service/calc.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const DonutChart = ({ data, billsData }) => {
  const [activeI, setActiveI] = React.useState(null);
  const navigate = useNavigate();

  const total = CalculateTotalQuantity(data, "value");
  const totalp = CalculateTotalQuantity(billsData, "total");
  const formatValue = (value) => {
    return value
      .toFixed(0)
      ?.toString()
      ?.replace(/\d(?=(\d{3})+$)/g, "$&,");
  };

  return (
    <div className="donut-chart-container">
      <svg className="donut-chart" width="400" height="400">
        {data?.map((slice, index) => {
          const startAngle =
            index === 0
              ? 0
              : data
                  .slice(0, index)
                  .reduce((acc, curr) => acc + (curr.value / total) * 360, 0);
          const endAngle = startAngle + (slice.value / total) * 360;

          const formatValue = (value) => {
            if (typeof value === "number") {
              return value?.toString()?.replace(/\d(?=(\d{3})+$)/g, "$& ");
            }
            return value;
          };

          return (
            <Tt
              title={`${slice?.type} - ${formatValue(slice?.value)}`}
              color={slice?.cl}
              key={`${slice?.cl}_${index}`}
              placement={slice?.direction}>
              <g
                className={`${
                  activeI !== index && activeI !== null ? "passive" : "active"
                }`}>
                <path
                  d={`
                    M 200,200
                    L ${
                      200 + Math.cos(((startAngle - 90) * Math.PI) / 180) * 150
                    },${
                    200 + Math.sin(((startAngle - 90) * Math.PI) / 180) * 150
                  }
                    A 150,150 0 ${slice.value / total > 0.5 ? 1 : 0},1 ${
                    200 + Math.cos(((endAngle - 90) * Math.PI) / 180) * 150
                  },${200 + Math.sin(((endAngle - 90) * Math.PI) / 180) * 150}
                    Z
                  `}
                  fill={slice?.cl}
                  onClick={() => setActiveI(activeI === index ? null : index)}
                />
              </g>
            </Tt>
          );
        })}
      </svg>
      <label
        className="df aic jcc flc"
        onClick={() => {
          navigate("/bills-report");
          setActiveI(null);
        }}>
        <span>🧾 {billsData?.length}ta</span>
        <small>
          💵 <AnimatedNumber value={totalp} formatValue={formatValue} />
        </small>
      </label>
    </div>
  );
};

const data = [
  {
    name: "00:00",
    incomes: 2400,
    other_incomes: 2400,
  },
  {
    name: "03:30",
    incomes: 1398,
    other_incomes: 2210,
  },
  {
    name: "07:00",
    incomes: 9800,
    other_incomes: 2290,
  },
  {
    name: "10:30",
    incomes: 3908,
    other_incomes: 2000,
  },
  {
    name: "14:00",
    incomes: 4800,
    other_incomes: 2181,
  },
  {
    name: "17:30",
    incomes: 3800,
    other_incomes: 2500,
  },
  {
    name: "21:00",
    incomes: 4300,
    other_incomes: 2100,
  },
  {
    name: "23:59",
    incomes: 4800,
    other_incomes: 2900,
  },
];

export const LineChartC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={500}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#aaa5" />
        <XAxis dataKey="name" fontSize={14} />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => {
            return `🕒 ${value}`;
          }}
          labelStyle={{
            fontSize: "12px",
          }}
          contentStyle={{
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="incomes"
          stroke="#80ed99"
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="other_incomes"
          stroke="#c1121f"
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
