import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
    // Aquí puedes agregar la lógica para enviar la consulta (por ejemplo, a través de una API o correo electrónico).
    console.log('Nombre: ', formData.name);
    console.log('Email: ', formData.email);
    console.log('Consulta: ', formData.message);
    // Luego, puedes restablecer el estado o mostrar un mensaje de confirmación.
  };

  return (
    <div>
      <div>
        <Typography variant="h6">Datos de la Empresa</Typography>
        <Typography variant="body1">Nombre de la Empresa: Mi Empresa</Typography>
        <Typography variant="body1">Dirección: Calle Principal 123</Typography>
        <Typography variant="body1">Teléfono: 555-555-555</Typography>
      </div>

      <div>
        <Typography variant="h6">Formulario de Contacto</Typography>
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
          <Button variant="contained" color="primary" type="submit">
            Enviar Consulta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
