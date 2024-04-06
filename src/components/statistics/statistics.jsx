import React from "react";
import "./statistics.css";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
const initialState = [
  {
    type: "Group A",
    value: 400,
    cl: "#353535",
  },
];
export const Example = ({ data = initialState }) => {
  const check = data?.every((item) => item?.value === 0);
  console.log(check, "check");
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={check ? initialState : data}
          cx={280}
          cy={150}
          innerRadius={170}
          outerRadius={250}
          fill="#353535"
          paddingAngle={0}
          dataKey="value"
          label={check ? "" : "type"}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={check ? "#353535" : entry?.cl} />
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
