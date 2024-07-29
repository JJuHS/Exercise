import React from 'react';
import { Alert } from 'react-bootstrap';

function ErrorNotification({ message }) {
    return (
        <Alert variant="danger">
        {message}
        </Alert>
    );
}

export default ErrorNotification;
