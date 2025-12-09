'use client';

import Navigation from '../components/Navigation';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-black mb-6">📚 API Documentation</h1>
          <p className="text-lg text-black mb-8">
            Learn about REST APIs, JSON, and how web applications communicate with each other.
          </p>

          <div className="space-y-12">
            {/* What is an API Section */}
            <section>
              <h2 className="text-3xl font-bold text-blue-600 mb-4">🤝 What is an API?</h2>
              <div className="max-w-none">
                <p className="text-black mb-4">
                  <strong>API</strong> stands for <strong>Application Programming Interface</strong>. Think of it as a bridge that allows different software applications to talk to each other.
                </p>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">🍽️ Restaurant Analogy</h3>
                  <p className="text-blue-700">
                    Imagine you're at a restaurant. You (the customer) want to order food from the kitchen (the server/database). 
                    But you can't go directly into the kitchen! Instead, you tell the waiter (the API) what you want. 
                    The waiter takes your order to the kitchen, and brings back your food.
                  </p>
                  <ul className="mt-2 text-blue-700">
                    <li><strong>You</strong> = Frontend/Client Application</li>
                    <li><strong>Waiter</strong> = API</li>
                    <li><strong>Kitchen</strong> = Backend/Database</li>
                    <li><strong>Menu</strong> = API Documentation</li>
                  </ul>
                </div>

                <h3 className="text-xl font-bold text-black mb-3">Why do we need APIs?</h3>
                <ul className="list-disc list-inside text-black space-y-2 mb-6">
                  <li><strong>Separation of Concerns</strong>: Keep frontend and backend code separate and organized</li>
                  <li><strong>Reusability</strong>: One API can serve multiple applications (web, mobile, desktop)</li>
                  <li><strong>Security</strong>: Control what data is accessible and how</li>
                  <li><strong>Scalability</strong>: Different parts can be scaled independently</li>
                </ul>
              </div>
            </section>

            {/* REST API Section */}
            <section>
              <h2 className="text-3xl font-bold text-green-600 mb-4">🌐 What is a REST API?</h2>
              <div className="max-w-none">
                <p className="text-black mb-4">
                  <strong>REST</strong> stands for <strong>Representational State Transfer</strong>. It's a set of rules for building APIs that are simple, predictable, and scalable.
                </p>

                <h3 className="text-xl font-bold text-black mb-3">REST Principles:</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800">📍 Resources & URLs</h4>
                    <p className="text-green-700 text-sm">Everything is a resource with a unique URL</p>
                    <code className="text-xs bg-white p-1 rounded">/api/lego-bricks/123</code>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800">🔄 HTTP Methods</h4>
                    <p className="text-green-700 text-sm">Use standard methods for different actions</p>
                    <code className="text-xs bg-white p-1 rounded">GET, POST, PUT, DELETE</code>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800">📊 Stateless</h4>
                    <p className="text-green-700 text-sm">Each request contains all needed information</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800">🏗️ Uniform Interface</h4>
                    <p className="text-green-700 text-sm">Consistent patterns across all endpoints</p>
                  </div>
                </div>
              </div>
            </section>

            {/* HTTP Methods Section */}
            <section>
              <h2 className="text-3xl font-bold text-purple-600 mb-4">🛠️ HTTP Methods (CRUD Operations)</h2>
              <div className="grid gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                    <h3 className="text-lg font-bold text-black">📖 Read/Retrieve Data</h3>
                  </div>
                  <p className="text-black mb-2">Get information without changing anything.</p>
                  <div className="bg-gray-50 p-2 rounded text-sm text-black">
                    <strong>Example:</strong> <code>GET /api/lego-bricks</code> - Get all Lego bricks<br/>
                    <strong>Waiter analogy:</strong> "What do you have on the menu?"
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                    <h3 className="text-lg font-bold text-black">➕ Create New Data</h3>
                  </div>
                  <p className="text-black mb-2">Add something new to the system.</p>
                  <div className="bg-gray-50 p-2 rounded text-sm text-black">
                    <strong>Example:</strong> <code>POST /api/lego-bricks</code> - Add a new Lego brick<br/>
                    <strong>Waiter analogy:</strong> "I'd like to order the salmon, please."
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">PUT</span>
                    <h3 className="text-lg font-bold text-black">✏️ Update/Replace Data</h3>
                  </div>
                  <p className="text-black mb-2">Change or update existing information.</p>
                  <div className="bg-gray-50 p-2 rounded text-sm text-black">
                    <strong>Example:</strong> <code>PUT /api/lego-bricks/123</code> - Update a specific brick<br/>
                    <strong>Waiter analogy:</strong> "Actually, can you change my salmon to medium-rare?"
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">DELETE</span>
                    <h3 className="text-lg font-bold text-black">🗑️ Remove Data</h3>
                  </div>
                  <p className="text-black mb-2">Delete something from the system.</p>
                  <div className="bg-gray-50 p-2 rounded text-sm text-black">
                    <strong>Example:</strong> <code>DELETE /api/lego-bricks/123</code> - Remove a specific brick<br/>
                    <strong>Waiter analogy:</strong> "Cancel my dessert order, please."
                  </div>
                </div>
              </div>
            </section>

            {/* JSON Section */}
            <section>
              <h2 className="text-3xl font-bold text-orange-600 mb-4">📄 What is JSON?</h2>
              <div className="max-w-none">
                <p className="text-black mb-4">
                  <strong>JSON</strong> stands for <strong>JavaScript Object Notation</strong>. It's the language that APIs use to send and receive data. 
                  Think of it as a standardized way to write down information that both humans and computers can easily understand.
                </p>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                  <h3 className="font-bold text-orange-800 mb-2">🧱 Lego Brick in JSON</h3>
                  <pre className="bg-white p-3 rounded text-sm overflow-x-auto text-black">
{`{
  "id": "brick123",
  "name": "Classic Red Brick",
  "color": "red",
  "size": "2x4",
  "shape": "rectangular",
  "quantity": 5,
  "isAvailable": true,
  "description": "The original Lego brick",
  "createdAt": "2023-12-09T10:30:00Z"
}`}
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-black mb-3">JSON Data Types:</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3 text-black">
                    <div className="text-black">
                      <strong className="text-orange-600">String:</strong> Text in quotes<br/>
                      <code className="text-sm bg-gray-100 p-1 rounded">"Hello World"</code>
                    </div>
                    <div className="text-black">
                      <strong className="text-orange-600">Number:</strong> Numbers without quotes<br/>
                      <code className="text-sm bg-gray-100 p-1 rounded">42, 3.14, -5</code>
                    </div>
                    <div className="text-black">
                      <strong className="text-orange-600">Boolean:</strong> True or false<br/>
                      <code className="text-sm bg-gray-100 p-1 rounded">true, false</code>
                    </div>
                  </div>
                  <div className="space-y-3 text-black">
                    <div className="text-black">
                      <strong className="text-orange-600">Array:</strong> List of items<br/>
                      <code className="text-sm bg-gray-100 p-1 rounded">["red", "blue", "green"]</code>
                    </div>
                    <div className="text-black">
                      <strong className="text-orange-600">Object:</strong> Collection of key-value pairs<br/>
                      <code className="text-sm bg-gray-100 p-1 rounded">{`{"name": "John", "age": 30}`}</code>
                    </div>
                    <div className="text-black">
                      <strong className="text-orange-600">Null:</strong> Empty value<br/>
                      <code className="text-sm bg-gray-100 p-1 rounded">null</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* JSON Schema Section */}
            <section>
              <h2 className="text-3xl font-bold text-indigo-600 mb-4">📋 What is JSON Schema?</h2>
              <div className="max-w-none">
                <p className="text-black mb-4">
                  A <strong>JSON Schema</strong> is like a blueprint or contract that describes what your JSON data should look like. 
                  It defines the structure, required fields, and data types to ensure data consistency.
                </p>

                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
                  <h3 className="font-bold text-indigo-800 mb-2">🧱 Lego Brick Schema</h3>
                  <pre className="bg-white p-3 rounded text-sm overflow-x-auto text-black">
{`{
  "type": "object",
  "required": ["name", "color", "size", "shape"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "Name of the brick"
    },
    "color": {
      "type": "string",
      "enum": ["red", "blue", "yellow", "green", "white", "black"]
    },
    "size": {
      "type": "string",
      "pattern": "^[0-9]+x[0-9]+$"
    },
    "quantity": {
      "type": "integer",
      "minimum": 0
    }
  }
}`}
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-black mb-3">Why use JSON Schema?</h3>
                <ul className="list-disc list-inside text-black space-y-2 mb-6">
                  <li><strong>Validation</strong>: Ensure data meets requirements before processing</li>
                  <li><strong>Documentation</strong>: Clear description of expected data structure</li>
                  <li><strong>Error Prevention</strong>: Catch invalid data early</li>
                  <li><strong>Code Generation</strong>: Automatically generate types and validation code</li>
                </ul>
              </div>
            </section>

            {/* API Response Formats Section */}
            <section>
              <h2 className="text-3xl font-bold text-teal-600 mb-4">📡 API Response Formats</h2>
              <div className="max-w-none">
                <p className="text-black mb-4">
                  Our API follows a consistent response format to make it predictable and easy to handle errors.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-800 mb-2">✅ Success Response</h3>
                    <pre className="bg-white p-3 rounded text-sm overflow-x-auto text-black">
{`{
  "success": true,
  "data": {
    "id": "brick123",
    "name": "Red Brick",
    "color": "red"
  },
  "message": "Brick created successfully!",
  "count": 1
}`}
                    </pre>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-bold text-red-800 mb-2">❌ Error Response</h3>
                    <pre className="bg-white p-3 rounded text-sm overflow-x-auto text-black">
{`{
  "success": false,
  "error": "Validation failed",
  "message": "Missing required field: name",
  "required": ["name", "color", "size"]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Reference Section */}
            <section>
              <h2 className="text-3xl font-bold text-black mb-4">🚀 Quick Reference</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-black">Common HTTP Status Codes:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-black">
                  <div>
                    <strong className="text-green-600">200 OK:</strong> Request successful<br/>
                    <strong className="text-green-600">201 Created:</strong> New resource created<br/>
                    <strong className="text-blue-600">400 Bad Request:</strong> Invalid request data<br/>
                  </div>
                  <div>
                    <strong className="text-orange-600">404 Not Found:</strong> Resource doesn't exist<br/>
                    <strong className="text-red-600">500 Internal Server Error:</strong> Server problem<br/>
                  </div>
                </div>

                <h3 className="text-xl font-bold mt-6 mb-4 text-black">Testing APIs:</h3>
                <div className="space-y-2 text-sm text-black">
                  <p><strong>Browser Dev Tools:</strong> Use the Console tab to test fetch() requests</p>
                  <p><strong>Postman:</strong> Popular API testing tool</p>
                  <p><strong>curl:</strong> Command-line tool for API requests</p>
                  <p><strong>Our Playground:</strong> Interactive examples right here!</p>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-center text-black">
                Ready to try it out? Go back to the <a href="/" className="text-blue-600 hover:underline">🧱 Lego Collection</a> or 
                <a href="/restaurant" className="text-orange-600 hover:underline ml-2">🍽️ Restaurant</a> to see these concepts in action!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}