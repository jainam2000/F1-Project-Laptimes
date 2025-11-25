import { useState, useEffect } from "react";
import RaceSelector from "./components/RaceSelector";
import DriverLapChart from "./components/DriverLapChart";
import FastestLapChart from "./components/FastestLapChart";
import DashboardLayout from "./components/DashboardLayout";

export default function App() {
  const [filters, setFilters] = useState({
    year: 2024,
    gp: "Bahrain",
    session: "R",
  });

  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Load driver list based on fastest laps API
  useEffect(() => {
    if (!filters.gp || !filters.session) return;

    fetch(
      `http://localhost:8080/api/laps/fastest?year=${filters.year}&gp=${filters.gp}&session=${filters.session}`
    )
      .then((res) => res.json())
      .then((obj) => {
        const values = Object.values(obj);
        const driverCodes = values.map((d) => d.driverCode);

        setDrivers(driverCodes);
        setSelectedDriver(driverCodes[0] || null); // auto-select first
      })
      .catch((err) => console.error("Failed loading drivers", err));
  }, [filters]);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* FILTERS */}
        <RaceSelector onChange={setFilters} />

        {/* DRIVER SWITCH BUTTONS */}
        <div className="flex gap-3 flex-wrap mt-3">
          {drivers.map((code) => (
            <button
              key={code}
              onClick={() => setSelectedDriver(code)}
              className={`px-4 py-1 rounded text-white font-semibold ${
                selectedDriver === code ? "bg-red-600" : "bg-gray-600"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* FASTEST LAP BAR CHART */}
          {/* <FastestLapChart filters={filters} /> */}

          {/* DRIVER LAP CHART */}
          {selectedDriver && (
            <DriverLapChart driver={selectedDriver} filters={filters} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
