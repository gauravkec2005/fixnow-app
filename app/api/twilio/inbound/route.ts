import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    console.log("🔥 WEBHOOK HIT");

    const formData = await req.formData();

    const from = formData.get("From") as string;
    const body = (formData.get("Body") as string)?.trim().toUpperCase();

    console.log("📩 Incoming WhatsApp message:", from, body);

    if (body !== "YES") {
      return new Response("ignored");
    }

    // 1. Get latest open job
    const { data: jobs, error: fetchError } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: true })
      .limit(1);

    console.log("🔍 FETCH ERROR:", fetchError);
    console.log("🔍 JOBS:", jobs);

    const job = jobs?.[0];

    if (!job) {
      return new Response("no job found");
    }

    console.log("🛠 Updating job:", job.id);

    // 2. Update job
    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update({
        status: "assigned",
        assigned_to: from,
        assigned_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .select();

    console.log("✅ UPDATE DATA:", updateData);
    console.log("❌ UPDATE ERROR:", updateError);

    return new Response("ok");
  } catch (err: any) {
    console.error("💥 WEBHOOK ERROR:", err);
    return new Response("error", { status: 500 });
  }
}