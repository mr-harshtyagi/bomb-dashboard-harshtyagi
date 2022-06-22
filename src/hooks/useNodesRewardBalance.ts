import { useEffect, useState } from 'react';
import useBombFinance from './useBombFinance';
import { NodesRewardWalletBalance } from '../bomb-finance/types';
import useRefresh from './useRefresh';

const useNodesRewardBalanceStats = (walletAddress: string) => {
  const [stat, setStat] = useState<NodesRewardWalletBalance>();
  const { fastRefresh } = useRefresh();
  const grapeFinance = useBombFinance();

  useEffect(() => {
    async function fetchNodesRewardWalletBalance() {
      try {
        setStat(await grapeFinance.getNodesRewardWalletBalance(walletAddress));
      } catch (err) {
        console.error(err);
      }
    }
    fetchNodesRewardWalletBalance();
  }, [setStat, grapeFinance, fastRefresh]);

  return stat;
};

export default useNodesRewardBalanceStats;
