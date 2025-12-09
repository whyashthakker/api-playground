'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  prepTime: number;
}

interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  specialRequests?: string;
  menuItem: MenuItem;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: number;
  status: string;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function RestaurantPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'customer' | 'kitchen'>('customer');

  const [newOrder, setNewOrder] = useState({
    customerName: 'Table Guest',
    tableNumber: 1,
    notes: '',
    items: [{ menuItemId: '', quantity: 1, specialRequests: '' }]
  });

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const placeOrder = async () => {
    if (!newOrder.items.some(item => item.menuItemId)) {
      alert('Please select at least one menu item!');
      return;
    }

    const orderItems = newOrder.items.filter(item => item.menuItemId);

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          items: orderItems
        })
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        setNewOrder({
          customerName: 'Table Guest',
          tableNumber: newOrder.tableNumber + 1,
          notes: '',
          items: [{ menuItemId: '', quantity: 1, specialRequests: '' }]
        });
        fetchOrders();
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
    setLoading(false);
  };

  const addOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { menuItemId: '', quantity: 1, specialRequests: '' }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-orange-100 text-orange-800';
      case 'READY': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-gray-100 text-black';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-black';
    }
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navigation />
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            🍽️ Restaurant API Experience
          </h1>
          <p className="text-lg text-black max-w-3xl mx-auto">
            APIs work like restaurant waiters - taking orders, communicating with the kitchen, and bringing back responses.
          </p>
        </div>

        {response && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${response.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className="font-bold text-sm mb-2">🗣️ Waiter Says:</h3>
            <p className="text-sm mb-2">{response.message}</p>
            <details className="text-xs">
              <summary className="cursor-pointer font-semibold">See full API response</summary>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('customer')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'customer' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            👨‍💼 Customer View
          </button>
          <button 
            onClick={() => setActiveTab('kitchen')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'kitchen' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            👨‍🍳 Kitchen View
          </button>
        </div>

        {activeTab === 'customer' ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-black">📝 Place Your Order</h2>
              
              <div className="space-y-4">
                <div className="text-sm text-black mb-4">
                  <strong>Customer:</strong> {newOrder.customerName} | <strong>Table:</strong> {newOrder.tableNumber}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Order Items:</h3>
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                      <select
                        value={item.menuItemId}
                        onChange={(e) => updateOrderItem(index, 'menuItemId', e.target.value)}
                        className="col-span-5 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      >
                        <option value="">Select item *</option>
                        {Object.entries(groupedMenu).map(([category, items]) => (
                          <optgroup key={category} label={category}>
                            {items.map((menuItem) => (
                              <option key={menuItem.id} value={menuItem.id}>
                                {menuItem.name} - ${menuItem.price}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="col-span-2 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                        min="1"
                      />
                      
                      <input
                        type="text"
                        placeholder="Special requests"
                        value={item.specialRequests}
                        onChange={(e) => updateOrderItem(index, 'specialRequests', e.target.value)}
                        className="col-span-4 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      />
                      
                      <button
                        onClick={() => removeOrderItem(index)}
                        className="col-span-1 text-red-500 hover:text-red-600 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={addOrderItem}
                    className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
                  >
                    + Add another item
                  </button>
                </div>
                
                <textarea
                  placeholder="Order notes (optional)"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  rows={3}
                />
                
                <button 
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order 🍽️'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">📋 Menu</h2>
                <button 
                  onClick={fetchMenu}
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  🔄 Refresh
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-bold text-lg text-orange-600 border-b border-orange-200 pb-1">
                      {category}
                    </h3>
                    {items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-3 mt-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-black">{item.description}</p>
                            <p className="text-sm text-black">
                              Prep time: {item.prepTime} min • ${item.price}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">👨‍🍳 Kitchen Orders Dashboard</h2>
              <button 
                onClick={fetchOrders}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                🔄 Refresh Orders
              </button>
            </div>
            
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <p className="text-black text-center py-8">No orders yet! Place some orders first.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {order.customerName} - Table {order.tableNumber}
                        </h3>
                        <p className="text-sm text-black">
                          Order Total: ${order.totalPrice.toFixed(2)}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-black italic">Notes: {order.notes}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-semibold text-sm mb-2">Items:</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm text-black ml-4">
                          • {item.quantity}x {item.menuItem.name}
                          {item.specialRequests && (
                            <span className="italic text-orange-600"> ({item.specialRequests})</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {['CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          disabled={loading || order.status === status}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            order.status === status
                              ? 'bg-gray-300 text-black cursor-not-allowed'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}