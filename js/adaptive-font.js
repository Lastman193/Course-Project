document.addEventListener('DOMContentLoaded', () => {
  const promotionTitles = document.querySelectorAll('.promotion-item h2'); // Или '.promotion-item-content h2'

  promotionTitles.forEach(title => {
    const containerWidth = title.offsetWidth;
    const textWidth = title.scrollWidth;

    if (textWidth > containerWidth) {
      // Если текст не помещается, уменьшаем размер шрифта
      let currentFontSize = parseFloat(window.getComputedStyle(title, null).getPropertyValue('font-size'));
      const step = 0.1; // Шаг уменьшения размера шрифта

      while (title.scrollWidth > title.offsetWidth && currentFontSize > 1) { // Уменьшаем до 1rem (или другого минимального значения)
        currentFontSize -= step;
        title.style.fontSize = `${currentFontSize}rem`;
      }
    }
  });
});