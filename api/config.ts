// 统一的环境配置文件

// 环境类型定义
export type Environment = 'development' | 'production';

// 配置接口定义
export interface AppConfig {
  environment: Environment;
  api: {
    baseUrl: string;
    timeout: number;
  };
  websocket: {
    url: string;
    reconnectAttempts: number;
    reconnectInterval: number;
  };
  features: {
    enableMockData: boolean;
    enableDebugLogs: boolean;
    enableNotifications: boolean;
  };
}

// 开发环境配置
const developmentConfig: AppConfig = {
  environment: 'development',
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000,
  },
  websocket: {
    url: 'ws://localhost:3000/ws',
    reconnectAttempts: 5,
    reconnectInterval: 3000,
  },
  features: {
    enableMockData: true,
    enableDebugLogs: true,
    enableNotifications: true,
  },
};

// 生产环境配置
const productionConfig: AppConfig = {
  environment: 'production',
  api: {
    baseUrl: 'https://api.loveconnect.com/api',
    timeout: 15000,
  },
  websocket: {
    url: 'wss://api.loveconnect.com/ws',
    reconnectAttempts: 3,
    reconnectInterval: 5000,
  },
  features: {
    enableMockData: false,
    enableDebugLogs: false,
    enableNotifications: true,
  },
};

// 环境配置映射
const configs: Record<Environment, AppConfig> = {
  development: developmentConfig,
  production: productionConfig, 
};

// 当前环境设置 - 在这里修改环境模式
const CURRENT_ENVIRONMENT: Environment = 'development';

// 获取当前配置
export const config: AppConfig = configs[CURRENT_ENVIRONMENT];

// 便捷的环境检查函数
export const isDevelopment = () => config.environment === 'development';
export const isProduction = () => config.environment === 'production';

// 获取特定环境的配置
export const getConfig = (env?: Environment): AppConfig => {
  return configs[env || CURRENT_ENVIRONMENT];
};

// 动态切换环境（主要用于开发调试）
export const setEnvironment = (env: Environment): AppConfig => {
  const newConfig = configs[env];
  Object.assign(config, newConfig);
  return newConfig;
};

// 日志工具函数
export const log = {
  debug: (...args: any[]) => {
    if (config.features.enableDebugLogs) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    console.log('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

// 导出默认配置
export default config;