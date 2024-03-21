import app from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';

export default function LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage('Logged in successfully!');
        } catch (error) {
            setMessage('Failed to log in. ' + error.message);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage('Account created successfully! Please log in.');
        } catch (error) {
            setMessage('Failed to create account. ' + error.message);
        }
    };

    return (
        <div>
            <form>
                <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
                <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                <button onClick={handleLogin}>Log In</button>
                <button onClick={handleSignUp}>Sign Up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
