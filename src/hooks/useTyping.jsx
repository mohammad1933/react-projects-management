// src/hooks/useTyping.js
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @param {object} channel  - The Echo private channel instance
 * @param {object} currentUser - { id, name }
 * @returns {{ typingUsers, handleTyping }}
 */
export function useTyping(channel, currentUser) {
    const [typingUsers, setTypingUsers] = useState({}); // { userId: { name, timer } }
    const typingTimers = useRef({});
    const isTypingRef  = useRef(false);

    // Listen for other members' whispers
    useEffect(() => {
        if (!channel) return;

        channel.listenForWhisper('typing', ({ user, isTyping }) => {
            if (user.id === currentUser.id) return; // ignore own whisper

            setTypingUsers(prev => {
                const next = { ...prev };

                if (isTyping) {
                    // Clear any existing auto-stop timer for this user
                    if (typingTimers.current[user.id]) {
                        clearTimeout(typingTimers.current[user.id]);
                    }
                    // Auto-remove after 3s in case we miss the "stopped" whisper
                    typingTimers.current[user.id] = setTimeout(() => {
                        setTypingUsers(u => {
                            const n = { ...u };
                            delete n[user.id];
                            return n;
                        });
                    }, 3000);

                    next[user.id] = { name: user.name };
                } else {
                    clearTimeout(typingTimers.current[user.id]);
                    delete next[user.id];
                }

                return next;
            });
        });

        return () => {
            // Clean up all timers on unmount
            Object.values(typingTimers.current).forEach(clearTimeout);
        };
    }, [channel, currentUser.id]);

    // Call this from your input's onChange
    const handleTyping = useCallback((value) => {
        if (!channel) return;

        const typing = value.length > 0;

        // Only whisper on state CHANGE to avoid spamming
        if (typing !== isTypingRef.current) {
            isTypingRef.current = typing;
            channel.whisper('typing', {
                user: { id: currentUser.id, name: currentUser.name },
                isTyping: typing,
            });
        }
    }, [channel, currentUser]);

    return { typingUsers, handleTyping };
}