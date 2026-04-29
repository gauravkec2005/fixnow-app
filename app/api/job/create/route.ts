import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const { issue, zip_code, urgency } = body;

  // 1. Create job
  const { data: job, error } = await supabase
    .from("jobs")
    .insert([
      {
        issue,
        zip_code,
        urgency,
        status: "new",
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. Simulate contractor assignment (Uber-style)
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