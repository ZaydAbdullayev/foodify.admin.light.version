import React, { useState } from "react";
import "./inventory.css";
import { InputNumber, Segmented, Select } from "antd";
import { useFetchDataQuery } from "../../service/fetch.service";
import { usePostDataMutation } from "../../service/fetch.service";
import { useLocation } from "react-router-dom";
import { LoadingBtn } from "../../components/loading/loading";

export const AddInventory = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const [postData] = usePostDataMutation();
  const lc = useLocation();
  const searchParams = new URLSearchParams(lc.search);
  const num = searchParams.get("number");
  const date = searchParams.get("date");
  const st_name = searchParams.get("sname");
  const st_id = searchParams.get("sid");
  const desc = searchParams.get("desc");
  const [type, setType] = useState("i");
  const [filter, setFilter] = useState("all");
  const [newData, setNewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: ingredients = {}, isLoading } = useFetchDataQuery({
    url: `get/storageItems/${user?.id}/${st_id}`,
    tags: ["ingredients"],
  });
  const { data: ct = [] } = useFetchDataQuery({
    url: `get/${user?.id}/categories`,
    tags: ["category"],
  });

  const { data: g = [] } = useFetchDataQuery({
    url: `get/ingredientGroups/${user?.id}`,
    tags: ["groups"],
  });

  const syncData = async () => {
    try {
      setLoading(true);
      const uData = {
        old_data: JSON.stringify(ingredients?.data),
        new_data: JSON.stringify(newData),
        storage_id: st_id,
        st_name: st_name,
        res_id: user?.id,
        number: num,
        description: desc,
      };
      const { data = null } = await postData({
        url: `/sync/storage`,
        data: uData,
        tags: ["inventory"],
      });
      if (data.message === "syncStorage has been added") {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w100 df flc aic inventory-container">
      <div className="w100 df aic jcsb inventory-add-title">
        <big>Inventarizatsiya qilish</big>
        <div className="df aic inventory-title-filter">
          <Select
            aria-label="place for choose option"
            defaultValue="i"
            onChange={(e) => setType(e)}
            options={[
              { label: "Ingredientlar", value: "i" },
              { label: "Ovqatlar", value: "p" },
            ]}
          />

          <Select
            aria-label="place for choose option"
            defaultValue={{
              label: (type === "i" ? g?.data : ct?.data)?.[0]?.name,
              value: (type === "i" ? g?.data : ct?.data)?.[0]?.name,
            }}
            options={(type === "i" ? g?.data : ct?.data)?.map((item) => ({
              label: item?.name,
              value: item?.name,
            }))}
          />
        </div>
      </div>
      <div className="w100 df jcc add-table-box">
        {isLoading ? (
          <span className="relative loader_box" style={{ margin: "auto" }}>
            <LoadingBtn />
          </span>
        ) : (
          <table className="w100 inventory-add-table" border={1}>
            <thead>
              <tr>
                <td>Maxsulot</td>
                <th>Oldigni soni</th>
                <th>Narxi</th>
                <th>Yangi soni</th>
              </tr>
            </thead>
            <tbody>
              {ingredients?.data?.map((itm, ind) => {
                return (
                  <tr key={`${itm?.name}_${ind}`}>
                    <td>{itm?.name}</td>
                    <th>{itm?.total_quantity}</th>
                    <th>{itm?.price}</th>
                    <th>
                      <InputNumber
                        addonAfter={itm?.unit}
                        aria-label="place for input number"
                        placeholder="Yangi soni"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        onChange={(e) => {
                          const newData = [...ingredients?.data];
                          newData[ind] = { ...newData[ind], total_quantity: e };
                          setNewData(newData);
                        }}
                      />
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <button className="relative finish-btn" onClick={() => syncData()}>
        {loading ? <LoadingBtn s={"small"} /> : "Yakunlash"}
      </button>
    </div>
  );
};
