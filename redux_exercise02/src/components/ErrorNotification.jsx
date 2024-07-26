// src/components/ErrorNotification.jsx

import React from 'react';

function ErrorNotification({ message }) {
    return (
        <div style={{ color: 'red' }}>
        <p>{message}</p>
        </div>
    );
}

export default ErrorNotification;
