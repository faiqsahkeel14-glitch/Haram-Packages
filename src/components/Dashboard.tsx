'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

interface Package {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function Dashboard() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchPackages(token);
  }, [router]);

  const fetchPackages = async (token: string) => {
    try {
      const response = await fetch('/api/packages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPackages(data.data);
      } else {
        setError(data.message || 'Failed to fetch packages');
      }
    } catch (err) {
      setError('An error occurred while fetching packages');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ name: '', description: '', price: '', quantity: '' });
        setShowAddForm(false);
        fetchPackages(token);
      } else {
        setError(data.message || 'Failed to add package');
      }
    } catch (err) {
      setError('Error adding package');
      console.error('Error:', err);
    }
  };

  const handleDeletePackage = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token || !confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchPackages(token);
      } else {
        setError('Failed to delete package');
      }
    } catch (err) {
      setError('Error deleting package');
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Haram Packages Admin</h1>
          <div className={styles.userInfo}>
            <span>Welcome, Admin!</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.overview}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Package Management</h2>
              <p>Total Packages: {packages.length}</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showAddForm ? 'Cancel' : '+ Add Package'}
            </button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </div>

        {/* Add Package Form */}
        {showAddForm && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e0e0e0'
          }}>
            <h3>Add New Package</h3>
            <form onSubmit={handleAddPackage} style={{ display: 'grid', gap: '10px' }}>
              <input
                type="text"
                placeholder="Package Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <input
                type="number"
                placeholder="Price"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <button 
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add Package
              </button>
            </form>
          </div>
        )}

        {/* Packages Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#6366f1', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px' }}><strong>{pkg.name}</strong></td>
                    <td style={{ padding: '12px' }}>{pkg.description || '-'}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${pkg.price.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{pkg.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    No packages yet. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2024 Haram Packages Admin. All rights reserved.</p>
      </footer>
    </div>
  );
}
