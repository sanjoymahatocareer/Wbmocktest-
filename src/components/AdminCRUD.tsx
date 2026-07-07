import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Check, Search, IterationCcw } from 'lucide-react';

interface AdminCRUDProps {
  tableName: string;
  title: string;
  columns: { key: string; label: string; type: 'text' | 'number' | 'boolean' | 'date' | 'textarea' }[];
  onBack: () => void;
}

export default function AdminCRUD({ tableName, title, columns, onBack }: AdminCRUDProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: records, error } = await supabase.from(tableName).select('*').order('id', { ascending: false });
    if (error) {
      showNotification(error.message, 'error');
    } else {
      setData(records || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentRecord.id) {
        const { error } = await supabase.from(tableName).update(currentRecord).eq('id', currentRecord.id);
        if (error) throw error;
        showNotification('Record updated successfully', 'success');
      } else {
        const { error } = await supabase.from(tableName).insert([currentRecord]);
        if (error) throw error;
        showNotification('Record added successfully', 'success');
      }
      setIsEditing(false);
      fetchData();
    } catch (err: any) {
      showNotification(err.message, 'error');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      showNotification(error.message, 'error');
      setLoading(false);
    } else {
      showNotification('Record deleted successfully', 'success');
      fetchData();
    }
  };

  const handleEdit = (record: any) => {
    setCurrentRecord(record);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentRecord({});
    setIsEditing(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20 max-w-md mx-auto relative shadow-2xl">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-b-[32px] pt-12 pb-6 px-6 shadow-lg flex items-center justify-between">
         <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full cursor-pointer">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
           </svg>
         </button>
         <h1 className="text-xl font-black">{title}</h1>
         <div className="w-10"></div>
      </header>

      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full font-bold text-sm shadow-xl ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="p-5 space-y-4">
           {columns.map(col => (
             <div key={col.key}>
                <label className="text-xs font-bold text-slate-500 mb-1 block">{col.label}</label>
                {col.type === 'textarea' ? (
                  <textarea 
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm"
                    value={currentRecord[col.key] || ''}
                    onChange={(e) => setCurrentRecord({...currentRecord, [col.key]: e.target.value})}
                    rows={4}
                  />
                ) : col.type === 'boolean' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5"
                      checked={currentRecord[col.key] || false}
                      onChange={(e) => setCurrentRecord({...currentRecord, [col.key]: e.target.checked})}
                    /> 
                    <span className="text-sm font-semibold">Yes / Enabled</span>
                  </div>
                ) : (
                  <input 
                    type={col.type === 'number' ? 'number' : 'text'}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm"
                    value={currentRecord[col.key] || ''}
                    onChange={(e) => setCurrentRecord({...currentRecord, [col.key]: col.type === 'number' ? parseFloat(e.target.value) : e.target.value})}
                  />
                )}
             </div>
           ))}
           <div className="flex gap-3 pt-4">
             <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl active:scale-95 transition-transform">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-transform">{loading ? 'Saving...' : 'Save Record'}</button>
           </div>
        </form>
      ) : (
        <div className="p-5">
           <button onClick={handleAdd} className="w-full py-3 mb-4 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-transform">
             <Plus className="w-5 h-5" /> Add New Record
           </button>
           
           {loading ? (
             <div className="text-center py-10 text-slate-400 font-bold">Loading data...</div>
           ) : data.length === 0 ? (
             <div className="text-center py-10 text-slate-400 font-bold">No records found.</div>
           ) : (
             <div className="space-y-3">
               {data.map(item => (
                 <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    <div className="text-sm font-bold text-slate-800 line-clamp-2">
                      {item.title || item.name || item.email || item.key || `Record #${item.id}`}
                    </div>
                    <div className="flex items-center gap-2 mt-2 border-t pt-2 border-slate-50">
                      <button onClick={() => handleEdit(item)} className="p-1.5 flex-1 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center gap-1 text-xs font-bold active:scale-95 transition-transform">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 flex-1 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-1 text-xs font-bold active:scale-95 transition-transform">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}
