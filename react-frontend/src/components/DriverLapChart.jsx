import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Scatter, ResponsiveContainer 
} from "recharts";

export default function DriverLapChart({ driver, filters }) {
  const [data, setData] = useState([]);
  const [minY, setMinY] = useState(null);
  const [maxY, setMaxY] = useState(null);

  const { year, gp, session } = filters;

  const compoundColor = {
    SOFT: "#ff4d4d",
    MEDIUM: "#ffd11a",
    HARD: "#ffffff",
  };

  useEffect(() => {
    if (!driver) return;

    fetch(
      `http://localhost:8080/api/laps/driver?year=${year}&gp=${gp}&session=${session}&driver=${driver}`
    )
      .then((res) => res.json())
      .then((d) => {
        const clean = d
          .filter((x) => !isNaN(x.lapTimeSeconds))
          .sort((a, b) => a.lapNumber - b.lapNumber);

        setData(clean);

        if (clean.length > 0) {
          const values = clean.map((x) => x.lapTimeSeconds);
          setMinY(Math.min(...values) - 1);
          setMaxY(Math.max(...values) + 1);
        }
      });
  }, [driver, year, gp, session]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">
        Laps of {driver}
      </h3>

      <LineChart width={950} height={420} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#666" />
        <XAxis dataKey="lapNumber" stroke="#ccc" />
        <YAxis domain={[minY, maxY]} stroke="#ccc" />
        <Tooltip />

        <Line type="monotone" dataKey="lapTimeSeconds" stroke="#999" dot={false}/>

        <Scatter
          data={data}
          dataKey="lapTimeSeconds"
          shape={(props) => {
            const { cx, cy, payload } = props;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={compoundColor[payload.compound] || "#741ed0"}
                strokeWidth={2}
              />
            );
          }}
        />
      </LineChart>
    </div>
  );
}
