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
    // Initialize all tables with metadata first
    const schema: Record<string, any> = {};
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

    // Check which tables actually exist in the database
    const existingTables = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name IN (${PRISMA_TABLE_NAMES.map(t => `'${t}'`).join(', ')});
    `) as any[];

    const existingTableNames = existingTables.map(t => t.table_name);
    
    // Only query columns for tables that exist
    if (existingTableNames.length > 0) {
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
          AND table_name IN (${existingTableNames.map(t => `'${t}'`).join(', ')})
        ORDER BY 
          CASE table_name
            ${PRISMA_TABLE_NAMES.map((t, i) => `WHEN '${t}' THEN ${i + 1}`).join(' ')}
            ELSE 999
          END,
          ordinal_position;
      `);

      if (Array.isArray(tables)) {
        (tables as any[]).forEach((row: any) => {
          if (PRISMA_TABLE_NAMES.includes(row.table_name) && schema[row.table_name]) {
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
    }

    // Return schema with all tables (existing ones will have columns, non-existing will have empty arrays)
    return NextResponse.json({
      success: true,
      data: schema,
      message: existingTableNames.length === PRISMA_TABLE_NAMES.length 
        ? 'Schema retrieved successfully' 
        : `Schema retrieved. ${existingTableNames.length} of ${PRISMA_TABLE_NAMES.length} tables exist in database.`
    });
  } catch (error: any) {
    console.error('Error fetching schema:', error);
    
    // Return schema structure even on error, so UI doesn't break
    const schema: Record<string, any> = {};
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
    
    return NextResponse.json({
      success: true,
      data: schema,
      message: 'Schema structure loaded. Tables may not exist in database yet. Run: npx prisma db push'
    });
  }
}

