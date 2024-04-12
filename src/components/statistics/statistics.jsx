import React from "react";
import "./statistics.css";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import AnimatedNumber from "animated-number-react";
import { CalculateTotalQuantity } from "../../service/calc.service";

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
            <Tooltip
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
            </Tooltip>
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

// export const DemoDualAxes = () => {
//   const uvBillData = [
//     {
//       time: "2023-03",
//       value: 350,
//       type: "oylik",
//     },
//     {
//       time: "2023-04",
//       value: 900,
//       type: "oylik",
//     },
//     {
//       time: "2023-05",
//       value: 300,
//       type: "oylik",
//     },
//     {
//       time: "2023-06",
//       value: 450,
//       type: "oylik",
//     },
//     {
//       time: "2023-07",
//       value: 470,
//       type: "oylik",
//     },
//     {
//       time: "2023-03",
//       value: 220,
//       type: "haftalik",
//     },
//     {
//       time: "2023-04",
//       value: 300,
//       type: "haftalik",
//     },
//     {
//       time: "2023-05",
//       value: 250,
//       type: "haftalik",
//     },
//     {
//       time: "2023-06",
//       value: 220,
//       type: "haftalik",
//     },
//     {
//       time: "2023-07",
//       value: 100,
//       type: "haftalik",
//     },
//   ];
//   const transformData = [
//     {
//       time: "2023-03",
//       count: 800,
//       name: "chiqim",
//     },
//     {
//       time: "2023-04",
//       count: 600,
//       name: "chiqim",
//     },
//     {
//       time: "2023-05",
//       count: 400,
//       name: "chiqim",
//     },
//     {
//       time: "2023-06",
//       count: 380,
//       name: "chiqim",
//     },
//     {
//       time: "2023-07",
//       count: 20,
//       name: "chiqim",
//     },
//     {
//       time: "2023-03",
//       count: 750,
//       name: "kirim",
//     },
//     {
//       time: "2023-04",
//       count: 650,
//       name: "kirim",
//     },
//     {
//       time: "2023-05",
//       count: 450,
//       name: "kirim",
//     },
//     {
//       time: "2023-06",
//       count: 400,
//       name: "kirim",
//     },
//     {
//       time: "2023-07",
//       count: 620,
//       name: "kirim",
//     },
//     {
//       time: "2023-03",
//       count: 900,
//       name: "foyda",
//     },
//     {
//       time: "2023-04",
//       count: 600,
//       name: "foyda",
//     },
//     {
//       time: "2023-05",
//       count: 450,
//       name: "foyda",
//     },
//     {
//       time: "2023-06",
//       count: 300,
//       name: "foyda",
//     },
//     {
//       time: "2023-07",
//       count: 200,
//       name: "foyda",
//     },
//   ];
//   const config = {
//     data: [uvBillData, transformData],
//     xField: "time",
//     yField: ["value", "count"],
//     geometryOptions: [
//       {
//         geometry: "line",
//         seriesField: "type",
//         lineStyle: {
//           lineWidth: 2,
//           lineDash: [5, 5],
//         },
//         smooth: true,
//       },
//       {
//         geometry: "line",
//         seriesField: "name",
//         point: {},
//       },
//     ],
//   };
//   return <DualAxes {...config} />;
// };
