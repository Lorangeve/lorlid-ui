// - FLIP 动画函数
/**
 * FLIP 动画函数 - 通过记录元素位置变化实现平滑过渡
 * @param refs 元素引用对象
 * @param shuffle 触发位置变化的函数
 */
export function animateFlipping(
  refs: Record<number | string, HTMLElement | null>,
  shuffle: () => void,
) {
  // First
  const firstRects: Record<number, DOMRect> = {};
  for (let [idx, el] of Object.entries(refs)) {
    if (el) firstRects[Number(idx)] = el.getBoundingClientRect();
  }

  shuffle();

  // 等待 DOM 更新
  requestAnimationFrame(() => {
    // Last
    const lastRects: Record<number, DOMRect> = {};
    for (let [idx, el] of Object.entries(refs)) {
      if (el) lastRects[Number(idx)] = el.getBoundingClientRect();
    }

    // Invert
    for (let [idx, el] of Object.entries(refs)) {
      const first = firstRects[Number(idx)];
      const last = lastRects[Number(idx)];

      if (el && first && last) {
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        el.style.transition = "";
      }
    }

    // Play
    requestAnimationFrame(() => {
      for (let el of Object.values(refs)) {
        if (el) {
          el.style.transition = "transform 0.5s";
          el.style.transform = "";
        }
      }
    });
  });
}

/**
 * 随机打乱数组顺序（Fisher-Yates 洗牌算法，简单实现）
 * @param array
 */
export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
