import React, { useState } from "react";
import './SkyApp.css'

function Clock() {
  const [time, setTime] = useState(new Date());

  setInterval(() => {
    setTime(new Date());
  }, 60000);

  return (
    <div>
      <h1>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
    </div>
  );
}

export default Clock;