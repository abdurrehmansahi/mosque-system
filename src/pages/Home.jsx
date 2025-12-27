import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Mosque Spaces</h1>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>
                Book co-working spaces and meeting rooms in your local mosque.
            </p>
            <div style={{ marginTop: '30px' }}>
                <Link to="/signup" className="btn" style={{ marginRight: '15px' }}>Get Started</Link>
                <Link to="/login" className="btn" style={{ backgroundColor: '#2c3e50' }}>Login</Link>
            </div>
        </div>
    );
};

export default Home;
