// src/components/TypingIndicator.jsx
export default function TypingIndicator({ typingUsers }) {
    const names = Object.values(typingUsers).map(u => u.name);

    if (names.length === 0) return null;

    let label;
    if (names.length === 1)      label = `${names[0]} is typing`;
    else if (names.length === 2) label = `${names[0]} and ${names[1]} are typing`;
    else                         label = `${names[0]} and ${names.length - 1} others are typing`;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            fontSize: '12px',
            color: '#888',
            minHeight: '24px',
        }}>
            {/* Animated dots */}
            <TypingDots />
            <span>{label}…</span>
        </div>
    );
}

function TypingDots() {
    return (
        <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#a0aec0',
                        display: 'inline-block',
                        animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                />
            ))}
            <style>{`
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>
        </span>
    );
}