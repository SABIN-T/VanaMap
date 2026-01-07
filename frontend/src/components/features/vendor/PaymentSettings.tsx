import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Building2, Shield, TrendingUp, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../common/Button';
import toast from 'react-hot-toast';
import styles from './PaymentSettings.module.css';

interface PaymentSettingsProps {
    vendorId: string;
}

export const PaymentSettings = ({ vendorId }: PaymentSettingsProps) => {
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [earnings, setEarnings] = useState<any>(null);
    const [formData, setFormData] = useState({
        accountHolderName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        accountType: 'savings',
        bankName: '',
        upiId: '',
        panCard: '',
        gstNumber: ''
    });

    useEffect(() => {
        loadPaymentData();
    }, [vendorId]);

    const loadPaymentData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/vendors/${vendorId}/payment-details`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setPaymentData(data.paymentDetails || {});
            setEarnings(data.earnings || {});

            if (data.paymentDetails) {
                setFormData({
                    accountHolderName: data.paymentDetails.accountHolderName || '',
                    accountNumber: '',
                    confirmAccountNumber: '',
                    ifscCode: data.paymentDetails.ifscCode || '',
                    accountType: data.paymentDetails.accountType || 'savings',
                    bankName: data.paymentDetails.bankName || '',
                    upiId: data.paymentDetails.upiId || '',
                    panCard: data.paymentDetails.panCard || '',
                    gstNumber: data.paymentDetails.gstNumber || ''
                });
            }
        } catch (e) {
            console.error('Failed to load payment data', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.accountNumber !== formData.confirmAccountNumber) {
            toast.error('Account numbers do not match!');
            return;
        }

        if (formData.panCard && formData.panCard.length !== 10) {
            toast.error('PAN Card must be 10 characters');
            return;
        }

        const tid = toast.loading('Saving payment details...');
        try {
            const response = await fetch(`/api/vendors/${vendorId}/payment-details`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save');

            toast.success('Payment details saved successfully!', { id: tid });
            loadPaymentData();
        } catch (e) {
            toast.error('Failed to save payment details', { id: tid });
        }
    };

    const requestPayout = async () => {
        if (!earnings?.pendingPayout || earnings.pendingPayout < 500) {
            toast.error('Minimum payout amount is ₹500');
            return;
        }

        const tid = toast.loading('Processing payout request...');
        try {
            const response = await fetch(`/api/vendors/${vendorId}/request-payout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Payout failed');

            toast.success('Payout request submitted! Funds will be transferred within 2-3 business days.', { id: tid, duration: 5000 });
            loadPaymentData();
        } catch (e) {
            toast.error('Failed to process payout', { id: tid });
        }
    };

    if (loading) {
        return <div className={styles.loader}>Loading payment settings...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Earnings Overview */}
            <div className={styles.earningsSection}>
                <h2 className={styles.sectionTitle}>
                    <TrendingUp size={24} />
                    Your Earnings
                </h2>
                <div className={styles.earningsGrid}>
                    <div className={styles.earningCard}>
                        <div className={styles.earningIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <DollarSign size={24} />
                        </div>
                        <div className={styles.earningInfo}>
                            <span className={styles.earningLabel}>Pending Payout</span>
                            <span className={styles.earningValue}>₹{earnings?.pendingPayout?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                    <div className={styles.earningCard}>
                        <div className={styles.earningIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className={styles.earningInfo}>
                            <span className={styles.earningLabel}>Total Sales</span>
                            <span className={styles.earningValue}>₹{earnings?.totalSales?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                    <div className={styles.earningCard}>
                        <div className={styles.earningIcon} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                            <Download size={24} />
                        </div>
                        <div className={styles.earningInfo}>
                            <span className={styles.earningLabel}>Total Paid Out</span>
                            <span className={styles.earningValue}>₹{earnings?.totalPaidOut?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>

                {paymentData?.isVerified ? (
                    <Button
                        onClick={requestPayout}
                        disabled={!earnings?.pendingPayout || earnings.pendingPayout < 500}
                        style={{ marginTop: '1rem', width: '100%' }}
                    >
                        <Download size={16} /> Request Payout (Min ₹500)
                    </Button>
                ) : (
                    <div className={styles.warningBox}>
                        <AlertCircle size={20} />
                        <p>Complete your bank details below to enable payouts</p>
                    </div>
                )}
            </div>

            {/* Bank Details Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.sectionTitle}>
                    <Building2 size={24} />
                    Bank Account Details
                </h2>

                {paymentData?.isVerified && (
                    <div className={styles.successBox}>
                        <CheckCircle2 size={20} />
                        <p>Your bank details are verified and active</p>
                    </div>
                )}

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label>Account Holder Name *</label>
                        <input
                            type="text"
                            value={formData.accountHolderName}
                            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                            required
                            placeholder="As per bank records"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Account Number *</label>
                        <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            required
                            placeholder="Enter account number"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Confirm Account Number *</label>
                        <input
                            type="text"
                            value={formData.confirmAccountNumber}
                            onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
                            required
                            placeholder="Re-enter to confirm"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>IFSC Code *</label>
                        <input
                            type="text"
                            value={formData.ifscCode}
                            onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                            required
                            placeholder="e.g., SBIN0001234"
                            maxLength={11}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Account Type *</label>
                        <select
                            value={formData.accountType}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                            required
                        >
                            <option value="savings">Savings</option>
                            <option value="current">Current</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Bank Name *</label>
                        <input
                            type="text"
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            required
                            placeholder="e.g., State Bank of India"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>UPI ID (Optional)</label>
                        <input
                            type="text"
                            value={formData.upiId}
                            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                            placeholder="yourname@upi"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>PAN Card * (Required for tax compliance)</label>
                        <input
                            type="text"
                            value={formData.panCard}
                            onChange={(e) => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
                            required
                            placeholder="ABCDE1234F"
                            maxLength={10}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>GST Number (Optional)</label>
                        <input
                            type="text"
                            value={formData.gstNumber}
                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                            placeholder="22AAAAA0000A1Z5"
                        />
                    </div>
                </div>

                <div className={styles.infoBox}>
                    <Shield size={20} />
                    <div>
                        <strong>Your data is secure</strong>
                        <p>All bank details are encrypted and stored securely. VanaMap uses industry-standard security practices.</p>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <Button type="submit" style={{ width: '100%' }}>
                        <CreditCard size={16} /> Save Payment Details
                    </Button>
                </div>
            </form>

            {/* Commission Info */}
            <div className={styles.commissionInfo}>
                <h3>💰 How Payments Work</h3>
                <ul>
                    <li><strong>Commission:</strong> VanaMap charges 10% on each sale</li>
                    <li><strong>Payout Frequency:</strong> Weekly automatic payouts (if enabled)</li>
                    <li><strong>Minimum Payout:</strong> ₹500</li>
                    <li><strong>Processing Time:</strong> 2-3 business days</li>
                    <li><strong>Tax Compliance:</strong> TDS applicable if earnings exceed ₹50,000/year</li>
                </ul>
            </div>
        </div>
    );
};
