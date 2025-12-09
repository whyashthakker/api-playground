const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed the database...');

  await prisma.legoBrick.createMany({
    data: [
      {
        name: 'Classic Red Brick',
        color: 'red',
        size: '2x4',
        shape: 'rectangular',
        quantity: 5,
        description: 'The classic Lego brick that started it all!'
      },
      {
        name: 'Blue Square Base',
        color: 'blue',
        size: '2x2',
        shape: 'square',
        quantity: 10,
        description: 'Perfect for creating stable foundations'
      },
      {
        name: 'Yellow Round Piece',
        color: 'yellow',
        size: '1x1',
        shape: 'round',
        quantity: 8,
        description: 'Great for decorative touches'
      },
      {
        name: 'Green Slope Tile',
        color: 'green',
        size: '1x2',
        shape: 'slope',
        quantity: 3,
        description: 'Adds angles and interesting shapes'
      },
      {
        name: 'White Corner Piece',
        color: 'white',
        size: '2x2',
        shape: 'square',
        quantity: 6,
        description: 'Essential for clean, modern builds'
      }
    ],
    skipDuplicates: true
  });

  await prisma.legoSet.createMany({
    data: [
      {
        name: 'Police Station',
        theme: 'City',
        pieceCount: 854,
        difficulty: 'Medium',
        price: 79.99,
        description: 'Complete police station with vehicles and minifigures'
      },
      {
        name: 'Space Shuttle Adventure',
        theme: 'Space',
        pieceCount: 1230,
        difficulty: 'Hard',
        price: 129.99,
        description: 'Detailed space shuttle with launch pad and astronauts'
      },
      {
        name: 'Medieval Castle',
        theme: 'Castle',
        pieceCount: 2164,
        difficulty: 'Expert',
        price: 199.99,
        description: 'Massive castle with towers, drawbridge, and knights'
      },
      {
        name: 'Fire Truck',
        theme: 'City',
        pieceCount: 466,
        difficulty: 'Easy',
        price: 49.99,
        description: 'Fire truck with extending ladder and firefighters'
      },
      {
        name: 'Flower Garden',
        theme: 'Friends',
        pieceCount: 298,
        difficulty: 'Easy',
        price: 34.99,
        description: 'Beautiful garden scene with flowers and butterflies'
      }
    ],
    skipDuplicates: true
  });

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