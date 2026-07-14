import { useEffect, useRef, useState } from 'react';
import echo from '../lib/echo';
import { useTyping } from '../hooks/useTyping';
import TypingIndicator from './TypingIndicator';
import FilePreview from './FilePreview';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import axios from 'axios';

export default function ProjectChat({ currentUser }) {
    const [messages, setMessages]             = useState([]);
    const [input, setInput]                   = useState('');
    const [loading, setLoading]               = useState(true);
    const [uploading, setUploading]           = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragOver, setDragOver]             = useState(false);
    const channelRef    = useRef(null);
    const fileInputRef  = useRef(null);
    const bottomRef     = useRef(null);
    const { id }        = useParams();

    // ── Load history ───────────────────────────────────────────────────────
    useEffect(() => {
        apiClient
            .get(`/projects/${id}/messages`)
            .then(res => {
                // Defensive: filter out any messages missing a user object
                const safe = (res.data.data ?? []).filter(m => m?.user?.id);
                setMessages(safe);
            })
            .finally(() => setLoading(false));
    }, [id]);

    // ── Subscribe to channel ───────────────────────────────────────────────
    useEffect(() => {
        const channel = echo.private(`project.${id}`);
        channelRef.current = channel;

        channel.listen('.message.sent', (payload) => {
            // Guard: only append if the payload has a valid user
            if (!payload?.user?.id) {
                console.warn('Received broadcast with missing user:', payload);
                return;
            }
            setMessages(prev => [...prev, payload]);
        });

        return () => {
            channel.stopListening('.message.sent');
            echo.leave(`project.${id}`);
            channelRef.current = null;
        };
    }, [id]);

    // ── Typing indicator hook ──────────────────────────────────────────────
    const { typingUsers, handleTyping } = useTyping(channelRef.current, currentUser);

    // ── Auto-scroll ────────────────────────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUsers]);

    // ── Send text message ──────────────────────────────────────────────────
    const sendMessage = async (e) => {
        e?.preventDefault();
        const body = input.trim();
        if (!body) return;
        // Guard: don't send if currentUser isn't ready
        if (!currentUser?.id) return;

        setInput('');
        handleTyping('');

        const optimistic = {
            id: `opt-${Date.now()}`,
            type: 'text',
            body,
            project_id: id,
            created_at: new Date().toISOString(),
            user: currentUser,
            optimistic: true,
        };
        setMessages(prev => [...prev, optimistic]);

        try {
            const { data } = await apiClient.post(`/projects/${id}/messages`, { body });

            // The server response may be nested under data.data or flat — handle both
            const confirmed = data?.data ?? data;

            // Make sure the confirmed message has a user; fall back to currentUser
            if (!confirmed.user) confirmed.user = currentUser;

            setMessages(prev =>
                prev.map(m => m.id === optimistic.id ? confirmed : m)
            );
        } catch (err) {
            console.error('Send failed:', err);
            setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        }
    };

    // ── Upload file ────────────────────────────────────────────────────────
  const uploadFile = async (file) => {
    if (!file || !currentUser?.id) return;

    setUploading(true);
    setUploadProgress(0);

    const objectUrl = URL.createObjectURL(file);
    const optimistic = {
        id: `opt-file-${Date.now()}`,
        type: 'file',
        body: input.trim() || null,
        file_name: file.name,
        file_mime: file.type,
        file_size: file.size,
        file_url: objectUrl,
        project_id: id,
        created_at: new Date().toISOString(),
        user: currentUser,
        optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);
    setInput('');

    const formData = new FormData();
    formData.append('file', file);
    if (input.trim()) formData.append('body', input.trim());

    try {
        const { data } = await apiClient.post(
            `/projects/${id}/messages`,
            formData,
            {
                // ✅ No Content-Type header — axios sets multipart/form-data + boundary automatically
                onUploadProgress: (evt) => {
                    setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
                },
            }
        );

        URL.revokeObjectURL(objectUrl);

        const confirmed = data?.data ?? data;
        if (!confirmed.user) confirmed.user = currentUser;

        setMessages(prev =>
            prev.map(m => m.id === optimistic.id ? confirmed : m)
        );
    } catch (err) {
        // Log the full Laravel validation error so you can see exactly what failed
        console.error('Upload failed — status:', err.response?.status);
        console.error('Upload failed — errors:', err.response?.data);

        URL.revokeObjectURL(objectUrl);
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));

        // Show the user what went wrong
        const message = err.response?.data?.message ?? 'Upload failed. Please try again.';
        alert(message); // replace with your own toast/notification
    } finally {
        setUploading(false);
        setUploadProgress(0);
    }
};

    // ── Drag and drop ──────────────────────────────────────────────────────
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    };

    // ── Keyboard ───────────────────────────────────────────────────────────
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ── Guard: wait for currentUser before rendering ───────────────────────
    if (!currentUser?.id) {
        return <p style={{ padding: '12px' }}>Loading user…</p>;
    }

    if (loading) {
        return <p style={{ padding: '12px' }}>Loading messages…</p>;
    }

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            {/* Drag overlay */}
            {dragOver && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 10,
                    background: 'rgba(79,70,229,0.08)',
                    border: '2px dashed #4f46e5',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                }}>
                    <span style={{ fontSize: '16px', color: '#4f46e5', fontWeight: 500 }}>
                        Drop file to send
                    </span>
                </div>
            )}

            {/* Message list */}
            <div className='max-h-52' style={{
                flex: 1, overflowY: 'auto', padding: '12px',
                display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
                {messages.map(msg => {
                    // Extra safety net — skip rendering any message with no user
                    if (!msg?.user?.id) return null;

                    const isOwn = msg.user.id === currentUser.id;

                    return (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: isOwn ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                opacity: msg.optimistic ? 0.6 : 1,
                                transition: 'opacity 0.2s',
                            }}
                        >
                            {!isOwn && (
                                <p style={{ fontSize: '11px', marginBottom: '2px', color: '#888' }}>
                                    {msg.user.name}
                                </p>
                            )}
                            <div style={{
                                background: isOwn ? '#4f46e5' : '#f1f5f9',
                                color: isOwn ? '#fff' : '#0f172a',
                                padding: msg.type === 'file' ? '8px' : '8px 12px',
                                borderRadius: '12px',
                                fontSize: '14px',
                            }}>
                                {msg.type === 'file'
                                    ? <FilePreview message={msg} />
                                    : msg.body
                                }
                            </div>
                            <p style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
                                {new Date(msg.created_at).toLocaleTimeString()}
                                {msg.optimistic && msg.type === 'file' && (
                                    <span> · {uploadProgress}%</span>
                                )}
                            </p>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <TypingIndicator typingUsers={typingUsers} />

            {/* Input bar */}
            <form
                onSubmit={sendMessage}
                style={{
                    display: 'flex', alignItems: 'flex-end', gap: '8px',
                    padding: '8px 12px', borderTop: '1px solid #e2e8f0',
                }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => uploadFile(e.target.files[0])}
                />

                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '8px', background: 'none', border: '1px solid #e2e8f0',
                        borderRadius: '8px', cursor: 'pointer', color: '#64748b',
                        display: 'flex', alignItems: 'center',
                    }}
                    title="Attach file"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                    </svg>
                </button>

                <textarea
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        handleTyping(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={uploading ? `Uploading… ${uploadProgress}%` : 'Type a message… (Enter to send)'}
                    disabled={uploading}
                    rows={1}
                    style={{
                        flex: 1, padding: '8px 12px', borderRadius: '8px',
                        border: '1px solid #e2e8f0', fontSize: '14px',
                        resize: 'none', lineHeight: '1.5',
                        maxHeight: '120px', overflowY: 'auto',
                    }}
                />

                <button
                    type="submit"
                    disabled={uploading || !input.trim()}
                    style={{
                        padding: '8px 16px', background: '#4f46e5', color: '#fff',
                        borderRadius: '8px', border: 'none', cursor: 'pointer',
                        opacity: (!input.trim() || uploading) ? 0.5 : 1,
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}