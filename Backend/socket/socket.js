export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-user-room', (userId) => {
      if (!userId) {
        console.warn('join-user-room called without userId');
        return;
      }

      socket.join(userId.toString());
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
