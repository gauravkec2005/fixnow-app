import { NextResponse } from "next/server";

// TEMP MOCK (later replace with Supabase table)
const contractors = [
  { id: 1, name: "A", available_in: 0 },   // now
  { id: 2, name: "B", available_in: 2 },   // hours
  { id: 3, name: "C", available_in: 6 },   // later today
  { id: 4, name: "D", available_in: 0 },
  { id: 5, name: "E", available_in: 3 },
];

export async function GET() {
  const now = contractors.filter(c => c.available_in === 0).length;
  const fewHours = contractors.filter(c => c.available_in > 0 && c.available_in <= 3).length;
  const today = contractors.filter(c => c.available_in > 3 && c.available_in <= 12).length;

  return NextResponse.json({
    now,
    fewHours,
    today,
    total: contractors.length,
  });
}