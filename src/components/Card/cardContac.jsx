import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Box, Alert } from '@mui/material';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Nombre: ', formData.name);
    console.log('Email: ', formData.email);
    console.log('Consulta: ', formData.message);
    
    // Mostrar mensaje de éxito
    setShowSuccess(true);
    
    // Limpiar el formulario
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 7000);
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
      
      {showSuccess && (
        <Alert 
          severity="success" 
          sx={{ mt: 2, mb: 2 }}
          onClose={() => setShowSuccess(false)}
        >
          ¡Su consulta fue enviada con éxito! Nos pondremos en contacto pronto.
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Nombre"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
          required
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