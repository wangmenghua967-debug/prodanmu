import { DanmakuItem } from '@/components/DanmakuItem';
import { DanmakuInput } from '@/components/DanmakuInput';
import { useDanmaku } from '@/hooks/useDanmaku';

const Index = () => {
  const { danmakus, send, removeDanmaku, isLoading } = useDanmaku();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 弹幕区域 */}
      <div className="relative w-full h-[calc(100vh-180px)] overflow-hidden">
        {danmakus.map((danmaku) => (
          <DanmakuItem
            key={danmaku.id}
            id={danmaku.id}
            text={danmaku.text}
            track={danmaku.track}
            duration={danmaku.duration}
            onComplete={removeDanmaku}
          />
        ))}

        {/* 空状态提示 */}
        {danmakus.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up">
            <div className="text-center">
              <h1 className="text-4xl font-light text-foreground/80 mb-4 tracking-wider">
                弹幕墙
              </h1>
              <p className="text-muted-foreground text-lg">
                发送一条弹幕，让它飘过屏幕
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <DanmakuInput onSend={send} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
