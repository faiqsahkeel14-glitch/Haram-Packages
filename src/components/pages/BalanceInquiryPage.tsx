'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Customer {
  id: number;
  name: string;
  type: 'customer' | 'seller';
  CustomerLedger?: { balance: string | number };
}

export default function BalanceInquiryPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  const buyers = customers.filter((c) => c.type === 'customer');
  const suppliers = customers.filter((c) => c.type === 'seller');

  if (isLoading) return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-white">Balance Inquiry</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buyers */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-auto">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/80 sticky top-0">
            <h2 className="text-2xl font-bold text-white">Amount Receivable (from Buyers)</h2>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-800">
                <tr>
                  <th className="p-4 text-slate-400 font-semibold">Name</th>
                  <th className="p-4 text-slate-400 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => {
                  const balance =
                    typeof buyer.CustomerLedger?.balance === 'string'
                      ? parseFloat(buyer.CustomerLedger.balance)
                      : buyer.CustomerLedger?.balance || 0;

                  return (
                    <tr key={buyer.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4 font-medium text-white">{buyer.name}</td>
                      <td className="p-4 text-right">
                        <span
                          className={`font-mono font-bold ${
                            balance >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          Rs. {Math.abs(balance).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {buyers.length === 0 && (
              <div className="text-center p-8 text-slate-500">No buyers found</div>
            )}
          </div>
        </div>

        {/* Suppliers */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-auto">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/80 sticky top-0">
            <h2 className="text-2xl font-bold text-white">Amount Payable (to Suppliers)</h2>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-800">
                <tr>
                  <th className="p-4 text-slate-400 font-semibold">Name</th>
                  <th className="p-4 text-slate-400 font-semibold text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => {
                  const balance =
                    typeof supplier.CustomerLedger?.balance === 'string'
                      ? parseFloat(supplier.CustomerLedger.balance)
                      : supplier.CustomerLedger?.balance || 0;

                  return (
                    <tr key={supplier.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4 font-medium text-white">{supplier.name}</td>
                      <td className="p-4 text-right">
                        <span
                          className={`font-mono font-bold ${
                            balance <= 0 ? 'text-orange-400' : 'text-blue-400'
                          }`}
                        >
                          Rs. {Math.abs(balance).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {suppliers.length === 0 && (
              <div className="text-center p-8 text-slate-500">No suppliers found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
