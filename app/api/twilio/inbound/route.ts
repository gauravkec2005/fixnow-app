import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT");

  try {
    const formData = await req.formData();

    const from = formData.get("From");
    const body = formData.get("Body");

    console.log("📩 Incoming WhatsApp message");
    console.log("From:", from);
    console.log("Body:", body);

    console.log("👉 STEP 1 OK");

    if (!body || (body as string).trim().toUpperCase() !== "YES") {
      console.log("❌ Not YES - ignoring");
      return new Response("ignored");
    }

    console.log("👉 STEP 2: before Supabase call");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "new")
      .limit(1);

    console.log("👉 STEP 2 RESULT:", data);
    console.log("👉 STEP 2 ERROR:", error);

    if (error) {
      console.log("❌ Supabase error:", error);
      return new Response("db error");
    }

    const job = data?.[0];

    if (!job) {
      console.log("❌ No job found");
      return new Response("no job");
    }

    console.log("👉 STEP 3: updating job");

    const { error: updateError } = await supabase
      .from("jobs")
      .update({
        status: "assigned",
        assigned_to: from,
        assigned_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    console.log("👉 UPDATE RESULT:", updateError);

    console.log("✅ JOB ASSIGNED:", job.id);

    return new Response("ok");
  } catch (err: any) {
    console.error("💥 WEBHOOK CRASH:", err?.message || err);
    return new Response("error", { status: 500 });
  }
}