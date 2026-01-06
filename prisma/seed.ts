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
      {
        name: 'Spinach Artichoke Dip',
        description: 'Creamy spinach and artichoke dip served with tortilla chips',
        price: 10.99,
        category: 'Appetizers',
        prepTime: 12
      },
      {
        name: 'Bruschetta',
        description: 'Toasted bread topped with fresh tomatoes, basil, and mozzarella',
        price: 8.99,
        category: 'Appetizers',
        prepTime: 7
      },
      {
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings with ranch dipping sauce',
        price: 7.99,
        category: 'Appetizers',
        prepTime: 10
      },
      {
        name: 'Shrimp Cocktail',
        description: 'Chilled jumbo shrimp with cocktail sauce',
        price: 14.99,
        category: 'Appetizers',
        prepTime: 5
      },
      {
        name: 'Nachos Supreme',
        description: 'Tortilla chips loaded with cheese, jalapeños, sour cream, and guacamole',
        price: 11.99,
        category: 'Appetizers',
        prepTime: 12
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
      {
        name: 'Ribeye Steak',
        description: '12oz prime ribeye steak cooked to your preference with garlic butter',
        price: 32.99,
        category: 'Main Courses',
        prepTime: 30
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
        price: 15.99,
        category: 'Main Courses',
        prepTime: 18
      },
      {
        name: 'Fish Tacos',
        description: 'Grilled fish tacos with cabbage slaw and chipotle aioli',
        price: 16.99,
        category: 'Main Courses',
        prepTime: 20
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken breast topped with marinara and mozzarella',
        price: 19.99,
        category: 'Main Courses',
        prepTime: 25
      },
      {
        name: 'Beef Tacos',
        description: 'Seasoned ground beef tacos with lettuce, tomato, and cheese',
        price: 13.99,
        category: 'Main Courses',
        prepTime: 15
      },
      {
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
        price: 17.99,
        category: 'Main Courses',
        prepTime: 20
      },
      {
        name: 'Grilled Chicken Breast',
        description: 'Herb-marinated chicken breast with roasted vegetables',
        price: 18.99,
        category: 'Main Courses',
        prepTime: 22
      },
      {
        name: 'Lobster Roll',
        description: 'Fresh lobster meat in a buttered roll with lemon aioli',
        price: 28.99,
        category: 'Main Courses',
        prepTime: 15
      },
      {
        name: 'BBQ Pulled Pork Sandwich',
        description: 'Slow-cooked pulled pork with BBQ sauce on a brioche bun',
        price: 15.99,
        category: 'Main Courses',
        prepTime: 5
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
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers',
        price: 9.99,
        category: 'Desserts',
        prepTime: 5
      },
      {
        name: 'Apple Pie',
        description: 'Homemade apple pie with cinnamon and vanilla ice cream',
        price: 7.99,
        category: 'Desserts',
        prepTime: 5
      },
      {
        name: 'Brownie Sundae',
        description: 'Warm brownie topped with vanilla ice cream and hot fudge',
        price: 8.99,
        category: 'Desserts',
        prepTime: 8
      },
      {
        name: 'Key Lime Pie',
        description: 'Tangy key lime pie with graham cracker crust',
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
      },
      {
        name: 'Coca Cola',
        description: 'Classic cola soft drink',
        price: 2.99,
        category: 'Beverages',
        prepTime: 1
      },
      {
        name: 'Orange Juice',
        description: 'Fresh squeezed orange juice',
        price: 3.99,
        category: 'Beverages',
        prepTime: 2
      },
      {
        name: 'Iced Tea',
        description: 'Freshly brewed iced tea with lemon',
        price: 2.99,
        category: 'Beverages',
        prepTime: 2
      },
      {
        name: 'Sparkling Water',
        description: 'Refreshing sparkling water',
        price: 2.49,
        category: 'Beverages',
        prepTime: 1
      },
      {
        name: 'Milkshake',
        description: 'Vanilla, chocolate, or strawberry milkshake',
        price: 5.99,
        category: 'Beverages',
        prepTime: 5
      },
      {
        name: 'Hot Chocolate',
        description: 'Rich hot chocolate with whipped cream',
        price: 4.99,
        category: 'Beverages',
        prepTime: 4
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
      },
      {
        email: 'james.martinez@email.com',
        firstName: 'James',
        lastName: 'Martinez',
        city: 'Austin',
        country: 'USA'
      },
      {
        email: 'maria.garcia@email.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        city: 'Phoenix',
        country: 'USA'
      },
      {
        email: 'robert.taylor@email.com',
        firstName: 'Robert',
        lastName: 'Taylor',
        city: 'Boston',
        country: 'USA'
      },
      {
        email: 'jennifer.anderson@email.com',
        firstName: 'Jennifer',
        lastName: 'Anderson',
        city: 'Denver',
        country: 'USA'
      },
      {
        email: 'william.thomas@email.com',
        firstName: 'William',
        lastName: 'Thomas',
        city: 'Portland',
        country: 'USA'
      },
      {
        email: 'patricia.jackson@email.com',
        firstName: 'Patricia',
        lastName: 'Jackson',
        city: 'Nashville',
        country: 'USA'
      },
      {
        email: 'richard.white@email.com',
        firstName: 'Richard',
        lastName: 'White',
        city: 'Las Vegas',
        country: 'USA'
      },
      {
        email: 'linda.harris@email.com',
        firstName: 'Linda',
        lastName: 'Harris',
        city: 'Atlanta',
        country: 'USA'
      },
      {
        email: 'joseph.martin@email.com',
        firstName: 'Joseph',
        lastName: 'Martin',
        city: 'Dallas',
        country: 'USA'
      },
      {
        email: 'susan.thompson@email.com',
        firstName: 'Susan',
        lastName: 'Thompson',
        city: 'Minneapolis',
        country: 'USA'
      },
      {
        email: 'thomas.moore@email.com',
        firstName: 'Thomas',
        lastName: 'Moore',
        city: 'Detroit',
        country: 'USA'
      },
      {
        email: 'jessica.young@email.com',
        firstName: 'Jessica',
        lastName: 'Young',
        city: 'Philadelphia',
        country: 'USA'
      },
      {
        email: 'charles.king@email.com',
        firstName: 'Charles',
        lastName: 'King',
        city: 'Houston',
        country: 'USA'
      },
      {
        email: 'sarah.wright@email.com',
        firstName: 'Sarah',
        lastName: 'Wright',
        city: 'San Diego',
        country: 'USA'
      }
    ],
    skipDuplicates: true
  });

  // Get menu items and users for orders
  const allMenuItems = await prisma.menuItem.findMany();
  const allUsers = await prisma.user.findMany();
  
  // Helper function to find menu items
  const findItem = (name: string) => allMenuItems.find((m: any) => m.name === name) || allMenuItems[0];
  
  const salmon = findItem('Grilled Salmon');
  const burger = findItem('BBQ Burger');
  const wings = findItem('Buffalo Wings');
  const salad = findItem('Caesar Salad');
  const alfredo = findItem('Chicken Alfredo');
  const cake = findItem('Chocolate Lava Cake');
  const lemonade = findItem('Fresh Lemonade');
  const mozzSticks = findItem('Mozzarella Sticks');
  const steak = findItem('Ribeye Steak');
  const pizza = findItem('Margherita Pizza');
  const fishTacos = findItem('Fish Tacos');
  const chickenParm = findItem('Chicken Parmesan');
  const carbonara = findItem('Pasta Carbonara');
  const tiramisu = findItem('Tiramisu');
  const icedTea = findItem('Iced Tea');
  const cola = findItem('Coca Cola');
  const applePie = findItem('Apple Pie');
  const bruschetta = findItem('Bruschetta');
  const onionRings = findItem('Onion Rings');
  const shrimp = findItem('Shrimp Cocktail');
  const nachos = findItem('Nachos Supreme');
  const lobster = findItem('Lobster Roll');
  const pulledPork = findItem('BBQ Pulled Pork Sandwich');
  const brownie = findItem('Brownie Sundae');

  // Seed orders with order items
  if (allUsers.length > 0 && allMenuItems.length > 0) {
    const orders = [
      // Order 1: John's order
      {
        customerName: 'John Smith',
        userId: allUsers[0].id,
        tableNumber: 5,
        status: 'CONFIRMED',
        totalPrice: 45.97,
        notes: 'No onions please',
        items: [
          { menuItemId: salmon.id, quantity: 1 },
          { menuItemId: salad.id, quantity: 1 },
          { menuItemId: lemonade.id, quantity: 2 }
        ]
      },
      // Order 2: Sarah's order
      {
        customerName: 'Sarah Johnson',
        userId: allUsers[1].id,
        tableNumber: 12,
        status: 'PREPARING',
        totalPrice: 33.98,
        items: [
          { menuItemId: burger.id, quantity: 2 },
          { menuItemId: wings.id, quantity: 1 }
        ]
      },
      // Order 3: Michael's order
      {
        customerName: 'Michael Chen',
        userId: allUsers[2].id,
        tableNumber: 8,
        status: 'READY',
        totalPrice: 27.98,
        items: [
          { menuItemId: alfredo.id, quantity: 1 },
          { menuItemId: cake.id, quantity: 1 }
        ]
      },
      // Order 4: Emily's order
      {
        customerName: 'Emily Davis',
        userId: allUsers[3].id,
        tableNumber: 3,
        status: 'DELIVERED',
        totalPrice: 52.96,
        items: [
          { menuItemId: salmon.id, quantity: 2 },
          { menuItemId: salad.id, quantity: 1 }
        ]
      },
      // Order 5: David's order (no user)
      {
        customerName: 'David Wilson',
        tableNumber: 15,
        status: 'PENDING',
        totalPrice: 16.99,
        items: [
          { menuItemId: burger.id, quantity: 1 }
        ]
      },
      // Order 6: Lisa's order
      {
        customerName: 'Lisa Brown',
        userId: allUsers[5].id,
        tableNumber: 7,
        status: 'CONFIRMED',
        totalPrice: 41.97,
        notes: 'Extra sauce on the side',
        items: [
          { menuItemId: wings.id, quantity: 2 },
          { menuItemId: salad.id, quantity: 1 },
          { menuItemId: lemonade.id, quantity: 1 }
        ]
      },
      // Order 7: James's order
      {
        customerName: 'James Martinez',
        userId: allUsers[6].id,
        tableNumber: 2,
        status: 'CONFIRMED',
        totalPrice: 67.97,
        items: [
          { menuItemId: steak.id, quantity: 1 },
          { menuItemId: bruschetta.id, quantity: 1 },
          { menuItemId: tiramisu.id, quantity: 1 },
          { menuItemId: cola.id, quantity: 2 }
        ]
      },
      // Order 8: Maria's order
      {
        customerName: 'Maria Garcia',
        userId: allUsers[7].id,
        tableNumber: 9,
        status: 'PREPARING',
        totalPrice: 28.98,
        items: [
          { menuItemId: pizza.id, quantity: 1 },
          { menuItemId: mozzSticks.id, quantity: 1 },
          { menuItemId: icedTea.id, quantity: 2 }
        ]
      },
      // Order 9: Robert's order
      {
        customerName: 'Robert Taylor',
        userId: allUsers[8].id,
        tableNumber: 11,
        status: 'READY',
        totalPrice: 19.98,
        items: [
          { menuItemId: fishTacos.id, quantity: 2 },
          { menuItemId: lemonade.id, quantity: 1 }
        ]
      },
      // Order 10: Jennifer's order
      {
        customerName: 'Jennifer Anderson',
        userId: allUsers[9].id,
        tableNumber: 4,
        status: 'DELIVERED',
        totalPrice: 35.97,
        items: [
          { menuItemId: chickenParm.id, quantity: 1 },
          { menuItemId: salad.id, quantity: 1 },
          { menuItemId: applePie.id, quantity: 1 }
        ]
      },
      // Order 11: William's order
      {
        customerName: 'William Thomas',
        userId: allUsers[10].id,
        tableNumber: 6,
        status: 'CONFIRMED',
        totalPrice: 54.97,
        items: [
          { menuItemId: lobster.id, quantity: 1 },
          { menuItemId: shrimp.id, quantity: 1 },
          { menuItemId: brownie.id, quantity: 1 }
        ]
      },
      // Order 12: Patricia's order
      {
        customerName: 'Patricia Jackson',
        userId: allUsers[11].id,
        tableNumber: 13,
        status: 'PREPARING',
        totalPrice: 31.97,
        items: [
          { menuItemId: carbonara.id, quantity: 1 },
          { menuItemId: bruschetta.id, quantity: 1 },
          { menuItemId: icedTea.id, quantity: 1 }
        ]
      },
      // Order 13: Richard's order
      {
        customerName: 'Richard White',
        userId: allUsers[12].id,
        tableNumber: 1,
        status: 'PENDING',
        totalPrice: 24.98,
        items: [
          { menuItemId: pulledPork.id, quantity: 1 },
          { menuItemId: onionRings.id, quantity: 1 },
          { menuItemId: cola.id, quantity: 1 }
        ]
      },
      // Order 14: Linda's order
      {
        customerName: 'Linda Harris',
        userId: allUsers[13].id,
        tableNumber: 10,
        status: 'READY',
        totalPrice: 42.97,
        items: [
          { menuItemId: salmon.id, quantity: 1 },
          { menuItemId: nachos.id, quantity: 1 },
          { menuItemId: tiramisu.id, quantity: 1 }
        ]
      },
      // Order 15: Joseph's order
      {
        customerName: 'Joseph Martin',
        userId: allUsers[14].id,
        tableNumber: 14,
        status: 'CONFIRMED',
        totalPrice: 38.97,
        items: [
          { menuItemId: burger.id, quantity: 1 },
          { menuItemId: wings.id, quantity: 1 },
          { menuItemId: cake.id, quantity: 1 },
          { menuItemId: lemonade.id, quantity: 1 }
        ]
      },
      // Order 16: Susan's order
      {
        customerName: 'Susan Thompson',
        userId: allUsers[15].id,
        tableNumber: 16,
        status: 'DELIVERED',
        totalPrice: 29.98,
        items: [
          { menuItemId: alfredo.id, quantity: 1 },
          { menuItemId: salad.id, quantity: 1 },
          { menuItemId: icedTea.id, quantity: 1 }
        ]
      },
      // Order 17: Thomas's order
      {
        customerName: 'Thomas Moore',
        userId: allUsers[16].id,
        tableNumber: 8,
        status: 'PREPARING',
        totalPrice: 71.97,
        items: [
          { menuItemId: steak.id, quantity: 1 },
          { menuItemId: lobster.id, quantity: 1 },
          { menuItemId: tiramisu.id, quantity: 1 },
          { menuItemId: cola.id, quantity: 2 }
        ]
      },
      // Order 18: Jessica's order
      {
        customerName: 'Jessica Young',
        userId: allUsers[17].id,
        tableNumber: 5,
        status: 'READY',
        totalPrice: 22.98,
        items: [
          { menuItemId: pizza.id, quantity: 1 },
          { menuItemId: mozzSticks.id, quantity: 1 }
        ]
      },
      // Order 19: Charles's order
      {
        customerName: 'Charles King',
        userId: allUsers[18].id,
        tableNumber: 3,
        status: 'CONFIRMED',
        totalPrice: 48.97,
        items: [
          { menuItemId: chickenParm.id, quantity: 1 },
          { menuItemId: bruschetta.id, quantity: 1 },
          { menuItemId: brownie.id, quantity: 1 },
          { menuItemId: lemonade.id, quantity: 2 }
        ]
      },
      // Order 20: Sarah Wright's order
      {
        customerName: 'Sarah Wright',
        userId: allUsers[19].id,
        tableNumber: 12,
        status: 'PENDING',
        totalPrice: 19.98,
        items: [
          { menuItemId: fishTacos.id, quantity: 2 },
          { menuItemId: icedTea.id, quantity: 1 }
        ]
      },
      // Order 21: Walk-in customer
      {
        customerName: 'Alex Rodriguez',
        tableNumber: 17,
        status: 'CONFIRMED',
        totalPrice: 35.97,
        items: [
          { menuItemId: pulledPork.id, quantity: 1 },
          { menuItemId: nachos.id, quantity: 1 },
          { menuItemId: applePie.id, quantity: 1 }
        ]
      },
      // Order 22: Another walk-in
      {
        customerName: 'Taylor Swift',
        tableNumber: 18,
        status: 'PREPARING',
        totalPrice: 41.97,
        items: [
          { menuItemId: salmon.id, quantity: 1 },
          { menuItemId: shrimp.id, quantity: 1 },
          { menuItemId: cake.id, quantity: 1 }
        ]
      },
      // Order 23: Large group order
      {
        customerName: 'Corporate Event',
        tableNumber: 20,
        status: 'CONFIRMED',
        totalPrice: 125.94,
        notes: 'Large group - please prepare together',
        items: [
          { menuItemId: wings.id, quantity: 5 },
          { menuItemId: mozzSticks.id, quantity: 3 },
          { menuItemId: nachos.id, quantity: 2 },
          { menuItemId: cola.id, quantity: 8 }
        ]
      },
      // Order 24: Family order
      {
        customerName: 'The Johnson Family',
        userId: allUsers[1].id,
        tableNumber: 19,
        status: 'READY',
        totalPrice: 89.95,
        items: [
          { menuItemId: burger.id, quantity: 3 },
          { menuItemId: pizza.id, quantity: 1 },
          { menuItemId: salad.id, quantity: 2 },
          { menuItemId: brownie.id, quantity: 2 },
          { menuItemId: lemonade.id, quantity: 4 }
        ]
      },
      // Order 25: Date night
      {
        customerName: 'Romantic Dinner',
        userId: allUsers[0].id,
        tableNumber: 21,
        status: 'DELIVERED',
        totalPrice: 95.96,
        notes: 'Anniversary celebration',
        items: [
          { menuItemId: steak.id, quantity: 2 },
          { menuItemId: lobster.id, quantity: 1 },
          { menuItemId: bruschetta.id, quantity: 1 },
          { menuItemId: tiramisu.id, quantity: 2 }
        ]
      }
    ];

    // Create all orders
    for (const orderData of orders) {
      await prisma.order.create({
        data: {
          customerName: orderData.customerName,
          userId: orderData.userId,
          tableNumber: orderData.tableNumber,
          status: orderData.status,
          totalPrice: orderData.totalPrice,
          notes: orderData.notes,
          items: {
            create: orderData.items
          }
        }
      });
    }
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