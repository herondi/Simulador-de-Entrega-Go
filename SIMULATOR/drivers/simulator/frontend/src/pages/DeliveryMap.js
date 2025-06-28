import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Loader } from '@googlemaps/js-api-loader';
import { 
  FiMapPin, 
  FiTruck, 
  FiClock, 
  FiNavigation,
  FiRefreshCw
} from 'react-icons/fi';

const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const MapHeader = styled.div`
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

const MapControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled(motion.button)`
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  min-height: 600px;
`;

const GoogleMap = styled.div`
  width: 100%;
  height: 100%;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 250px;
  z-index: 1000;
`;

const OverlayTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DeliveryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateX(4px);
  }
  
  &.active {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
  }
`;

const DeliveryIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  background: ${props => props.color || '#667eea'};
`;

const DeliveryInfo = styled.div`
  flex: 1;
`;

const DeliveryTitle = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const DeliverySubtitle = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DeliveryMap = () => {
  const [map, setMap] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    initializeMap();
    loadDeliveries();
  }, []);

  const initializeMap = async () => {
    try {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY',
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setLoading(false);
    }
  };

  const loadDeliveries = () => {
    // Mock data - substituir por chamada real da API
    const mockDeliveries = [
      {
        id: 1,
        driver: 'João Silva',
        destination: 'Rua das Flores, 123',
        status: 'in-progress',
        coordinates: { lat: -23.5510, lng: -46.6340 },
        estimatedTime: '15 min'
      },
      {
        id: 2,
        driver: 'Maria Santos',
        destination: 'Av. Paulista, 1000',
        status: 'pending',
        coordinates: { lat: -23.5520, lng: -46.6350 },
        estimatedTime: '25 min'
      },
      {
        id: 3,
        driver: 'Pedro Costa',
        destination: 'Rua Augusta, 500',
        status: 'completed',
        coordinates: { lat: -23.5530, lng: -46.6360 },
        estimatedTime: 'Entregue'
      }
    ];

    setDeliveries(mockDeliveries);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in-progress': return '#2196f3';
      case 'completed': return '#4caf50';
      default: return '#667eea';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in-progress': return 'Em Andamento';
      case 'completed': return 'Entregue';
      default: return 'Desconhecido';
    }
  };

  const handleDeliveryClick = (delivery) => {
    setActiveDelivery(delivery);
    
    if (map && delivery.coordinates) {
      map.setCenter(delivery.coordinates);
      map.setZoom(15);
    }
  };

  const refreshMap = () => {
    setLoading(true);
    setTimeout(() => {
      loadDeliveries();
      setLoading(false);
    }, 1000);
  };

  return (
    <MapContainer>
      <MapHeader>
        <div>
          <Title>Mapa de Entregas</Title>
          <Subtitle>Acompanhe suas entregas em tempo real</Subtitle>
        </div>
        <MapControls>
          <ControlButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshMap}
          >
            <FiRefreshCw />
            Atualizar
          </ControlButton>
          <ControlButton
            className="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiNavigation />
            Nova Rota
          </ControlButton>
        </MapControls>
      </MapHeader>

      <MapWrapper>
        <GoogleMap ref={mapRef} />
        
        {loading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}

        <MapOverlay>
          <OverlayTitle>
            <FiTruck />
            Entregas Ativas
          </OverlayTitle>
          
          {deliveries.map((delivery) => (
            <DeliveryItem
              key={delivery.id}
              className={activeDelivery?.id === delivery.id ? 'active' : ''}
              onClick={() => handleDeliveryClick(delivery)}
            >
              <DeliveryIcon color={getStatusColor(delivery.status)}>
                <FiTruck />
              </DeliveryIcon>
              <DeliveryInfo>
                <DeliveryTitle>{delivery.driver}</DeliveryTitle>
                <DeliverySubtitle>
                  {delivery.destination} • {delivery.estimatedTime}
                </DeliverySubtitle>
              </DeliveryInfo>
            </DeliveryItem>
          ))}
        </MapOverlay>
      </MapWrapper>
    </MapContainer>
  );
};

export default DeliveryMap; 