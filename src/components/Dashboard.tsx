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
          <h1>Haram Packages Dashboard</h1>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.firstName || user?.username}!</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.overview}>
          <h2>Your Packages</h2>
          {error && <div className={styles.error}>{error}</div>}
        </div>

        {/* Packages Grid */}
        <div className={styles.grid}>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg.id} className={styles.card}>
                <h3>{pkg.name}</h3>
                <p className={styles.description}>
                  {pkg.description || 'No description'}
                </p>
                <div className={styles.cardFooter}>
                  <div className={styles.price}>${pkg.price.toFixed(2)}</div>
                  <div className={styles.quantity}>
                    Stock: {pkg.quantity}
                  </div>
                </div>
                <button className={styles.buyBtn}>Select Package</button>
              </div>
            ))
          ) : (
            <p>No packages available</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2024 Haram Packages. All rights reserved.</p>
      </footer>
    </div>
  );
}
