import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Received multi-agent creation:", data);
  // For now, just print and return success
  const res = await fetch("http://localhost:8000/create-multi-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  // return NextResponse.json({ success: true, received: data });
  const res_data = await res.json();
  // console.log("Response from backend:", res_data);
  return NextResponse.json({success: true, received: res_data.agentUrls});
}