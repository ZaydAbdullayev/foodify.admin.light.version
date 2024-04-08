import React, { useState, useCallback, useEffect } from "react";
import "./statistics.css";
import { Tooltip } from "antd";

export const DonutChart = () => {
  const data = [
    { label: "Red", value: 300, color: "#e7505a", direction: "top" },
    { label: "Blue", value: 150, color: "#337ab7", direction: "right" },
    { label: "Green", value: 200, color: "#00c49f", direction: "right" },
    { label: "Purple", value: 20, color: "#8e44ad", direction: "rightBottom" },
    { label: "Hoki", value: 280, color: "#67809f", direction: "bottom" },
  ];

  const [activeI, setActiveI] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 500; // 2 saniye
    let startTimestamp;

    function startAnimation(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / animationDuration, 1);
      setAnimationProgress(progress);

      if (elapsed < animationDuration) {
        requestAnimationFrame(startAnimation);
      }
    }

    requestAnimationFrame(startAnimation);
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="donut-chart-container">
      <svg className={`donut-chart`} width="400" height="400">
        {data.map((slice, index) => {
          const startAngle =
            index === 0
              ? 0
              : data
                  .slice(0, index)
                  .reduce((acc, curr) => acc + (curr.value / total) * 360, 0);
          // const endAngle = startAngle + (slice.value / total) * 360;

          const animatedEndAngle =
            startAngle + (slice.value / total) * 360 * animationProgress;

          return (
            <Tooltip
              title={`${slice.label} - ${slice.value}`}
              color={slice?.color}
              key={slice?.color}
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
                },${200 + Math.sin(((startAngle - 90) * Math.PI) / 180) * 150}
            A 150,150 0 ${slice.value / total > 0.5 ? 1 : 0},1 ${
                    200 +
                    Math.cos(((animatedEndAngle - 90) * Math.PI) / 180) * 150
                  },${
                    200 +
                    Math.sin(((animatedEndAngle - 90) * Math.PI) / 180) * 150
                  }
            Z
            `}
                  fill={slice.color}
                  onClick={() => setActiveI(activeI === index ? null : index)}
                />
              </g>
            </Tooltip>
          );
        })}
      </svg>

      <span onClick={() => setActiveI(null)}></span>
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
