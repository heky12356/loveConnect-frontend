import { NotificationData } from '@/types/websocket';

// 通知去重配置
interface DeduplicationConfig {
  timeWindow: number; // 时间窗口（毫秒）
  maxSimilar: number; // 相似通知最大数量
  similarityThreshold: number; // 相似度阈值（0-1）
}

// 通知缓存项
interface NotificationCacheItem {
  notification: NotificationData;
  timestamp: number;
  count: number;
}

class NotificationDeduplicator {
  private cache = new Map<string, NotificationCacheItem>();
  private config: DeduplicationConfig;

  constructor(config: Partial<DeduplicationConfig> = {}) {
    this.config = {
      timeWindow: 30000, // 30秒
      maxSimilar: 3, // 最多3个相似通知
      similarityThreshold: 0.8, // 80%相似度
      ...config
    };
  }

  // 检查通知是否应该被过滤
  shouldFilter(notification: NotificationData): boolean {
    const now = Date.now();
    this.cleanExpiredCache(now);

    // 检查完全相同的通知
    const exactKey = this.getExactKey(notification);
    if (this.cache.has(exactKey)) {
      const cached = this.cache.get(exactKey)!;
      cached.count++;
      cached.timestamp = now;
      return true; // 过滤重复通知
    }

    // 检查相似通知
    const similarCount = this.getSimilarNotificationCount(notification);
    if (similarCount >= this.config.maxSimilar) {
      return true; // 过滤过多相似通知
    }

    // 添加到缓存
    this.cache.set(exactKey, {
      notification,
      timestamp: now,
      count: 1
    });

    return false; // 不过滤
  }

  // 获取精确匹配的键
  private getExactKey(notification: NotificationData): string {
    return `${notification.type}-${notification.title}-${notification.message}`;
  }

  // 计算相似通知数量
  private getSimilarNotificationCount(notification: NotificationData): number {
    let count = 0;
    
    for (const [, cached] of this.cache) {
      if (this.calculateSimilarity(notification, cached.notification) >= this.config.similarityThreshold) {
        count++;
      }
    }
    
    return count;
  }

  // 计算通知相似度
  private calculateSimilarity(n1: NotificationData, n2: NotificationData): number {
    // 类型权重
    const typeMatch = n1.type === n2.type ? 0.3 : 0;
    
    // 标题相似度
    const titleSimilarity = this.stringSimilarity(n1.title, n2.title) * 0.4;
    
    // 消息相似度
    const messageSimilarity = this.stringSimilarity(n1.message, n2.message) * 0.3;
    
    return typeMatch + titleSimilarity + messageSimilarity;
  }

  // 字符串相似度计算（简化版Levenshtein距离）
  private stringSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  // Levenshtein距离计算
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // 清理过期缓存
  private cleanExpiredCache(now: number): void {
    for (const [key, cached] of this.cache) {
      if (now - cached.timestamp > this.config.timeWindow) {
        this.cache.delete(key);
      }
    }
  }

  // 获取缓存统计
  getStats(): { totalCached: number; duplicateCount: number } {
    let duplicateCount = 0;
    
    for (const [, cached] of this.cache) {
      if (cached.count > 1) {
        duplicateCount += cached.count - 1;
      }
    }
    
    return {
      totalCached: this.cache.size,
      duplicateCount
    };
  }

  // 清空缓存
  clear(): void {
    this.cache.clear();
  }
}

// 通知优先级管理
export class NotificationPriorityManager {
  private static readonly PRIORITY_ORDER = ['error', 'warning', 'info', 'success'];

  // 根据优先级排序通知
  static sortByPriority(notifications: NotificationData[]): NotificationData[] {
    return notifications.sort((a, b) => {
      const aPriority = this.PRIORITY_ORDER.indexOf(a.type);
      const bPriority = this.PRIORITY_ORDER.indexOf(b.type);
      
      // 如果类型不在优先级列表中，放到最后
      const aIndex = aPriority === -1 ? this.PRIORITY_ORDER.length : aPriority;
      const bIndex = bPriority === -1 ? this.PRIORITY_ORDER.length : bPriority;
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      // 相同优先级按时间排序（新的在前）
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  }

  // 获取通知的显示时长
  static getDisplayDuration(notification: NotificationData): number {
    switch (notification.type) {
      case 'error': return 8000;
      case 'warning': return 6000;
      case 'success': return 4000;
      default: return 5000;
    }
  }
}

// 创建全局去重器实例
export const notificationDeduplicator = new NotificationDeduplicator();

// 通知处理工具函数
export const notificationUtils = {
  // 过滤重复通知
  filterDuplicates: (notifications: NotificationData[]): NotificationData[] => {
    return notifications.filter(notification => 
      !notificationDeduplicator.shouldFilter(notification)
    );
  },

  // 批量处理通知
  processNotifications: (notifications: NotificationData[]): NotificationData[] => {
    // 1. 过滤重复
    const filtered = notificationUtils.filterDuplicates(notifications);
    
    // 2. 按优先级排序
    const sorted = NotificationPriorityManager.sortByPriority(filtered);
    
    return sorted;
  },

  // 获取去重统计
  getDeduplicationStats: () => notificationDeduplicator.getStats(),

  // 清空去重缓存
  clearDeduplicationCache: () => notificationDeduplicator.clear(),
};