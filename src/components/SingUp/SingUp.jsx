import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import axios from 'axios';

const apiUrl="http://localhost:3000/usuarios"

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Nombre: ', formData.firstName);
    console.log('Apellido: ', formData.lastName);
    console.log('Teléfono: ', formData.phoneNumber);
    console.log('Correo Electrónico: ', formData.email);
    console.log('Contraseña: ', formData.password);
    console.log('Repetir Contraseña: ', formData.confirmPassword);

  
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const dataToSend = {
      nombre: formData.firstName,
      apellido: formData.lastName,
      contraseña: formData.password,
      //telefono:formData.telefono,
      email: formData.email,
      roles: "cliente",
    };

    try {
      // Enviar los datos a la API usando Axios
      const response =  axios.post(apiUrl, dataToSend);

      console.log('Datos enviados correctamente a la API', response.data);
    } catch (error) {
      console.error('Error al enviar datos a la API', error);
    }





    
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          name="firstName"
          label="Nombre"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="lastName"
          label="Apellido"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="phoneNumber"
          label="Teléfono"
          value={formData.phoneNumber}
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
          name="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      
        <TextField
          name="confirmPassword"
          label="Repetir Contraseña"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Button variant="contained" color="primary" type="submit">
            Registrarse
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default SignUp;
