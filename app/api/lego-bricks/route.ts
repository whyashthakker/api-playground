import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const color = searchParams.get('color');
    const shape = searchParams.get('shape');
    const limit = searchParams.get('limit');

    let whereClause: any = {};
    
    if (color) {
      whereClause.color = {
        contains: color,
        mode: 'insensitive'
      };
    }
    
    if (shape) {
      whereClause.shape = {
        contains: shape,
        mode: 'insensitive'
      };
    }

    const bricks = await prisma.legoBrick.findMany({
      where: whereClause,
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: bricks,
      count: bricks.length,
      message: "Here are your Lego bricks! 🧱"
    });
  } catch (error) {
    console.error('Error fetching Lego bricks:', error);
    return NextResponse.json({
      success: false,
      error: "Oops! Something went wrong while getting your Lego bricks",
      message: "Try again in a moment"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, size, shape, quantity, description } = body;

    if (!name || !color || !size || !shape) {
      return NextResponse.json({
        success: false,
        error: "Missing required information",
        message: "Every Lego brick needs: name, color, size, and shape",
        required: ["name", "color", "size", "shape"]
      }, { status: 400 });
    }

    const newBrick = await prisma.legoBrick.create({
      data: {
        name,
        color,
        size,
        shape,
        quantity: quantity || 1,
        description
      }
    });

    return NextResponse.json({
      success: true,
      data: newBrick,
      message: `🎉 New ${color} ${shape} brick added to your collection!`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Lego brick:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't add your Lego brick",
      message: "Check your brick details and try again"
    }, { status: 500 });
  }
}