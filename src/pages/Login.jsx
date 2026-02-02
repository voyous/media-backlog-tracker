import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { useEffect } from 'react';

const Login = () => {
    const { loginWithRedirect, loginWithPopup, currentUser, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleLoginRedirect = async () => {
        try {
            await loginWithRedirect();
        } catch (error) {
            console.error("Failed to log in", error);
        }
    };

    const handleLoginPopup = async () => {
        try {
            await loginWithPopup();
        } catch (error) {
            console.error("Failed to log in", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="icon-wrapper">
                    <Sparkles size={48} className="text-gradient-icon" />
                </div>
                <h1 className="text-gradient">Media Tracker</h1>
                <p className="subtitle">Track your games, movies, and shows across all your devices.</p>

                {error && <div className="error-message">{error}</div>}

                <div className="button-group">
                    <button onClick={handleLoginRedirect} className="google-btn">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                        />
                        <span>Sign in (Redirect)</span>
                    </button>

                    <button onClick={handleLoginPopup} className="google-btn secondary">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                        />
                        <span>Sign in (Popup)</span>
                    </button>
                    <p className="helper-text">Try Popup if Redirect fails on your device.</p>
                </div>
            </div>

            <style>{`
                .login-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    padding: 1rem;
                }
                .login-card {
                    padding: 3rem 2rem;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .icon-wrapper {
                    margin-bottom: 1.5rem;
                    display: inline-flex;
                    padding: 1rem;
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 50%;
                }
                .text-gradient-icon {
                    color: #d946ef;
                }
                .subtitle {
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                    font-size: 1.1rem;
                .error-message {
                    background: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }
                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .google-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    background: white;
                    color: #333;
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius-full);
                    font-weight: 500;
                    font-family: 'Roboto', sans-serif;
                    transition: transform 0.2s ease;
                    cursor: pointer;
                    border: none;
                }
                .google-btn.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .google-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255,255,255,0.2);
                }
                .google-btn img {
                    width: 24px;
                    height: 24px;
                }
                .helper-text {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default Login;
