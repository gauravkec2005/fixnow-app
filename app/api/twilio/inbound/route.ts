import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT");

  try {
    const formData = await req.formData();

    const from = formData.get("From") as string;
    const body = (formData.get("Body") as string)?.trim().toUpperCase();

    console.log("📩 Incoming WhatsApp message");
    console.log("From:", from);
    console.log("Body:", body);

    if (body !== "YES") {
      console.log("❌ Not YES — ignoring");
      return new Response("ignored");
    }

    // ✅ Create Supabase client safely
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log("👉 STEP 1: searching job");

    const { data: jobs, error: fetchError } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: true })
      .limit(1);

    console.log("👉 FETCH ERROR:", fetchError);
    console.log("👉 JOBS FOUND:", jobs);

    if (fetchError) {
      console.log("❌ Supabase fetch failed");
      return new Response("db fetch error", { status: 500 });
    }

    const job = jobs?.[0];

    if (!job) {
      console.log("❌ No open jobs found");
      return new Response("no job");
    }

    console.log("👉 STEP 2: updating job:", job.id);

    const { data: updateData, error: updateError } = await supabase
      .from("jobs")
      .update({
        status: "assigned",
        assigned_to: from,
        assigned_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .select();

    console.log("👉 UPDATE DATA:", updateData);
    console.log("👉 UPDATE ERROR:", updateError);

    if (updateError) {
      console.log("❌ Update failed");
      return new Response("update error", { status: 500 });
    }

    console.log("✅ JOB ASSIGNED SUCCESSFULLY:", job.id);

    return new Response("ok");
  } catch (err: any) {
    console.error("💥 WEBHOOK CRASH:", err);
    return new Response("server error", { status: 500 });
  }
}