import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import './styles.css';
function App() {
    return (
        <div className="container">
            <Sidebar />
            <main className="main-content">
                <ChatArea />
            </main>
        </div>
    );
//     return (
//         <div>
//             <div className='container'>
//             <main className='main-content'>
//             <MediaSlider containerName="achievements" />
// </main>
//         </div>
//         </div>
//     );
}

export default App;
