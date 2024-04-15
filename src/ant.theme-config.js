export const themeConfig = {
  token: {
    activeBg: "#444",
    activeBorderColor: "red",
    activeShadow: "0px 3px 6px 0px rgba(140, 149, 159, 0.15)",
    hoverBorderColor: "green",
    colorBgElevated: "#444",
    colorBorder: "transparent",
    cellHoverBg: "#444",
    colorPrimary: "#787aff",
    cellActiveWithRangeBg: "#222",
    colorBgContainer: "#333",
  },
  components: {
    DatePicker: {
      zIndexPopup: 9999,
    },
    Select: {
      fontSizeIcon: 10,
      optionActiveBg: "#555",
      optionSelectedBg: "#555",
      zIndexPopup: 9999,
    },
    Notification: {
      zIndexPopup: 9999,
    },
    Segmented: {
      itemSelectedBg: "#444",
      trackBg: "#333",
    },
    Dropdown: {
      zIndexPopup: 9999,
    },
  },
};
