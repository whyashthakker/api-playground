'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';

interface LegoBrick {
  id: string;
  name: string;
  color: string;
  size: string;
  shape: string;
  quantity: number;
  description?: string;
  createdAt: string;
}

interface LegoSet {
  id: string;
  name: string;
  theme: string;
  pieceCount: number;
  difficulty: string;
  price?: number;
  description?: string;
  createdAt: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bricks' | 'sets'>('bricks');
  const [bricks, setBricks] = useState<LegoBrick[]>([]);
  const [sets, setSets] = useState<LegoSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [editingBrick, setEditingBrick] = useState<LegoBrick | null>(null);
  const [editingSet, setEditingSet] = useState<LegoSet | null>(null);

  const [newBrick, setNewBrick] = useState({
    name: '',
    color: '',
    size: '',
    shape: '',
    quantity: 1,
    description: ''
  });

  const [newSet, setNewSet] = useState({
    name: '',
    theme: '',
    pieceCount: 0,
    difficulty: '',
    price: 0,
    description: ''
  });

  useEffect(() => {
    fetchBricks();
    fetchSets();
  }, []);

  const fetchBricks = async () => {
    try {
      const res = await fetch('/api/lego-bricks');
      const data = await res.json();
      if (data.success) {
        setBricks(data.data);
      }
    } catch (error) {
      console.error('Error fetching bricks:', error);
    }
  };

  const fetchSets = async () => {
    try {
      const res = await fetch('/api/lego-sets');
      const data = await res.json();
      if (data.success) {
        setSets(data.data);
      }
    } catch (error) {
      console.error('Error fetching sets:', error);
    }
  };

  const addBrick = async () => {
    if (!newBrick.name || !newBrick.color || !newBrick.size || !newBrick.shape) {
      alert('Please fill in all required fields!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/lego-bricks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrick)
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        setNewBrick({ name: '', color: '', size: '', shape: '', quantity: 1, description: '' });
        fetchBricks();
      }
    } catch (error) {
      console.error('Error adding brick:', error);
    }
    setLoading(false);
  };

  const addSet = async () => {
    if (!newSet.name || !newSet.theme || !newSet.pieceCount || !newSet.difficulty) {
      alert('Please fill in all required fields!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/lego-sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSet)
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        setNewSet({ name: '', theme: '', pieceCount: 0, difficulty: '', price: 0, description: '' });
        fetchSets();
      }
    } catch (error) {
      console.error('Error adding set:', error);
    }
    setLoading(false);
  };

  const deleteBrick = async (id: string) => {
    if (!confirm('Are you sure you want to remove this brick?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/lego-bricks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        fetchBricks();
      }
    } catch (error) {
      console.error('Error deleting brick:', error);
    }
    setLoading(false);
  };

