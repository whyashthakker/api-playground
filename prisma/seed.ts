const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed the database...');

  // Seed menu items
  await prisma.menuItem.createMany({
    data: [
      // Appetizers
      {
        name: 'Buffalo Wings',
        description: 'Crispy chicken wings tossed in spicy buffalo sauce',
        price: 12.99,
        category: 'Appetizers',
        prepTime: 15
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Golden fried mozzarella with marinara sauce',
        price: 9.99,
        category: 'Appetizers',
        prepTime: 10
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing and croutons',
        price: 11.99,
        category: 'Appetizers',
        prepTime: 8
      },

      // Main Courses
      {
        name: 'Grilled Salmon',
        description: 'Atlantic salmon grilled to perfection with lemon herb butter',
        price: 24.99,
        category: 'Main Courses',
        prepTime: 25
      },
      {
        name: 'BBQ Burger',
        description: 'Juicy beef patty with BBQ sauce, bacon, and cheddar cheese',
        price: 16.99,
        category: 'Main Courses',
        prepTime: 20
      },
      {
        name: 'Chicken Alfredo',
        description: 'Creamy alfredo pasta with grilled chicken breast',
        price: 18.99,
        category: 'Main Courses',
        prepTime: 22
      },
      {
        name: 'Vegetable Stir Fry',
        description: 'Fresh seasonal vegetables in garlic soy sauce',
        price: 14.99,
        category: 'Main Courses',
        prepTime: 15
      },

      // Desserts
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center and vanilla ice cream',
        price: 8.99,
        category: 'Desserts',
        prepTime: 12
      },
      {
        name: 'Cheesecake',
        description: 'New York style cheesecake with berry compote',
        price: 7.99,
        category: 'Desserts',
        prepTime: 5
      },

      // Beverages
      {
        name: 'Fresh Lemonade',
        description: 'House-made lemonade with fresh lemons',
        price: 3.99,
        category: 'Beverages',
        prepTime: 3
      },
      {
        name: 'Iced Coffee',
        description: 'Cold brew coffee served over ice',
        price: 4.99,
        category: 'Beverages',
        prepTime: 2
      }
    ],
    skipDuplicates: true
  });

  // Seed users
  await prisma.user.createMany({
    data: [
      {
        email: 'john.smith@email.com',
        firstName: 'John',
        lastName: 'Smith',
        city: 'New York',
        country: 'USA'
      },
      {
        email: 'sarah.johnson@email.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        city: 'Los Angeles',
        country: 'USA'
      },
      {
        email: 'michael.chen@email.com',
        firstName: 'Michael',
        lastName: 'Chen',
        city: 'San Francisco',
        country: 'USA'
      },
      {
        email: 'emily.davis@email.com',
        firstName: 'Emily',
        lastName: 'Davis',
        city: 'Chicago',
        country: 'USA'
      },
      {
        email: 'david.wilson@email.com',
        firstName: 'David',
        lastName: 'Wilson',
        city: 'Miami',
        country: 'USA'
      },
      {
        email: 'lisa.brown@email.com',
        firstName: 'Lisa',
        lastName: 'Brown',
        city: 'Seattle',
        country: 'USA'
      }
    ],
    skipDuplicates: true
  });

  // Get menu items and users for orders
  const allMenuItems = await prisma.menuItem.findMany();
  const allUsers = await prisma.user.findMany();
  
  const salmon = allMenuItems.find((m: any) => m.name === 'Grilled Salmon');
  const burger = allMenuItems.find((m: any) => m.name === 'BBQ Burger');
  const wings = allMenuItems.find((m: any) => m.name === 'Buffalo Wings');
  const salad = allMenuItems.find((m: any) => m.name === 'Caesar Salad');
  const alfredo = allMenuItems.find((m: any) => m.name === 'Chicken Alfredo');
  const cake = allMenuItems.find((m: any) => m.name === 'Chocolate Lava Cake');
  const lemonade = allMenuItems.find((m: any) => m.name === 'Fresh Lemonade');

  // Seed orders with order items
  if (allUsers.length > 0 && allMenuItems.length > 0) {
    // Order 1: John's order
    const order1 = await prisma.order.create({
      data: {
        customerName: 'John Smith',
        userId: allUsers[0].id,
        tableNumber: 5,
        status: 'CONFIRMED',
        totalPrice: 45.97,
        notes: 'No onions please',
        items: {
          create: [
            { menuItemId: salmon?.id || allMenuItems[0].id, quantity: 1 },
            { menuItemId: salad?.id || allMenuItems[0].id, quantity: 1 },
            { menuItemId: lemonade?.id || allMenuItems[0].id, quantity: 2 }
          ]
        }
      }
    });

    // Order 2: Sarah's order
    const order2 = await prisma.order.create({
      data: {
        customerName: 'Sarah Johnson',
        userId: allUsers[1].id,
        tableNumber: 12,
        status: 'PREPARING',
        totalPrice: 33.98,
        items: {
          create: [
            { menuItemId: burger?.id || allMenuItems[0].id, quantity: 2 },
            { menuItemId: wings?.id || allMenuItems[0].id, quantity: 1 }
          ]
        }
      }
    });

    // Order 3: Michael's order
    const order3 = await prisma.order.create({
      data: {
        customerName: 'Michael Chen',
        userId: allUsers[2].id,
        tableNumber: 8,
        status: 'READY',
        totalPrice: 27.98,
        items: {
          create: [
            { menuItemId: alfredo?.id || allMenuItems[0].id, quantity: 1 },
            { menuItemId: cake?.id || allMenuItems[0].id, quantity: 1 }
          ]
        }
      }
    });

    // Order 4: Emily's order
    const order4 = await prisma.order.create({
      data: {
        customerName: 'Emily Davis',
        userId: allUsers[3].id,
        tableNumber: 3,
        status: 'DELIVERED',
        totalPrice: 52.96,
        items: {
          create: [
            { menuItemId: salmon?.id || allMenuItems[0].id, quantity: 2 },
            { menuItemId: salad?.id || allMenuItems[0].id, quantity: 1 }
          ]
        }
      }
    });

    // Order 5: David's order (no user)
    const order5 = await prisma.order.create({
      data: {
        customerName: 'David Wilson',
        tableNumber: 15,
        status: 'PENDING',
        totalPrice: 16.99,
        items: {
          create: [
            { menuItemId: burger?.id || allMenuItems[0].id, quantity: 1 }
          ]
        }
      }
    });

    // Order 6: Lisa's order
    const order6 = await prisma.order.create({
      data: {
        customerName: 'Lisa Brown',
        userId: allUsers[5].id,
        tableNumber: 7,
        status: 'CONFIRMED',
        totalPrice: 41.97,
        notes: 'Extra sauce on the side',
        items: {
          create: [
            { menuItemId: wings?.id || allMenuItems[0].id, quantity: 2 },
            { menuItemId: salad?.id || allMenuItems[0].id, quantity: 1 },
            { menuItemId: lemonade?.id || allMenuItems[0].id, quantity: 1 }
          ]
        }
      }
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });