import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    console.log("🔥 WEBHOOK HIT");

    const formData = await req.formData();

    const from = formData.get("From") as string;
    const body = (formData.get("Body") as string)?.trim().toUpperCase();

    console.log("📩 MESSAGE:", from, body);

    if (body !== "YES") return new Response("ignored");

    const { data: jobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "new")
      .limit(1);

    const job = jobs?.[0];
    if (!job) return new Response("no job");

    const estTime = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      })
    ).toISOString();

    const { data, error } = await supabase
      .from("jobs")
      .update({
        status: "assigned",
        assigned_to: from,
        assigned_at: estTime,
      })
      .eq("id", job.id)
      .select();

    console.log("✅ UPDATE:", data);
    console.log("❌ ERROR:", error);

    return new Response("ok");
  } catch (e) {
    console.error(e);
    return new Response("error");
  }
}