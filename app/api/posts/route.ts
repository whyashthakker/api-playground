import { NextRequest, NextResponse } from "next/server";

let posts = [
  { id: "1", title: "First Post", content: "Hello world!", author: "John" },
  { id: "2", title: "Second Post", content: "Another post", author: "Jane" }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  
  let result = posts;
  if (limit) {
    result = posts.slice(0, parseInt(limit));
  }

  return NextResponse.json({
    data: result,
    count: result.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author } = body;

    if (!title) {
      return NextResponse.json({
        error: "Title is required"
      }, { status: 400 });
    }

    const newPost = {
      id: (posts.length + 1).toString(),
      title,
      content: content || "",
      author: author || "Anonymous"
    };

    posts.push(newPost);

    return NextResponse.json({
      data: newPost,
      message: "Post created"
    }, { status: 201 });
  } catch {
    return NextResponse.json({
      error: "Invalid JSON"
    }, { status: 400 });
  }
}