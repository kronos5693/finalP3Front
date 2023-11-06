import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Box } from '@mui/material';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Nombre: ', formData.name);
    console.log('Email: ', formData.email);
    console.log('Consulta: ', formData.message);
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        marginTop: '2cm',
      }}
    >
      <Typography variant="h6">Haga su consulta</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Nombre"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="message"
          label="Consulta"
          multiline
          rows={4}
          value={formData.message}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" justifyContent="flex-end"> 
          <Button variant="contained" color="primary" type="submit">
            Enviar Consulta
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ContactForm;
