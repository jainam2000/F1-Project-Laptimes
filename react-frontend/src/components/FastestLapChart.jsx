import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

export default function FastestLapChart({ filters }) {
  const [data, setData] = useState([]);

  const { year, gp, session } = filters;

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/laps/fastest?year=${year}&gp=${gp}&session=${session}`
    )
      .then((res) => res.json())
      .then((obj) => setData(Object.values(obj)));
  }, [year, gp, session]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">
        Fastest Lap per Driver
      </h3>

      <BarChart width={900} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="driverCode" />
        <YAxis dataKey="lapTimeSeconds" />
        <Tooltip />
        <Bar dataKey="lapTimeSeconds" fill="#3399ff" />
      </BarChart>
    </div>
  );
}