  const updateBrick = async (id: string, updatedData: Partial<LegoBrick>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lego-bricks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        setEditingBrick(null);
        fetchBricks();
      }
    } catch (error) {
      console.error('Error updating brick:', error);
    }
    setLoading(false);
  };

  const updateSet = async (id: string, updatedData: Partial<LegoSet>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lego-sets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        setEditingSet(null);
        fetchSets();
      }
    } catch (error) {
      console.error('Error updating set:', error);
    }
    setLoading(false);
  };

  const startEditBrick = (brick: LegoBrick) => {
    setEditingBrick(brick);
  };

  const startEditSet = (set: LegoSet) => {
    setEditingSet(set);
  };

  const getRequestBodyPreview = () => {
    const data = activeTab === 'bricks' ? newBrick : newSet;
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => 
        value !== '' && value !== 0 && value !== null && value !== undefined
      )
    );
    return JSON.stringify(filteredData, null, 2);
  };

  const deleteSet = async (id: string) => {
    if (!confirm('Are you sure you want to remove this set?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/lego-sets/${id}`, { method: 'DELETE' });
      const data = await res.json();
      setResponse(data);
      
      if (data.success) {
        fetchSets();
      }
    } catch (error) {
      console.error('Error deleting set:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <Navigation />
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            🧱 Lego API Playground
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Learn APIs like building with Legos! See the real-time JSON request body as you fill out forms.
          </p>
        </div>

        {response && (
          <div className={`mb-6 p-4 rounded-lg ${response.success ? 'bg-gray-900' : 'bg-red-900'}`}>
            <h3 className="font-bold text-sm mb-2 text-white">📡 Latest API Response:</h3>
            <p className="text-sm mb-2 text-green-300">{response.message}</p>
            <pre className="text-xs text-green-400 overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('bricks')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'bricks' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🧱 Lego Bricks
          </button>
          <button 
            onClick={() => setActiveTab('sets')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'sets' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-black border border-gray-300 hover:bg-gray-50'
            }`}
          >
            📦 Lego Sets
          </button>
        </div>

        {/* Real-time JSON Preview */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-6">
          <h3 className="text-white font-bold mb-2">📡 Real-time JSON Request Body</h3>
          <p className="text-green-300 text-sm mb-2">
            This is what will be sent to {activeTab === 'bricks' ? 'POST /api/lego-bricks' : 'POST /api/lego-sets'}
          </p>
          <pre className="text-xs overflow-auto">
            {getRequestBodyPreview()}
          </pre>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {activeTab === 'bricks' ? (
            <>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-black">Add New Brick</h2>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Brick name *"
                    value={newBrick.name}
                    onChange={(e) => setNewBrick({...newBrick, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newBrick.color}
                      onChange={(e) => setNewBrick({...newBrick, color: e.target.value})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select color *</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="yellow">Yellow</option>
                      <option value="green">Green</option>
                      <option value="white">White</option>
                      <option value="black">Black</option>
                    </select>
                    
                    <select
                      value={newBrick.size}
                      onChange={(e) => setNewBrick({...newBrick, size: e.target.value})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select size *</option>
                      <option value="1x1">1x1</option>
                      <option value="1x2">1x2</option>
                      <option value="2x2">2x2</option>
                      <option value="2x4">2x4</option>
                      <option value="4x4">4x4</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newBrick.shape}
                      onChange={(e) => setNewBrick({...newBrick, shape: e.target.value})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select shape *</option>
                      <option value="rectangular">Rectangular</option>
                      <option value="square">Square</option>
                      <option value="round">Round</option>
                      <option value="slope">Slope</option>
                    </select>
                    
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={newBrick.quantity}
                      onChange={(e) => setNewBrick({...newBrick, quantity: parseInt(e.target.value) || 1})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      min="1"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Description (optional)"
                    value={newBrick.description}
                    onChange={(e) => setNewBrick({...newBrick, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    rows={3}
                  />
                  
                  <button 
                    onClick={addBrick}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Brick 🧱'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-black">Your Brick Collection</h2>
                  <button 
                    onClick={fetchBricks}
                    className="text-blue-500 hover:text-blue-600 font-semibold"
                  >
                    🔄 Refresh
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bricks.length === 0 ? (
                    <p className="text-black text-center py-8">No bricks yet! Add some above.</p>
                  ) : (
                    bricks.map((brick) => (
                      <div key={brick.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {editingBrick && editingBrick.id === brick.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingBrick.name}
                              onChange={(e) => setEditingBrick({...editingBrick, name: e.target.value})}
                              className="w-full p-2 border rounded text-gray-900 bg-white"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={editingBrick.color}
                                onChange={(e) => setEditingBrick({...editingBrick, color: e.target.value})}
                                className="p-2 border rounded text-gray-900 bg-white"
                              >
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="yellow">Yellow</option>
                                <option value="green">Green</option>
                                <option value="white">White</option>
                                <option value="black">Black</option>
                              </select>
                              <input
                                type="number"
                                value={editingBrick.quantity}
                                onChange={(e) => setEditingBrick({...editingBrick, quantity: parseInt(e.target.value)})}
                                className="p-2 border rounded text-gray-900 bg-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateBrick(brick.id, editingBrick)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingBrick(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-black">{brick.name}</h3>
                              <p className="text-sm text-black">
                                {brick.color} {brick.shape} • {brick.size} • Qty: {brick.quantity}
                              </p>
                              {brick.description && (
                                <p className="text-sm text-black mt-1">{brick.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => startEditBrick(brick)}
                                className="text-blue-500 hover:text-blue-600 font-semibold"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => deleteBrick(brick.id)}
                                className="text-red-500 hover:text-red-600 font-semibold"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-black">Add New Set</h2>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Set name *"
                    value={newSet.name}
                    onChange={(e) => setNewSet({...newSet, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={newSet.theme}
                      onChange={(e) => setNewSet({...newSet, theme: e.target.value})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select theme *</option>
                      <option value="City">City</option>
                      <option value="Space">Space</option>
                      <option value="Castle">Castle</option>
                      <option value="Creator">Creator</option>
                      <option value="Technic">Technic</option>
                      <option value="Friends">Friends</option>
                    </select>
                    
                    <select
                      value={newSet.difficulty}
                      onChange={(e) => setNewSet({...newSet, difficulty: e.target.value})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Select difficulty *</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Piece count *"
                      value={newSet.pieceCount || ''}
                      onChange={(e) => setNewSet({...newSet, pieceCount: parseInt(e.target.value) || 0})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      min="1"
                    />
                    
                    <input
                      type="number"
                      placeholder="Price (optional)"
                      value={newSet.price || ''}
                      onChange={(e) => setNewSet({...newSet, price: parseFloat(e.target.value) || 0})}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Description (optional)"
                    value={newSet.description}
                    onChange={(e) => setNewSet({...newSet, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    rows={3}
                  />
                  
                  <button 
                    onClick={addSet}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Set 📦'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-black">Your Set Collection</h2>
                  <button 
                    onClick={fetchSets}
                    className="text-blue-500 hover:text-blue-600 font-semibold"
                  >
                    🔄 Refresh
                  </button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sets.length === 0 ? (
                    <p className="text-black text-center py-8">No sets yet! Add some above.</p>
                  ) : (
                    sets.map((set) => (
                      <div key={set.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {editingSet && editingSet.id === set.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingSet.name}
                              onChange={(e) => setEditingSet({...editingSet, name: e.target.value})}
                              className="w-full p-2 border rounded text-gray-900 bg-white"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={editingSet.theme}
                                onChange={(e) => setEditingSet({...editingSet, theme: e.target.value})}
                                className="p-2 border rounded text-gray-900 bg-white"
                              >
                                <option value="City">City</option>
                                <option value="Space">Space</option>
                                <option value="Castle">Castle</option>
                                <option value="Creator">Creator</option>
                                <option value="Technic">Technic</option>
                                <option value="Friends">Friends</option>
                              </select>
                              <input
                                type="number"
                                value={editingSet.pieceCount}
                                onChange={(e) => setEditingSet({...editingSet, pieceCount: parseInt(e.target.value)})}
                                className="p-2 border rounded text-gray-900 bg-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateSet(set.id, editingSet)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingSet(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-black">{set.name}</h3>
                              <p className="text-sm text-black">
                                {set.theme} • {set.difficulty} • {set.pieceCount} pieces
                                {set.price && ` • $${set.price}`}
                              </p>
                              {set.description && (
                                <p className="text-sm text-black mt-1">{set.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => startEditSet(set)}
                                className="text-blue-500 hover:text-blue-600 font-semibold"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => deleteSet(set.id)}
                                className="text-red-500 hover:text-red-600 font-semibold"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
