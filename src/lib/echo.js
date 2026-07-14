import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// pusher-js must be assigned to window so Echo can find it
window.Pusher = Pusher;

const echo = new Echo({
    // Tell Echo to use the Reverb driver (Pusher-protocol compatible)
    broadcaster: 'reverb',

    // Read the values from your React .env file
    // import.meta.env is how Vite exposes VITE_* variables to JS
    key:      import.meta.env.VITE_REVERB_APP_KEY,
    wsHost:   import.meta.env.VITE_REVERB_HOST,
    wsPort:   import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort:  import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],

    // This is where Echo sends the authorization request for private channels.
    // It must point to your Laravel API's broadcasting auth endpoint.
    // Since your React and Laravel are separate, use the full URL.
    authEndpoint: 'http://localhost:8000/api/broadcasting/auth',

    // Send the Sanctum Bearer token so Laravel knows who is connecting.
    // Adjust localStorage.getItem('token') to match where you store the token.
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            Accept: 'application/json',
        },
    },
});

export default echo;
