import React, { useState, useEffect } from 'react';
import styles from './BroadcastCenter.module.css';
import { Loader2, Search } from 'lucide-react'; // Added icons for better UX

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}

export const BroadcastCenter: React.FC = () => {
    const [recipientType, setRecipientType] = useState<'all' | 'single'>('all');
    const [messageType, setMessageType] = useState<'text' | 'image' | 'both'>('text');
    const [subject, setSubject] = useState('');
    const [messageText, setMessageText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [sending, setSending] = useState(false);
    const [searching, setSearching] = useState(false);

    // Live Search Effect (Debounced)
    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery.trim() || searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }

            // If we already selected someone, don't search behind the scenes
            if (selectedUser) return;

            setSearching(true);
            try {
                const response = await fetch(`/api/admin/search-users?q=${encodeURIComponent(searchQuery)}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();
                setSearchResults(data.users || []);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchUsers, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedUser]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Send broadcast
    const handleSend = async () => {
        if (!subject.trim() || (!messageText.trim() && !imageFile)) {
            alert('Please fill in all required fields');
            return;
        }

        setSending(true);

        try {
            const formData = new FormData();
            formData.append('recipientType', recipientType);
            formData.append('messageType', messageType);
            formData.append('subject', subject);
            formData.append('messageText', messageText);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (recipientType === 'single' && selectedUser) {
                formData.append('recipientId', selectedUser.id);
            }

            const response = await fetch('/api/admin/broadcast', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ Message sent successfully to ${data.recipientCount} recipient(s)!`);
                // Reset form
                setSubject('');
                setMessageText('');
                setImageFile(null);
                setImagePreview('');
                setSelectedUser(null);
            } else {
                alert('❌ Failed to send message: ' + data.error);
            }
        } catch (error) {
            alert('❌ Error sending message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>📢 Broadcast Center</h1>
                <p>Send messages to your users via email</p>
            </div>

            <div className={styles.content}>
                {/* Recipient Selection */}
                <div className={styles.section}>
                    <h2>👥 Recipients</h2>
                    <div className={styles.recipientToggle}>
                        <button
                            className={`${styles.toggleBtn} ${recipientType === 'all' ? styles.active : ''}`}
                            onClick={() => setRecipientType('all')}
                        >
                            📣 All Users
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${recipientType === 'single' ? styles.active : ''}`}
                            onClick={() => setRecipientType('single')}
                        >
                            👤 Single User
                        </button>
                    </div>

                    {recipientType === 'single' && (
                        <div className={styles.searchBox}>
                            {!selectedUser ? (
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input
                                            type="text"
                                            placeholder="Type name, email, or phone..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={styles.searchInput}
                                            style={{ paddingLeft: '48px' }}
                                        />
                                        {searching && (
                                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                                                <Loader2 size={18} className="animate-spin text-emerald-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Auto-Suggestions Dropdown */}
                                    {searchResults.length > 0 && searchQuery.length >= 2 && (
                                        <div className={styles.searchResults}>
                                            <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9ca3af', borderBottom: '1px solid #eee' }}>
                                                Found {searchResults.length} matches
                                            </div>
                                            {searchResults.map(user => (
                                                <div
                                                    key={user.id}
                                                    className={styles.userCard}
                                                    onClick={() => handleSelectUser(user)}
                                                >
                                                    <div className={styles.userInfo}>
                                                        <strong>{user.name}</strong>
                                                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#666' }}>
                                                            <span>📧 {user.email}</span>
                                                            {user.phone && <span>📱 {user.phone}</span>}
                                                        </div>
                                                    </div>
                                                    <span className={styles.userRole}>{user.role}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.selectedUser}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Recipient Selected</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedUser.name}</span>
                                            <span style={{ background: '#065f46', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>{selectedUser.role}</span>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>{selectedUser.email} &bull; {selectedUser.phone}</span>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>✕</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Message Type */}
                <div className={styles.section}>
                    <h2>📝 Message Type</h2>
                    <div className={styles.messageTypeToggle}>
                        <button
                            className={`${styles.typeBtn} ${messageType === 'text' ? styles.active : ''}`}
                            onClick={() => setMessageType('text')}
                        >
                            📄 Text Only
                        </button>
                        <button
                            className={`${styles.typeBtn} ${messageType === 'image' ? styles.active : ''}`}
                            onClick={() => setMessageType('image')}
                        >
                            🖼️ Image Only
                        </button>
                        <button
                            className={`${styles.typeBtn} ${messageType === 'both' ? styles.active : ''}`}
                            onClick={() => setMessageType('both')}
                        >
                            📸 Text + Image
                        </button>
                    </div>
                </div>

                {/* Subject */}
                <div className={styles.section}>
                    <h2>✉️ Subject</h2>
                    <input
                        type="text"
                        placeholder="Enter email subject..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className={styles.subjectInput}
                        maxLength={100}
                    />
                    <span className={styles.charCount}>{subject.length}/100</span>
                </div>

                {/* Message Text */}
                {(messageType === 'text' || messageType === 'both') && (
                    <div className={styles.section}>
                        <h2>💬 Message</h2>
                        <textarea
                            placeholder="Write your message here..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className={styles.messageTextarea}
                            rows={8}
                        />
                    </div>
                )}

                {/* Image Upload */}
                {(messageType === 'image' || messageType === 'both') && (
                    <div className={styles.section}>
                        <h2>🖼️ Image</h2>
                        <div className={styles.imageUpload}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                                id="imageUpload"
                            />
                            <label htmlFor="imageUpload" className={styles.uploadLabel}>
                                {imagePreview ? '✅ Change Image' : '📤 Upload Image'}
                            </label>

                            {imagePreview && (
                                <div className={styles.imagePreview}>
                                    <img src={imagePreview} alt="Preview" />
                                    <button
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview('');
                                        }}
                                        className={styles.removeImageBtn}
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Send Button */}
                <div className={styles.sendSection}>
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className={styles.sendBtn}
                    >
                        {sending ? '⏳ Sending...' : '🚀 Send Message'}
                    </button>
                    <p className={styles.sendInfo}>
                        {recipientType === 'all'
                            ? '📣 This will send to all registered users'
                            : selectedUser
                                ? `👤 This will send to ${selectedUser.name}`
                                : '⚠️ Please select a recipient'}
                    </p>
                </div>
            </div>
        </div>
    );
};
