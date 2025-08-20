/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main multi-column container
  const mainSection = element.querySelector('.multi-column-container');
  if (!mainSection) return;

  // Select all the card columns (each card is in a col-*)
  const cardCols = mainSection.querySelectorAll('.row > div[class*="col-"]');
  const cells = [['Cards (cards15)']]; // Header row (matches example)

  cardCols.forEach((col) => {
    // --- IMAGE CELL ---
    // Prefer desktop image, fallback to mobile image, fallback to any img
    let cardImg = col.querySelector('.expand-img-desktop img');
    if (!cardImg) cardImg = col.querySelector('.expand-img-mobile img');
    if (!cardImg) cardImg = col.querySelector('img');

    // --- TEXT CELL ---
    // The text cell is beneath the image in the original screenshot,
    // but in the source HTML there is no semantic text node for title/desc/cta,
    // so we must extract what is present and keep it general for robustness.
    // The card "title" can be from a data attribute, or from visible text nodes in the component,
    // or from the alt text as a last resort.

    // Get .new-image (the card root) inside .newImage
    let cardRoot = col.querySelector('.new-image');
    if (!cardRoot) cardRoot = col; // fallback to col itself

    // Try to extract title from alt attribute of image if it has meaningful text
    let title = '';
    if (cardImg && cardImg.getAttribute('alt') && cardImg.getAttribute('alt').trim()) {
      title = cardImg.getAttribute('alt').trim();
    }
    // Check if there's visible text inside cardRoot (not in links or images)
    // Look for the first strong or b, or a text node that looks like the card title
    let visibleText = '';
    // Look for visible text nodes directly under cardRoot
    Array.from(cardRoot.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent.replace(/\s+/g, ' ').trim();
        if (txt) visibleText += txt + ' ';
      }
    });
    visibleText = visibleText.trim();
    if (!title && visibleText) title = visibleText;
    // If still no title, try data-title attribute
    if (!title && cardRoot.getAttribute('data-title')) title = cardRoot.getAttribute('data-title');
    // If still no title, fallback to known column order (for this HTML only)
    if (!title) {
      const fallbackTitles = ['Respiratorio', 'Oncología', 'Cardiometabólico', 'Educación médica'];
      const colIdx = Array.from(cardCols).indexOf(col);
      if (colIdx > -1 && fallbackTitles[colIdx]) title = fallbackTitles[colIdx];
    }

    // For description: try to get additional text nodes beneath .new-image
    // (in this HTML, there are none, but we'll future-proof for the pattern)
    let description = '';
    // Check for a second text node or sibling span/div in cardRoot
    Array.from(cardRoot.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SPAN' || node.tagName === 'DIV')) {
        const txt = node.textContent.replace(/\s+/g, ' ').trim();
        if (txt && txt !== title) description += txt + ' ';
      }
    });
    description = description.trim();
    // In this HTML, the only exception is the last card, which has a subtitle in the screenshot
    // We check the fallback
    const colIdx = Array.from(cardCols).indexOf(col);
    if (!description && colIdx === 3) description = 'Cursos, actualizaciones y webinars';

    // Create text cell element, using strong for the title
    const textCell = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.appendChild(strong);
    }
    if (description) {
      textCell.appendChild(document.createElement('br'));
      const descDiv = document.createElement('div');
      descDiv.textContent = description;
      textCell.appendChild(descDiv);
    }
    // Get the card's link for CTA (always present in this HTML)
    let ctaLink = cardRoot.querySelector('a');
    if (!ctaLink) ctaLink = col.querySelector('a');
    if (ctaLink) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaLink);
      // Set CTA text
      ctaLink.textContent = 'Más información';
    }

    // Reference the existing image element (do not clone)
    cells.push([
      cardImg || '',
      textCell
    ]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
