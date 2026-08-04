import { useEffect, useRef, useState } from 'react';

export default function RenderBadge({ label }: { label: string }) {
  const count = useRef(0);
  const badgeRef = useRef<HTMLSpanElement>(null);
  count.current += 1;

  useEffect(() => {
    const e1=badgeRef.current ;
    if(!e1) return ;
    e1.classList.remove('render-badge-flash');
    void e1.offsetWidth; //force reflow so the animation restarts even if the class never left
    e1.classList.add('render-vadge-flash')
  }
   );

  return (
    <span ref={badgeRef} className ="badge rounded-pill bg-secondary render-badge">
      {label}: {count.current}
    </span>
  );
}
