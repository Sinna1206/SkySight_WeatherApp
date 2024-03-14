import React, { useState, useEffect, useCallback} from "react";
import './SkyApp.css'

function LocationTime({ timezoneOffset }) {
    const calculateLocationTime = useCallback(() => {
        const currentTime = new Date();
        const localTime = currentTime.getTime();
        const localOffset = currentTime.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const locationTime = new Date(utc + (1000 * timezoneOffset));
        return locationTime;
    }, [timezoneOffset]);

    const [locationTime, setLocationTime] = useState(calculateLocationTime());

    useEffect(() => {
        setLocationTime(calculateLocationTime()); // Update time immediately when timezoneOffset changes

        const timerId = setInterval(() => {
            setLocationTime(calculateLocationTime()); // Update time every minute
        }, 60000);

        return () => clearInterval(timerId);
    }, [calculateLocationTime]);

    return (
        <div className="data">{locationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    );
}

export default LocationTime;