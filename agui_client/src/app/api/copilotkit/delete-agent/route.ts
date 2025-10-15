import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const agent = await req.json();
  console.log("Agent to be Deleted Data Received:", agent);
  // Forward the request to FastAPI backend
  const res = await fetch("http://localhost:8000/delete-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agent),
  });

  const data = await res.json();
  console.log("After delete-agent POST data received", data)
  return NextResponse.json(data);
}