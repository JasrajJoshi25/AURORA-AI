import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  sender: 'USER' | 'COPILOT';
  text: string;
  timestamp: string;
  isSimulatedNotice?: boolean;
}

export const AuroraCopilot: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    activeVessel, 
    dataMode 
  } = useApp();

  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'COPILOT',
      text: 'Aurora Copilot v2.4 initialized. Connected to Southern Ocean telemetry feeds. How can I assist your Antarctic maritime navigation or research operations today?',
      timestamp: '12:00 UTC',
      isSimulatedNotice: dataMode === 'SIMULATION'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const promptsContainerRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    'Why did the route change for ORV Sagar Anveshika?',
    'What is the safest approach corridor to Maitri?',
    'Explain the physics drift model of Iceberg A23A.',
    'What will sea-ice conditions look like in +48 hours?',
    'Compare fuel consumption between Route A and Route C.'
  ];

  const scrollPrompts = (direction: 'left' | 'right') => {
    if (promptsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      promptsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    
    if (q.includes('why') && (q.includes('route') || q.includes('change') || q.includes('sagar'))) {
      return `The route for ORV Sagar Anveshika was modified from Route A to Route C because Sentinel-1A SAR radar observed Mega-Iceberg A23A accelerating along the Antarctic Circumpolar Current. Route A passed within 12.4 NM of A23A's 72-hour projected uncertainty corridor (73% collision probability). Route C introduces an optimal +18 km bypass (+34 min ETA), increasing separation to 28.4 NM and reducing collision risk by 71% while saving 8.6% fuel versus manual evasive routing.`;
    }
    
    if (q.includes('maitri') || q.includes('safest')) {
      return `For transit to Maitri Station (70°46'S, 11°44'E) from Cape Town, Route C (AI Balanced) is recommended. Sea-ice concentration currently averages 68% in the Schirmacher coastal sector. Maintain speed at 11-12 knots until 68°S, then reduce to 8.5 knots upon entering first-year pack ice. Avoid the western Weddell gyre shear zone.`;
    }

    if (q.includes('physics') || q.includes('a23a') || q.includes('drift')) {
      return `Mega-Iceberg A23A drift is modeled using momentum balance: m(dv/dt + f·k×v) = F_water + F_air + F_ice + F_tilt. Currently, ocean current drag (72% contribution) and 22-knot SW wind drag (28% contribution with 37° leftward Coriolis deflection) dominate its 0.85-knot North-East trajectory. High draft (380m) locks it into deep barotropic current streamlines.`;
    }

    if (q.includes('48') || q.includes('forecast') || q.includes('sea-ice') || q.includes('conditions')) {
      return `In +48 hours, the Aurora ConvLSTM v2.4 model projects sea-ice concentration to increase by +3.8% across Queen Maud Land due to katabatic cold air pooling. First-year ice thickness will reach 1.45m. The Weddell Sea ice edge will advance 14 km northward at 0.3 km/h.`;
    }

    if (q.includes('fuel') || q.includes('compare')) {
      return `Route A (Fastest: 820 km) consumes 7.9 tons of fuel but incurs critical iceberg hazard. Route B (Safest: 1,020 km) requires 8.8 tons (+18% fuel penalty). Route C (AI Balanced: 910 km) consumes 8.2 tons, yielding an 8.6% fuel savings relative to Route B while maintaining full polar safety margins.`;
    }

    return `Telemetry analysis complete for ${activeVessel?.name || 'ORV Sagar Anveshika'}. All environmental parameters (ice concentration, iceberg vectors, barotropic currents) satisfy Polar Code safety thresholds for Route C. No urgent hazard flags detected.`;
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'USER',
      text: query,
      timestamp: new Date().toISOString().substring(11, 16) + ' UTC'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateAnswer(query);
      const copilotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'COPILOT',
        text: replyText,
        timestamp: new Date().toISOString().substring(11, 16) + ' UTC',
        isSimulatedNotice: dataMode === 'SIMULATION'
      };
      setMessages(prev => [...prev, copilotMsg]);
      setIsTyping(false);
    }, 800);
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed bottom-14 right-4 z-40 w-96 sm:w-[440px] rounded-2xl bg-[#061124]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.75)] flex flex-col h-[520px] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-sky-500/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-display font-bold text-sm text-white">AURORA COPILOT</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold">AI DSS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Antarctic Navigation & Climate Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts with Scroll Bar and Arrow Controls */}
      <div className="relative px-2 py-1.5 bg-slate-950/85 border-b border-sky-500/20 flex items-center gap-1.5 shadow-inner">
        <button
          onClick={() => scrollPrompts('left')}
          className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer border border-slate-800"
          title="Scroll Left"
          type="button"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={promptsContainerRef}
          className="flex-1 flex items-center space-x-2 overflow-x-auto py-1 text-[11px] font-mono scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 240, 255, 0.4) rgba(8, 20, 39, 0.8)'
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-0.5 animate-pulse" />
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/50 border border-slate-700 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-200 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              title={prompt}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollPrompts('right')}
          className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer border border-slate-800"
          title="Scroll Right"
          type="button"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mb-1 px-1">
              <span>{msg.sender === 'USER' ? 'OPERATOR' : 'AURORA'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-xl text-xs leading-relaxed max-w-[90%] ${
                msg.sender === 'USER'
                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-sky-500/20 rounded-tl-none font-sans'
              }`}
            >
              {msg.text}

              {msg.isSimulatedNotice && msg.sender === 'COPILOT' && (
                <div className="mt-2 pt-1.5 border-t border-slate-700/60 text-[10px] font-mono text-cyan-400/80 flex items-center space-x-1">
                  <span>ℹ️</span>
                  <span>Simulation-based response (Aurora Physics & ConvLSTM models)</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono p-2">
            <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Analyzing Antarctic satellite telemetry & route models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-900/90 border-t border-sky-500/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about routes, icebergs, sea-ice forecast..."
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
