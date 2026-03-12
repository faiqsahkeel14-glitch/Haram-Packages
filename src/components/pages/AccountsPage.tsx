'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { HiPlus } from 'react-icons/hi';

interface Account {
  id: number;
  name: string;
  balance: string | number;
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

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Partial<Account> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAccounts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSaveAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAccount || !editingAccount.name) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/accounts', editingAccount, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAccounts();
      setIsModalOpen(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Error saving account');
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Accounts</h1>
        <button
          onClick={() => {
            setEditingAccount({ name: '', balance: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          <HiPlus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th className="p-4 text-slate-400 font-semibold">Account Name</th>
              <th className="p-4 text-slate-400 font-semibold text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              const balance =
                typeof account.balance === 'string'
                  ? parseFloat(account.balance)
                  : account.balance;

              return (
                <tr key={account.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-4 font-medium text-white">{account.name}</td>
                  <td className="p-4 text-right">
                    <span className="font-mono font-bold text-cyan-300">
                      Rs. {balance.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {accounts.length === 0 && (
          <div className="text-center p-8 text-slate-500">No accounts found</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Account">
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <input
            type="text"
            placeholder="Account Name"
            value={editingAccount?.name || ''}
            onChange={(e) =>
              setEditingAccount({ ...editingAccount, name: e.target.value })
            }
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Opening Balance"
            value={editingAccount?.balance || 0}
            onChange={(e) =>
              setEditingAccount({
                ...editingAccount,
                balance: parseFloat(e.target.value),
              })
            }
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
          >
            Save Account
          </button>
        </form>
      </Modal>
    </div>
  );
}
