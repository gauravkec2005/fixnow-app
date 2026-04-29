import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("contractors")
    .select("*");

  const contractors = data || [];

  const now = contractors.filter(c => (c.available_in_hours ?? 0) === 0);
  const few = contractors.filter(c => (c.available_in_hours ?? 0) > 0 && (c.available_in_hours ?? 0) <= 3);
  const later = contractors.filter(c => (c.available_in_hours ?? 0) > 3);

  const byType = (list: any[]) => {
    const map: any = {};
    list.forEach(c => {
      map[c.type] = (map[c.type] || 0) + 1;
    });
    return map;
  };

  const signal =
    contractors.length <= 3
      ? "LOW_SUPPLY"
      : contractors.length <= 6
      ? "BALANCED"
      : "HIGH_SUPPLY";

  return NextResponse.json({
    now: {
      count: now.length,
      types: byType(now),
    },
    fewHours: {
      count: few.length,
      types: byType(few),
    },
    today: {
      count: later.length,
      types: byType(later),
    },
    signal, // ⭐ NEW
    total: contractors.length,
  });
}