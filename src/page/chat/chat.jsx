import React, { useState, useEffect, Suspense, lazy } from "react";
import "./chat.css";
import socket from "../../socket.config";
import { useFetchDataQuery } from ".././../service/fetch.service";
import { useLocation, useNavigate } from "react-router-dom";
import { generateUniqueId } from "../../service/unique.service";
import { notification } from "antd";

import { ImUserPlus } from "react-icons/im";
import { FaArrowUp } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmark } from "react-icons/io5";
import { LoadingBtn } from "../../components/loading/loading";

const ChatModal = lazy(() => import("./chat.modal"));
// message tick border radius
export const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  // const dep = JSON.parse(localStorage.getItem("department")) || [];
  const [activeChat, setActiveChat] = useState([]);
  const [activeAcc, setActiveAcc] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false);
  const [addfetch, setAddFetch] = useState(false);
  const path = useLocation().search;
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const id = user?.user_id || user?.id;
  const chatContainer = document.getElementById("chat-body");
  const { data: usersD, isLoading } = useFetchDataQuery({
    url: `get/chats/${id}`,
    tags: ["chat"],
  });

  function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  useEffect(() => {
    if (path === "?closeChat") {
      setActiveAcc(null);
      setActiveChat([]);
    }
  }, [path]);

  socket.on(`/get/newChat`, (data) => {
    console.log(data);
  });

  useEffect(() => {
    if (activeAcc?.chat_id) {
      socket.on(`/get/newMessage/${activeAcc?.chat_id}`, (data) => {
        console.log("gelen son mesaj:", data);
        setActiveChat((prev) => {
          const prevChat = activeChat.find(
            (item) => item?.message_id === data?.message_id
          );
          if (prevChat) {
            return prev;
          } else {
            return [...prev, data];
          }
        });
      });
      return () => {
        socket.off(`/get/newMessage/${activeAcc?.chat_id}`);
      };
    }
  }, [activeAcc, activeChat]);

  // when get chat add location's sercha user id
  const getChat = (user) => {
    navigate(`?chat=${user?.chat_id || "no-chat-yet"}`);
    setActiveAcc(user);
    setAddNewChat(false);
  };

  const addChat = async () => {
    setAddNewChat(!addNewChat);
    setAddFetch(true);
    setActiveAcc(null);
    setActiveChat([]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const value = Object.fromEntries(formdata.entries());
    scrollToBottom();
    if (value?.text === "") {
      const placement = "topRight";
      return api.warning({
        message: "Habar yozilmadi!",
        description: "Iltimos, habar yuborish uchun matn kiriting!",
        placement,
      });
    }
    const add_chat = {
      user1: user?.user_id || user?.id,
      user2: activeAcc?.id,
      last_messages: value?.text,
      user1_name: user?.name,
      user2_name: activeAcc?.name,
    };
    const msg = {
      message_id: generateUniqueId(16),
      content: value?.text,
      sender_id: user?.user_id || user?.id,
      read_status: 0,
      received_at: new Date().toLocaleTimeString().slice(0, 5),
    };
    if (addfetch) {
      socket.emit("/create/chat", add_chat);
      e.target.reset();
      setAddNewChat(false);
      setAddFetch(false);
    } else {
      setActiveChat((prev) => [...prev, msg]);
      socket.emit("/send/message", {
        ...msg,
        chat_id: activeAcc?.chat_id,
        receiver_id: activeAcc?.id,
      });
      e.target.reset();
    }
  };
  return (
    <>
      {contextHolder}
      <div className="df aic chat-container">
        <div
          className={`df flc aic chat-accounts ${
            (activeAcc?.user2_name || activeAcc?.name) && "close"
          }`}>
          <h1 className="df aic _accounts-header">
            <span>Chat</span>
            <small style={{ cursor: "pointer" }} onClick={() => addChat()}>
              <ImUserPlus />
            </small>
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
            ) : usersD?.data !== "there are no Chats" ? (
              usersD?.data?.map((inUser, ind) => {
                const last_m = JSON.parse(inUser?.last_messages || "[]");
                const name =
                  inUser?.user2_name === (user?.name || user?.username)
                    ? inUser?.user1_name
                    : inUser?.user2_name;
                return (
                  <div
                    className={`df aic _user-item 
                ${activeAcc?.id === inUser?.id ? "active" : ""}
                `}
                    key={`${inUser?.user2_id}_${ind}`}
                    onClick={() => getChat(inUser)}>
                    <div
                      className="df aic jcc user-img"
                      style={{ background: inUser?.bg || "#666" }}>
                      {inUser?.img ? (
                        <img
                          src="https://via.placeholder.com/40"
                          alt="user"
                          aria-label="user's image"
                        />
                      ) : (
                        name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="df flc user-info">
                      <p>{name}</p>
                      <small>{last_m?.[0]?.content || ""}</small>
                      {!inUser?.read_status ? (
                        <span className="df aic jcc badge">
                          {last_m?.length + 1}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="empty-chat">Chatlaringiz yo'q</span>
            )}
          </div>
        </div>
        <div className="df flc chat-content">
          <div className="df flc chat-body" id="chat-body">
            <p className="df aic jcc chat-body-header">
              <span>
                {activeAcc?.user2_name || activeAcc?.name || "Chat tanlang"}
              </span>
            </p>
            {activeChat?.length ? (
              activeChat?.map((message, ind) => {
                return (
                  <div
                    className={`df aic ${
                      message?.sender_id === (user?.user_id || user?.id)
                        ? "chat-right"
                        : "chat-left"
                    }`}
                    key={`${message?.message_id}_${ind}`}>
                    <div className="df chat-message">
                      <p>{message?.content}</p>
                      <sup>
                        <small className="df aic">
                          {message?.received_at}{" "}
                          {message?.sender_id === user?.id ? (
                            message?.read_status === 0 ? (
                              <IoCheckmark />
                            ) : (
                              <IoCheckmarkDoneOutline />
                            )
                          ) : (
                            ""
                          )}
                        </small>
                      </sup>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="empty-chat">Chat bo'sh</span>
            )}
          </div>
          <form
            className={`df aic chat-footer ${
              activeAcc?.user2_name || activeAcc?.name ? "" : "hide"
            }`}
            onSubmit={(e) => sendMessage(e)}>
            <input
              type="text"
              name="text"
              placeholder="Habar yozing"
              autoComplete="off"
            />
            <button>
              <FaArrowUp />
            </button>
          </form>
        </div>
      </div>
      <Suspense>
        {addNewChat && (
          <ChatModal
            getChat={getChat}
            activeAcc={activeAcc}
            setAddNewChat={setAddNewChat}
          />
        )}
      </Suspense>
    </>
  );
};
