'use client';

// CareTouch 데모 페이지

import { useState } from 'react';
import Link from 'next/link';

const ROOMS = ['거실', '침실', '주방'];

type DeviceState = {
  light: boolean;
  lightLevel: number;
  heat: boolean;
  heatTemp: number;
  tv: boolean;
  tvChannel: number;
};

const DEFAULT_STATE: DeviceState = {
  light: true, lightLevel: 70,
  heat: false, heatTemp: 22,
  tv: false, tvChannel: 1,
};

export default function CareTouchDemoPage() {
  const [room, setRoom] = useState('거실');
  const [devices, setDevices] = useState<Record<string, DeviceState>>({
    거실: { ...DEFAULT_STATE },
    침실: { ...DEFAULT_STATE, light: false, heat: true },
    주방: { ...DEFAULT_STATE, tv: false, lightLevel: 100 },
  });
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState('');

  const d = devices[room];

  function update(patch: Partial<DeviceState>) {
    setDevices((prev) => ({ ...prev, [room]: { ...prev[room], ...patch } }));
  }

  function handleVoice() {
    const commands = [
      { msg: '거실 조명을 켭니다.', patch: { light: true } },
      { msg: '난방 온도를 24도로 설정합니다.', patch: { heat: true, heatTemp: 24 } },
      { msg: 'TV를 끕니다.', patch: { tv: false } },
    ];
    const cmd = commands[Math.floor(Math.random() * commands.length)];
    setVoiceActive(true);
    setVoiceMsg('듣고 있어요…');
    setTimeout(() => {
      setVoiceMsg(cmd.msg);
      update(cmd.patch);
    }, 1200);
    setTimeout(() => {
      setVoiceActive(false);
      setVoiceMsg('');
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href="/showcase" className="text-gray-500 hover:text-gray-300 text-sm">← 쇼케이스</Link>
        <span className="text-gray-700">|</span>
        <span className="text-sm font-bold text-white">CareTouch <span className="text-xs font-normal text-gray-500 ml-1">데모</span></span>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* 인사 */}
        <div>
          <p className="text-gray-400 text-sm">안녕하세요, 김순자 어르신 👋</p>
          <p className="text-xl font-extrabold mt-0.5">
            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>

        {/* 방 선택 */}
        <div className="flex gap-2">
          {ROOMS.map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`flex-1 py-3 rounded-2xl text-base font-bold transition-colors ${
                room === r ? 'bg-sky-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* 제어 버튼 */}
        <div className="grid grid-cols-1 gap-4">
          {/* 조명 */}
          <div className="bg-gray-900 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{d.light ? '💡' : '🌑'}</span>
                <div>
                  <p className="text-base font-bold">조명</p>
                  <p className="text-xs text-gray-500">{d.light ? `밝기 ${d.lightLevel}%` : '꺼짐'}</p>
                </div>
              </div>
              <button
                onClick={() => update({ light: !d.light })}
                className={`w-14 h-8 rounded-full transition-colors relative ${d.light ? 'bg-sky-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${d.light ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {d.light && (
              <input
                type="range" min={10} max={100} value={d.lightLevel}
                onChange={(e) => update({ lightLevel: Number(e.target.value) })}
                className="w-full accent-sky-400"
              />
            )}
          </div>

          {/* 난방 */}
          <div className="bg-gray-900 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{d.heat ? '🔥' : '❄️'}</span>
                <div>
                  <p className="text-base font-bold">난방</p>
                  <p className="text-xs text-gray-500">{d.heat ? `${d.heatTemp}°C 설정 중` : '꺼짐'}</p>
                </div>
              </div>
              <button
                onClick={() => update({ heat: !d.heat })}
                className={`w-14 h-8 rounded-full transition-colors relative ${d.heat ? 'bg-orange-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${d.heat ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {d.heat && (
              <div className="flex items-center gap-4">
                <button onClick={() => update({ heatTemp: Math.max(16, d.heatTemp - 1) })} className="w-10 h-10 rounded-full bg-gray-800 text-lg font-bold hover:bg-gray-700">−</button>
                <span className="flex-1 text-center text-2xl font-extrabold">{d.heatTemp}°C</span>
                <button onClick={() => update({ heatTemp: Math.min(30, d.heatTemp + 1) })} className="w-10 h-10 rounded-full bg-gray-800 text-lg font-bold hover:bg-gray-700">+</button>
              </div>
            )}
          </div>

          {/* TV */}
          <div className="bg-gray-900 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{d.tv ? '📺' : '⬛'}</span>
                <div>
                  <p className="text-base font-bold">TV</p>
                  <p className="text-xs text-gray-500">{d.tv ? `${d.tvChannel}채널` : '꺼짐'}</p>
                </div>
              </div>
              <button
                onClick={() => update({ tv: !d.tv })}
                className={`w-14 h-8 rounded-full transition-colors relative ${d.tv ? 'bg-purple-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${d.tv ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            {d.tv && (
              <div className="flex items-center gap-4">
                <button onClick={() => update({ tvChannel: Math.max(1, d.tvChannel - 1) })} className="w-10 h-10 rounded-full bg-gray-800 text-lg font-bold hover:bg-gray-700">−</button>
                <span className="flex-1 text-center text-2xl font-extrabold">CH {d.tvChannel}</span>
                <button onClick={() => update({ tvChannel: d.tvChannel + 1 })} className="w-10 h-10 rounded-full bg-gray-800 text-lg font-bold hover:bg-gray-700">+</button>
              </div>
            )}
          </div>
        </div>

        {/* 음성 명령 */}
        <button
          onClick={handleVoice}
          disabled={voiceActive}
          className={`w-full py-4 rounded-3xl text-base font-bold transition-all ${
            voiceActive ? 'bg-sky-700 text-sky-200' : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
        >
          {voiceMsg || '🎤  음성으로 제어하기'}
        </button>
      </div>
    </div>
  );
}
