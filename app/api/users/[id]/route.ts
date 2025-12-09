import { NextRequest, NextResponse } from "next/server";

let users = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find(u => u.id === id);

  if (!user) {
    return NextResponse.json({
      error: "User not found"
    }, { status: 404 });
  }

  return NextResponse.json({ data: user });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({
        error: "User not found"
      }, { status: 404 });
    }

    users[userIndex] = { ...users[userIndex], ...body, id };

    return NextResponse.json({
      data: users[userIndex],
      message: "User updated"
    });
  } catch {
    return NextResponse.json({
      error: "Invalid JSON"
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return NextResponse.json({
      error: "User not found"
    }, { status: 404 });
  }

  const deleted = users.splice(userIndex, 1)[0];
  return NextResponse.json({
    data: deleted,
    message: "User deleted"
  });
}