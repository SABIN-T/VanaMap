import { useState, useEffect } from 'react';
import { Mail, Inbox, Send, Archive, Search, Filter, Clock, CheckCircle2, AlertCircle, Trash2, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import styles from './SupportEmails.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://plantoxy.onrender.com/api';

interface SupportEmail {
    _id: string;
    from: string;
    subject: string;
    text: string;
    html: string;
    receivedAt: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    reply?: {
        message: string;
        sentAt: string;
        sentBy: string;
    };
}

interface Stats {
    total: number;
    unread: number;
    replied: number;
    archived: number;
    avgResponseTimeHours: string;
}

export const SupportEmails = () => {
    const [emails, setEmails] = useState<SupportEmail[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<SupportEmail | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadEmails();
        loadStats();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            loadEmails(true);
            loadStats();
        }, 30000);

        return () => clearInterval(interval);
    }, [filter, searchQuery]);

    const loadEmails = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);
            if (searchQuery) params.append('search', searchQuery);

            const response = await fetch(`${API_URL}/admin/support-emails?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            setEmails(data.emails || []);
        } catch (error) {
            console.error('Failed to load emails:', error);
            if (!silent) toast.error('Failed to load emails');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/support-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleEmailClick = async (email: SupportEmail) => {
        setSelectedEmail(email);

        // Mark as read if unread
        if (email.status === 'unread') {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${API_URL}/admin/support-emails/${email._id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'read' })
                });
                loadEmails(true);
                loadStats();
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }
    };

    const handleReply = async () => {
        if (!selectedEmail || !replyMessage.trim()) {
            toast.error('Please enter a reply message');
            return;
        }

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/admin/support-emails/${selectedEmail._id}/reply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: replyMessage })
            });

            if (response.ok) {
                toast.success('Reply sent successfully!');
                setReplyMessage('');
                setSelectedEmail(null);
                loadEmails(true);
                loadStats();
            } else {
                toast.error('Failed to send reply');
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
            toast.error('Failed to send reply');
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (emailId: string, status: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/admin/support-emails/${emailId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            toast.success(`Marked as ${status}`);
            loadEmails(true);
            loadStats();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (emailId: string) => {
        if (!confirm('Are you sure you want to delete this email?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/admin/support-emails/${emailId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success('Email deleted');
            setSelectedEmail(null);
            loadEmails(true);
            loadStats();
        } catch (error) {
            toast.error('Failed to delete email');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'unread': return <Mail size={16} className={styles.statusIconUnread} />;
            case 'read': return <Inbox size={16} className={styles.statusIconRead} />;
            case 'replied': return <Send size={16} className={styles.statusIconReplied} />;
            case 'archived': return <Archive size={16} className={styles.statusIconArchived} />;
            default: return <Mail size={16} />;
        }
    };

    if (loading && emails.length === 0) {
        return <div className={styles.loader}>Loading support emails...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Statistics */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Mail size={24} className={styles.statIcon} style={{ color: '#3b82f6' }} />
                    <div>
                        <div className={styles.statValue}>{stats?.total || 0}</div>
                        <div className={styles.statLabel}>Total Emails</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <AlertCircle size={24} className={styles.statIcon} style={{ color: '#f59e0b' }} />
                    <div>
                        <div className={styles.statValue}>{stats?.unread || 0}</div>
                        <div className={styles.statLabel}>Unread</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <CheckCircle2 size={24} className={styles.statIcon} style={{ color: '#10b981' }} />
                    <div>
                        <div className={styles.statValue}>{stats?.replied || 0}</div>
                        <div className={styles.statLabel}>Replied</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Clock size={24} className={styles.statIcon} style={{ color: '#a855f7' }} />
                    <div>
                        <div className={styles.statValue}>{stats?.avgResponseTimeHours || '0'}h</div>
                        <div className={styles.statLabel}>Avg Response</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className={styles.toolbar}>
                <div className={styles.filterGroup}>
                    {['all', 'unread', 'read', 'replied', 'archived'].map((f) => (
                        <button
                            key={f}
                            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => loadEmails()} size="sm">
                    <RefreshCw size={16} /> Refresh
                </Button>
            </div>

            {/* Email List and Detail View */}
            <div className={styles.emailLayout}>
                {/* Email List */}
                <div className={styles.emailList}>
                    {emails.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Inbox size={48} />
                            <p>No emails found</p>
                        </div>
                    ) : (
                        emails.map((email) => (
                            <div
                                key={email._id}
                                className={`${styles.emailItem} ${selectedEmail?._id === email._id ? styles.emailItemActive : ''} ${email.status === 'unread' ? styles.emailItemUnread : ''}`}
                                onClick={() => handleEmailClick(email)}
                            >
                                <div className={styles.emailItemHeader}>
                                    {getStatusIcon(email.status)}
                                    <span className={styles.emailFrom}>{email.from}</span>
                                    <span className={styles.emailTime}>
                                        {new Date(email.receivedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles.emailSubject}>{email.subject || '(No Subject)'}</div>
                                <div className={styles.emailPreview}>
                                    {email.text?.substring(0, 100) || 'No content'}...
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Email Detail */}
                {selectedEmail && (
                    <div className={styles.emailDetail}>
                        <div className={styles.emailDetailHeader}>
                            <div>
                                <h3>{selectedEmail.subject || '(No Subject)'}</h3>
                                <p className={styles.emailMeta}>
                                    From: <strong>{selectedEmail.from}</strong> •
                                    {new Date(selectedEmail.receivedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className={styles.emailActions}>
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(selectedEmail._id, 'archived')}>
                                    <Archive size={16} /> Archive
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(selectedEmail._id)}>
                                    <Trash2 size={16} /> Delete
                                </Button>
                            </div>
                        </div>

                        <div className={styles.emailContent}>
                            {selectedEmail.html ? (
                                <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                            ) : (
                                <pre>{selectedEmail.text}</pre>
                            )}
                        </div>

                        {selectedEmail.reply && (
                            <div className={styles.replySection}>
                                <h4>Your Reply</h4>
                                <div className={styles.replyContent}>
                                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.reply.message }} />
                                    <p className={styles.replyMeta}>
                                        Sent by {selectedEmail.reply.sentBy} on {new Date(selectedEmail.reply.sentAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {!selectedEmail.reply && (
                            <div className={styles.replyForm}>
                                <h4>Reply to {selectedEmail.from}</h4>
                                <textarea
                                    placeholder="Type your reply here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows={6}
                                />
                                <Button onClick={handleReply} disabled={sending || !replyMessage.trim()}>
                                    <Send size={16} /> {sending ? 'Sending...' : 'Send Reply'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
