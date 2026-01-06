import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import styles from './GoogleAuthButton.module.css';

interface GoogleAuthButtonProps {
    onSuccess: (userData: {
        email: string;
        name: string;
        picture: string;
        email_verified: boolean;
    }) => void;
    role: 'user' | 'vendor';
}

interface GoogleJWT {
    email: string;
    name: string;
    picture: string;
    email_verified: boolean;
    sub: string;
}

export const GoogleAuthButton = ({ onSuccess, role }: GoogleAuthButtonProps) => {
    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                toast.error('Google authentication failed');
                return;
            }

            const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);

            console.log('[Google Auth] User authenticated:', decoded.email);

            onSuccess({
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                email_verified: decoded.email_verified
            });
        } catch (error) {
            console.error('[Google Auth] Decode error:', error);
            toast.error('Failed to process Google authentication');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google Sign-In was cancelled or failed');
    };

    return (
        <div className={styles.googleAuthContainer}>
            <div className={styles.divider}>
                <span className={styles.dividerText}>OR</span>
            </div>

            <div className={styles.googleButtonWrapper}>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    size="large"
                    text={role === 'vendor' ? 'continue_with' : 'signin_with'}
                    shape="rectangular"
                    width="100%"
                    logo_alignment="left"
                />
            </div>

            <p className={styles.googleHint}>
                {role === 'vendor'
                    ? '🏪 Sign in with Google to set up your shop instantly'
                    : '🌿 Quick access with your Google account'}
            </p>
        </div>
    );
};
