import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

const Login = () => {
    const { login, currentUser, error } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const handleLogin = async () => {
        try {
            await login();
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to log in", error);
        }
    };

    const handleGoToApp = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 20 + 10; // Width depending on "paper" size
                this.height = this.size * 1.4; // Maintain aspect ratio
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
            }

            update(mouseX, mouseY) {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;

                // Wrap around screen
                if (this.x < -50) this.x = canvas.width + 50;
                if (this.x > canvas.width + 50) this.x = -50;
                if (this.y < -50) this.y = canvas.height + 50;
                if (this.y > canvas.height + 50) this.y = -50;

                // Mouse interaction (repel)
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 2;
                    const pushY = Math.sin(angle) * force * 2;

                    this.vx += pushX * 0.1;
                    this.vy += pushY * 0.1;
                }

                // Friction to return to normal speed
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Minimum movement to keep drifting
                const baseSpeed = 0.2;
                if (Math.abs(this.vx) < baseSpeed && Math.abs(this.vy) < baseSpeed) {
                    this.vx += (Math.random() - 0.5) * 0.01;
                    this.vy += (Math.random() - 0.5) * 0.01;
                }
            }

            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                // Draw paper
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                ctx.shadowBlur = 5;
                ctx.fillRect(-this.size / 2, -this.height / 2, this.size, this.height);

                // Optional: Draw lines to look like text
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(-this.size / 2 + 2, -this.height / 2 + 5, this.size - 4, 2);
                ctx.fillRect(-this.size / 2 + 2, -this.height / 2 + 10, this.size - 4, 2);

                ctx.restore();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // Density
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update(mouseX, mouseY);
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="login-container">
            <canvas ref={canvasRef} className="background-canvas" />

            <div className="login-card glass-panel">
                <div className="icon-wrapper">
                    <Sparkles size={48} className="text-gradient-icon" />
                </div>
                <h1 className="text-gradient">Unstack</h1>
                <p className="subtitle">Track your games, movies, and shows across all your devices.</p>

                {error && <div className="error-message">{error}</div>}

                {currentUser ? (
                    <button onClick={handleGoToApp} className="google-btn">
                        <span>Go to App</span>
                    </button>
                ) : (
                    <button onClick={handleLogin} className="google-btn">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                        />
                        <span>Sign in with Google</span>
                    </button>
                )}
            </div>

            <style>{`
                .login-container {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    padding: 1rem;
                    position: relative;
                    overflow: hidden;
                }
                .background-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none; /* Let clicks pass through if needed, but we track mouse on window */
                    z-index: 1;
                }
                .login-card {
                    padding: 3rem 2rem;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    border: 1px solid rgba(255,255,255,0.1);
                    position: relative;
                    z-index: 10;
                    backdrop-filter: blur(10px); /* Enhance glass effect */
                    background: rgba(30, 30, 40, 0.6); /* Slightly more opaque for readability */
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
                }
                .error-message {
                    background: rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    padding: 0.75rem;
                    border-radius: var(--radius-sm);
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    border: 1px solid rgba(239, 68, 68, 0.3);
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
                .google-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255,255,255,0.2);
                }
                .google-btn img {
                    width: 24px;
                    height: 24px;
                }
            `}</style>
        </div>
    );
};

export default Login;
