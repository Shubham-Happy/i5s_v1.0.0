
export interface NotificationPermissionStatus {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermissionStatus {
    this.permission = Notification.permission;
    return {
      granted: this.permission === 'granted',
      denied: this.permission === 'denied',
      default: this.permission === 'default'
    };
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications are not supported in this browser');
    }

    if (this.permission === 'granted') {
      return this.permission;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  // Send a local notification
  async sendNotification(title: string, options?: NotificationOptions): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return null;
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'statusnow-notification',
        requireInteraction: false,
        ...options
      });

      // Auto-close after 5 seconds if not interacted with
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Send a notification for new messages
  async sendMessageNotification(senderName: string, message: string): Promise<void> {
    await this.sendNotification(`New message from ${senderName}`, {
      body: message,
      icon: '/favicon.ico',
      tag: 'message-notification'
    });
  }

  // Send a notification for new followers
  async sendFollowerNotification(followerName: string): Promise<void> {
    await this.sendNotification('New Follower', {
      body: `${followerName} started following you`,
      icon: '/favicon.ico',
      tag: 'follower-notification'
    });
  }

  // Send a notification for post likes
  async sendLikeNotification(likerName: string, postContent: string): Promise<void> {
    const truncatedContent = postContent.length > 50 ? 
      postContent.substring(0, 50) + '...' : postContent;
    
    await this.sendNotification('Post Liked', {
      body: `${likerName} liked your post: "${truncatedContent}"`,
      icon: '/favicon.ico',
      tag: 'like-notification'
    });
  }

  // Send a notification for comments
  async sendCommentNotification(commenterName: string, postContent: string): Promise<void> {
    const truncatedContent = postContent.length > 50 ? 
      postContent.substring(0, 50) + '...' : postContent;
    
    await this.sendNotification('New Comment', {
      body: `${commenterName} commented on your post: "${truncatedContent}"`,
      icon: '/favicon.ico',
      tag: 'comment-notification'
    });
  }

  // Send a system notification
  async sendSystemNotification(title: string, message: string): Promise<void> {
    await this.sendNotification(title, {
      body: message,
      icon: '/favicon.ico',
      tag: 'system-notification'
    });
  }
}

export const notificationService = NotificationService.getInstance();
