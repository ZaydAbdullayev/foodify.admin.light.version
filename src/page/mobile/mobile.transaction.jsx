import React, { useEffect, useState, lazy, Suspense } from "react";
import "./mobile.transaction.css";
import { useFetchDataQuery } from "../../service/fetch.service";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from "../../hooks/generate.tags";
import { acNavStatus } from "../../redux/navbar.status";
import { ConfigProvider, DatePicker } from "antd";
import { usePostDataMutation } from "../../service/fetch.service";
import useNotification from "antd/es/notification/useNotification";
import { ClearForm } from "../../service/form.service";
import { Segmented } from "antd";
import { NumericFormat } from "react-number-format";
import middlewareService from "../../middleware/form.middleware";

import { ImCalendar } from "react-icons/im";
import { BsCashCoin } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { acOpenUModal } from "../../redux/u-modal";
const UniversalModal = lazy(() => import("../../components/modal/modal"));

export const MobileInvoice = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || [];
  const [postData] = usePostDataMutation();
  const [type, setType] = useState("invoices");
  const dispatch = useDispatch();
  const acItem = useSelector((state) => state.activeThing);
  const [api, contexHolder] = useNotification();

  const { data: invoiceData = [] } = useFetchDataQuery({
    url: `get/InvoiceGroups/${user?.id}`,
    tags: ["invoice-group"],
  });
  const { data: cashboxData = [] } = useFetchDataQuery({
    url: `get/cashbox/${user?.id}`,
    tags: ["cashboxes"],
  });
  const { data: suppData = [] } = useFetchDataQuery({
    url: `get/suppliers/${user?.id}`,
    tags: ["suplier"],
  });

  const paymentData = [
    {
      name: "Naqd",
    },
    {
      name: "Plastik karta",
    },
    {
      name: "Bank hisob raqami",
    },
    {
      name: "Elektron ilovalar",
    },
  ];

  const ctgData = {
    invoices: {
      income: "income",
      expense: "expense",
      invoice_payment: "invoicePayment",
    },
    invoice_supp: {
      income: "paymentToSupplier",
      expense: "invoicePaymentFromSupplier",
    },
    transfer_cash: {
      transfer: "transfer",
    },
  };

  useEffect(() => {
    dispatch(acNavStatus([0, 1, 2, 3]));
  }, [dispatch]);

  const handleButtonClick = async (t_type) => {
    // Diğer işlemler
    const formdata = new FormData(document.querySelector(".mobile-invoice"));
    const vl = Object.fromEntries(formdata.entries());
    const value = middlewareService(vl, api.error);
    if (type === "transfer_cash") {
      const { data = [] } = await postData({
        url: `/add/transaction`,
        data: {
          ...value,
          res_id: user?.id,
          worker: user?.name || user?.username,
          worker_id: user?.user_id || user?.id,
          transaction_type: "income",
          transaction_category: ctgData?.[type]?.[t_type] || "",
        },
        tags: ["cashbox-transaction"],
      });
    }
    const { data = [] } = await postData({
      url: `/add/transaction`,
      data: {
        ...value,
        res_id: user?.id,
        worker: user?.name || user?.username,
        worker_id: user?.user_id || user?.id,
        transaction_type: t_type === "transfer" ? "expense" : t_type,
        transaction_category: ctgData?.[type]?.[t_type] || "",
      },
      tags: ["cashbox-transaction"],
    });
    if (data?.message === "Transaction has been added") {
      const placement = "topRight";
      api.success({
        message: "Muaffaqiyatli!",
        description: "Ma'lumotlar muvaffaqiyatli saqlandi",
        placement,
      });
      ClearForm(".mobile-invoice");
    }
  };

  const type_data = [
    {
      title: `Kassa ${type === "transfer_cash" ? "dan" : ""}`,
      data: cashboxData?.data,
      name: type !== "transfer_cash" ? "cashbox_receiver" : "cashbox_sender",
    },
    {
      title:
        type === "invoices"
          ? "Harakat turi"
          : type === "invoice_supp"
          ? "Yetkazuvchi tanlang"
          : "Kassaga",
      data:
        type === "invoices"
          ? null
          : type === "invoice_supp"
          ? suppData?.data
          : cashboxData?.data,
      name:
        type === "invoices"
          ? null
          : type === "invoice_supp"
          ? "supplier"
          : "cashbox_receiver",
    },
    {
      title: "Harakat guruhi",
      data: invoiceData?.data,
      name: "transaction_group",
      add: true,
    },
    {
      title: "To'lov turi",
      data: paymentData,
      name: "payment_type",
    },
  ];

  return (
    <>
      <form className="mobile-invoice container_box">
        {contexHolder}
        <ConfigProvider
          theme={{
            components: {
              Segmented: {
                trackPadding: "4px",
              },
            },
          }}>
          <Segmented
            options={[
              { label: "To'lovlar", value: "invoices" },
              { label: "Yetkazuvchiga to'lov", value: "invoice_supp" },
              { label: "Kassa orasida almashinuv", value: "transfer_cash" },
            ]}
            className="segmented"
            onChange={(e) => setType(e)}
            block
          />
        </ConfigProvider>
        <div className="mobile-invoice-content">
          {type_data.map(
            (item, ind) =>
              item?.name !== null && (
                <div className="activity-type" key={ind}>
                  <p>{item.title} * :</p>
                  <div className="activity-types">
                    {item.data?.map((inner, ind) => (
                      <CheckBox
                        key={`${inner.name}_${ind}`}
                        label={inner.name}
                        value={inner.name}
                        id={item.name === "supplier" ? inner.id : null}
                        name={item.name}
                      />
                    ))}
                    {item.add && (
                      <span
                        className="add-tr-group"
                        onClick={() => dispatch(acOpenUModal())}>
                        +
                      </span>
                    )}
                  </div>
                  <IoIosArrowForward />
                </div>
              )
          )}
          <div className="activity-type activity-inputs">
            <p>Tafsilot :</p>
            <label className="activity-types short">
              <textarea name="description" placeholder="Tafsilot"></textarea>
            </label>
            <div className="amount-and-date">
              <label>
                <BsCashCoin />
                <div className="activity-types">
                  <NumericFormat
                    name="amount"
                    placeholder="Miqdori"
                    required
                    thousandSeparator=","
                  />
                </div>
              </label>
              <label>
                <ImCalendar />
                <DatePicker
                  name="date"
                  className="date-picker"
                  placeholder="Kun tanlang"
                  variant="borderless"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="_invoice-footer">
          <div className="history-screen"></div>
          {type === "transfer_cash" ? (
            <button type="button" onClick={() => handleButtonClick("transfer")}>
              O'tkazish
            </button>
          ) : (
            <div className="activity-btn">
              <button
                type="button"
                onClick={() => handleButtonClick("expense")}>
                – CHIQIM
              </button>
              <button type="button" onClick={() => handleButtonClick("income")}>
                KIRIM +
              </button>
            </div>
          )}
        </div>
      </form>
      <Suspense>
        <UniversalModal
          type="invGr"
          title="Guruh qo'shish"
          status={acItem?.id ? false : true}
          darkMode={true}>
          <input
            type="text"
            name="name"
            placeholder="Guruh nomi*"
            defaultValue={acItem.name}
            required
          />
          <input type="hidden" name="res_id" value={user?.id} />
          {acItem.id && <input type="hidden" name="id" value={acItem?.id} />}
        </UniversalModal>
      </Suspense>
    </>
  );
};
