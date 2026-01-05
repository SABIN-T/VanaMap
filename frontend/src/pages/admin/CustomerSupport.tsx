import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, User, Mail, Calendar, Filter, Search } from 'lucide-react';
import { fetchSupportTickets, replyToTicket, broadcastMessage } from '../../services/api';
import toast from 'react-hot-toast';
import styles from './CustomerSupport.module.css';

interface Ticket {
    _id: string;
    userId: string;
    userEmail: string;
    userName: string;
    subject: string;
    message: string;
    status: 'open' | 'in_progress' | 'resolved';
    adminReply?: string;
    repliedAt?: Date;
    createdAt: Date;
}

export const CustomerSupport = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replyText, setReplyText] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [broadcastMode, setBroadcastMode] = useState(false);
    const [broadcastData, setBroadcastData] = useState({ targetId: '', title: '', message: '' });

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const data = await fetchSupportTickets();
            setTickets(data);
        } catch {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!selectedTicket || !replyText.trim()) {
            toast.error('Please enter a reply message');
            return;
        }

        const tid = toast.loading('Sending reply...');
        try {
            await replyToTicket(selectedTicket._id, replyText);
            toast.success('Reply sent! User will be notified.', { id: tid });
            setReplyText('');
            setSelectedTicket(null);
            loadTickets();
        } catch {
            toast.error('Failed to send reply', { id: tid });
        }
    };

    const handleBroadcast = async () => {
        if (!broadcastData.targetId || !broadcastData.message) {
            toast.error('Please fill all fields');
            return;
        }

        const tid = toast.loading('Broadcasting...');
        try {
            await broadcastMessage({
                type: 'specific',
                targetId: broadcastData.targetId,
                title: broadcastData.title,
                message: broadcastData.message
            });
            toast.success('Message sent!', { id: tid });
            setBroadcastData({ targetId: '', title: '', message: '' });
            setBroadcastMode(false);
        } catch (e: any) {
            toast.error(e.message || 'Failed to broadcast', { id: tid });
        }
    };

    const filteredTickets = tickets
        .filter(t => filterStatus === 'all' || t.status === filterStatus)
        .filter(t =>
            t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Customer Support Hub</h1>
                    <p className={styles.subtitle}>Manage inquiries and broadcast updates</p>
                </div>
                <button
                    className={styles.broadcastBtn}
                    onClick={() => setBroadcastMode(!broadcastMode)}
                >
                    <Send size={18} />
                    {broadcastMode ? 'Close Broadcast' : 'Broadcast Message'}
                </button>
            </header>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                        <MessageSquare size={24} color="#3b82f6" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Tickets</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(251, 146, 60, 0.1)' }}>
                        <Clock size={24} color="#fb923c" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.open}</div>
                        <div className={styles.statLabel}>Open</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                        <CheckCircle size={24} color="#10b981" />
                    </div>
                    <div>
                        <div className={styles.statValue}>{stats.resolved}</div>
                        <div className={styles.statLabel}>Resolved</div>
                    </div>
                </div>
            </div>

            {/* Broadcast Panel */}
            {broadcastMode && (
                <div className={styles.broadcastPanel}>
                    <h3 className={styles.panelTitle}>Send Direct Message to User</h3>
                    <div className={styles.broadcastForm}>
                        <input
                            type="text"
                            placeholder="User ID (from ticket)"
                            className={styles.input}
                            value={broadcastData.targetId}
                            onChange={(e) => setBroadcastData({ ...broadcastData, targetId: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Notification Title"
                            className={styles.input}
                            value={broadcastData.title}
                            onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Message content..."
                            className={styles.textarea}
                            rows={3}
                            value={broadcastData.message}
                            onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                        />
                        <button className={styles.sendBtn} onClick={handleBroadcast}>
                            <Send size={18} /> Send Notification
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <Filter size={18} />
                    <button
                        className={filterStatus === 'all' ? styles.filterActive : ''}
                        onClick={() => setFilterStatus('all')}
                    >
                        All
                    </button>
                    <button
                        className={filterStatus === 'open' ? styles.filterActive : ''}
                        onClick={() => setFilterStatus('open')}
                    >
                        Open
                    </button>
                    <button
                        className={filterStatus === 'resolved' ? styles.filterActive : ''}
                        onClick={() => setFilterStatus('resolved')}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            {/* Tickets Grid */}
            {loading ? (
                <div className={styles.loading}>Loading tickets...</div>
            ) : (
                <div className={styles.ticketsGrid}>
                    {filteredTickets.map(ticket => (
                        <div key={ticket._id} className={styles.ticketCard}>
                            <div className={styles.ticketHeader}>
                                <div className={styles.userInfo}>
                                    <User size={16} />
                                    <span>{ticket.userName}</span>
                                </div>
                                <span className={`${styles.statusBadge} ${styles[ticket.status]}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                            <p className={styles.ticketMessage}>{ticket.message}</p>
                            <div className={styles.ticketMeta}>
                                <div className={styles.metaItem}>
                                    <Mail size={14} />
                                    {ticket.userEmail}
                                </div>
                                <div className={styles.metaItem}>
                                    <Calendar size={14} />
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            {ticket.adminReply && (
                                <div className={styles.replyPreview}>
                                    <strong>Your Reply:</strong> {ticket.adminReply.substring(0, 60)}...
                                </div>
                            )}
                            <button
                                className={styles.replyBtn}
                                onClick={() => setSelectedTicket(ticket)}
                                disabled={ticket.status === 'resolved'}
                            >
                                {ticket.status === 'resolved' ? 'Resolved' : 'Reply'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            {selectedTicket && (
                <div className={styles.modal} onClick={() => setSelectedTicket(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Reply to {selectedTicket.userName}</h2>
                        <div className={styles.originalMessage}>
                            <strong>Original Message:</strong>
                            <p>{selectedTicket.message}</p>
                        </div>
                        <textarea
                            className={styles.replyTextarea}
                            rows={6}
                            placeholder="Type your reply here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setSelectedTicket(null)}>
                                Cancel
                            </button>
                            <button className={styles.submitBtn} onClick={handleReply}>
                                <Send size={18} /> Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
