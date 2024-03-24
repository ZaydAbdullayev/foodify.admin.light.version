import React, { useState, useEffect, Suspense, lazy } from "react";
import "./chat.css";
import socket from "../../socket.config";
import { useFetchDataQuery } from ".././../service/fetch.service";
import { usePostDataMutation } from ".././../service/fetch.service";
import { useLocation, useNavigate } from "react-router-dom";
import { generateUniqueId } from "../../service/unique.service";
import { notification } from "antd";

import { ImUserPlus } from "react-icons/im";
import { FaArrowUp, FaChevronDown } from "react-icons/fa6";
import { IoCheckmarkDoneOutline, IoCheckmark } from "react-icons/io5";
import { LoadingBtn } from "../../components/loading/loading";

const ChatModal = lazy(() => import("./chat.modal"));
export const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"))?.user || {};
  const [activeChat, setActiveChat] = useState([]);
  const [activeAcc, setActiveAcc] = useState(null);
  const [addNewChat, setAddNewChat] = useState(false);
  const [addfetch, setAddFetch] = useState(false);
  const [chats, setChats] = useState([]);
  const path = useLocation().search;
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [postData] = usePostDataMutation();
  const id = user?.user_id || user?.id;
  const user_name = user?.name || user?.username;
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

  socket.on(`/get/newChat/${id}`, (data) => {
    console.log("new-chat", data);
    setChats((prev) => {
      const isPrevChatExist = prev.some(
        (item) => item?.chat_id === data?.chat_id
      );
      if (isPrevChatExist) {
        return prev.map((item) =>
          item?.chat_id === data?.chat_id ? data : item
        );
      } else {
        return Array.isArray(prev) && prev.length > 0
          ? [data, ...prev]
          : [data];
      }
    });
    socket.off(`/get/newChat/${id}`);
  });

  const markMessageAsRead = async (data) => {
    if (data?.sender_id !== id) {
      socket.emit("/mark/asRead", data);
    }
  };

  useEffect(() => {
    if (activeAcc?.chat_id) {
      socket.on(`/get/newMessage/${activeAcc?.chat_id}`, (data) => {
        console.log("gelen son mesaj:", data);
        if (data.read_status === 0) {
          markMessageAsRead(data);
        }
        // Check if the message is already present in activeChat
        setActiveChat((prev) => {
          const prevChat = activeChat?.find(
            (item) => item?.message_id === data?.message_id
          );
          if (prevChat) {
            return prev?.map((item) =>
              item?.message_id === data?.message_id ? data : item
            );
          } else {
            return prev?.length ? [...prev, data] : [data];
          }
        });
      });

      return () => {
        socket.off(`/get/newMessage/${activeAcc?.chat_id}`);
      };
    }
  }, [activeAcc?.chat_id, activeChat]);

  // when get chat add location's sercha user id
  const getChat = async (user) => {
    navigate(`?chat=${user?.chat_id || "no-chat-yet"}`);
    setActiveAcc(user);
    setAddNewChat(false);
    const { data = {} } = await postData({
      url: `get/messages/${user?.chat_id}/${id}`,
      tags: ["chat"],
    });
    const chat = Array.isArray(data?.data) ? data?.data : [];
    setActiveChat(chat);
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
    const r_id = activeAcc?.user2 === id ? activeAcc?.user1 : activeAcc?.user2;
    const msg = {
      message_id: generateUniqueId(16),
      content: value?.text,
      sender_id: id,
      receiver_id: activeAcc?.id || r_id,
      read_status: 0,
      received_at: new Date().toISOString(),
    };
    const add_chat = {
      user1: id,
      user2: activeAcc?.id,
      last_messages: JSON.stringify([msg]),
      user1_name: user?.name,
      user2_name: activeAcc?.name,
    };
    setActiveChat((prev) => (prev?.length ? [...prev, msg] : [msg]));
    setTimeout(() => {
      scrollToBottom();
    }, 0);
    if (addfetch) {
      socket.emit("/create/chat", add_chat);
      e.target.reset();
      setAddNewChat(false);
      setAddFetch(false);
    } else {
      socket.emit("/send/message", {
        ...msg,
        chat_id: activeAcc?.chat_id,
        receiver_id: activeAcc?.id || r_id,
      });
      console.log("msg", { ...msg, chat_id: activeAcc?.chat_id });
      e.target.reset();
    }
  };

  // escape key to close chat
  useEffect(() => {
    const closeChat = (e) => {
      if (e.key === "Escape") {
        navigate(`?closeChat`);
        setActiveAcc(null);
        setActiveChat([]);
      }
    };
    window.addEventListener("keydown", closeChat);
    return () => {
      window.removeEventListener("keydown", closeChat);
    };
  }, [navigate]);

  const chatData = chats?.length ? chats : usersD?.data;
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
            ) : Array.isArray(chatData) ? (
              chatData?.map((inUser, ind) => {
                const last_m = JSON?.parse(inUser?.last_messages || "[]");
                const name =
                  inUser?.user2_name === user_name
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
                      {inUser?.read_status === 0 &&
                      last_m?.length &&
                      last_m?.[last_m?.length - 1]?.sender_id !== id ? (
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
              {activeAcc?.name
                ? activeAcc?.name
                : activeAcc?.user1_name === user_name
                ? activeAcc?.user2_name
                : activeAcc?.user1_name || "Chat tanlang"}
            </span>
          </p>
          {activeChat?.length ? (
            <div className="df flc chat-body" id="chat-body">
              {activeChat?.map((message, ind) => {
                const hour = new Date(message?.received_at).getHours();
                const minute = new Date(message?.received_at).getMinutes();
                return (
                  <div
                    className={`df flc ${
                      message?.sender_id === id ? "chat-right" : "chat-left"
                    }`}
                    key={`${message?.message_id}_${ind}`}>
                    <p id="paragraf">{message?.content}</p>
                    <span>
                      {hour < 10 ? `0${hour}` : hour}:
                      {minute < 10 ? `0${minute}` : minute}
                    </span>
                    <i>
                      {message?.sender_id === id ? (
                        message?.read_status === 0 ? (
                          <IoCheckmark />
                        ) : (
                          <IoCheckmarkDoneOutline />
                        )
                      ) : (
                        ""
                      )}
                    </i>
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
                autoFocus
              />
              <button>
                <FaArrowUp />
              </button>
            </label>
          </form>
          <span
            className={`df aic jcc scroll-down`}
            onClick={() => scrollToBottom()}>
            <FaChevronDown />
          </span>
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
