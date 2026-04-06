// components/settings/FeeStructureTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import { DollarSign, Plus, X, AlertCircle, Loader2, Save } from "lucide-react";
import { useGetFeeStructureQuery, useUpdateFeeStructureMutation } from "@/redux/slices/settingsSlice";
import { Section, SaveBtn } from "./SharedComponents";
import toast from "react-hot-toast";

const CATEGORY_META = {
  primaryDay:      { label: 'Primary (Day)',                   color: 'bg-blue-50 text-blue-700 border-blue-200',   icon: '', desc: 'KG / Nursery / Primary day students' },
  primaryBoarders: { label: 'Primary (Boarders)',              color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '', desc: 'KG / Nursery / Primary boarding students' },
  juniorDay:       { label: 'Junior Secondary (Day)',          color: 'bg-green-50 text-green-700 border-green-200',  icon: '', desc: 'JSS 1–3 day students' },
  juniorBoarders:  { label: 'Junior Secondary (Boarders)',     color: 'bg-teal-50 text-teal-700 border-teal-200',   icon: '', desc: 'JSS 1–3 boarding students' },
  seniorDay:       { label: 'Senior Secondary (Day)',          color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '', desc: 'SS 1–3 day students' },
  seniorBoarders:  { label: 'Senior Secondary (Boarders)',     color: 'bg-rose-50 text-rose-700 border-rose-200',   icon: '', desc: 'SS 1–3 boarding students' },
};

const TERM_KEYS = ['firstTerm', 'secondTerm', 'thirdTerm'];
const TERM_LABELS = { firstTerm: '1st Term', secondTerm: '2nd Term', thirdTerm: '3rd Term' };

