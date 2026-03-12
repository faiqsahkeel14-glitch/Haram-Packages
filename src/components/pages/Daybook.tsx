'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { HiEye, HiX, HiCalendar, HiPlus } from 'react-icons/hi';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface Account {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  direction: 'inward' | 'outward';
  amount: string;
  description: string;
  transaction_date: string;
  createdAt: string;
  Customer?: { name: string };
  Account?: { name: string };
}

const TransactionDetailModal = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => {
  const localDate = new Date(transaction.transaction_date + 'T00:00:00');
  const formattedDate = localDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = new Date(transaction.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const details = [
    { label: 'Customer', value: transaction.Customer?.name || 'N/A' },
    { label: 'Amount', value: `Rs. ${parseFloat(transaction.amount).toFixed(2)}` },
    { label: 'Account', value: transaction.Account?.name || 'N/A' },
    { label: 'Date', value: formattedDate },
    { label: 'Time', value: formattedTime },
    { label: 'Description', value: transaction.description || 'No description' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <HiX className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-white mb-6">Transaction Details</h3>
        <div className="space-y-4">
          {details.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-slate-700 pb-3">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddTransactionModal = ({
  isOpen,
  onClose,
  onSave,
  customers,
  accounts,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  customers: Customer[];
  accounts: Account[];
}) => {
  const [formData, setFormData] = useState({
    direction: 'inward' as 'inward' | 'outward',
    customerId: '',
    accountId: '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/transactions', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave();
    } catch (error) {
      console.error('Error adding transaction', error);
      alert('Error adding transaction');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <HiX className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-white mb-6">Add New Transaction</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              name="direction"
              value={formData.direction}
              onChange={(e) => setFormData({ ...formData, direction: e.target.value as any })}
              required
              className="bg-slate-700 p-3 rounded-lg text-white"
            >
              <option value="inward">Inward / Income</option>
              <option value="outward">Outward / Expense</option>
            </select>
            <input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              required
              className="bg-slate-700 p-3 rounded-lg text-white"
            />
          </div>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              required
              className="bg-slate-700 p-3 rounded-lg text-white"
            >
              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="bg-slate-700 p-3 rounded-lg text-white"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

const TransactionTable = ({
  title,
  transactions,
  total,
  icon: Icon,
  colorClass,
  onView,
}: {
  title: string;
  transactions: Transaction[];
  total: number;
  icon: any;
  colorClass: string;
  onView: (tx: Transaction) => void;
}) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-full ${colorClass}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="overflow-y-auto flex-1">
        {transactions.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-800">
              <tr>
                <th className="py-3 text-slate-400 font-semibold">Customer</th>
                <th className="py-3 text-slate-400 font-semibold text-right">Amount</th>
                <th className="py-3 text-slate-400 font-semibold text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-4">{tx.Customer?.name || 'Unknown'}</td>
                  <td className="py-4 text-right font-mono">Rs. {parseFloat(tx.amount).toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <button
                      onClick={() => onView(tx)}
                      className="p-2 text-slate-400 hover:text-cyan-400"
                    >
                      <HiEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40 text-slate-500">
            No transactions found
          </div>
        )}
      </div>
      <div className="mt-auto pt-6 border-t border-slate-700/50">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-300">Total</span>
          <span className="font-bold font-mono text-white">Rs. {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default function Daybook() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const todaysDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [txRes, custRes, accRes] = await Promise.all([
        axios.get('/api/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/customers', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/accounts', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setTransactions(txRes.data);
      setCustomers(custRes.data);
      setAccounts(accRes.data);
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

  const { inwardTxs, outwardTxs, totalInward, totalOutward } = useMemo(() => {
    const inward = transactions.filter((tx) => tx.direction === 'inward');
    const outward = transactions.filter((tx) => tx.direction === 'outward');
    const sumInward = inward.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const sumOutward = outward.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    return {
      inwardTxs: inward,
      outwardTxs: outward,
      totalInward: sumInward,
      totalOutward: sumOutward,
    };
  }, [transactions]);

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Daybook</h1>
          <div className="flex items-center gap-2 text-slate-400 mt-2">
            <HiCalendar className="w-5 h-5" />
            <span>{todaysDate}</span>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          <HiPlus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionTable
          title="Inward (Income)"
          transactions={inwardTxs}
          total={totalInward}
          icon={FaArrowDown}
          colorClass="bg-gradient-to-br from-green-500 to-cyan-500"
          onView={(tx) => setViewingTransaction(tx)}
        />
        <TransactionTable
          title="Outward (Expense)"
          transactions={outwardTxs}
          total={totalOutward}
          icon={FaArrowUp}
          colorClass="bg-gradient-to-br from-red-500 to-orange-500"
          onView={(tx) => setViewingTransaction(tx)}
        />
      </div>

      <div className="flex justify-center">
        <div className="bg-slate-900/50 border border-slate-700 rounded-full px-8 py-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xl font-bold text-slate-300">Day&apos;s Net Flow:</span>
            <span
              className={`text-3xl font-bold font-mono ${
                totalInward - totalOutward >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              Rs. {(totalInward - totalOutward).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {viewingTransaction && (
        <TransactionDetailModal
          transaction={viewingTransaction}
          onClose={() => setViewingTransaction(null)}
        />
      )}

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {
          setIsAddModalOpen(false);
          fetchData();
        }}
        customers={customers}
        accounts={accounts}
      />
    </div>
  );
}
