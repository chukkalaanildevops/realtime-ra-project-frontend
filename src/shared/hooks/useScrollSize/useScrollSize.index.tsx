import { useState, useEffect } from 'react';

interface IScrollSize {
  left: number;
  top: number;
}

export default function useScrollSize(containerSelector: string) {
  function getSize(x?: number, y?: number): IScrollSize {
    return {
      left: x || 0,
      top: y || 0,
    };
  }

  const [scrollSize, setScrollSize] = useState<IScrollSize>(getSize);

  const handleScroll = (container?: Element) => {
    if (container) {
      setScrollSize(getSize(container.scrollLeft, container.scrollTop));
    } else {
      setScrollSize(getSize(window.scrollX, window.scrollY));
    }
  };

  const _componentDidUpdate_EffectFn = () => {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.addEventListener('scroll', handleScroll.bind(null, container));
      return () =>
        container.removeEventListener(
          'scroll',
          handleScroll.bind(null, container),
        );
    } else {
      window.addEventListener('scroll', handleScroll.bind(null, undefined));
      return () =>
        window.removeEventListener(
          'scroll',
          handleScroll.bind(null, undefined),
        );
    }
  };
  useEffect(_componentDidUpdate_EffectFn, []); // Empty array ensures that effect is only run on mount and unmount

  return scrollSize;
}
