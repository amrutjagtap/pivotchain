import React, { useState, useEffect } from "react";

function DigitalClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = formatTime(date.getMonth() + 1);
    const day = formatTime(date.getDate());
    return `${day}/${month}/${year}`;
  };

  const formatTimeComponent = (date) => {
    return `${formatTime(date.getHours())}:${formatTime(
      date.getMinutes()
    )}:${formatTime(date.getSeconds())}`;
  };

  return (
    <div className="container-fluid">
      <div className="fw-bold">{formatDate(currentDateTime)}</div>
      <div className="fw-bold">{formatTimeComponent(currentDateTime)}</div>
    </div>
  );
}

export default DigitalClock;
