import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brick = await prisma.legoBrick.findUnique({
      where: {
        id
      }
    });

    if (!brick) {
      return NextResponse.json({
        success: false,
        error: "Lego brick not found",
        message: "This brick doesn't exist in your collection"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: brick,
      message: `Found your ${brick.color} ${brick.shape} brick! 🧱`
    });
  } catch (error) {
    console.error('Error fetching Lego brick:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't get your Lego brick",
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
    const { name, color, size, shape, quantity, description } = body;

    const existingBrick = await prisma.legoBrick.findUnique({
      where: { id }
    });

    if (!existingBrick) {
      return NextResponse.json({
        success: false,
        error: "Lego brick not found",
        message: "Can't update a brick that doesn't exist"
      }, { status: 404 });
    }

    const updatedBrick = await prisma.legoBrick.update({
      where: {
        id
      },
      data: {
        name: name || existingBrick.name,
        color: color || existingBrick.color,
        size: size || existingBrick.size,
        shape: shape || existingBrick.shape,
        quantity: quantity !== undefined ? quantity : existingBrick.quantity,
        description: description !== undefined ? description : existingBrick.description
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBrick,
      message: `✨ Your ${updatedBrick.color} ${updatedBrick.shape} brick has been updated!`
    });
  } catch (error) {
    console.error('Error updating Lego brick:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't update your Lego brick",
      message: "Check your brick details and try again"
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brick = await prisma.legoBrick.findUnique({
      where: { id }
    });

    if (!brick) {
      return NextResponse.json({
        success: false,
        error: "Lego brick not found",
        message: "Can't remove a brick that doesn't exist"
      }, { status: 404 });
    }

    await prisma.legoBrick.delete({
      where: {
        id
      }
    });

    return NextResponse.json({
      success: true,
      message: `🗑️ Removed ${brick.color} ${brick.shape} brick from your collection`,
      removedBrick: {
        name: brick.name,
        color: brick.color,
        shape: brick.shape
      }
    });
  } catch (error) {
    console.error('Error deleting Lego brick:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't remove your Lego brick",
      message: "Try again in a moment"
    }, { status: 500 });
  }
}