import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function BestLapChart({ gp, session }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!gp || !session) return;
    axios.get(`http://localhost:8080/api/laps/fastest?gp=${encodeURIComponent(gp)}&session=${encodeURIComponent(session)}`)
      .then(res => {
        // expected array of { driver_code, driver, lapTime_seconds }
        setData(res.data.map(d => ({ name: d.driver_code || d.driver, time: d.lapTime_seconds })));
      })
      .catch(err => {
        console.error(err);
        setData([]);
      });
  }, [gp, session]);

  return (
    <div>
      <h2>Fastest Lap per Driver — {gp} {session}</h2>
      <BarChart width={800} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="time" />
      </BarChart>
    </div>
  );
}
