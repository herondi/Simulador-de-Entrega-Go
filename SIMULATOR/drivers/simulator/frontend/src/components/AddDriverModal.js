import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import axios from 'axios';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: #666;
  font-size: 1rem;
  z-index: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &.primary {
    background: #667eea;
    color: white;
    border: none;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: transparent;
    color: #666;
    border: 2px solid #e1e5e9;
    
    &:hover {
      border-color: #667eea;
      color: #667eea;
    }
  }
`;

const AddDriverModal = ({ isOpen, onClose, onDriverAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/drivers', formData);
      
      if (response.status === 201) {
        alert('Entregador adicionado com sucesso!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: ''
        });
        onDriverAdded && onDriverAdded();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao adicionar entregador:', error);
      alert('Erro ao adicionar entregador. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Adicionar Novo Entregador</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nome Completo</Label>
                <InputContainer>
                  <InputIcon>
                    <FiUser />
                  </InputIcon>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <InputContainer>
                  <InputIcon>
                    <FiMail />
                  </InputIcon>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Digite o email"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Telefone</Label>
                <InputContainer>
                  <InputIcon>
                    <FiPhone />
                  </InputIcon>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="location">Localização Base</Label>
                <InputContainer>
                  <InputIcon>
                    <FiMapPin />
                  </InputIcon>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Digite a localização base"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" className="secondary" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar Entregador'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AddDriverModal;