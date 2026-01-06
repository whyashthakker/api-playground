import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tables defined in Prisma schema with metadata
// Based on prisma/schema.prisma review:
const PRISMA_TABLES = [
  {
    name: 'users',
    model: 'User',
    description: 'Customer/user information',
    category: 'core'
  },
  {
    name: 'orders',
    model: 'Order',
    description: 'Restaurant orders placed by customers',
    category: 'core'
  },
  {
    name: 'order_items',
    model: 'OrderItem',
    description: 'Items within each order (links orders to menu items)',
    category: 'core'
  },
  {
    name: 'menu_items',
    model: 'MenuItem',
    description: 'Restaurant menu items (food/drinks)',
    category: 'core'
  },
  {
    name: 'lego_bricks',
    model: 'LegoBrick',
    description: 'Lego brick collection (legacy data)',
    category: 'legacy'
  },
  {
    name: 'lego_sets',
    model: 'LegoSet',
    description: 'Lego set collection (legacy data)',
    category: 'legacy'
  }
];

// Extract just table names for SQL queries
const PRISMA_TABLE_NAMES = PRISMA_TABLES.map(t => t.name);

// Get table schema information - only for tables defined in Prisma schema
export async function GET(request: NextRequest) {
  try {
    // Get table names and their columns using raw SQL, filtered to only Prisma tables
    const tables = await prisma.$queryRawUnsafe(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        CASE 
          WHEN column_name ~ '^[A-Z]' THEN '"' || column_name || '"'
          ELSE column_name
        END as quoted_column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name IN (${PRISMA_TABLE_NAMES.map(t => `'${t}'`).join(', ')})
      ORDER BY 
        CASE table_name
          ${PRISMA_TABLE_NAMES.map((t, i) => `WHEN '${t}' THEN ${i + 1}`).join(' ')}
          ELSE 999
        END,
        ordinal_position;
    `);

    // Group by table name and add metadata
    const schema: Record<string, any> = {};
    
    // Initialize all tables with metadata
    PRISMA_TABLES.forEach(tableInfo => {
      schema[tableInfo.name] = {
        columns: [],
        metadata: {
          model: tableInfo.model,
          description: tableInfo.description,
          category: tableInfo.category
        }
      };
    });
    
    if (Array.isArray(tables)) {
      (tables as any[]).forEach((row: any) => {
        // Double-check that table is in our allowed list
        if (PRISMA_TABLE_NAMES.includes(row.table_name)) {
          if (!schema[row.table_name]) {
            schema[row.table_name] = {
              columns: [],
              metadata: PRISMA_TABLES.find(t => t.name === row.table_name) || {}
            };
          }
          schema[row.table_name].columns.push({
            name: row.column_name,
            quotedName: (row as any).quoted_column_name || row.column_name,
            type: row.data_type,
            nullable: row.is_nullable === 'YES',
            default: row.column_default
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: schema,
      message: 'Schema retrieved successfully'
    });
  } catch (error: any) {
    console.error('Error fetching schema:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch schema',
      message: 'Could not retrieve database schema'
    }, { status: 500 });
  }
}

