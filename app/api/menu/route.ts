import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let whereClause: any = {};
    
    if (category) {
      whereClause.category = {
        contains: category,
        mode: 'insensitive'
      };
    }

    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: {
        category: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: menuItems,
      count: menuItems.length,
      message: "🍽️ Here's our delicious menu!"
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({
      success: false,
      error: "Sorry, couldn't fetch the menu",
      message: "The kitchen is having trouble right now"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, prepTime, isAvailable } = body;

    if (!name || !description || !price || !category || !prepTime) {
      return NextResponse.json({
        success: false,
        error: "Missing required information",
        message: "Every menu item needs: name, description, price, category, and prep time",
        required: ["name", "description", "price", "category", "prepTime"]
      }, { status: 400 });
    }

    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        prepTime: parseInt(prepTime),
        isAvailable: isAvailable !== undefined ? isAvailable : true
      }
    });

    return NextResponse.json({
      success: true,
      data: newMenuItem,
      message: `👨‍🍳 New ${category} "${name}" added to the menu!`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't add menu item",
      message: "The chef couldn't add this to the menu"
    }, { status: 500 });
  }
}