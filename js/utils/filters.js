import accounting from 'accounting';
import BigNumber from 'bignumber.js';

export function moneyFilter(amount) {
  if (!amount)
    return '$0.00';

  amount = new BigNumber(String(amount)).abs().toFixed(2);
  return accounting.formatMoney(amount);
}