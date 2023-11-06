import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log('Nombre de usuario: ', formData.username);
    console.log('Contraseña: ', formData.password);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Nombre de Usuario"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          style={{ fontSize: '14px' }}
        />
        <TextField
          name="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          style={{ fontSize: '14px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="contained" color="primary" type="submit" style={{ fontSize: '14px' }}>
            Iniciar Sesión
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default LoginForm;
