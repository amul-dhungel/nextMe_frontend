// Sidebar.js
import React from 'react';
import './styles.css';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function Sidebar({ onConfigClick }) {
    return (
        <aside className="sidebar">
            <div className="logo">LLM Factory</div>
            <ul className="menu">
                <li>
                    <a href="#" onClick={e => { e.preventDefault(); onConfigClick(); }}>
                        Configure Model
                    </a>
                </li>
                <li><a href="#">Voice Streams</a></li>
                <li><a href="#">Game AI</a></li>
                <li><a href="#">Dreamscape</a></li>
            </ul>
            <div className="bottom-section">
                <div className="resume-download">
                    <a href="frontend/reactjs/src/Resume.docx" download className="btn btn-resume">
                        Download Resume
                    </a>
                </div>
                <div className="social-links">
                    <a href="https://www.linkedin.com/in/amul-dhungel-0641161b1/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                        <FaLinkedin />
                    </a>
                    <a href="https://github.com/amul-dhungel" target="_blank" rel="noopener noreferrer" className="social-icon github">
                        <FaGithub />
                    </a>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
