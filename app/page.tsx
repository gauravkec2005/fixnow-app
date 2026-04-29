"use client";

import { useState } from "react";

const mockData = {
  availableNow: [
    { id: 1, name: "Plumber", count: 1 },
    { id: 2, name: "Electrician", count: 1 },
  ],
  soon: [{ id: 3, name: "HVAC", count: 1 }],
  later: [],
};

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition ${
        active ? "bg-black text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ title, items }) {
  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm">
      <h2 className="font-semibold mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No data available</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex justify-between items-center p-2 border rounded-xl"
            >
              <span>{i.name}</span>
              <span className="text-sm text-gray-500">{i.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LiveMarketplaceSignal() {
  const [screen, setScreen] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Live Marketplace Signal</h1>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton active={screen === "overview"} onClick={() => setScreen("overview")}>Overview</TabButton>
        <TabButton active={screen === "now"} onClick={() => setScreen("now")}>Available Now</TabButton>
        <TabButton active={screen === "soon"} onClick={() => setScreen("soon")}>In a few hours</TabButton>
        <TabButton active={screen === "later"} onClick={() => setScreen("later")}>Later today</TabButton>
        <TabButton active={screen === "analytics"} onClick={() => setScreen("analytics")}>Analytics</TabButton>
        <TabButton active={screen === "settings"} onClick={() => setScreen("settings")}>Settings</TabButton>
      </div>

      {/* Screens */}
      {screen === "overview" && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Available Now" items={mockData.availableNow} />
          <Card title="Coming Soon" items={mockData.soon} />
          <Card title="Later Today" items={mockData.later} />
        </div>
      )}

      {screen === "now" && (
        <Card title="Available Now" items={mockData.availableNow} />
      )}

      {screen === "soon" && (
        <Card title="In a Few Hours" items={mockData.soon} />
      )}

      {screen === "later" && (
        <Card title="Later Today" items={mockData.later} />
      )}

      {screen === "analytics" && (
        <div className="p-6 border rounded-2xl bg-white">
          <h2 className="font-semibold mb-2">Analytics</h2>
          <p className="text-sm text-gray-500">
            Demand vs Supply trends, conversion rates, and peak hours (placeholder UI).
          </p>
          <div className="mt-4 h-40 bg-gray-100 rounded-xl flex items-center justify-center">
            Chart Area
          </div>
        </div>
      )}

      {screen === "settings" && (
        <div className="p-6 border rounded-2xl bg-white space-y-4">
          <h2 className="font-semibold">Settings</h2>
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Auto-refresh</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      )}
    </div>
  );
}
