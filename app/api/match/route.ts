import { NextResponse } from "next/server";

// MOCK DATA (replace with Supabase later)
const contractors = [
  {
    id: "1",
    name: "John Plumbing",
    phone: "+15713535926",
    zip_code: "20171",
    is_available: true,
    rating: 5,
  },
  {
    id: "2",
    name: "Alex HVAC",
    phone: "+15713535926",
    zip_code: "20171",
    is_available: true,
    rating: 5,
  },
];

export async function POST(req: Request) {
  try {
    const { zip_code } = await req.json();

    if (!zip_code) {
      return NextResponse.json(
        { error: "zip_code is required" },
        { status: 400 }
      );
    }

    // 1. FILTER MATCHES
    const matches = contractors.filter(
      (c) => c.zip_code === zip_code && c.is_available
    );

    // 2. SORT (optional improvement)
    matches.sort((a, b) => b.rating - a.rating);

    // 3. RETURN MATCHES ONLY (NO SMS HERE)
    return NextResponse.json({
      matches,
      count: matches.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch matches",
        details: error.message,
      },
      { status: 500 }
    );
  }
}