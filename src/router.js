import React, { useEffect } from "react";
import "./assets/global.css";
import "./assets/root.css";
import { Route, Routes, Outlet } from "react-router-dom";
import { Home } from "./page/home/home";
import { Layout } from "./layout/layout";
import { Sidebar } from "./components/sideBar/sidebar";
import { CheackDepartment, Login } from "./auth/login";
import { Auth } from "./auth/auth";
import { Addproduct, ShowProduct } from "./components/Addproduct/addproduct";
import { Products } from "./page/products/products";
import { Statistics } from "./components/statistics/layout.statis";
import { Document } from "./page/document/document";
import { Payment } from "./page/payment/payment";
import { AddPayment } from "./page/payment/addPayment/addPayment.jsx";
import { Workers } from "./page/workers/workers";
import { AddWorker } from "./page/workers/addWorker/addWorker";
import { PaymentCheck } from "./components/payment-check/check";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { acCloseUModal } from "./redux/u-modal";
import { NavigationPanel } from "./page/navigation/navigation";
import { TableBox } from "./page/table-box/table-box";
import { Orders } from "./page/orders/orders";
import { OrderById } from "./page/order-by-id/order-by-id";
import { Howl } from "howler";
import { acDeviceWidth } from "./redux/media";
import { acNothification } from "./redux/nothification";
import { NothificationPage } from "./page/nothification/nothification.jsx";
import { MyOrder } from "./page/my-orders/my-order.jsx";
import { Result, Button } from "antd";
import { MobileInvoice } from "./page/mobile/mobile.transaction.jsx";
import { Chat } from "./page/chat/chat.jsx";
import audio from "./assets/images/nothification.mp3";
import {
  BillReportById,
  BillsReport,
  StatisticDetails,
} from "./components/statistics/bill.jsx";
import { StatisticsIncome } from "./components/statistics/bill.jsx";
import { StatisticsExpenses } from "./components/statistics/bill.jsx";

export const Router = () => {
  // const dep = useSelector((state) => state.permission);
  const nothificate = useSelector((state) => state.nothificate);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (nothificate) {
      var audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      if (audioContext) {
        let sound = new Howl({
          src: [audio],
          html5: true,
        });
        sound.play();
        setTimeout(() => {
          dispatch(acNothification(false));
          sound.stop();
        }, 1000);
      }
    }
  }, [dispatch, nothificate]);

  useEffect(() => {
    dispatch(acCloseUModal());
  }, [dispatch, location]);

  if (window.innerWidth < 600) {
    dispatch(acDeviceWidth(true));
  } else {
    dispatch(acDeviceWidth(false));
  }

  // document.addEventListener("contextmenu", (event) => event.preventDefault());

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Auth />}>
        <Route path="check" element={<CheackDepartment />} />
        <Route path="/" element={<Layout />}>
          {/* ============== pages of the navbar ================= */}
          <Route path="" element={<Statistics />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="my-receive-orders" element={<MyOrder />} />
          <Route path="nothifications" element={<NothificationPage />} />

          {/* ============== pages of the sidebar ================= */}
          <Route path="restaurant-all-items" element={<Products />} />
          <Route path="workers" element={<Workers />} />

          <Route path="orders/tables" element={<TableBox />} />
          <Route
            path="orders/tables/:type/:number/:id"
            element={<OrderById />}
          />
          <Route path="orders" element={<Blog />}>
            <Route path="" element={<Home />} />
          </Route>
          <Route path="financial" element={<Blog />}>
            <Route path="" element={<Payment />} />
            <Route path="payment" element={<AddPayment />} />
            <Route path="get/check/:id" element={<PaymentCheck />} />
          </Route>
          <Route path="other-pages" element={<Blog />}>
            <Route path="documents" element={<Document />} />
            <Route path="navigation" element={<NavigationPanel />} />
          </Route>

          {/* ============== pages of the single ================= */}
          <Route path="more/info/:id" element={<ShowProduct />} />
          <Route path="category/:type/:number/:id" element={<Orders />} />
          <Route
            path="update-order/:type/:number/:id/:ProductId/:queue"
            element={<Orders />}
          />

          {/* ============== pages of the modal ================= */}
          <Route path="add/product" element={<Addproduct />} />
          <Route path="workers/add" element={<AddWorker />} />

          {/* ============== pages of the other ================= */}
          <Route path="sidebar" element={<Sidebar />} />
          <Route path="bills-report" element={<BillsReport />} />
          <Route path="one-bill-report/:id" element={<BillReportById />} />
          <Route path="mobile-invoices" element={<MobileInvoice />} />
          <Route path="statistic/:name" element={<StatisticsExpenses />} />
          <Route path="statistic/incomes" element={<StatisticsIncome />} />
          <Route path="statistic-details" element={<StatisticDetails />} />
          <Route path="chat-restaurant-staff" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sahifa topilmadi!"
      extra={
        <Button onClick={() => (window.location.href = "/")}>
          Bosh sahifaga qaytish
        </Button>
      }
    />
  );
};

export const Blog = () => {
  return <Outlet />;
};
