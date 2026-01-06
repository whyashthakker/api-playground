import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get table schema information
export async function GET(request: NextRequest) {
  try {
    // Get all table names and their columns using raw SQL
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
      ORDER BY table_name, ordinal_position;
    `);

    // Group by table name
    const schema: Record<string, any[]> = {};
    
    if (Array.isArray(tables)) {
      (tables as any[]).forEach((row: any) => {
        if (!schema[row.table_name]) {
          schema[row.table_name] = [];
        }
        schema[row.table_name].push({
          name: row.column_name,
          quotedName: (row as any).quoted_column_name || row.column_name,
          type: row.data_type,
          nullable: row.is_nullable === 'YES',
          default: row.column_default
        });
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

