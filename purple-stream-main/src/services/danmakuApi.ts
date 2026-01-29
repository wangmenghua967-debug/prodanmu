// ==========================================
// 弹幕 API 接口 - 预留后端连接
// ==========================================

export interface Danmaku {
  id: string;
  text: string;
  userId?: string;
  createdAt: Date;
}

export interface SendDanmakuRequest {
  text: string;
  userId?: string;
}

export interface SendDanmakuResponse {
  success: boolean;
  danmaku?: Danmaku;
  error?: string;
}

export interface FetchDanmakuResponse {
  success: boolean;
  danmakus: Danmaku[];
  error?: string;
}

// API 基础配置
const API_BASE_URL = 'https://wmh.onrender.com/api';

/**
 * 发送弹幕到后端
 * @param request 弹幕请求数据
 * @returns 发送结果
 */
export const sendDanmaku = async (request: SendDanmakuRequest): Promise<SendDanmakuResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/danmu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: request.text }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send danmaku');
    }
    
    const data = await response.json();
    // 转换后端返回的数据格式以匹配前端接口
    return {
      success: data.success,
      danmaku: data.danmaku ? {
        id: data.danmaku.id.toString(),
        text: data.danmaku.content,
        userId: request.userId,
        createdAt: new Date(data.danmaku.timestamp * 1000),
      } : undefined,
      error: data.error,
    };
  } catch (error) {
    console.error('Error sending danmaku:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * 从后端获取历史弹幕
 * @param limit 获取数量限制
 * @returns 弹幕列表
 */
export const fetchDanmakus = async (limit: number = 50): Promise<FetchDanmakuResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/danmu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch danmakus');
    }
    
    const data = await response.json();
    // 转换后端返回的数据格式以匹配前端接口
    return {
      success: data.success,
      danmakus: data.danmakus.map((danmaku: any) => ({
        id: danmaku.id.toString(),
        text: danmaku.content,
        userId: undefined,
        createdAt: new Date(danmaku.timestamp * 1000),
      })),
      error: data.error,
    };
  } catch (error) {
    console.error('Error fetching danmakus:', error);
    return {
      success: false,
      danmakus: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * WebSocket 连接（用于实时弹幕）
 * @param onMessage 收到弹幕时的回调
 * @returns 断开连接的函数
 */
export const connectDanmakuWebSocket = (
  onMessage: (danmaku: Danmaku) => void
): (() => void) => {
  // TODO: 连接后端时实现 WebSocket
  /*
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws/danmaku';
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const danmaku = JSON.parse(event.data) as Danmaku;
      onMessage(danmaku);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  return () => ws.close();
  */

  // 模拟返回空函数（前端演示用）
  console.log('WebSocket connection placeholder - implement when backend is ready');
  return () => {};
};
