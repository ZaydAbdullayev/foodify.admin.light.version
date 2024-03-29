export const getFormattedDate = (offset) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - offset);
  return currentDate.toISOString().split("T")[0];
};

export const calculateWeekRange = (offset) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return {
    start: startOfWeek.toISOString().split("T")[0],
    end: endOfWeek.toISOString().split("T")[0],
  };
};

export const calculateMonthRange = (offset) => {
  const today = new Date();
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + offset,
    1
  );
  const lastDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() + offset + 1,
    0
  );
  return {
    start: firstDayOfMonth.toISOString().split("T")[0],
    end: lastDayOfMonth.toISOString().split("T")[0],
  };
};

export const calculateDifTime = (time) => {
  const currentTime = new Date();
  const oldTime = new Date(time);
  const difference = currentTime - oldTime;
  const diffMinutes = Math.floor(difference / (1000 * 60));

  if (diffMinutes >= 60) {
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    const diffDays = Math.floor(diffHours / 24);
    const remainingHours = diffHours % 24;

    const diffTimeStr = `${diffDays}:${remainingHours}:${remainingMinutes}`;
    return diffTimeStr;
  } else {
    const diffTimeStr = `00:00:${diffMinutes}`;
    return diffTimeStr;
  }
};

export const getWeekDay = (offset) => {
  const days = [
    "Yakshanba",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
  ];

  return days[offset];
};
