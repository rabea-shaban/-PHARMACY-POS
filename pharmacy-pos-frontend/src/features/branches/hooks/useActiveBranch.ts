import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { branchesApi } from '../api/branchesApi.js';
import { setBranches, setActiveBranch } from '../../../store/slices/settingsSlice.js';
import { Branch } from '../types/branch.types.js';
import { showToast } from '../../../lib/alerts.js';

export const useActiveBranch = () => {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);
  const { activeBranch, activeBranchId, branches } = useAppSelector((state) => state.settings);

  // Fetch all active branches with caching
  const { data: branchesResponse, isLoading } = useQuery({
    queryKey: ['branches', 'active_list'],
    queryFn: () => branchesApi.getBranches({ isActive: true, limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const branchList: Branch[] = branchesResponse?.items || branches;

  // Keep Redux in sync when query completes
  useEffect(() => {
    if (branchList && branchList.length > 0) {
      dispatch(setBranches(branchList));

      // Resolve active branch:
      // 1. User's assigned branch from login/profile
      // 2. Saved active branch in localStorage (if manager switched)
      // 3. First branch in branchList
      if (!activeBranch) {
        const matchedUser = user?.branchId
          ? branchList.find((b: Branch) => b.id === user.branchId)
          : user?.branch
          ? branchList.find((b: Branch) => b.id === user.branch?.id)
          : null;
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('virexa_active_branch_id') : null;
        const matchedSaved = savedId ? branchList.find((b: Branch) => b.id === savedId) : null;
        const resolved = matchedUser || matchedSaved || branchList[0];

        if (resolved) {
          dispatch(setActiveBranch(resolved));
        }
      }
    }
  }, [branchList, activeBranch, user?.branchId, user?.branch, dispatch]);

  const canSwitchBranch = role === 'PLATFORM_MANAGER' || role === 'PHARMACY_MANAGER' || !user?.branchId;

  const switchBranch = (branch: Branch, notify = true) => {
    dispatch(setActiveBranch(branch));
    if (notify) {
      showToast(`تم تبديل الفرع النشط إلى: ${branch.name} (${branch.code})`, 'success');
    }
  };

  return {
    activeBranch,
    activeBranchId: activeBranch?.id || activeBranchId,
    branches: branchList,
    isLoading,
    canSwitchBranch,
    switchBranch,
    isMainBranch: Boolean(activeBranch?.isMain),
  };
};

