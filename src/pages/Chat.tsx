import React, { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Chat: React.FC = () => {
  const { state: chatState, sendMessage, setActiveRoom, markMessagesAsRead } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeRoom = chatState.chatRooms.find(room => room.id === chatState.activeRoomId);
  const roomMessages = chatState.messages.filter(message => {
    if (!activeRoom) return false;
    return activeRoom.participantIds.includes(message.senderId) && 
           activeRoom.participantIds.includes(message.receiverId);
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && activeRoom) {
      const receiverId = activeRoom.participantIds.find(id => id !== user?.id);
      if (receiverId) {
        sendMessage(messageText, receiverId);
        setMessageText('');
      }
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setActiveRoom(roomId);
    markMessagesAsRead(roomId);
  };

  const getOtherParticipant = (room: any) => {
    const otherIndex = room.participantIds.findIndex((id: string) => id !== user?.id);
    return {
      name: room.participantNames[otherIndex],
      avatar: room.participantAvatars[otherIndex],
    };
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat Rooms */}
          <div className="flex-1 overflow-y-auto">
            {chatState.chatRooms.map((room) => {
              const otherParticipant = getOtherParticipant(room);
              const isActive = chatState.activeRoomId === room.id;
              
              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomSelect(room.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    isActive ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{otherParticipant.name}</h3>
                        {room.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">{room.lastMessage.content}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={getOtherParticipant(activeRoom).avatar}
                    alt={getOtherParticipant(activeRoom).name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{getOtherParticipant(activeRoom).name}</h3>
                    <p className="text-sm text-green-600">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {roomMessages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <img
                            src={message.senderAvatar}
                            alt={message.senderName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;