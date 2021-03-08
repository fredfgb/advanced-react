export default function formatMoney(ammount = 0) {
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  if (ammount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }
  const formatter = Intl.NumberFormat('en-US', options);
  return formatter.format(ammount / 100);
}
