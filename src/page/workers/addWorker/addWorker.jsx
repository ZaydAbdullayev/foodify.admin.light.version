import React, { useState } from "react";
import "./addWorker.css";
import { enqueueSnackbar as es } from "notistack";
// import { useNavigate } from "react-router-dom";
import { LoadingBtn } from "../../../components/loading/loading";
import { useFetchDataQuery } from "../../../service/fetch.service";
import { usePostDataMutation } from "../../../service/fetch.service";
import { Tag, ConfigProvider } from "antd";
export const AddWorker = ({ open, setOpen, state }) => {
  const res = JSON.parse(localStorage.getItem("user"))?.user || [];
  const [loading, setLoading] = useState(false);
  const [postData] = usePostDataMutation();
  const { data: depData = [] } = useFetchDataQuery({
    url: `get/${res?.id}/departments`,
    tags: ["department"],
  });
  const [selectedTags, setSelectedTags] = useState([]);
  // const { data: depData = [] } = useFetchDataQuery({
  //   url: `/get/depW/${res?.id}`,
  //   tags: [""],
  // });
  // const navigate = useNavigate();

  const deps = [
    "ish boshqaruvchi",
    "kassir",
    "buxgalter",
    "mezbon",
    "oshpaz",
    "barmen",
    "offitsant",
    "tozalovchi",
  ];
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const addWorker = async (e) => {
    e.preventDefault();
    const wdata = new FormData(e.target);
    const value = Object.fromEntries(wdata.entries());
    console.log(value);
    try {
      const { data } = await postData({
        url: "/add/worker",
        data: value,
        tags: ["worker"],
      });
      if (data) {
        setOpen(false);
        es("Ishchi qo'shildi", { variant: "success" });
      }
    } catch (err) {
      return es("Xatolik", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const create_login = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = Object.fromEntries(formData);
    try {
      setLoading(true);
      const { data } = await postData({
        url: `/add/loginInfo/${res?.id}`,
        data: value,
        tags: [""],
      });
      localStorage.setItem("permission", JSON.stringify(data));
      window.location.reload();
    } catch (err) {
      return es("Xatolik", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={open ? "addWorker_container open" : "addWorker_container"}>
      <div className="add_worker_box">
        {state === 1 ? (
          <form className="add_worker relative" onSubmit={addWorker}>
            <p>Yangi ishchi qo'shish</p>
            <input
              type="text"
              name="name"
              required
              autoComplete="off"
              placeholder="Ishchining ismi*"
            />
            <input
              type="text"
              name="pin"
              required
              autoComplete="off"
              placeholder="Ishchi uchun kirish kodi*"
            />
            <select name="department">
              <option value="">Bo'lim tanlang</option>
              {deps?.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="deparments">
              {depData?.data?.map((tag) => (
                <ConfigProvider
                  theme={{
                    components: {
                      Tag: {
                        defaultColor: "red",
                        defaultBg: "#454545",
                      },
                    },
                  }}>
                  <Tag.CheckableTag
                    key={tag?.name}
                    checked={selectedTags.includes(tag?.name)}
                    onChange={(checked) => handleChange(tag?.name, checked)}>
                    {tag?.name}
                  </Tag.CheckableTag>
                </ConfigProvider>
              ))}
            </div>
            <input type="hidden" name="res_id" value={res?.id} />
            <button className="relative">
              {loading ? <LoadingBtn /> : "Qo'shish"}
            </button>
            <span className="close_btn" onClick={() => setOpen(false)}>
              ×
            </span>
          </form>
        ) : (
          <form className="add_worker relative" onSubmit={create_login}>
            <input
              type="text"
              name="workers"
              placeholder="Username"
              required
              autoComplete="off"
            />
            <input
              type="text"
              name="workerpass"
              placeholder="Password"
              required
              autoComplete="off"
            />
            <button className="relative">
              {loading ? <LoadingBtn /> : "Qo'shish"}
            </button>
            <span className="close_btn" onClick={() => setOpen(false)}>
              ×
            </span>
          </form>
        )}

        <i
          onClick={() => setOpen(false)}
          aria-label="close add new worker modal"></i>
      </div>
    </div>
  );
};
