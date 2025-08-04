import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPackage, FiMapPin, FiUser, FiPhone, FiDollarSign } from 'react-icons/fi';
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
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

const NewDeliveryModal = ({ isOpen, onClose, onDeliveryCreated }) => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    driverId: '',
    pickupAddress: '',
    deliveryAddress: '',
    packageDescription: '',
    value: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/drivers');
      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error('Erro ao buscar entregadores:', error);
    }
  };

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
      const deliveryData = {
        ...formData,
        value: parseFloat(formData.value),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await axios.post('/deliveries', deliveryData);
      
      if (response.status === 201) {
        alert('Entrega criada com sucesso!');
        resetForm();
        onDeliveryCreated && onDeliveryCreated();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      alert('Erro ao criar entrega. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerPhone: '',
      driverId: '',
      pickupAddress: '',
      deliveryAddress: '',
      packageDescription: '',
      value: '',
      notes: ''
    });
  };

  const handleClose = () => {
    resetForm();
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
              <ModalTitle>Nova Entrega</ModalTitle>
              <CloseButton onClick={handleClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="customerName">Nome do Cliente</Label>
                  <InputContainer>
                    <InputIcon>
                      <FiUser />
                    </InputIcon>
                    <Input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Nome do cliente"
                      required
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="customerPhone">Telefone do Cliente</Label>
                  <InputContainer>
                    <InputIcon>
                      <FiPhone />
                    </InputIcon>
                    <Input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </InputContainer>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="driverId">Entregador</Label>
                <InputContainer>
                  <InputIcon>
                    <FiUser />
                  </InputIcon>
                  <Select
                    id="driverId"
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um entregador</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </Select>
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="pickupAddress">Endereço de Coleta</Label>
                <InputContainer>
                  <InputIcon>
                    <FiMapPin />
                  </InputIcon>
                  <Input
                    type="text"
                    id="pickupAddress"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    placeholder="Endereço para coleta"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="deliveryAddress">Endereço de Entrega</Label>
                <InputContainer>
                  <InputIcon>
                    <FiMapPin />
                  </InputIcon>
                  <Input
                    type="text"
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Endereço para entrega"
                    required
                  />
                </InputContainer>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="packageDescription">Descrição do Pacote</Label>
                  <InputContainer>
                    <InputIcon>
                      <FiPackage />
                    </InputIcon>
                    <Input
                      type="text"
                      id="packageDescription"
                      name="packageDescription"
                      value={formData.packageDescription}
                      onChange={handleInputChange}
                      placeholder="Descrição do item"
                      required
                    />
                  </InputContainer>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="value">Valor da Entrega</Label>
                  <InputContainer>
                    <InputIcon>
                      <FiDollarSign />
                    </InputIcon>
                    <Input
                      type="number"
                      step="0.01"
                      id="value"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </InputContainer>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="notes">Observações</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre a entrega..."
                />
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
                  {isSubmitting ? 'Criando...' : 'Criar Entrega'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default NewDeliveryModal;