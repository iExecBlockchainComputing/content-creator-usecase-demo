import { useAppKit } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { useContentStore } from '@/stores/content.store.ts';

// import { resetCompletedTaskIdsCache } from '@/utils/localStorageContentMap.ts';

export function useLoginLogout() {
  const { open } = useAppKit();
  const { disconnectAsync } = useDisconnect();
  const { resetContent } = useContentStore();

  const logout = async () => {
    try {
      await disconnectAsync();
      resetContent();
      // resetCompletedTaskIdsCache();
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const login = () => {
    open({ view: 'Connect' });
  };

  return {
    login,
    logout,
  };
}
