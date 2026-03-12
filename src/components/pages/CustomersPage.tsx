'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiOutlineSearch } from 'react-icons/hi';

interface Customer {
  id: number;
  name: string;
  type: 'customer' | 'seller';
  address?: string;
  phone?: string;
  opening_balance: number;
  CustomerLedger?: { balance: string | number };
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCustomers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('/api/customers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(
    () => customers.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [customers, searchQuery]
  );

  const handleSaveCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name) return;

    try {
      const token = localStorage.getItem('token');
      if (editingCustomer.id) {
        await axios.put(`/api/customers/${editingCustomer.id}`, editingCustomer, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/customers', editingCustomer, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchCustomers();
      setIsModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer');
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Customers</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 pl-10 pr-4 py-2 rounded-full text-white placeholder:text-slate-500"
            />
          </div>
          <button
            onClick={() => {
              setEditingCustomer({ opening_balance: 0, type: 'customer' });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            <HiPlus className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th className="p-4 text-slate-400 font-semibold">Name</th>
              <th className="p-4 text-slate-400 font-semibold">Type</th>
              <th className="p-4 text-slate-400 font-semibold text-right">Balance</th>
              <th className="p-4 text-slate-400 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => {
              const balance =
                typeof customer.CustomerLedger?.balance === 'string'
                  ? parseFloat(customer.CustomerLedger.balance)
                  : customer.CustomerLedger?.balance || 0;

              return (
                <tr key={customer.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-4 font-medium text-white">{customer.name}</td>
                  <td className="p-4 text-slate-400 capitalize">{customer.type}</td>
                  <td className="p-4 text-right">
                    <span
                      className={`font-mono font-bold ${
                        balance >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      Rs. {balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setEditingCustomer(customer);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-400 inline-block"
                    >
                      <HiOutlinePencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="p-2 text-slate-400 hover:text-red-400 inline-block"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div className="text-center p-8 text-slate-500">No customers found</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add/Edit Customer">
        <form onSubmit={handleSaveCustomer} className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={editingCustomer?.name || ''}
            onChange={(e) =>
              setEditingCustomer({ ...editingCustomer, name: e.target.value })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <select
            value={editingCustomer?.type || 'customer'}
            onChange={(e) =>
              setEditingCustomer({ ...editingCustomer, type: e.target.value as any })
            }
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
          <input
            type="text"
            placeholder="Address (Optional)"
            value={editingCustomer?.address || ''}
            onChange={(e) =>
              setEditingCustomer({ ...editingCustomer, address: e.target.value })
            }
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <input
            type="text"
            placeholder="Phone (Optional)"
            value={editingCustomer?.phone || ''}
            onChange={(e) =>
              setEditingCustomer({ ...editingCustomer, phone: e.target.value })
            }
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          {!editingCustomer?.id && (
            <input
              type="number"
              step="0.01"
              placeholder="Opening Balance"
              value={editingCustomer?.opening_balance || 0}
              onChange={(e) =>
                setEditingCustomer({
                  ...editingCustomer,
                  opening_balance: parseFloat(e.target.value),
                })
              }
              className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
            />
          )}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg"
          >
            Save Customer
          </button>
        </form>
      </Modal>
    </div>
  );
}
