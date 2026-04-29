import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("contractors")
      .select("*");

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const contractors = data || [];

    const now = contractors.filter(
      (c) => (c.available_in_hours ?? 0) === 0
    ).length;

    const fewHours = contractors.filter(
      (c) =>
        (c.available_in_hours ?? 0) > 0 &&
        (c.available_in_hours ?? 0) <= 3
    ).length;

    const today = contractors.filter(
      (c) =>
        (c.available_in_hours ?? 0) > 3 &&
        (c.available_in_hours ?? 0) <= 12
    ).length;

    return NextResponse.json({
      now,
      fewHours,
      today,
      total: contractors.length,
      source: "supabase"
    });
  } catch (e: any) {
    console.error("API ERROR:", e);
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}