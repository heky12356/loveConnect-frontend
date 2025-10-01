// API响应格式统一处理工具

// 统一API响应格式接口
export interface ApiResponse<T = any> {
  code: string | number;
  msg: string;
  data: T;
}

// API错误类
export class ApiError extends Error {
  public code: number;
  public msg: string;
  public data?: any;

  constructor(code: number, msg: string, data?: any) {
    super(msg);
    this.name = 'ApiError';
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}

// 统一处理API响应
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.code === "200" || response.code === 200) {
    return response.data;
  }
  
  throw new ApiError(Number(response.code), response.msg, response.data);
}

// 统一处理API错误
export function handleApiError(error: any): never {
  if (error instanceof ApiError) {
    throw error;
  }
  
  // 处理网络错误或其他错误
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new ApiError(0, '网络连接失败，请检查网络设置');
  }
  
  throw new ApiError(500, error.message || '未知错误');
}

// 统一的fetch包装器
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const result: ApiResponse<T> = await response.json();
    return handleApiResponse(result);
  } catch (error) {
    handleApiError(error);
  }
}

// 带认证的API请求
export async function authenticatedApiRequest<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': `Bearer ${token}`, // Authorization 放在最后确保不被覆盖
    },
  });
}

// 错误码映射
export const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权访问，请先登录',
  404: '请求的资源不存在',
  409: '资源冲突',
  500: '服务器内部错误，请稍后重试',
  501: '第三方服务调用失败',
  504: '服务超时，请重试',
};

// 获取错误信息
export function getErrorMessage(code: number, defaultMsg?: string): string {
  return ERROR_MESSAGES[code] || defaultMsg || '未知错误';
}