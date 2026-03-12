'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { HiOutlineTrash } from 'react-icons/hi';

interface Transaction {
  id: number;
  direction: 'inward' | 'outward';
  amount: string | number;
  description: string;
  transaction_date: string;
  Customer?: { name: string };
  Account?: { name: string };
}

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Are you sure?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction');
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-white">All Transactions</h1>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th className="p-4 text-slate-400 font-semibold">Type</th>
              <th className="p-4 text-slate-400 font-semibold">Customer</th>
              <th className="p-4 text-slate-400 font-semibold">Account</th>
              <th className="p-4 text-slate-400 font-semibold text-right">Amount</th>
              <th className="p-4 text-slate-400 font-semibold">Date</th>
              <th className="p-4 text-slate-400 font-semibold">Description</th>
              <th className="p-4 text-slate-400 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const amount =
                typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;

              return (
                <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tx.direction === 'inward'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {tx.direction === 'inward' ? 'Inward' : 'Outward'}
                    </span>
                  </td>
                  <td className="p-4 text-white font-medium">{tx.Customer?.name || 'N/A'}</td>
                  <td className="p-4 text-slate-400">{tx.Account?.name || 'N/A'}</td>
                  <td className="p-4 text-right font-mono font-bold">Rs. {amount.toFixed(2)}</td>
                  <td className="p-4 text-slate-400">
                    {new Date(tx.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">{tx.description}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="p-2 text-slate-400 hover:text-red-400"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center p-8 text-slate-500">No transactions found</div>
        )}
      </div>
    </div>
  );
}
