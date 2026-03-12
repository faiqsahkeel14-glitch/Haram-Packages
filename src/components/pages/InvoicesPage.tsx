'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { HiPlus, HiOutlineTrash } from 'react-icons/hi';

interface Customer {
  id: number;
  name: string;
  type: 'customer' | 'seller';
}

interface Invoice {
  id: number;
  customerId: number;
  description: string;
  quantity: number;
  unit_price: string | number;
  total: string | number;
  invoice_date: string;
  customer: Customer;
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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Partial<Invoice> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [invRes, custRes] = await Promise.all([
        axios.get('/api/invoices', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingInvoice || !editingInvoice.customerId || !editingInvoice.quantity) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/invoices', editingInvoice, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
      setIsModalOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    if (!confirm('Are you sure?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice');
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Invoices</h1>
        <button
          onClick={() => {
            setEditingInvoice({
              customerId: 0,
              quantity: 1,
              unit_price: 0,
              total: 0,
              invoice_date: new Date().toISOString().split('T')[0],
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          <HiPlus className="w-5 h-5" />
          Add Invoice
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th className="p-4 text-slate-400 font-semibold">Customer</th>
              <th className="p-4 text-slate-400 font-semibold">Type</th>
              <th className="p-4 text-slate-400 font-semibold text-right">Total</th>
              <th className="p-4 text-slate-400 font-semibold">Date</th>
              <th className="p-4 text-slate-400 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="p-4 font-medium text-white">{invoice.customer.name}</td>
                <td className="p-4 text-slate-400 capitalize">{invoice.customer.type}</td>
                <td className="p-4 text-right font-mono">
                  Rs. {typeof invoice.total === 'string' ? parseFloat(invoice.total).toFixed(2) : invoice.total.toFixed(2)}
                </td>
                <td className="p-4 text-slate-400">
                  {new Date(invoice.invoice_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div className="text-center p-8 text-slate-500">No invoices found</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Invoice">
        <form onSubmit={handleSaveInvoice} className="space-y-4">
          <select
            value={editingInvoice?.customerId || 0}
            onChange={(e) =>
              setEditingInvoice({
                ...editingInvoice,
                customerId: parseInt(e.target.value),
              })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          >
            <option value="0">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={editingInvoice?.invoice_date || ''}
            onChange={(e) =>
              setEditingInvoice({ ...editingInvoice, invoice_date: e.target.value })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={editingInvoice?.quantity || 1}
            onChange={(e) =>
              setEditingInvoice({
                ...editingInvoice,
                quantity: parseInt(e.target.value),
              })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Unit Price"
            value={editingInvoice?.unit_price || 0}
            onChange={(e) =>
              setEditingInvoice({
                ...editingInvoice,
                unit_price: parseFloat(e.target.value),
              })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Total"
            value={editingInvoice?.total || 0}
            onChange={(e) =>
              setEditingInvoice({
                ...editingInvoice,
                total: parseFloat(e.target.value),
              })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={editingInvoice?.description || ''}
            onChange={(e) =>
              setEditingInvoice({ ...editingInvoice, description: e.target.value })
            }
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg"
          >
            Save Invoice
          </button>
        </form>
      </Modal>
    </div>
  );
}
