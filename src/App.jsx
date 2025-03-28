import React, { useState } from 'react';
import Login from './Login';
import VideoRoom from './VideoRoom';
import './assets/app.css';

function App() {
    const [user, setUser] = useState(null);

    return (
        <div>
            {user ? <VideoRoom user={user} /> : <Login setUser={setUser} />}
        </div>
    );
}

export default App;
