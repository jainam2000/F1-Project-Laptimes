export default function RaceSelector({ onChange }) {
  const handleChange = (e) => {
    onChange((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <select name="year" onChange={handleChange} className="border p-2 rounded bg-gray-800 text-white">
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>

      <select name="gp" onChange={handleChange} className="border p-2 rounded bg-gray-800 text-white">
        <option value="las_vegas">Las Vegas</option>
        <option value="Bahrain">Bahrain</option>
        <option value="monza">Monza</option>
      </select>

      <select name="session" onChange={handleChange} className="border p-2 rounded bg-gray-800 text-white">
        <option value="R">Race</option>
        <option value="Q">Qualifying</option>
        <option value="FP1">FP1</option>
      </select>
    </div>
  );
}
