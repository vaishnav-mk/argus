import { NextResponse } from "next/server";

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const page_state = params.get("page_state")?.replace(/\s/g, "") || "";
  const limit = params.get("limit") || 25;

  console.log("page_state", page_state);

  //remove whitespace

  const response = await fetch(
    `http://localhost:5000/logs?page_state=${page_state}&limit=${limit}`
  );

  const data = await response.json();

  return NextResponse.json(data);
}
