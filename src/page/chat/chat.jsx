import React from "react";
import "./chat.css";

export const Chat = () => {
  function generate_l_g(numColors) {
    const colors = Array.from(
      { length: numColors },
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );
    const gradient = `linear-gradient(to right, ${colors.join(", ")})`;
    return gradient;
  }
  return (
    <div className="df aic chat-container">
      <div className="df flc aic chat-accounts">
        <h1>Chat</h1>
        <label
          className="df aic chat-search"
          aria-label="to filter the data according by name">
          <input type="search" placeholder="Search" />
        </label>

        <div className="df flc chat-user-list">
          {users?.map((user) => {
            return (
              <div className="df aic _user-item">
                <div
                  className="df aic jcc user-img"
                  style={{ background: generate_l_g(2) }}>
                  {user?.img ? (
                    <img
                      src="https://via.placeholder.com/40"
                      alt="user"
                      aria-label="user's image"
                    />
                  ) : (
                    user?.firstname?.charAt(0) + user?.lastname?.charAt(0)
                  )}
                </div>
                <div className="df flc user-info">
                  <p>
                    {user?.firstname} {user?.lastname}
                  </p>
                  <small>{user?.last_messages?.text || ""}</small>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="df flc chat-content">
        <div className="chat-body"></div>
        <form className="df aic chat-footer">
          <input type="text" placeholder="Type a message" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

const users = [
  {
    id: 100,
    firstname: "John",
    lastname: "Doe",
    chat_id: 1,
    last_messages: {
      id: 1,
      user_id: 100,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 101,
    firstname: "Jane",
    lastname: "Doe",
    chat_id: 1,
    last_messages: {
      id: 2,
      user_id: 101,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 102,
    firstname: "John",
    lastname: "Smith",
    chat_id: 2,
    last_messages: {
      id: 3,
      user_id: 102,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 103,
    firstname: "Jane",
    lastname: "Smith",
    chat_id: 2,
    last_messages: {
      id: 4,
      user_id: 103,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 104,
    firstname: "John",
    lastname: "Johnson",
    chat_id: 3,
    last_messages: {
      id: 5,
      user_id: 104,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 105,
    firstname: "Jane",
    lastname: "Johnson",
    chat_id: 3,
    last_messages: {
      id: 6,
      user_id: 105,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 106,
    firstname: "John",
    lastname: "Brown",
    chat_id: 4,
    last_messages: {
      id: 7,
      user_id: 106,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 107,
    firstname: "Jane",
    lastname: "Brown",
    chat_id: 4,
    last_messages: {
      id: 8,
      user_id: 107,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 108,
    firstname: "John",
    lastname: "Williams",
    chat_id: 5,
    last_messages: {
      id: 9,
      user_id: 108,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 100,
    firstname: "John",
    lastname: "Doe",
    chat_id: 1,
    last_messages: {
      id: 1,
      user_id: 100,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 101,
    firstname: "Jane",
    lastname: "Doe",
    chat_id: 1,
    last_messages: {
      id: 2,
      user_id: 101,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 102,
    firstname: "John",
    lastname: "Smith",
    chat_id: 2,
    last_messages: {
      id: 3,
      user_id: 102,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 103,
    firstname: "Jane",
    lastname: "Smith",
    chat_id: 2,
    last_messages: {
      id: 4,
      user_id: 103,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 104,
    firstname: "John",
    lastname: "Johnson",
    chat_id: 3,
    last_messages: {
      id: 5,
      user_id: 104,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 105,
    firstname: "Jane",
    lastname: "Johnson",
    chat_id: 3,
    last_messages: {
      id: 6,
      user_id: 105,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 106,
    firstname: "John",
    lastname: "Brown",
    chat_id: 4,
    last_messages: {
      id: 7,
      user_id: 106,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
  {
    id: 107,
    firstname: "Jane",
    lastname: "Brown",
    chat_id: 4,
    last_messages: {
      id: 8,
      user_id: 107,
      text: "Hi",
      date: "2021-06-01",
      time: "12:01",
    },
  },
  {
    id: 108,
    firstname: "John",
    lastname: "Williams",
    chat_id: 5,
    last_messages: {
      id: 9,
      user_id: 108,
      text: "Hello",
      date: "2021-06-01",
      time: "12:00",
    },
  },
];
