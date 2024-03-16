import React, { useState, useEffect } from "react";
import "./modal-calc.css";
import { enqueueSnackbar as es } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { acCloseUModal } from "../../redux/u-modal";
import { calculateTotal } from "./components";
import { acCalc, acCutting } from "../../redux/calc";
import { LoadingBtn } from "../../components/loading/loading";
import { useFetchDataQuery } from "../../service/fetch.service";
import { usePostDataMutation } from "../../service/fetch.service";
import { usePatchDataMutation } from "../../service/fetch.service";
import { ClearForm } from "../../service/form.service";
import { acPassiveThing } from "../../redux/active";
import { acGetUrl } from "../../redux/u-modal";
import { acStorageId } from "../../redux/active";
import { notification } from "antd";
import middlewareService from "../../middleware/form.middleware";
import { GenerateField } from "../../hooks/generate.tags";
import { Popover, ConfigProvider } from "antd";

import { FaCalculator, FaCheck, FaInfo } from "react-icons/fa";
import { TbArrowBarLeft } from "react-icons/tb";
import { RiImageAddFill } from "react-icons/ri";
const user = JSON.parse(localStorage.getItem("user"))?.user || null;

export const UniversalControlModal = ({
  children,
  status,
  type,
  Pdata,
  Udata,
  id,
  setCheckedData,
}) => {
  const open = useSelector((state) => state.uModal);
  const image = useSelector((state) => state.image);
  const [fetchdata, setFetchdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [postData] = usePostDataMutation();
  //update points
  const [patchData] = usePatchDataMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setFetchdata({});
  }, [Pdata, Udata]);

  const [api, contextHolder] = notification.useNotification();
  const openWarning = (placement) => {
    api.warning({
      message: "Yaroqsiz ma'lumot",
      description:
        "Iltimos, barcha maydonlarni to'ldiring yoki to'g'ri ma'lumot kiritganingizni tekshiring!",
      placement,
    });
  };

  const content = (
    <div>
      <p>
        <TbArrowBarLeft /> – Oynani yopish uchun
      </p>
      <p>
        <FaCalculator /> – Oynadagi malumotlarni hisoblash uchun
      </p>
      <p>
        <FaCheck /> – Oynadagi malumotlarni saqlash uchun
      </p>
      <p>
        <RiImageAddFill /> – Mahsulot uchun rasm qo'shish uchun <br /> (faqat
        mahsulot qo'shish sahifasida ko'rinadi)
      </p>
    </div>
  );

  const fetchValues = async (value) => {
    setLoading(true);
    if (value.ingredients && Array.isArray(value.ingredients)) {
      value.ingredients = JSON.stringify(value.ingredients);
    }
    try {
      let result;

      if (status) {
        switch (type) {
          case "product":
            result = await patchData({
              url: `update/foods/${value.id}`,
              data: value,
              tags: ["s-products"],
            });
            break;
          case "invoice":
            result = await patchData({
              url: `update/receivedGoods/${value.id}`,
              data: value,
              tags: ["invoices"],
            });
            break;
          case "cutting":
            result = await patchData({
              url: `update/cutting/${value.id}`,
              data: value,
              tags: ["cutting"],
            });
            break;
          case "damaged":
            result = await patchData({
              url: `update/damagedGoods/${value.id}`,
              data: value,
              tags: ["damaged"],
            });
            break;
          case "edr":
            result = await patchData({
              url: `update/usedGoods/${value.id}`,
              data: value,
              tags: ["expenditure"],
            });
            break;
          case "carryUp":
            result = await patchData({
              url: `update/carry-up/${value.id}`,
              data: value,
              tags: ["carry-up"],
            });
            break;
          case "making":
            result = await patchData({
              url: `update/preparedFoods/${value.id}`,
              data: value,
              tags: ["makingFood"],
            });
            break;
          case "preOrder":
            result = await patchData({
              url: `update/preOrders/${value.id}`,
              data: {
                res_id: value.res_id,
                name: value.name,
                department: value.department,
              },
              tags: ["pre-order"],
            });
            break;
          default:
            break;
        }
      } else {
        switch (type) {
          case "product":
            result = await postData({
              url: "add/food",
              data: value,
              tags: ["s-products"],
            });
            break;
          case "invoice":
            result = await postData({
              url: "add/receivedGoods",
              data: value,
              tags: ["invoices"],
            });
            result = await patchData({
              url: `update/storageItems/${id}`,
              data: { ingredients: Udata },
              tags: ["inventory"],
            });
            break;
          case "cutting":
            result = await postData({
              url: "add/cutting",
              data: value,
              tags: ["cutting"],
            });
            break;
          case "damaged":
            result = await postData({
              url: "add/damagedGoods",
              data: value,
              tags: ["damaged"],
            });
            break;
          case "edr":
            result = await postData({
              url: "add/usedGoods",
              data: value,
              tags: ["expenditure"],
            });
            break;
          case "carryUp":
            result = await postData({
              url: "move/goods",
              data: value,
              tags: ["carry-up"],
            });
            break;
          case "making":
            result = await postData({
              url: "make/food",
              data: value,
              tags: ["makingFood"],
            });
            break;
          case "preOrder":
            result = await postData({
              url: "add/preOrders",
              data: value,
              tags: ["pre-order"],
            });
            break;
          default:
            break;
        }
      }

      if (result?.error) {
        es({ message: "Xatolik", variant: "error" });
      } else if (result?.data) {
        es({ message: "Qo'shildi", variant: "success" });
        // ClearForm(".u-control-form");
        // dispatch(acCloseUModal());
        dispatch(acPassiveThing());
        dispatch(acCutting(0));
        dispatch(acGetUrl({ st: false, img: "" }));
        // setCheckedData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getValues = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const ds = Object.fromEntries(formdata.entries());
    const value = middlewareService(ds, openWarning);
    const data = { ...value, ingredients: Pdata };
    data.res_id = user.id;
    if (type !== "cutting") {
      delete data.amount;
    }

    const result = calculateTotal(data);
    dispatch(acCalc(result));
    if (type === "product") {
      setFetchdata({ ...data, ...result });
    }
    if (type === "invoice") {
      setFetchdata({
        ...data,
        cost: result.prime_cost,
        leftover: result.prime_cost,
      });
    }
    if (type === "edr") {
      setFetchdata({
        ...data,
        cost: result.prime_cost,
      });
    }
    if (type === "cutting") {
      setFetchdata({ ...data });
    }
    if (type === "carryUp") {
      setFetchdata({ ...data, amount: result?.prime_cost });
    }
    if (type === "damaged") {
      setFetchdata({ ...data, cost: result?.prime_cost });
    }
    if (type === "making") {
      setFetchdata({ ...data, total_price: result?.prime_cost });
    }
    if (type === "preOrder") {
      setFetchdata({ ...data, cost: result?.prime_cost });
    }
    console.log("data", data, "result", result);
  };

  const closeModal = () => {
    dispatch(acCloseUModal());
    dispatch(acPassiveThing());
    setCheckedData([]);
  };

  return (
    <>
      {contextHolder}
      <form
        className={open ? "u-control-container open" : "u-control-container"}
        onSubmit={getValues}
        id="u-control-form">
        {children}
        <div
          className={
            open ? "u-control_action__box active" : "u-control_action__box"
          }>
          <ConfigProvider
            theme={{
              components: {
                Popover: {
                  fontSize: "var(--fs6)",
                },
              },
            }}>
            <Popover
              content={content}
              title="Harakat tugmalari vazifalari"
              placement="topRight"
              trigger="click">
              <button type="button" aria-label="get info about buttons">
                <FaInfo />
              </button>
            </Popover>
          </ConfigProvider>
          {image.img !== "" && (
            <figure
              onClick={() =>
                dispatch(acGetUrl({ st: true, img: image?.img, type: "view" }))
              }>
              <img src={image?.img} alt="peoduct images" />
            </figure>
          )}
          {type === "product" && (
            <button
              type="button"
              onClick={() => dispatch(acGetUrl({ st: true, img: "" }))}
              aria-label="modal of add image">
              <RiImageAddFill />
            </button>
          )}
          <button
            type="button"
            className="relative"
            onClick={() => fetchValues(fetchdata)}
            aria-label="add values of the all input's value">
            {loading ? <LoadingBtn /> : <FaCheck />}
          </button>
          <button
            type="submit"
            aria-label="calculate values of the all input's value">
            <FaCalculator />
          </button>
          <button
            type="button"
            onClick={() => closeModal()}
            aria-label="close modal">
            <TbArrowBarLeft />
          </button>
        </div>
      </form>
    </>
  );
};

export const UniversalForm = ({ formData }) => {
  return (
    <div className="wdfaic u-control_form_box">
      {formData?.map((field, index) => (
        <GenerateField key={`${index}_${field.name}`} fieldData={field} />
      ))}
    </div>
  );
};

export const UniversalProductControl = ({
  children,
  setActivePart,
  activePart,
  type,
}) => {
  const { data: store = [] } = useFetchDataQuery({
    url: `/get/storage/${user?.id}`,
    tags: ["store"],
  });
  const { data: groups = [] } = useFetchDataQuery({
    url: `get/ingredientGroups/${user?.id}`,
    tags: ["groups"],
  });
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (store?.data?.length > 0) {
      dispatch(acStorageId(store?.data?.[0]?.id));
    }
  }, [dispatch, store?.data]);

  return (
    <div className="u-control_add_box">
      <div className="section_u">
        <div className="add_box__header">
          <div className="wdfaic _header_parts">
            {type === "preOrder" ? (
              <span className="active">taomlar</span>
            ) : (
              <>
                <span
                  className={activePart === 1 ? "active" : "passive"}
                  onClick={() => setActivePart(1)}
                  aria-label="target ingredient section">
                  ingredientlar
                </span>
                <span
                  className={activePart === 2 ? "active" : "passive"}
                  onClick={() => setActivePart(2)}
                  aria-label=" target product section">
                  taomlar
                </span>
              </>
            )}
          </div>
          <input
            type="search"
            placeholder="Qidirish..."
            aria-label="search ingredient or products for add"
          />
          {activePart === 1 && (
            <>
              <select>
                <option value="default">Guruh tanlang</option>
                {groups?.data?.map((item) => {
                  return (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <select onChange={(e) => dispatch(acStorageId(e.target.value))}>
                {store?.data?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </>
          )}
        </div>
        <div className="u-control_product_box">{children}</div>
      </div>
    </div>
  );
};

export const CalcResult = ({ children, status }) => {
  const calculatedData = useSelector((state) => state.calc);
  return (
    <div className="u-control_calc_box">
      <div className="u-control_calc_body">{children}</div>
      {status === "cr" && (
        <div className="product_box_footer">
          <p>
            Tan narx: <span>{calculatedData?.prime_cost}</span>
          </p>
          <p>
            Foyda: <span>{calculatedData?.profit?.toFixed(2)}</span>
          </p>
          <p>
            Foyda(%): <span>{calculatedData?.markup?.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export const CalcResultHeader = ({ children, headerKeys }) => {
  return <div className="product_box_item">{children}</div>;
};

export const CalcResultBody = ({ data = [], status, displayKeys }) => {
  return (
    <div className="product_box_body">
      {data?.map((item, index) => (
        <div className="product_box_item" key={item.id + index}>
          <label>{index + 1}</label>
          {displayKeys?.map(({ name, size, position }, ind) => (
            <p
              key={ind}
              style={{
                "--data-line-size": size,
                justifyContent: position
                  ? position === 1
                    ? "center"
                    : "end"
                  : "start",
              }}>
              {item?.[name] || 0}
            </p>
          ))}
          {status !== "inv" && (
            <p
              style={{
                "--data-line-size": "18%",
                justifyContent: "end",
              }}>
              {item.price * item.amount}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
