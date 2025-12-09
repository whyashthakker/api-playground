import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: params.id
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: "Order not found",
        message: "This order doesn't exist in our system"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: `📋 Found order for ${order.customerName} at table ${order.tableNumber}`
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't get the order",
      message: "The waiter couldn't find this order"
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    });

    if (!existingOrder) {
      return NextResponse.json({
        success: false,
        error: "Order not found",
        message: "Can't update an order that doesn't exist"
      }, { status: 404 });
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: "Invalid status",
        message: `Status must be one of: ${validStatuses.join(', ')}`
      }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id
      },
      data: {
        status: status || existingOrder.status,
        notes: notes !== undefined ? notes : existingOrder.notes
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    const statusMessages = {
      'PENDING': '⏳ Order is waiting to be confirmed',
      'CONFIRMED': '✅ Order confirmed and sent to kitchen',
      'PREPARING': '👨‍🍳 Kitchen is preparing your order',
      'READY': '🛎️ Order is ready for pickup/delivery',
      'DELIVERED': '🍽️ Order has been delivered',
      'CANCELLED': '❌ Order has been cancelled'
    };

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: statusMessages[status as keyof typeof statusMessages] || `✨ Order updated!`
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't update the order",
      message: "The waiter couldn't update this order"
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: "Order not found",
        message: "Can't cancel an order that doesn't exist"
      }, { status: 404 });
    }

    await prisma.order.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: `🗑️ Order for ${order.customerName} at table ${order.tableNumber} has been cancelled`,
      cancelledOrder: {
        customerName: order.customerName,
        tableNumber: order.tableNumber,
        totalPrice: order.totalPrice
      }
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({
      success: false,
      error: "Couldn't cancel the order",
      message: "The waiter couldn't cancel this order"
    }, { status: 500 });
  }
}