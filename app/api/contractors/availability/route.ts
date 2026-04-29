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

  const group = (min: number, max: number) =>
    contractors.filter(
      (c) =>
        (c.available_in_hours ?? 0) >= min &&
        (c.available_in_hours ?? 0) <= max
    );

  const now = group(0, 0);
  const fewHours = group(1, 3);
  const today = group(4, 12);

  return NextResponse.json({
    now: {
      count: now.length,
      types: [...new Set(now.map(c => c.type))],
    },
    fewHours: {
      count: fewHours.length,
      types: [...new Set(fewHours.map(c => c.type))],
    },
    today: {
      count: today.length,
      types: [...new Set(today.map(c => c.type))],
    },
    total: contractors.length,
  });
}