"""
WebSocket connection manager for real-time updates
"""
from typing import Dict, List, Any
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
from loguru import logger


class ConnectionManager:
    """Enhanced WebSocket connection manager with user tracking"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.connection_count = 0

    async def connect(self, websocket: WebSocket, user_id: str = "anonymous"):
        """Connect a WebSocket client"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        self.connection_count += 1
        
        logger.info(f"✅ WebSocket connected: {user_id} | Total: {self.connection_count}")
        
        # Send welcome message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        })

    def disconnect(self, websocket: WebSocket, user_id: str = "anonymous"):
        """Disconnect a WebSocket client"""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
                self.connection_count -= 1
                
                # Clean up empty user lists
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
                
                logger.info(f"❌ WebSocket disconnected: {user_id} | Total: {self.connection_count}")

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending personal message to {user_id}: {str(e)}")

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        disconnected = []
        
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to {user_id}: {str(e)}")
                    disconnected.append((connection, user_id))
        
        # Clean up disconnected clients
        for connection, user_id in disconnected:
            self.disconnect(connection, user_id)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            "total_connections": self.connection_count,
            "unique_users": len(self.active_connections),
            "connections_per_user": {
                user_id: len(connections) 
                for user_id, connections in self.active_connections.items()
            }
        }


# Global connection manager instance
manager = ConnectionManager()
