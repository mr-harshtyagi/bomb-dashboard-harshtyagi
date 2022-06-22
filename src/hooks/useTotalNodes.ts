import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import useBombFinance from './useBombFinance';
import config from '../config';

const useTotalNodes = (contract: string, sectionInUI: number) => {
  const grapeFinance = useBombFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await grapeFinance.getTotalNodes(contract));
  }, [grapeFinance, contract]);

  useEffect(() => {
    if (sectionInUI === 9) {
      fetchNodes().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [setPoolAPRs, grapeFinance, fetchNodes, sectionInUI]);

  return poolAPRs;
};

export default useTotalNodes;