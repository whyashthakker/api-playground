import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    const difficulty = searchParams.get('difficulty');
    const limit = searchParams.get('limit');

    let whereClause: any = {};
    
    if (theme) {
      whereClause.theme = {
        contains: theme,
        mode: 'insensitive'
      };
    }
    
    if (difficulty) {
      whereClause.difficulty = {
        contains: difficulty,
        mode: 'insensitive'
      };
    }

    const sets = await prisma.legoSet.findMany({
      where: whereClause,
      take: limit ? parseInt(limit) : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: sets,
      count: sets.length,
      message: "Here are your Lego sets! 📦"
    });
  } catch (error) {
    console.error('Error fetching Lego sets:', error);
    return NextResponse.json({
      success: false,
      error: "Oops! Something went wrong while getting your Lego sets",
      message: "Try again in a moment"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, theme, pieceCount, difficulty, price, description } = body;

    if (!name || !theme || !pieceCount || !difficulty) {
      return NextResponse.json({
        success: false,
        error: "Missing required information",
        message: "Every Lego set needs: name, theme, pieceCount, and difficulty",
        required: ["name", "theme", "pieceCount", "difficulty"]
      }, { status: 400 });
    }

    if (typeof pieceCount !== 'number' || pieceCount < 1) {
      return NextResponse.json({
        success: false,
        error: "Invalid piece count",
        message: "Piece count must be a positive number"
      }, { status: 400 });
    }

    const newSet = await prisma.legoSet.create({
      data: {
        name,
        theme,
        pieceCount,
        difficulty,
        price,
        description
      }
    });

    return NextResponse.json({
      success: true,
      data: newSet,
      message: `🎉 New ${theme} Lego set "${name}" added to your collection!`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Lego set:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't add your Lego set",
      message: "Check your set details and try again"
    }, { status: 500 });
  }
}