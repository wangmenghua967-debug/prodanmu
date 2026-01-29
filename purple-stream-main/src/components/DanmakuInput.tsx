import { useState } from 'react';
import { Send } from 'lucide-react';

interface DanmakuInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export const DanmakuInput = ({ onSend, isLoading = false }: DanmakuInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-3 items-center glass-effect rounded-2xl p-2 input-glow transition-all duration-300">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入弹幕内容..."
          className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          maxLength={50}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground btn-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center text-muted-foreground text-sm mt-3 opacity-60">
        按 Enter 发送弹幕
      </p>
    </form>
  );
};
