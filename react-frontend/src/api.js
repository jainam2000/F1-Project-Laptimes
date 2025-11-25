export async function fetchDriverLaps(gp, session, driverCode) {
  const url = `http://localhost:8080/api/laps/driver?gp=${gp}&session=${session}&driver=${driverCode}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchFastestLaps(gp, session) {
  const url = `http://localhost:8080/api/laps/fastest?gp=${gp}&session=${session}`;
  const res = await fetch(url);
  return res.json();
}
