import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiClock, FiTruck, FiNavigation, FiUser } from 'react-icons/fi';
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
  max-width: 800px;
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

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
  }
  
  &:hover:not(.active) {
    border-color: #667eea;
    color: #667eea;
  }
`;

const RoutesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RouteCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const RouteInfo = styled.div`
  flex: 1;
`;

const RouteName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RouteDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  flex-wrap: wrap;
`;

const RouteStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  
  &.active {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
  
  &.pending {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
  
  &.completed {
    background: rgba(33, 150, 243, 0.1);
    color: #2196f3;
  }
`;

const RouteStops = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const StopItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
`;

const StopIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  
  &.pickup {
    background: #2196f3;
  }
  
  &.delivery {
    background: #4caf50;
  }
`;

const StopInfo = styled.div`
  flex: 1;
`;

const StopAddress = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StopDetails = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
`;

const RoutesModal = ({ isOpen, onClose }) => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoutes();
    }
  }, [isOpen]);

  useEffect(() => {
    filterRoutes();
  }, [routes, activeFilter]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      // Simular dados de rotas (substitua pela chamada real da API)
      const mockRoutes = [
        {
          id: 1,
          driver: 'João Silva',
          status: 'active',
          estimatedTime: '45 min',
          totalStops: 3,
          stops: [
            {
              type: 'pickup',
              address: 'Loja Central - Av. Paulista, 1000',
              customer: 'Loja Central',
              time: '09:00'
            },
            {
              type: 'delivery',
              address: 'Rua das Flores, 123 - Vila Madalena',
              customer: 'Maria Santos',
              time: '09:30'
            },
            {
              type: 'delivery',
              address: 'Av. Faria Lima, 2000 - Itaim',
              customer: 'Pedro Costa',
              time: '10:15'
            }
          ]
        },
        {
          id: 2,
          driver: 'Ana Oliveira',
          status: 'pending',
          estimatedTime: '30 min',
          totalStops: 2,
          stops: [
            {
              type: 'pickup',
              address: 'Centro de Distribuição - Zona Sul',
              customer: 'CD Sul',
              time: '14:00'
            },
            {
              type: 'delivery',
              address: 'Rua Augusta, 500 - Consolação',
              customer: 'Carlos Silva',
              time: '14:30'
            }
          ]
        },
        {
          id: 3,
          driver: 'Roberto Lima',
          status: 'completed',
          estimatedTime: 'Concluída',
          totalStops: 4,
          stops: [
            {
              type: 'pickup',
              address: 'Depósito Norte - Santana',
              customer: 'Depósito Norte',
              time: '08:00'
            },
            {
              type: 'delivery',
              address: 'Rua da Consolação, 100',
              customer: 'Empresa XYZ',
              time: '08:45'
            },
            {
              type: 'delivery',
              address: 'Av. Rebouças, 800',
              customer: 'Loja ABC',
              time: '09:30'
            },
            {
              type: 'delivery',
              address: 'Rua Oscar Freire, 200',
              customer: 'Cliente VIP',
              time: '10:15'
            }
          ]
        }
      ];

      setRoutes(mockRoutes);
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRoutes = () => {
    if (activeFilter === 'all') {
      setFilteredRoutes(routes);
    } else {
      setFilteredRoutes(routes.filter(route => route.status === activeFilter));
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Rotas de Entrega</ModalTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <FilterSection>
              <FilterButton
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => setActiveFilter('all')}
              >
                Todas
              </FilterButton>
              <FilterButton
                className={activeFilter === 'active' ? 'active' : ''}
                onClick={() => setActiveFilter('active')}
              >
                Em Andamento
              </FilterButton>
              <FilterButton
                className={activeFilter === 'pending' ? 'active' : ''}
                onClick={() => setActiveFilter('pending')}
              >
                Pendentes
              </FilterButton>
              <FilterButton
                className={activeFilter === 'completed' ? 'active' : ''}
                onClick={() => setActiveFilter('completed')}
              >
                Concluídas
              </FilterButton>
            </FilterSection>

            {loading ? (
              <EmptyState>
                <EmptyIcon>⏳</EmptyIcon>
                <p>Carregando rotas...</p>
              </EmptyState>
            ) : filteredRoutes.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <FiMapPin />
                </EmptyIcon>
                <p>Nenhuma rota encontrada para o filtro selecionado.</p>
              </EmptyState>
            ) : (
              <RoutesList>
                {filteredRoutes.map((route, index) => (
                  <RouteCard
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <RouteHeader>
                      <RouteInfo>
                        <RouteName>
                          <FiTruck />
                          {route.driver}
                        </RouteName>
                        <RouteDetails>
                          <span>
                            <FiClock /> {route.estimatedTime}
                          </span>
                          <span>
                            <FiNavigation /> {route.totalStops} paradas
                          </span>
                        </RouteDetails>
                      </RouteInfo>
                      <RouteStatus className={route.status}>
                        {getStatusText(route.status)}
                      </RouteStatus>
                    </RouteHeader>

                    <RouteStops>
                      {route.stops.map((stop, stopIndex) => (
                        <StopItem key={stopIndex}>
                          <StopIcon className={stop.type}>
                            {stop.type === 'pickup' ? <FiMapPin /> : <FiUser />}
                          </StopIcon>
                          <StopInfo>
                            <StopAddress>{stop.address}</StopAddress>
                            <StopDetails>
                              {stop.customer} • {stop.time}
                            </StopDetails>
                          </StopInfo>
                        </StopItem>
                      ))}
                    </RouteStops>
                  </RouteCard>
                ))}
              </RoutesList>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default RoutesModal;