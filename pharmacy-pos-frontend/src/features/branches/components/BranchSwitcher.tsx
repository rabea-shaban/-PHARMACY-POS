import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useActiveBranch } from '../hooks/useActiveBranch.js';
import { Branch } from '../types/branch.types.js';
import {
  Store,
  ChevronDown,
  Check,
  Building2,
  ExternalLink,
  MapPin,
} from 'lucide-react';

export interface BranchSwitcherProps {
  variant?: 'header' | 'pos' | 'compact' | 'pill';
  showDropdown?: boolean;
}

export const BranchSwitcher: React.FC<BranchSwitcherProps> = ({
  variant = 'header',
  showDropdown = true,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { activeBranch, branches, canSwitchBranch, switchBranch, isLoading } = useActiveBranch();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (isLoading && !activeBranch) {
    return (
      <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
    );
  }

  const displayName = activeBranch?.name || (isAr ? 'اختر الفرع' : 'Select Branch');
  const displayCode = activeBranch?.code || '';

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (canSwitchBranch && showDropdown) {
            setIsOpen((prev) => !prev);
          }
        }}
        disabled={!canSwitchBranch || !showDropdown}
        className={`flex items-center gap-2 transition-all select-none ${
          !canSwitchBranch || !showDropdown ? 'cursor-default' : 'cursor-pointer hover:shadow-xs'
        } ${
          variant === 'pos'
            ? 'px-3 py-1.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/50 text-sky-900 dark:text-sky-200'
            : variant === 'pill'
            ? 'px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1A2639] border border-slate-200 dark:border-[#22334C] text-slate-800 dark:text-slate-100 text-xs font-bold'
            : 'px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-sky-50 dark:bg-[#1A2639] dark:hover:bg-[#22334C] border border-slate-200/70 dark:border-[#22334C] text-slate-800 dark:text-slate-100 text-xs font-bold'
        }`}
        title={
          canSwitchBranch && showDropdown
            ? isAr
              ? 'انقر لتغيير الفرع النشط'
              : 'Click to switch active branch'
            : undefined
        }
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
          <Store className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center gap-1.5 max-w-[140px] sm:max-w-[200px] truncate">
          <span className="truncate font-black">{displayName}</span>
          {displayCode && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white dark:bg-[#0E1522] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
              {displayCode}
            </span>
          )}
        </div>

        {canSwitchBranch && showDropdown && (
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#131B2A] border border-slate-200 dark:border-[#1E293B] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#0E1522] border-b border-slate-200 dark:border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {isAr ? 'تبديل الفرع النشط للتشغيل' : 'Switch Active Branch'}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              {branches.length} {isAr ? 'فروع' : 'branches'}
            </span>
          </div>

          {/* Branches List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1">
            {branches.map((b: Branch) => {
              const isCurrent = activeBranch?.id === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    switchBranch(b);
                    setIsOpen(false);
                  }}
                  className={`w-full text-right p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-100'
                      : 'hover:bg-slate-100 dark:hover:bg-[#1A2639] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-sky-600 text-white font-black'
                          : 'bg-slate-100 dark:bg-[#0E1522] text-slate-500'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{b.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          ({b.code})
                        </span>
                      </div>
                      {b.address && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{b.address}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 ml-2">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Action Links */}
          <div className="p-2 bg-slate-50 dark:bg-[#0E1522] border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/branches');
              }}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{isAr ? 'إدارة الفروع' : 'Manage Branches'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
