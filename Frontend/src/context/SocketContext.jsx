import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import { useNotification } from './NotificationContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('bid-hired', (data) => {
      showNotification(data.message, 'success');
    });

    socket.on('notification', (data) => {
      showNotification(data.message, 'info');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('bid-hired');
      socket.off('notification');
    };
  }, [showNotification]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
