export const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null) return 'N/A';

    // In a real app, we would detect locale here:
    // const locale = navigator.language;
    // const currency = userCountry === 'IN' ? 'INR' : 'USD';

    // For this demo, we assume INR/Rs as the primary market
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
