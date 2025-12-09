import { NextRequest, NextResponse } from "next/server";

let posts = [
  { id: "1", title: "First Post", content: "Hello world!", author: "John" },
  { id: "2", title: "Second Post", content: "Another post", author: "Jane" }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = posts.find(p => p.id === id);

  if (!post) {
    return NextResponse.json({
      error: "Post not found"
    }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({
        error: "Post not found"
      }, { status: 404 });
    }

    posts[postIndex] = { ...posts[postIndex], ...body, id };

    return NextResponse.json({
      data: posts[postIndex],
      message: "Post updated"
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
  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({
      error: "Post not found"
    }, { status: 404 });
  }

  const deleted = posts.splice(postIndex, 1)[0];
  return NextResponse.json({
    data: deleted,
    message: "Post deleted"
  });
}