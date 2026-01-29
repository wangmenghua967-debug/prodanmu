import { useState, useCallback, useEffect } from 'react';
import { sendDanmaku, fetchDanmakus, connectDanmakuWebSocket, Danmaku } from '@/services/danmakuApi';

interface DanmakuDisplay {
  id: string;
  text: string;
  track: number;
  duration: number;
}

const TRACK_COUNT = 8; // 弹幕轨道数量
const MIN_DURATION = 6; // 最短持续时间（秒）
const MAX_DURATION = 10; // 最长持续时间（秒）

export const useDanmaku = () => {
  const [danmakus, setDanmakus] = useState<DanmakuDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usedTracks, setUsedTracks] = useState<Set<number>>(new Set());

  // 获取可用轨道
  const getAvailableTrack = useCallback(() => {
    const availableTracks = Array.from({ length: TRACK_COUNT }, (_, i) => i)
      .filter(track => !usedTracks.has(track));
    
    if (availableTracks.length === 0) {
      // 如果所有轨道都被使用，随机选择一个
      return Math.floor(Math.random() * TRACK_COUNT);
    }
    
    return availableTracks[Math.floor(Math.random() * availableTracks.length)];
  }, [usedTracks]);

  // 添加弹幕到显示
  const addDanmakuToDisplay = useCallback((text: string) => {
    const track = getAvailableTrack();
    const duration = MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION);
    const id = crypto.randomUUID();

    const newDanmaku: DanmakuDisplay = {
      id,
      text,
      track,
      duration,
    };

    setDanmakus(prev => [...prev, newDanmaku]);
    setUsedTracks(prev => new Set(prev).add(track));

    // 在弹幕开始一段时间后释放轨道
    setTimeout(() => {
      setUsedTracks(prev => {
        const newSet = new Set(prev);
        newSet.delete(track);
        return newSet;
      });
    }, 2000); // 2秒后释放轨道，允许新弹幕使用
  }, [getAvailableTrack]);

  // 发送弹幕
  const send = useCallback(async (text: string) => {
    setIsLoading(true);
    
    try {
      const response = await sendDanmaku({ text });
      
      if (response.success) {
        addDanmakuToDisplay(text);
      } else {
        console.error('Failed to send danmaku:', response.error);
      }
    } catch (error) {
      console.error('Error sending danmaku:', error);
    } finally {
      setIsLoading(false);
    }
  }, [addDanmakuToDisplay]);

  // 移除已完成的弹幕
  const removeDanmaku = useCallback((id: string) => {
    setDanmakus(prev => prev.filter(d => d.id !== id));
  }, []);

  // 初始化：获取历史弹幕并连接 WebSocket
  useEffect(() => {
    // 获取历史弹幕
    const loadHistoricalDanmakus = async () => {
      const response = await fetchDanmakus();
      if (response.success && response.danmakus.length > 0) {
        response.danmakus.forEach(d => {
          addDanmakuToDisplay(d.text);
        });
      }
    };

    loadHistoricalDanmakus();

    // 连接 WebSocket 接收实时弹幕
    const disconnect = connectDanmakuWebSocket((danmaku: Danmaku) => {
      addDanmakuToDisplay(danmaku.text);
    });

    return () => {
      disconnect();
    };
  }, [addDanmakuToDisplay]);

  return {
    danmakus,
    send,
    removeDanmaku,
    isLoading,
  };
};
