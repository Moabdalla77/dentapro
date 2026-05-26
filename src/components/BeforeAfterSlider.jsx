import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

export default function BeforeAfterSlider({ before, after, title }) {
  const [position, setPosition] = useState(52);

  return (
    <div className="before-after rounded-lg">
      <img src={after} alt={`${title} after treatment`} className="h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img
          src={before}
          alt={`${title} before treatment`}
          className="h-full w-full object-cover grayscale contrast-90"
        />
      </div>
      <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white">
        <span className="rounded-md bg-stone-950/70 px-3 py-1">Before</span>
        <span className="rounded-md bg-gold/90 px-3 py-1 text-stone-950">After</span>
      </div>
      <div className="before-after-line" style={{ left: `${position}%` }}>
        <span>
          <ArrowLeftRight className="h-5 w-5" />
        </span>
      </div>
      <input
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(event.target.value)}
        className="before-after-range"
        aria-label={`Compare before and after for ${title}`}
      />
    </div>
  );
}
