import React from "react";
import "./chat.css";
import { useFetchDataQuery } from ".././../service/fetch.service";
import { LoadingBtn } from "../../components/loading/loading";

const ChatModal = ({ getChat, activeAcc, setAddNewChat }) => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const id = user?.user_id || user?.id;

  const { data: workers = {}, isLoading } = useFetchDataQuery({
    url: `get/workersList/${user?.id}/${id}`,
    tags: ["workers"],
  });

  return (
    <div className={`workers-modal_container`}>
      <div className="df flc aic workers-modal">
        <h1 className="df aic _accounts-header">
          <small>Habar yuborish</small>
        </h1>
        <label
          className="df aic chat-search"
          aria-label="to filter the data according by name">
          <input type="search" placeholder="Search" />
        </label>

        <div className="df flc chat-user-list">
          {isLoading ? (
            <span className="relative">
              <LoadingBtn />
            </span>
          ) : (
            workers?.data?.map((user) => {
              const add = true;
              return (
                <div
                  className={`df aic _user-item 
                ${activeAcc?.id === user?.id ? "active" : ""}
                `}
                  key={user?.id}
                  onClick={() => getChat(user, add)}>
                  <div
                    className="df aic jcc user-img"
                    style={{ background: user?.bg || "#666" }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="df flc user-info">
                    <p>{user?.name}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <i onClick={() => setAddNewChat(false)}></i>
    </div>
  );
};

export default ChatModal;
