export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-white">
      <header className="p-4 text-2xl font-bold border-b border-gray-700">
        F1 Telemetry Dashboard
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}