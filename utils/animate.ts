/**
 * FLIP 动画函数 - 通过记录元素位置变化实现平滑过渡
 * @param refs 元素引用对象
 * @param shuffle 触发位置变化的函数
 */
export function animateFlipping(
  firstRefs: Record<number, HTMLElement | null>,
  lastRefs: Record<number, HTMLElement | null>,
) {
  // First
  const firstRects: Record<number, DOMRect> = {};
  for (let [idx, el] of Object.entries(firstRefs)) {
    if (el) firstRects[Number(idx)] = el.getBoundingClientRect();
  }

  // 等待 DOM 更新
  requestAnimationFrame(() => {
    // Last
    const lastRects: Record<number, DOMRect> = {};
    for (let [idx, el] of Object.entries(lastRefs)) {
      if (el) lastRects[Number(idx)] = el.getBoundingClientRect();
    }

    // Invert
    for (let [idx, el] of Object.entries(lastRefs)) {
      const first = firstRects[Number(idx)];
      const last = lastRects[Number(idx)];

      if (el && first && last) {
        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;
        (el as HTMLElement).style.transform =
          `translate(${deltaX}px, ${deltaY}px)`;
        (el as HTMLElement).style.transition = "";
      }
    }

    // Play
    requestAnimationFrame(() => {
      for (let el of Object.values(lastRefs)) {
        if (el) {
          (el as HTMLElement).style.transition = "transform 0.5s";
          (el as HTMLElement).style.transform = "";
        }
      }
    });
  });
}
