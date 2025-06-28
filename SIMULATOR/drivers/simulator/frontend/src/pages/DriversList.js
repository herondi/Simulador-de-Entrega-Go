import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiMail, FiUser } from 'react-icons/fi';
import axios from 'axios';

const DriversContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.95rem;
  width: 300px;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #666;
`;

const AddButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const DriversGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const DriverCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const DriverHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DriverAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const DriverInfo = styled.div`
  flex: 1;
`;

const DriverName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
`;

const DriverEmail = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin: 0;
`;

const DriverActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
  }
  
  &.edit {
    color: #2196f3;
    border-color: rgba(33, 150, 243, 0.2);
    
    &:hover {
      background: rgba(33, 150, 243, 0.1);
    }
  }
  
  &.delete {
    color: #f44336;
    border-color: rgba(244, 67, 54, 0.2);
    
    &:hover {
      background: rgba(244, 67, 54, 0.1);
    }
  }
`;

const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [searchTerm, drivers]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/drivers');
      setDrivers(response.data.drivers || []);
      setFilteredDrivers(response.data.drivers || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div>Carregando entregadores...</div>;
  }

  return (
    <DriversContainer>
      <PageHeader>
        <div>
          <Title>Entregadores</Title>
          <Subtitle>Gerencie sua equipe de entregadores</Subtitle>
        </div>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar entregadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <AddButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Adicionar
          </AddButton>
        </HeaderActions>
      </PageHeader>

      <DriversGrid>
        {filteredDrivers.map((driver, index) => (
          <DriverCard
            key={driver.uuid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DriverHeader>
              <DriverAvatar>
                {getInitials(driver.name)}
              </DriverAvatar>
              <DriverInfo>
                <DriverName>{driver.name}</DriverName>
                <DriverEmail>{driver.email}</DriverEmail>
              </DriverInfo>
            </DriverHeader>

            <DriverActions>
              <ActionButton
                className="edit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiEdit />
                Editar
              </ActionButton>
              <ActionButton
                className="delete"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiTrash2 />
                Excluir
              </ActionButton>
            </DriverActions>
          </DriverCard>
        ))}
      </DriversGrid>
    </DriversContainer>
  );
};

export default DriversList; 