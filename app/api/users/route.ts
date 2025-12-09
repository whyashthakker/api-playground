import { NextRequest, NextResponse } from "next/server";

let users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  
  let result = users;
  if (limit) {
    result = users.slice(0, parseInt(limit));
  }

  return NextResponse.json({
    data: result,
    count: result.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({
        error: "Name and email are required"
      }, { status: 400 });
    }

    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email
    };

    users.push(newUser);

    return NextResponse.json({
      data: newUser,
      message: "User created"
    }, { status: 201 });
  } catch {
    return NextResponse.json({
      error: "Invalid JSON"
    }, { status: 400 });
  }
}