import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function MessageBox({ variant = 'info', children }) {
  return <Alert variant={variant}>{children}</Alert>;
}
