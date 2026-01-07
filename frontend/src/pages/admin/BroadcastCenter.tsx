import React, { useState } from 'react';
import styles from './BroadcastCenter.module.css';

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

    // Search users by email, phone, or name
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

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
        }
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
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className={styles.searchInput}
                            />
                            <button onClick={handleSearch} className={styles.searchBtn}>
                                🔍 Search
                            </button>

                            {searchResults.length > 0 && (
                                <div className={styles.searchResults}>
                                    {searchResults.map(user => (
                                        <div
                                            key={user.id}
                                            className={`${styles.userCard} ${selectedUser?.id === user.id ? styles.selected : ''}`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <div className={styles.userInfo}>
                                                <strong>{user.name}</strong>
                                                <span>{user.email}</span>
                                                <span>{user.phone}</span>
                                            </div>
                                            <span className={styles.userRole}>{user.role}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedUser && (
                                <div className={styles.selectedUser}>
                                    <span>✅ Selected: <strong>{selectedUser.name}</strong> ({selectedUser.email})</span>
                                    <button onClick={() => setSelectedUser(null)}>✕</button>
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
