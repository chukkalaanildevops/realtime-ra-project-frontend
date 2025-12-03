import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  const handleResize = () => {
    setWindowSize(getSize());
  };

  const _componentDidUpdate_EffectFn = () => {
    if (isClient) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  };
  useEffect(_componentDidUpdate_EffectFn, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
