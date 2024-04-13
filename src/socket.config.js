// socket.js

import io from "socket.io-client";
// const base_url = process.env.REACT_APP_SOCKET_BASE_URL;
const base_url = "https://k13cjx1h-80.euw.devtunnels.ms/";
const socket = io(base_url, {
  transportOptions: {
    polling: {
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    },
  },
});

export default socket;

const data = [
  {
    name: "00:00",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "03:30",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "07:00",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "10:30",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "14:00",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "17:30",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "21:00",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: "00:00",
    uv: 3790,
    pv: 4800,
    amt: 2900,
  },
];