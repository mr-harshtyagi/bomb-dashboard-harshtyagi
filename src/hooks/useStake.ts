import { useCallback } from 'react';
import useBombFinance from './useBombFinance';
import { Bank } from '../bomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const useStake = (bank: Bank) => {
  const grapeFinance = useBombFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = bank.sectionInUI !== 9
        ? parseUnits(amount, bank.depositToken.decimal)
        : BigNumber.from(amount);
      if (bank.sectionInUI === 3) {
        handleTransactionReceipt(
          grapeFinance.stake(bank.contract, bank.poolId, bank.sectionInUI, amountBn),
          `Buy ${amount} ${bank.depositTokenName} Node`,
        );
      } else {
        handleTransactionReceipt(
          grapeFinance.stake(bank.contract, bank.poolId, bank.sectionInUI, amountBn),
          `Stake ${amount} ${bank.depositTokenName} to ${bank.contract}`,
        );
      }

    },
    [bank, grapeFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStake;
