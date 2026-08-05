import { useRef } from 'react';
/** Counts renders without causing one — makes re-render scope visible. */
export function useRenderCount(name: string): number {
  const n = useRef(0);
  n.current += 1;
  console.log(`%c RENDER %c ${name} #${n.current}`,
    'background:#185FA5;color:#fff;padding:1px 5px;border-radius:3px', '');
  return n.current;
}
