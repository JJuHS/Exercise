import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
    return (
        <div className="text-center my-3">
        <Spinner animation="border" />
        </div>
    );
}

export default Loader;
