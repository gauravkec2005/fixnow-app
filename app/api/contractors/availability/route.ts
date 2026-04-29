import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("contractors")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const contractors = data || [];

  const group = (type: string, min: number, max: number) =>
    contractors.filter(
      (c) =>
        c.type === type &&
        (c.available_in_hours ?? 0) >= min &&
        (c.available_in_hours ?? 0) <= max
    ).length;

  const summary = {
    now: {
      plumbers: group("Plumber", 0, 0),
      electricians: group("Electrician", 0, 0),
      hvac: group("HVAC", 0, 0),
      handyman: group("Handyman", 0, 0),
    },
    fewHours: {
      plumbers: group("Plumber", 1, 3),
      electricians: group("Electrician", 1, 3),
      hvac: group("HVAC", 1, 3),
      handyman: group("Handyman", 1, 3),
    },
    today: {
      plumbers: group("Plumber", 4, 12),
      electricians: group("Electrician", 4, 12),
      hvac: group("HVAC", 4, 12),
      handyman: group("Handyman", 4, 12),
    },
    total: contractors.length,
  };

  return NextResponse.json(summary);
}