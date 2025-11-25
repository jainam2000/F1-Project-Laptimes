import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LapTable({ gp, session }) {
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    if (!gp || !session) return;
    axios.get(`http://localhost:8080/api/laps?gp=${encodeURIComponent(gp)}&session=${encodeURIComponent(session)}`)
      .then(res => setLaps(res.data))
      .catch(err => {
        console.error(err);
        setLaps([]);
      });
  }, [gp, session]);

  return (
    <div>
      <h2>All Laps — {gp} {session}</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Driver</th><th>Driver Code</th><th>Lap #</th><th>Lap Time (s)</th><th>Compound</th>
          </tr>
        </thead>
        <tbody>
          {laps.map(l => (
            <tr key={l.id}>
              <td>{l.driver}</td>
              <td>{l.driver_code}</td>
              <td>{l.lapNumber}</td>
              {/* <td>{l.lapTime_seconds != undefined? l.lapTime_seconds.toFixed(3): "NAN"}</td> */}
              <td>{l.compound}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
