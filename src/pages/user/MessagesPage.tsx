import { useState } from 'react';
import { Send, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { setActiveConversation, sendMessage, deleteConversation } from '../../store/slices/messagesSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Message } from '../../types';

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.auth.user);
  const { conversations, activeConversationId } = useAppSelector(s => s.messages);
  const { t, isRtl, lang } = useLanguage();
  const [newMessage, setNewMessage] = useState('');

  const activeConv = conversations.find(c => c.id === activeConversationId);

  const handleSend = () => {
    if (!newMessage.trim() || !activeConversationId || !user) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      senderId: user.id,
      timestamp: new Date().toISOString(),
      read: true,
    };
    dispatch(sendMessage({ conversationId: activeConversationId, message: msg }));
    setNewMessage('');
  };

  const handleDelete = (convId: string) => {
    dispatch(deleteConversation(convId));
    dispatch(addToast({ message: lang === 'ar' ? 'تم حذف المحادثة' : 'Conversation deleted', type: 'info' }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 shrink-0 border-r border-custom flex flex-col bg-dh-card ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-5 py-4 border-b border-custom">
          <h2 className="font-bold text-custom flex items-center gap-2">
            <MessageSquare size={18} className="text-sky-500" /> {t('msg.title')}
          </h2>
          <p className="text-xs text-muted mt-0.5">{conversations.length} {t('msg.conversations')}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare size={40} className="text-muted mb-3" />
              <p className="text-sm text-muted">{lang === 'ar' ? 'لا توجد محادثات بعد' : 'No conversations yet'}</p>
            </div>
          ) : (
            conversations.map(conv => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => dispatch(setActiveConversation(conv.id))}
                  className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors border-b border-custom group ${isActive ? 'bg-sky-500/10 border-l-2 border-l-sky-500' : 'hover:bg-bg'}`}
                >
                  <img
                    src={conv.senderAvatar}
                    alt={conv.senderName}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-custom truncate">{conv.receiverName}</p>
                      {lastMsg && (
                        <span className="text-[10px] text-muted shrink-0">
                          {format(new Date(conv.lastUpdated), 'MMM d')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate">{conv.propertyTitle}</p>
                    {lastMsg && <p className="text-xs text-muted truncate mt-0.5">{lastMsg.text}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(conv.id); }}
                      className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {!activeConv ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageSquare size={56} className="text-muted/30 mb-4" />
            <h3 className="text-lg font-semibold text-custom mb-2">{lang === 'ar' ? 'حدد محادثة' : 'Select a Conversation'}</h3>
            <p className="text-sm text-muted">{lang === 'ar' ? 'اختر محادثة من القائمة الجانبية لبدء الدردشة.' : 'Choose a conversation from the sidebar to start chatting.'}</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-custom bg-dh-card">
              <button onClick={() => dispatch(setActiveConversation(null))} className="md:hidden text-muted hover:text-custom mr-1">
                ←
              </button>
              <img src={activeConv.senderAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-custom text-sm">{activeConv.receiverName}</p>
                <p className="text-xs text-muted">re: {activeConv.propertyTitle}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3" style={{ background: 'rgb(var(--color-bg))' }}>
              {activeConv.messages.length === 0 && (
                <div className="text-center text-sm text-muted py-10">
                  {lang === 'ar' ? 'لا توجد رسائل بعد. ابدأ المحادثة!' : 'No messages yet. Start the conversation!'}
                </div>
              )}
              {activeConv.messages.map(msg => {
                const isOwn = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-sky-500 text-white rounded-br-sm'
                        : 'bg-dh-card text-custom border border-custom rounded-bl-sm'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-sky-100' : 'text-muted'}`}>
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-custom bg-dh-card">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t('msg.writeMessage')}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="dh-input flex-1 text-sm"
                />
                <button onClick={handleSend} disabled={!newMessage.trim()} className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={16} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
