import React from "react";
// import { DualAxes } from "@ant-design/plots";
import "./statistics.css";

import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#e7505a"];
export const Example = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          innerRadius={80}
          outerRadius={130}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          label="name">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
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
