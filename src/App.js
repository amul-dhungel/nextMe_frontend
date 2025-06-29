import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import ConfigureModel from './ConfigureModel';
import './styles.css';
import { FaWindowClose } from 'react-icons/fa';

function App() {
    const [showConfig, setShowConfig] = useState(false);

    return (
        <div className="container">
            <Sidebar onConfigClick={() => setShowConfig(true)} />
            <main className="main-content">
                <ChatArea />
            </main>
            {/* Slide-over panel */}
            <div className={`slide-panel${showConfig ? ' open' : ''}`}>
                <button className="close-btn" onClick={() => setShowConfig(false)} icon={FaWindowClose}>
                </button>
                <ConfigureModel />
            </div>
            {showConfig && <div className="overlay" onClick={() => setShowConfig(false)} />}
        </div>
    );
}
export default App;
