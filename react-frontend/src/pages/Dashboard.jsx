import { useState, useEffect } from "react";
import RaceSelector from "../components/RaceSelector";
import DriverLapChart from "../components/DriverLapChart";
import FastestLapChart from "../components/FastestLapChart";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    year: 2024,
    gp: "las_vegas",
    session: "R",
  });

  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/laps/fastest?year=${filters.year}&gp=${filters.gp}&session=${filters.session}`
    )
      .then((res) => res.json())
      .then((obj) => {
        const arr = Object.values(obj);
        const codes = arr.map((d) => d.driverCode);
        setDrivers(codes);
        setSelectedDriver(codes[0] || null);
      });
  }, [filters]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">F1 Telemetry Dashboard</h1>

      {/* FILTER BAR */}
      <RaceSelector onChange={(newFilters) => setFilters(newFilters)} />

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">

        {/* LEFT COLUMN - DRIVER BUTTONS */}
        <div className="bg-gray-900 p-4 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-3">Drivers</h2>
          <div className="flex flex-wrap gap-2">
            {drivers.map((code) => (
              <button
                key={code}
                onClick={() => setSelectedDriver(code)}
                className={`px-4 py-2 rounded text-white font-semibold transition ${
                  selectedDriver === code
                    ? "bg-red-600 shadow-lg scale-105"
                    : "bg-gray-700 hover:bg-gray-500"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN - FASTEST LAP BAR CHART */}
        <div className="col-span-2 bg-gray-900 p-4 rounded-xl shadow-lg">
          <FastestLapChart filters={filters} />
        </div>
      </div>

      {/* FULL LAP CHART */}
      <div className="bg-gray-900 p-4 mt-6 rounded-xl shadow-lg">
        {selectedDriver ? (
          <DriverLapChart driver={selectedDriver} filters={filters} />
        ) : (
          <p className="text-gray-400">Select a driver to view data</p>
        )}
      </div>
    </div>
  );
}
