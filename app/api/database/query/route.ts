import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Detect query type and check if it's a destructive command
function detectQueryType(query: string): { 
  type: 'SELECT' | 'DELETE' | 'UPDATE' | 'INSERT' | 'DANGEROUS' | 'UNKNOWN';
  table?: string;
  whereClause?: string;
} {
  const trimmed = query.trim().toUpperCase();
  
  // Block truly dangerous commands
  const dangerousKeywords = ['DROP', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
  for (const keyword of dangerousKeywords) {
    if (trimmed.includes(keyword)) {
      return { type: 'DANGEROUS' };
    }
  }
  
  // Detect DELETE
  if (trimmed.startsWith('DELETE')) {
    const deleteMatch = query.match(/DELETE\s+FROM\s+["']?(\w+)["']?/i);
    const whereMatch = query.match(/WHERE\s+([\s\S]+?)(?:\s+ORDER|\s+LIMIT|$)/i);
    return {
      type: 'DELETE',
      table: deleteMatch ? deleteMatch[1] : undefined,
      whereClause: whereMatch ? whereMatch[1].trim() : undefined
    };
  }
  
  // Detect UPDATE
  if (trimmed.startsWith('UPDATE')) {
    const updateMatch = query.match(/UPDATE\s+["']?(\w+)["']?/i);
    const whereMatch = query.match(/WHERE\s+([\s\S]+?)(?:\s+ORDER|\s+LIMIT|$)/i);
    return {
      type: 'UPDATE',
      table: updateMatch ? updateMatch[1] : undefined,
      whereClause: whereMatch ? whereMatch[1].trim() : undefined
    };
  }
  
  // Detect INSERT
  if (trimmed.startsWith('INSERT')) {
    const insertMatch = query.match(/INSERT\s+INTO\s+["']?(\w+)["']?/i);
    return {
      type: 'INSERT',
      table: insertMatch ? insertMatch[1] : undefined
    };
  }
  
  // SELECT queries
  if (trimmed.startsWith('SELECT')) {
    return { type: 'SELECT' };
  }
  
  return { type: 'UNKNOWN' };
}

// Get count of rows that would be affected by DELETE/UPDATE
async function getAffectedRowCount(table: string, whereClause?: string): Promise<number> {
  try {
    let countQuery = `SELECT COUNT(*) as count FROM ${table}`;
    if (whereClause) {
      countQuery += ` WHERE ${whereClause}`;
    }
    const result = await prisma.$queryRawUnsafe(countQuery) as any[];
    return result[0]?.count || 0;
  } catch (error) {
    return 0;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Query is required',
        message: 'Please provide a SQL query'
      }, { status: 400 });
    }

    // Detect query type
    const queryInfo = detectQueryType(query);
    
    // Block dangerous commands
    if (queryInfo.type === 'DANGEROUS') {
      return NextResponse.json({
        success: false,
        error: 'This command is not allowed for safety',
        message: 'Commands like DROP, ALTER, CREATE, TRUNCATE are blocked to protect the database',
        isPreview: false
      }, { status: 400 });
    }
    
    // Handle DELETE commands - show preview
    if (queryInfo.type === 'DELETE') {
      const affectedRows = queryInfo.table 
        ? await getAffectedRowCount(queryInfo.table, queryInfo.whereClause)
        : 0;
      
      return NextResponse.json({
        success: true,
        isPreview: true,
        queryType: 'DELETE',
        affectedRows,
        table: queryInfo.table,
        message: `⚠️ This would DELETE ${affectedRows} row${affectedRows !== 1 ? 's' : ''} from ${queryInfo.table || 'the table'}`,
        warning: 'This is a preview only. No data was actually deleted. Be careful with DELETE commands!',
        data: []
      });
    }
    
    // Handle UPDATE commands - show preview
    if (queryInfo.type === 'UPDATE') {
      const affectedRows = queryInfo.table 
        ? await getAffectedRowCount(queryInfo.table, queryInfo.whereClause)
        : 0;
      
      return NextResponse.json({
        success: true,
        isPreview: true,
        queryType: 'UPDATE',
        affectedRows,
        table: queryInfo.table,
        message: `⚠️ This would UPDATE ${affectedRows} row${affectedRows !== 1 ? 's' : ''} in ${queryInfo.table || 'the table'}`,
        warning: 'This is a preview only. No data was actually updated. Be careful with UPDATE commands!',
        data: []
      });
    }
    
    // Handle INSERT commands - show preview
    if (queryInfo.type === 'INSERT') {
      return NextResponse.json({
        success: true,
        isPreview: true,
        queryType: 'INSERT',
        table: queryInfo.table,
        message: `⚠️ This would INSERT a new row into ${queryInfo.table || 'the table'}`,
        warning: 'This is a preview only. No data was actually inserted. Be careful with INSERT commands!',
        data: []
      });
    }
    
    // Handle SELECT queries - execute normally
    if (queryInfo.type === 'SELECT') {
      const result = await prisma.$queryRawUnsafe(query);
      return NextResponse.json({
        success: true,
        isPreview: false,
        data: result,
        count: Array.isArray(result) ? result.length : 1,
        message: 'Query executed successfully!'
      });
    }
    
    // Unknown query type
    return NextResponse.json({
      success: false,
      error: 'Unknown query type',
      message: 'Could not determine query type. Please check your SQL syntax.'
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error executing query:', error);
    
    // Check if it's a column name error and provide helpful message
    let errorMessage = error.message || 'Query execution failed';
    let helpfulMessage = 'There was an error executing your query. Check the syntax!';
    
    if (error.code === '42703' && error.message?.includes('does not exist')) {
      helpfulMessage = 'Column name error: PostgreSQL requires quoted identifiers for camelCase columns. Use "tableNumber" instead of tableNumber, or "totalPrice" instead of totalPrice. Check the table schema for exact column names.';
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: helpfulMessage,
      hint: error.code === '42703' ? 'Tip: Use double quotes around camelCase column names like "tableNumber", "totalPrice", "customerName", etc.' : undefined
    }, { status: 500 });
  }
}

