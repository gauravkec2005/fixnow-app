export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT");

  console.log("STEP A REACHED");

  const formData = await req.formData();
  const body = formData.get("Body");

  console.log("BODY:", body);

  console.log("STEP B REACHED");

  return new Response("OK");
}