import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from '../services/api.js';
import { Bell, CheckCheck, MessageSquare, CheckCircle2, Shield, Rocket, Users, Compass } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await request<{ notifications: any[]; unreadCount: number }>('/notifications');
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await request('/notifications/mark-read', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const filteredNotifications = activeFilter === 'unread'
    ? notifications.filter(n => n.is_read === 0)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'accepted_answer':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'project_request':
      case 'team_invite':
        return <Rocket className="h-4 w-4 text-purple-400" />;
      case 'moderator_alert':
        return <Shield className="h-4 w-4 text-amber-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1F2937]">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-400" />
          <h1 className="text-xl font-extrabold text-white">Campus Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1F2937]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-xl transition-colors ${
            activeFilter === 'unread'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-[#111827] text-gray-400 hover:text-white border border-[#1F2937]'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading campus alerts...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-12 text-center space-y-3">
          <Bell className="h-8 w-8 text-gray-600 mx-auto" />
          <div>
            <p className="text-sm font-bold text-white">
              {activeFilter === 'unread' ? 'No unread notifications' : 'You are all caught up!'}
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Join discussions in your department community, contribute answers, or collaborate on student prototypes.
            </p>
          </div>
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Browse Discussions Feed</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((n) => (
            <Link
              key={n.id}
              to={n.link || '#'}
              className={`block rounded-2xl border p-4 transition-all ${
                n.is_read === 0
                  ? 'bg-indigo-950/25 border-indigo-500/40 hover:bg-indigo-950/40'
                  : 'bg-[#111827] border-[#1F2937] hover:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#182234] border border-[#2D3748] flex items-center justify-center flex-shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-white">{n.title}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
