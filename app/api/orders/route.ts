import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const tableNumber = searchParams.get('tableNumber');

    let whereClause: any = {};
    
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    
    if (tableNumber) {
      whereClause.tableNumber = parseInt(tableNumber);
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
      message: "📋 Here are the current orders!"
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      error: "Sorry, couldn't fetch orders",
      message: "The waiter lost track of the orders"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, tableNumber, items, notes } = body;

    if (!customerName || !tableNumber || !items || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Missing required information",
        message: "Every order needs: customerName, tableNumber, and at least one item",
        required: ["customerName", "tableNumber", "items"]
      }, { status: 400 });
    }

    let totalPrice = 0;
    const menuItemIds = items.map((item: any) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: menuItemIds
        }
      }
    });

    const orderItems = items.map((item: any) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      totalPrice += menuItem.price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        specialRequests: item.specialRequests
      };
    });

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        tableNumber: parseInt(tableNumber),
        totalPrice,
        notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: `🍽️ Order for ${customerName} at table ${tableNumber} has been placed!`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't place the order",
      message: "The waiter couldn't send this order to the kitchen"
    }, { status: 500 });
  }
}