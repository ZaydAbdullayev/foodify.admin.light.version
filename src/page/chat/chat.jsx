import React, { useState, useEffect, Suspense, lazy } from "react";
import "./chat.css";
import socket from "../../socket.config";
import { useFetchDataQuery } from ".././../service/fetch.service";
import { usePostDataMutation } from ".././../service/fetch.service";
import { useLocation, useNavigate } from "react-router-dom";
import { generateUniqueId } from "../../service/unique.service";
import { notification } from "antd";

import { ImUserPlus } from "react-icons/im";
import { FaArrowUp } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmark } from "react-icons/io5";
import { LoadingBtn } from "../../components/loading/loading";

const ChatModal = lazy(() => import("./chat.modal"));
export const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const [activeChat, setActiveChat] = useState([]);
  const [activeAcc, setActiveAcc] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false);
  const [addfetch, setAddFetch] = useState(false);
  const path = useLocation().search;
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [postData] = usePostDataMutation();
  const id = user?.user_id || user?.id;
  const { data: usersD, isLoading } = useFetchDataQuery({
    url: `get/chats/${id}`,
    tags: ["chat"],
  });

  const scrollToBottom = async () => {
    const chatContainer = document.getElementById("chat-body");
    chatContainer.scrollTop = chatContainer?.scrollHeight;
  };

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
        if (data?.sender_id !== id) {
          socket.emit("/mark/asRead", data);
        }
        setActiveChat((prev) => {
          const prevChat = activeChat.find(
            (item) => item?.message_id === data?.message_id
          );
          if (prevChat) {
            return prev.map((item) =>
              item?.message_id === data?.message_id ? data : item
            );
          } else {
            return [...prev, data];
          }
        });
      });
      return () => {
        socket.off(`/get/newMessage/${activeAcc?.chat_id}`);
      };
    }
  }, [activeAcc?.chat_id, activeChat, id]);

  // when get chat add location's sercha user id
  const getChat = async (user) => {
    navigate(`?chat=${user?.chat_id || "no-chat-yet"}`);
    setActiveAcc(user);
    setAddNewChat(false);
    const { data = {} } = await postData({
      url: `get/messages/${user?.chat_id}`,
      tags: ["chat"],
    });
    setActiveChat(data?.data || []);
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
    if (value?.text === "") {
      const placement = "topRight";
      return api.warning({
        message: "Habar yozilmadi!",
        description: "Iltimos, habar yuborish uchun matn kiriting!",
        placement,
      });
    }
    const msg = {
      message_id: generateUniqueId(16),
      content: value?.text,
      sender_id: id,
      receiver_id: activeAcc?.id,
      read_status: 0,
      received_at: new Date().toLocaleString(),
    };
    const add_chat = {
      user1: id,
      user2: activeAcc?.id,
      last_messages: JSON.stringify([msg]),
      user1_name: user?.name,
      user2_name: activeAcc?.name,
    };
    setActiveChat((prev) => [...prev, msg]);
    if (addfetch) {
      socket.emit("/create/chat", add_chat);
      e.target.reset();
      setAddNewChat(false);
      setAddFetch(false);
    } else {
      socket.emit("/send/message", {
        ...msg,
        chat_id: activeAcc?.chat_id,
        receiver_id: activeAcc?.id,
      });
      e.target.reset();
    }
    scrollToBottom();
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
                const uid =
                  inUser?.user2 === id ? inUser?.user1 : inUser?.user2;
                return (
                  <div
                    className={`df aic _user-item 
                ${
                  uid === (activeAcc?.user1 || activeAcc?.user1) ? "active" : ""
                }
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
                      <small>
                        {last_m?.[last_m?.length - 1]?.content || ""}
                      </small>
                      {!inUser?.read_status && last_m?.length ? (
                        <span className="df aic jcc badge">
                          {last_m?.length}
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
          <p className="df aic jcc chat-body-header">
            <span>
              {activeAcc?.name ||
              activeAcc?.user2_name === (user?.name || user?.username)
                ? activeAcc?.user1_name
                : activeAcc?.user2_name || "Chat tanlang"}
            </span>
          </p>
          {activeChat?.length ? (
            <div className="df flc chat-body" id="chat-body">
              {activeChat?.map((message, ind) => {
                return (
                  <div
                    className={`df flc ${
                      message?.sender_id === id ? "chat-right" : "chat-left"
                    }`}
                    key={`${message?.message_id}_${ind}`}>
                    <p id="paragraf">{message?.content}</p>
                    <span>
                      {" "}
                      {message?.received_at?.split(" ")[1].slice(0, 5)}
                      {message?.sender_id === id ? (
                        message?.read_status === 0 ? (
                          <IoCheckmark />
                        ) : (
                          <IoCheckmarkDoneOutline />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="empty-chat">Chat bo'sh</span>
          )}
          <form
            className={`df aic chat-footer ${
              activeAcc?.user2_name || activeAcc?.name ? "" : "hide"
            }`}
            onSubmit={(e) => sendMessage(e)}>
            <label>
              <input
                type="text"
                name="text"
                placeholder="Habar yozing"
                autoComplete="off"
              />
              <button>
                <FaArrowUp />
              </button>
            </label>
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
