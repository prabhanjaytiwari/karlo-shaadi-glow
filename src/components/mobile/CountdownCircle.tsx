import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

interface CountdownCircleProps {
  weddingDate: Date;
  totalDays?: number;
}

export function CountdownCircle({ weddingDate, totalDays = 365 }: CountdownCircleProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const daysLeft = Math.max(0, differenceInDays(weddingDate, now));
  const hoursLeft = Math.max(0, differenceInHours(weddingDate, now) % 24);
  const minutesLeft = Math.max(0, differenceInMinutes(weddingDate, now) % 60);
  const secondsLeft = Math.max(0, differenceInSeconds(weddingDate, now) % 60);

  const progress = Math.max(0, Math.min(1, 1 - daysLeft / totalDays));
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="url(#maroonGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="maroonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(340 65% 33%)" />
              <stop offset="100%" stopColor="hsl(38 55% 50%)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Wedding in</span>
          <span className="text-5xl font-bold text-primary tabular-nums mt-1">{daysLeft}</span>
          <span className="text-sm font-medium text-muted-foreground -mt-0.5">Days</span>
          <div className="flex items-center gap-1 mt-2 tabular-nums">
            <span className="text-xs font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
              {String(hoursLeft).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground">:</span>
            <span className="text-xs font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
              {String(minutesLeft).padStart(2, '0')}
            </span>
            <span className="text-xs text-muted-foreground">:</span>
            <span className="text-xs font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">
              {String(secondsLeft).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
