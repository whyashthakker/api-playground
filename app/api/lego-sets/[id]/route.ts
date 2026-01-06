import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const set = await prisma.legoSet.findUnique({
      where: {
        id
      }
    });

    if (!set) {
      return NextResponse.json({
        success: false,
        error: "Lego set not found",
        message: "This set doesn't exist in your collection"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: set,
      message: `Found your ${set.theme} set "${set.name}"! 📦`
    });
  } catch (error) {
    console.error('Error fetching Lego set:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't get your Lego set",
      message: "Try again in a moment"
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, theme, pieceCount, difficulty, price, description } = body;

    const existingSet = await prisma.legoSet.findUnique({
      where: { id }
    });

    if (!existingSet) {
      return NextResponse.json({
        success: false,
        error: "Lego set not found",
        message: "Can't update a set that doesn't exist"
      }, { status: 404 });
    }

    if (pieceCount !== undefined && (typeof pieceCount !== 'number' || pieceCount < 1)) {
      return NextResponse.json({
        success: false,
        error: "Invalid piece count",
        message: "Piece count must be a positive number"
      }, { status: 400 });
    }

    const updatedSet = await prisma.legoSet.update({
      where: {
        id
      },
      data: {
        name: name || existingSet.name,
        theme: theme || existingSet.theme,
        pieceCount: pieceCount !== undefined ? pieceCount : existingSet.pieceCount,
        difficulty: difficulty || existingSet.difficulty,
        price: price !== undefined ? price : existingSet.price,
        description: description !== undefined ? description : existingSet.description
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSet,
      message: `✨ Your ${updatedSet.theme} set "${updatedSet.name}" has been updated!`
    });
  } catch (error) {
    console.error('Error updating Lego set:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't update your Lego set",
      message: "Check your set details and try again"
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const set = await prisma.legoSet.findUnique({
      where: { id }
    });

    if (!set) {
      return NextResponse.json({
        success: false,
        error: "Lego set not found",
        message: "Can't remove a set that doesn't exist"
      }, { status: 404 });
    }

    await prisma.legoSet.delete({
      where: {
        id
      }
    });

    return NextResponse.json({
      success: true,
      message: `🗑️ Removed ${set.theme} set "${set.name}" from your collection`,
      removedSet: {
        name: set.name,
        theme: set.theme,
        pieceCount: set.pieceCount
      }
    });
  } catch (error) {
    console.error('Error deleting Lego set:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't remove your Lego set",
      message: "Try again in a moment"
    }, { status: 500 });
  }
}