import React, { useState } from "react";
import "./modal.css";
import { useDispatch, useSelector } from "react-redux";
import { acCloseUModal } from "../../redux/u-modal";
import { usePostDataMutation } from "../../service/fetch.service";
import { usePatchDataMutation } from "../../service/fetch.service";
import { enqueueSnackbar as es } from "notistack";
import { LoadingBtn } from "../../components/loading/loading";
import { ClearForm } from "../../service/form.service";
import { acClosePayModal } from "../../redux/modal";

const UniversalModal = ({
  children,
  type,
  newGrData,
  setChecked,
  status,
  title,
  payment,
  darkMode,
  color,
}) => {
  const open = useSelector((state) => state.uModal);
  const pay = useSelector((state) => state.pay);
  const dispatch = useDispatch();
  const [postData] = usePostDataMutation();
  // service for update
  const [patchData] = usePatchDataMutation();
  const [loading, setLoading] = useState(false);

  const fetchValues = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const value = Object.fromEntries(formdata.entries());
    if (value.department === "default") {
      return es({ message: "Taxrirlash tugallanmadi!", variant: "warning" });
    }
    if (type === "supp") {
      value.number.split(" ").join("");
    }
    try {
      let result;

      if (status) {
        switch (type) {
          case "main":
            result = await postData({
              url: `add/storage`,
              data: value,
              tags: ["store"],
            });
            break;
          case "dep":
            result = await postData({
              url: `add/department`,
              data: value,
              tags: ["department"],
            });
            break;
          case "category":
            result = await postData({
              url: `add/category`,
              data: value,
              tags: ["category"],
            });
            break;
          case "group":
            result = await postData({
              url: `add/ingredientGroup`,
              data: value,
              tags: ["groups"],
            });
            break;
          case "ing":
            result = await postData({
              url: `add/ingredient`,
              data: value,
              tags: ["ingredient"],
            });
            break;
          case "newIngGr":
            result = await postData({
              url: `add/ingredientGroup`,
              data: newGrData,
              tags: ["groups"],
            });
            result = await postData({
              url: `add/ingredient`,
              data: value,
              tags: ["ingredient"],
            });
            break;
          case "supp":
            result = await postData({
              url: `add/supplier`,
              data: value,
              tags: ["suplier"],
            });
            break;
          case "invGr":
            result = await postData({
              url: `add/invoiceGroup`,
              data: value,
              tags: ["invoice-group"],
            });
            break;
          case "cashbox":
            result = await postData({
              url: `add/cashbox`,
              data: value,
              tags: ["cashbox"],
            });
            break;
          case "cashboxGr":
            result = await postData({
              url: `add/transactionGroups`,
              data: value,
              tags: ["tr-group"],
            });
            break;
          case "trsn":
            result = await postData({
              url: `add/transaction`,
              data: value,
              tags: ["cashbox-transaction"],
            });
            break;
          case "table":
            result = await postData({
              url: `add/table`,
              data: value,
              tags: ["table"],
            });
            break;
          default:
            break;
        }
      } else {
        switch (type) {
          case "main":
            result = await patchData({
              url: `update/storage/${value.id}`,
              data: { res_id: value.res_id, name: value.name },
              tags: ["store"],
            });
            break;
          case "dep":
            result = await patchData({
              url: `update/department/${value.id}`,
              data: value,
              tags: ["department"],
            });
            break;
          case "category":
            result = await patchData({
              url: `update/category/${value.id}`,
              data: {
                res_id: value.res_id,
                name: value.name,
                department: value.department,
              },
              tags: ["category"],
            });
            break;
          case "group":
            result = await patchData({
              url: `update/ingredientGroup/${value.id}`,
              data: { res_id: value.res_id, name: value.name },
              tags: ["groups"],
            });
            break;
          case "ing":
            result = await patchData({
              url: `update/ingredient/${value.id}`,
              data: {
                res_id: value.res_id,
                name: value.name,
                unit: value.unit,
                group: value.group,
              },
              tags: ["ingredient"],
            });
            break;
          case "newIngGr":
            result = await postData({
              url: `add/ingredientGroup`,
              data: newGrData,
              tags: ["groups"],
            });
            result = await patchData({
              url: `update/ingredient/${value.id}`,
              data: {
                res_id: value.res_id,
                name: value.name,
                unit: value.unit,
                group: value.group,
              },
              tags: ["ingredient"],
            });
            break;
          case "supp":
            result = await patchData({
              url: `update/suppliers/${value.id}`,
              data: value,
              tags: ["suplier"],
            });
            break;
          case "invGr":
            result = await patchData({
              url: `update/invoiceGroup/${value.id}`,
              data: value,
              tags: ["invoice-group"],
            });
            break;
          case "cashbox":
            result = await patchData({
              url: `update/cashbox/${value.id}`,
              data: value,
              tags: ["cashbox"],
            });
            break;
          case "cashboxGr":
            result = await patchData({
              url: `update/transactionGroups/${value.id}`,
              data: value,
              tags: ["tr-group"],
            });
            break;
          case "trsn":
            result = await patchData({
              url: `update/transaction/${value.id}`,
              data: value,
              tags: ["cashbox-transaction"],
            });
            break;
          default:
            break;
        }
      }

      if (result?.error) {
        es({ message: "Xatolik", variant: "error" });
      } else if (result?.data) {
        dispatch(acCloseUModal());
        setChecked(false);
        ClearForm(".u_modal");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setClose = () => {
    dispatch(acCloseUModal());
    dispatch(acClosePayModal());
    ClearForm(".u_modal");
  };

  return (
    <div
      className={
        payment
          ? `u_modal_container ${pay && "open"}`
          : `u_modal_container ${open && "open"}`
      }>
      <div className="w100 df aic jcc u_modal_box">
        <form
          className={`df flc aic u_modal ${
            darkMode ? "dark-mode" : color ? "dark-color-mode" : ""
          }`}
          onSubmit={fetchValues}>
          <p>{status ? title : "Taxrirlash"}</p>
          {children}
          <button className="relative">
            {loading ? <LoadingBtn /> : "Qo'shish"}
          </button>
        </form>
        <i onClick={() => setClose()} aria-label="df aic jcc close modal"></i>
      </div>
    </div>
  );
};

export default UniversalModal;
