// src/components/FilePreview.jsx
export default function FilePreview({ message }) {
    const { file_url, file_name, file_mime, file_size } = message;

    const isImage = file_mime?.startsWith('image/');
    const isPdf   = file_mime === 'application/pdf';
    const sizeLabel = formatBytes(file_size);

    if (isImage) {
        return (
            <div>
                <img
                    src={file_url}
                    alt={file_name}
                    style={{
                        maxWidth: '280px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        display: 'block',
                        cursor: 'pointer',
                    }}
                    onClick={() => window.open(file_url, '_blank')}
                />
                {message.body && (
                    <p style={{ marginTop: '4px', fontSize: '14px' }}>{message.body}</p>
                )}
            </div>
        );
    }

    // Generic file card
    return (
        
           <a href={file_url}
            download={file_name}
            target="_blank"
            rel="noreferrer"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.06)',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                minWidth: '200px',
            }}
        >
            <FileIcon mime={file_mime} />
            <div>
                <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{file_name}</p>
                <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                    {isPdf ? 'PDF' : 'File'} · {sizeLabel}
                </p>
            </div>
        </a>
    );
}

function FileIcon({ mime }) {
    const color = mime === 'application/pdf' ? '#e53e3e'
                : mime?.startsWith('video/') ? '#805ad5'
                : '#4a90e2';
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill={color} opacity="0.12"/>
            <path d="M10 8h8l6 6v12a2 2 0 01-2 2H10a2 2 0 01-2-2V10a2 2 0 012-2z"
                  stroke={color} strokeWidth="1.5" fill="none"/>
            <path d="M18 8v6h6" stroke={color} strokeWidth="1.5" fill="none"/>
        </svg>
    );
}

function formatBytes(bytes) {
    if (!bytes) return '';
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}