const FeeLineRow = ({ item, index, onChange, onRemove }) => (
  <div className="flex items-center gap-2 group">
    <input
      value={item.description}
      onChange={e => onChange(index, 'description', e.target.value)}
      placeholder="Description"
      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300"
    />
    <div className="relative w-36 flex-shrink-0">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₦</span>
      <input
        type="number"
        min="0"
        value={item.amount}
        onChange={e => onChange(index, 'amount', parseFloat(e.target.value) || 0)}
        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-300"
      />
    </div>
    <button onClick={() => onRemove(index)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const FeeTermPanel = ({ termLabel, items, onItemChange, onAddItem, onRemoveItem }) => {
  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">{termLabel}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Total:</span>
          <span className="text-sm font-bold text-brand-700">₦{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {items.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">No items yet — click "Add Item" to begin</p>
        )}
        {items.map((item, idx) => (
          <FeeLineRow key={idx} item={item} index={idx} onChange={onItemChange} onRemove={onRemoveItem} />
        ))}
        <button onClick={onAddItem} className="flex items-center gap-1.5 mt-2 text-xs text-brand-600 hover:text-brand-800 font-medium">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>
      </div>
    </div>
  );
};

export default function FeeStructureTab() {
  const { data: feeData, isLoading: feeLoading } = useGetFeeStructureQuery();
  const [updateFeeStructure, { isLoading: updating }] = useUpdateFeeStructureMutation();

  const [feeState, setFeeState] = useState({});
  const [activeCategory, setActiveCategory] = useState('juniorDay');
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (feeData?.data?.feeStructure) {
      setFeeState(JSON.parse(JSON.stringify(feeData.data.feeStructure)));
      setDirty(false);
    }
  }, [feeData]);

  const updateItem = useCallback((category, termKey, idx, field, value) => {
    setFeeState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[category]) next[category] = {};
      if (!next[category][termKey]) next[category][termKey] = { items: [] };
      next[category][termKey].items[idx][field] = field === 'amount' ? (parseFloat(value) || 0) : value;
      return next;
    });
    setDirty(true);
  }, []);

  const addItem = useCallback((category, termKey) => {
    setFeeState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[category]) next[category] = {};
      if (!next[category][termKey]) next[category][termKey] = { items: [] };
      next[category][termKey].items.push({ description: '', amount: 0 });
      return next;
    });
    setDirty(true);
  }, []);

  const removeItem = useCallback((category, termKey, idx) => {
    setFeeState(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[category][termKey].items.splice(idx, 1);
      return next;
    });
    setDirty(true);
  }, []);

  const handleSaveCategory = async () => {
    const cat = feeState[activeCategory];
    if (!cat) return;
    try {
      await updateFeeStructure({
        category: activeCategory,
        label: cat.label || CATEGORY_META[activeCategory]?.label || activeCategory,
        firstTerm: cat.firstTerm || { items: [] },
        secondTerm: cat.secondTerm || { items: [] },
        thirdTerm: cat.thirdTerm || { items: [] },
      }).unwrap();
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
      toast.success(`Fee structure for "${CATEGORY_META[activeCategory]?.label}" saved`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save fee structure');
    }
  };

  const handleSaveAll = async () => {
    try {
      await updateFeeStructure({ feeStructure: feeState }).unwrap();
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
      toast.success('All fee structures saved');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save fee structure');
    }
  };

  const grandSummary = Object.entries(feeState).map(([catKey, cat]) => {
    const totals = TERM_KEYS.map(tk => (cat[tk]?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0));
    return { catKey, totals };
  });

  if (feeLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading fee structure…
      </div>
    );
  }

  const activeCat = feeState[activeCategory] || {};

  return (
    <Section icon={DollarSign} title="Fee Structure Management">
      <div className="space-y-5">
        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Fee Structure Configuration</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Changes here affect how invoices are generated and how parent payment balances are computed.
              Each student's fee is determined by their class level and boarding status.
            </p>
          </div>
        </div>

        {/* Fee Summary Table */}
        {Object.keys(feeState).length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <p className="text-sm font-semibold text-gray-700">Fee Summary (All Categories)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Category</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">1st Term</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">2nd Term</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">3rd Term</th>
                    <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Annual Total</th>
                  </tr>
                </thead>
                <tbody>
                  {grandSummary.map(({ catKey, totals }) => {
                    const meta = CATEGORY_META[catKey];
                    const annual = totals.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={catKey}
                        onClick={() => setActiveCategory(catKey)}
                        className={`border-b border-gray-50 cursor-pointer transition-colors ${activeCategory === catKey ? 'bg-brand-50' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{meta?.icon}</span>
                            <span className={`font-medium ${activeCategory === catKey ? 'text-brand-700' : 'text-gray-700'}`}>
                              {meta?.label || catKey}
                            </span>
                          </div>
                         </td>
                        {totals.map((t, i) => (
                          <td key={i} className="text-right px-4 py-2.5 text-gray-600 font-mono">
                            ₦{t.toLocaleString()}
                          </td>
                        ))}
                        <td className="text-right px-4 py-2.5 font-bold text-gray-800 font-mono">
                          ₦{annual.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                ${activeCategory === key
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : `border ${meta.color} hover:opacity-80`
                }`}
            >
              <span className="text-base">{meta.icon}</span>
              {meta.label}
            </button>
          ))}
        </div>

        {/* Active Category Editor */}
        {activeCategory && (
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className={`px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-opacity-30`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{CATEGORY_META[activeCategory]?.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{CATEGORY_META[activeCategory]?.label}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{CATEGORY_META[activeCategory]?.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {dirty && (
                  <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-medium">
                    Unsaved changes
                  </span>
                )}
                <SaveBtn label="Save Category" saved={saved} isLoading={updating} onClick={handleSaveCategory} />
              </div>
            </div>

            <div className="p-5 space-y-4">
              {TERM_KEYS.map(termKey => {
                const items = activeCat[termKey]?.items || [];
                return (
                  <FeeTermPanel
                    key={termKey}
                    termLabel={TERM_LABELS[termKey]}
                    items={items}
                    onItemChange={(idx, field, val) => updateItem(activeCategory, termKey, idx, field, val)}
                    onAddItem={() => addItem(activeCategory, termKey)}
                    onRemoveItem={(idx) => removeItem(activeCategory, termKey, idx)}
                  />
                );
              })}

              <div className="grid grid-cols-3 gap-3 pt-2">
                {TERM_KEYS.map(termKey => {
                  const total = (activeCat[termKey]?.items || []).reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
                  return (
                    <div key={termKey} className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-brand-500 font-medium">{TERM_LABELS[termKey]} Total</p>
                      <p className="text-lg font-black text-brand-800 mt-1">₦{total.toLocaleString()}</p>
                      <p className="text-xs text-brand-400 mt-0.5">{(activeCat[termKey]?.items || []).length} items</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Save All updates all 6 categories at once. Save Category updates only the selected category.
          </p>
          <button
            onClick={handleSaveAll}
            disabled={updating || !dirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-xl hover:bg-gray-900 disabled:opacity-40 transition-all"
          >
            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Categories
          </button>
        </div>
      </div>
    </Section>
  );
}