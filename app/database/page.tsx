'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

interface TableColumn {
  name: string;
  quotedName?: string;
  type: string;
  nullable: boolean;
  default: string | null;
}

interface TableMetadata {
  model: string;
  description: string;
  category: string;
}

interface TableInfo {
  columns: TableColumn[];
  metadata: TableMetadata;
}

interface TableSchema {
  [tableName: string]: TableInfo;
}

interface QueryStep {
  type: 'select' | 'from' | 'where' | 'join' | 'group' | 'order' | 'limit';
  description: string;
  highlight?: string;
}

export default function DatabasePage() {
  const [query, setQuery] = useState('SELECT * FROM orders LIMIT 5;');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<TableSchema>({});
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [querySteps, setQuerySteps] = useState<QueryStep[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [previewInfo, setPreviewInfo] = useState<{
    isPreview: boolean;
    queryType?: string;
    affectedRows?: number;
    table?: string;
    warning?: string;
  } | null>(null);

  useEffect(() => {
    fetchSchema();
    parseQuery(query);
  }, []);

  useEffect(() => {
    parseQuery(query);
  }, [query]);

  const fetchSchema = async () => {
    try {
      const res = await fetch('/api/database/schema');
      const data = await res.json();
      if (data.success) {
        setSchema(data.data);
      }
    } catch (err) {
      console.error('Error fetching schema:', err);
    }
  };

  const parseQuery = (sql: string) => {
    const steps: QueryStep[] = [];
    const upperQuery = sql.toUpperCase().trim();
    
    // Parse SELECT
    if (upperQuery.includes('SELECT')) {
      const selectMatch = sql.match(/SELECT\s+(.+?)\s+FROM/i);
      if (selectMatch) {
        const columns = selectMatch[1].trim();
        steps.push({
          type: 'select',
          description: columns === '*' 
            ? 'Selecting all columns' 
            : `Selecting columns: ${columns}`,
          highlight: 'SELECT'
        });
      }
    }

    // Parse FROM - handle table aliases and quoted table names
    const fromMatch = sql.match(/FROM\s+["']?([\w_]+)["']?\s*(?:AS\s+(\w+))?/i);
    if (fromMatch) {
      const table = fromMatch[1];
      steps.push({
        type: 'from',
        description: `Reading from table: ${table}`,
        highlight: 'FROM'
      });
      setSelectedTable(table);
    }

    // Parse JOIN - improved regex to handle quoted names and aliases
    if (upperQuery.includes('JOIN')) {
      const joinRegex = /(INNER|LEFT|RIGHT|FULL)?\s*JOIN\s+["']?([\w_]+)["']?\s*(?:AS\s+(\w+))?\s+ON\s+([^\s]+(?:\s+[^\s]+)*?)(?=\s+(?:WHERE|ORDER|GROUP|LIMIT|$)|$)/gi;
      let joinMatch;
      while ((joinMatch = joinRegex.exec(sql)) !== null) {
        const joinType = (joinMatch[1] || 'INNER').trim();
        const table = joinMatch[2];
        const condition = joinMatch[4]?.trim() || '';
        steps.push({
          type: 'join',
          description: `${joinType} JOIN with ${table} on ${condition}`,
          highlight: joinType + ' JOIN'
        });
      }
    }

    // Parse WHERE
    if (upperQuery.includes('WHERE')) {
      const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?:\s+GROUP|\s+ORDER|\s+LIMIT|$)/i);
      if (whereMatch) {
        steps.push({
          type: 'where',
          description: `Filtering rows where: ${whereMatch[1].trim()}`,
          highlight: 'WHERE'
        });
      }
    }

    // Parse GROUP BY
    if (upperQuery.includes('GROUP BY')) {
      const groupMatch = sql.match(/GROUP BY\s+([\s\S]+?)(?:\s+HAVING|\s+ORDER|\s+LIMIT|$)/i);
      if (groupMatch) {
        steps.push({
          type: 'group',
          description: `Grouping by: ${groupMatch[1].trim()}`,
          highlight: 'GROUP BY'
        });
      }
    }

    // Parse HAVING
    if (upperQuery.includes('HAVING')) {
      const havingMatch = sql.match(/HAVING\s+([\s\S]+?)(?:\s+ORDER|\s+LIMIT|$)/i);
      if (havingMatch) {
        steps.push({
          type: 'where',
          description: `Filtering groups having: ${havingMatch[1].trim()}`,
          highlight: 'HAVING'
        });
      }
    }

    // Parse ORDER BY
    if (upperQuery.includes('ORDER BY')) {
      const orderMatch = sql.match(/ORDER BY\s+([\s\S]+?)(?:\s+LIMIT|$)/i);
      if (orderMatch) {
        steps.push({
          type: 'order',
          description: `Sorting by: ${orderMatch[1].trim()}`,
          highlight: 'ORDER BY'
        });
      }
    }

    // Parse LIMIT
    if (upperQuery.includes('LIMIT')) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        steps.push({
          type: 'limit',
          description: `Limiting to ${limitMatch[1]} rows`,
          highlight: 'LIMIT'
        });
      }
    }

    setQuerySteps(steps);
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setExecutionTime(null);
    setPreviewInfo(null);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      const data = await res.json();
      
      console.log('Query response:', data); // Debug log
      
      if (data.success) {
        // Check if this is a preview (DELETE/UPDATE/INSERT)
        if (data.isPreview) {
          setPreviewInfo({
            isPreview: true,
            queryType: data.queryType,
            affectedRows: data.affectedRows,
            table: data.table,
            warning: data.warning
          });
          setResults([]);
        } else {
          // Regular SELECT query
          if (data.data) {
            const resultArray = Array.isArray(data.data) ? data.data : [data.data];
            console.log('Setting results:', resultArray); // Debug log
            setResults(resultArray);
          } else {
            console.log('No data in response'); // Debug log
            setResults([]);
          }
          setPreviewInfo(null);
        }
        setError(null);
      } else {
        setError(data.error || 'Query failed');
        setResults([]);
        setPreviewInfo(null);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setError(err.message || 'Failed to execute query');
      setResults([]);
      setPreviewInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to run query
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (query.trim()) {
          executeQuery();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const exampleQueries = [
    {
      name: 'Select All Orders',
      query: 'SELECT * FROM orders LIMIT 5;',
      description: 'Get all columns from orders table'
    },
    {
      name: 'Select Specific Columns',
      query: 'SELECT "customerName", "tableNumber", status, "totalPrice" FROM orders;',
      description: 'Choose which columns to display'
    },
    {
      name: 'Filter with WHERE',
      query: "SELECT * FROM orders WHERE status = 'CONFIRMED';",
      description: 'Filter rows based on conditions'
    },
    {
      name: 'Sort Results',
      query: 'SELECT * FROM orders ORDER BY "totalPrice" DESC;',
      description: 'Order results by a column'
    },
    {
      name: 'Filter by Price Range',
      query: 'SELECT * FROM orders WHERE "totalPrice" > 30 ORDER BY "totalPrice" DESC;',
      description: 'Use comparison operators'
    },
    {
      name: 'Aggregate Functions',
      query: 'SELECT COUNT(*) as total_orders, AVG("totalPrice") as avg_price, SUM("totalPrice") as total_revenue FROM orders;',
      description: 'Calculate summaries'
    },
    {
      name: 'GROUP BY Status',
      query: 'SELECT status, COUNT(*) as count, AVG("totalPrice") as avg_price FROM orders GROUP BY status;',
      description: 'Group and aggregate data'
    },
    {
      name: 'JOIN Orders with Users',
      query: `SELECT u."firstName", u."lastName", u.city, o."customerName", o."totalPrice", o.status 
              FROM orders o 
              LEFT JOIN users u ON o."userId" = u.id 
              LIMIT 10;`,
      description: 'Combine data from multiple tables'
    },
    {
      name: 'JOIN Orders with Order Items',
      query: `SELECT o."customerName", oi.quantity, m.name, m.price 
              FROM orders o 
              JOIN order_items oi ON o.id = oi."orderId" 
              JOIN menu_items m ON oi."menuItemId" = m.id 
              LIMIT 10;`,
      description: 'Multi-table JOIN to see order details'
    },
    {
      name: 'Users by City',
      query: 'SELECT city, COUNT(*) as user_count FROM users GROUP BY city ORDER BY user_count DESC;',
      description: 'Group users by location'
    },
    {
      name: 'DELETE Example (Preview)',
      query: "DELETE FROM orders WHERE status = 'CANCELLED';",
      description: 'Preview DELETE - shows how many rows would be deleted'
    },
    {
      name: 'UPDATE Example (Preview)',
      query: "UPDATE orders SET status = 'DELIVERED' WHERE status = 'READY';",
      description: 'Preview UPDATE - shows how many rows would be updated'
    },
    {
      name: 'INSERT Example (Preview)',
      query: "INSERT INTO users (email, \"firstName\", \"lastName\", city) VALUES ('test@example.com', 'Test', 'User', 'New York');",
      description: 'Preview INSERT - shows what would be inserted'
    }
  ];

  const loadExample = (exampleQuery: string) => {
    setQuery(exampleQuery);
    executeQuery();
  };

  const highlightSQL = (sql: string, highlight?: string) => {
    if (!highlight) return sql;
    
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AS', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];
    let highlighted = sql;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="text-blue-600 font-bold">${keyword}</span>`);
    });
    
    return highlighted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            🗄️ Interactive SQL Learning
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Learn SQL by building queries visually. See how each part of your query works in real-time!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Sidebar - Sample Queries */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">📚 Sample Queries</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {exampleQueries.map((example, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => loadExample(example.query)}
                >
                  <h3 className="font-semibold text-black mb-1 text-sm">{example.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{example.description}</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block text-gray-800 font-mono">
                    {example.query.substring(0, 80)}{example.query.length > 80 ? '...' : ''}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Query Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Editor */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">✏️ Write Your Query</h2>
                <div className="flex items-center gap-3">
                  {executionTime !== null && (
                    <span className="text-sm text-gray-600">
                      ⏱️ {executionTime.toFixed(2)}ms
                    </span>
                  )}
                  <button
                    onClick={executeQuery}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Running...' : '▶️ Run Query'}
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
                  placeholder="SELECT * FROM orders LIMIT 5;"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  Ctrl+Enter to run
                </div>
              </div>

              {/* Query Steps Visualization */}
              {querySteps.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-black mb-3">🔍 Query Breakdown:</h3>
                  <div className="space-y-2">
                    {querySteps.map((step, idx) => {
                      const stepColors: Record<string, string> = {
                        select: 'bg-blue-100 border-blue-300',
                        from: 'bg-green-100 border-green-300',
                        where: 'bg-yellow-100 border-yellow-300',
                        join: 'bg-pink-100 border-pink-300',
                        group: 'bg-indigo-100 border-indigo-300',
                        order: 'bg-orange-100 border-orange-300',
                        limit: 'bg-red-100 border-red-300'
                      };
                      const colorClass = stepColors[step.type] || 'bg-gray-100 border-gray-300';
                      
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border-2 text-sm transition-all ${
                            activeStep === idx ? 'scale-105 shadow-md' : ''
                          } ${colorClass}`}
                          onMouseEnter={() => setActiveStep(idx)}
                          onMouseLeave={() => setActiveStep(null)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {step.type === 'select' && '📋'}
                              {step.type === 'from' && '📊'}
                              {step.type === 'where' && '🔍'}
                              {step.type === 'join' && '🔗'}
                              {step.type === 'group' && '📦'}
                              {step.type === 'order' && '⬆️'}
                              {step.type === 'limit' && '✂️'}
                            </span>
                            <div>
                              <span className="font-bold text-gray-800">{step.highlight}:</span>{' '}
                              <span className="text-gray-700">{step.description}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Preview Warning for DELETE/UPDATE/INSERT */}
              {previewInfo && previewInfo.isPreview && (
                <div className="mt-4 p-5 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h3 className="text-yellow-800 font-bold text-lg mb-2">
                        Preview Mode - No Data Changed
                      </h3>
                      <p className="text-yellow-700 font-semibold mb-2">
                        {previewInfo.queryType === 'DELETE' && 
                          `This would DELETE ${previewInfo.affectedRows || 0} row${(previewInfo.affectedRows || 0) !== 1 ? 's' : ''} from ${previewInfo.table || 'the table'}`
                        }
                        {previewInfo.queryType === 'UPDATE' && 
                          `This would UPDATE ${previewInfo.affectedRows || 0} row${(previewInfo.affectedRows || 0) !== 1 ? 's' : ''} in ${previewInfo.table || 'the table'}`
                        }
                        {previewInfo.queryType === 'INSERT' && 
                          `This would INSERT a new row into ${previewInfo.table || 'the table'}`
                        }
                      </p>
                      <p className="text-yellow-600 text-sm">
                        {previewInfo.warning || 'This is a preview only. No data was actually modified. Be careful with destructive commands!'}
                      </p>
                      {previewInfo.queryType === 'DELETE' && (!previewInfo.affectedRows || previewInfo.affectedRows === 0) && (
                        <p className="text-yellow-600 text-sm mt-2 font-semibold">
                          ⚠️ No WHERE clause detected - this would delete ALL rows in the table!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-semibold">❌ Error:</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Display */}
        {!loading && !error && !previewInfo && (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                📋 Results ({results.length} {results.length === 1 ? 'row' : 'rows'})
              </h2>
            </div>
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Query executed successfully but returned no rows.</p>
                <p className="text-sm mt-2">Try a different query or check if the table has data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {results[0] && Object.keys(results[0]).map((key) => (
                        <th key={key} className="border border-gray-300 px-4 py-2 text-left font-semibold text-black">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {row && Object.values(row).map((value: any, colIdx) => (
                          <td key={colIdx} className="border border-gray-300 px-4 py-2 text-gray-700">
                            {value === null ? (
                              <span className="text-gray-400 italic">NULL</span>
                            ) : typeof value === 'object' ? (
                              JSON.stringify(value)
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Available Tables */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-black">📊 Available Tables</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(schema).length === 0 ? (
              <p className="text-gray-500">Loading tables...</p>
            ) : (
              Object.entries(schema).map(([tableName, tableInfo]) => {
                const columns = tableInfo.columns || [];
                const metadata = tableInfo.metadata || { model: '', description: '', category: '' };
                
                return (
                <div
                  key={tableName}
                  className={`border rounded-lg transition-all ${
                    selectedTable === tableName
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  } ${expandedTable === tableName ? 'col-span-full' : ''}`}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => {
                      setSelectedTable(tableName);
                      setExpandedTable(expandedTable === tableName ? null : tableName);
                      // Insert table name into query if FROM is present
                      if (query.toUpperCase().includes('FROM')) {
                        const fromMatch = query.match(/FROM\s+["']?[\w_]+["']?/i);
                        if (fromMatch) {
                          setQuery(query.replace(/FROM\s+["']?[\w_]+["']?/i, `FROM ${tableName}`));
                        }
                      } else {
                        // Add FROM clause if not present
                        if (!query.trim().endsWith(';')) {
                          setQuery(query + ` FROM ${tableName};`);
                        } else {
                          setQuery(query.replace(/;/, ` FROM ${tableName};`));
                        }
                      }
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold text-black">{tableName}</h3>
                        {metadata.description && (
                          <p className="text-xs text-gray-500 mt-1">{metadata.description}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{columns.length} columns</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuery(`SELECT * FROM ${tableName} LIMIT 10;`);
                      }}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full"
                    >
                      Use Table
                    </button>
                  </div>
                  
                  {/* Expanded Schema View */}
                  {expandedTable === tableName && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="mb-3">
                        <h4 className="font-semibold text-black mb-1">Table Schema</h4>
                        {metadata.model && (
                          <p className="text-xs text-gray-600">Model: <code className="text-blue-600">{metadata.model}</code></p>
                        )}
                        {metadata.description && (
                          <p className="text-xs text-gray-600 mt-1">{metadata.description}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {columns.map((col) => (
                          <div
                            key={col.name}
                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <code className="text-sm font-mono text-blue-600 font-semibold">
                                {col.quotedName || col.name}
                              </code>
                              <span className="text-xs text-gray-500">
                                {col.type}
                              </span>
                              {!col.nullable && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">
                                  NOT NULL
                                </span>
                              )}
                              {col.default && (
                                <span className="text-xs text-gray-400">
                                  default: {col.default}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const colName = col.quotedName || col.name;
                                if (query.toUpperCase().includes('SELECT')) {
                                  const selectMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
                                  if (selectMatch && selectMatch[1] !== '*') {
                                    const currentCols = selectMatch[1];
                                    if (!currentCols.includes(col.name) && !currentCols.includes(colName)) {
                                      setQuery(query.replace(/SELECT\s+(.+?)\s+FROM/i, `SELECT ${currentCols}, ${colName} FROM`));
                                    }
                                  } else if (selectMatch && selectMatch[1] === '*') {
                                    setQuery(query.replace(/SELECT\s+\*\s+FROM/i, `SELECT ${colName} FROM`));
                                  }
                                } else {
                                  setQuery(`SELECT ${colName} FROM ${tableName};`);
                                }
                              }}
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 ml-2"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                );
              })
            )}
          </div>
        </div>


        {/* Educational Content */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-black">💡 SQL Concepts</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-black mb-2">SELECT</h3>
              <p className="text-gray-700">Choose which columns to display. Use * for all columns.</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">FROM</h3>
              <p className="text-gray-700">Specify which table to read data from.</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">WHERE</h3>
              <p className="text-gray-700">Filter rows based on conditions (e.g., color = 'red').</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">JOIN</h3>
              <p className="text-gray-700">Combine data from multiple tables using relationships.</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">GROUP BY</h3>
              <p className="text-gray-700">Group rows together and calculate aggregates per group.</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">ORDER BY</h3>
              <p className="text-gray-700">Sort results by one or more columns (ASC or DESC).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

