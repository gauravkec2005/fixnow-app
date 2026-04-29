import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { issue, zip_code, urgency } = body;

  // STEP 1: create job in SEARCHING state
  const { data: job, error } = await supabase
    .from("jobs")
    .insert([
      {
        issue,
        zip_code,
        urgency,
        status: "searching",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // STEP 2: simulate contractor assignment (Uber-style delay)
  setTimeout(async () => {
    await supabase
      .from("jobs")
      .update({
        status: "assigned",
        assigned_to: "contractor_001",
        assigned_at: new Date().toISOString(),
      })
      .eq("id", job.id);
  }, 4000);

  return NextResponse.json({ job });
}