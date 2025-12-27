import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [spaces, setSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hardcoded config for axios requests
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const spacesRes = await axios.get('http://localhost:5000/api/spaces');
                setSpaces(spacesRes.data);

                // In a real app we would protect this call or handle errors if user isn't auth'd (but protected route handles that)
                const bookingsRes = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
                setBookings(bookingsRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBook = async (spaceId) => {
        // Ideally open a modal to select dates. For now, simple booking demo with hardcoded dates
        if (!window.confirm("Book this space for tomorrow 9-5?")) return;

        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);

            const endTime = new Date(tomorrow);
            endTime.setHours(17, 0, 0, 0);

            await axios.post('http://localhost:5000/api/bookings', {
                spaceId,
                startTime: tomorrow,
                endTime: endTime,
                totalPrice: 100 // Placeholder price
            }, config);

            alert('Booking Confirmed!');
            // Refresh bookings
            const bookingsRes = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
            setBookings(bookingsRes.data);
        } catch (error) {
            alert('Booking Failed');
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, {user.name}</h1>

            {/* My Bookings Section */}
            <div style={{ marginTop: '30px' }}>
                <h2>My Bookings</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {bookings.length > 0 ? bookings.map((booking) => (
                        <div key={booking._id} className="card">
                            <h3>{booking.space.name}</h3>
                            <p>Date: {new Date(booking.startTime).toLocaleDateString()}</p>
                            <p>Status: {booking.status}</p>
                        </div>
                    )) : <p>No bookings yet.</p>}
                </div>
            </div>

            {/* Available Spaces Section */}
            <div style={{ marginTop: '30px' }}>
                <h2>Available Spaces</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {spaces.map((space) => (
                        <div key={space._id} className="card">
                            <h3>{space.name}</h3>
                            <p>{space.description}</p>
                            <p>Capacity: {space.capacity}</p>
                            <p>Price: ${space.pricePerHour}/hr</p>
                            <button
                                className="btn"
                                style={{ marginTop: '10px' }}
                                onClick={() => handleBook(space._id)}
                            >
                                Book
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
