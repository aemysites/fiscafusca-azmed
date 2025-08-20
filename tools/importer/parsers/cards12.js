/* global WebImporter */
export default function parse(element, { document }) {
  const multiColumn = element.querySelector('.multi-column-container');
  if (!multiColumn) return;

  const cardColumns = multiColumn.querySelectorAll('.row > div[class*="col-"]');

  const rows = [];
  rows.push(['Cards (cards12)']);

  cardColumns.forEach((col) => {
    // --- Find image ---
    const images = Array.from(col.querySelectorAll('.newImage.parbase'));
    let imgCell = null;
    for (let i = 0; i < images.length; i++) {
      const img = images[i].querySelector('img');
      if (img && !(img.src && img.src.match(/boton|Boton/i) && img.src.match(/\.gif$/i))) {
        imgCell = images[i];
        break;
      }
    }

    // --- Find text/cta content ---
    // Title: first heading inside .text.parbase
    let title = null;
    let description = null;
    let foundTitle = false;
    const allTextSections = Array.from(col.querySelectorAll('.text.parbase'));
    for (let t of allTextSections) {
      const h = t.querySelector('h3, h2, h4');
      if (h && !foundTitle) {
        title = h;
        foundTitle = true;
      }
      // Description: first <p> with non-empty text
      if (!description) {
        // Skip <p> tags that are just whitespace or &nbsp;
        const ps = t.querySelectorAll('p');
        for (let p of ps) {
          if (p.textContent && p.textContent.replace(/\u00a0| |\s/g, '').length > 0) {
            description = p;
            break;
          }
        }
      }
    }
    // If description is missing, synthesize one using button texts
    // Find button texts from .newImage.parbase .gif images if any
    const ctaImages = images.filter((ni) => {
      const img = ni.querySelector('img');
      return img && img.src && img.src.match(/boton|Boton/i) && img.src.match(/\.gif$/i);
    });
    // Synthesize a description for first card if missing
    // If no description and there are ctaImages, create a <p> element listing the CTA button alt texts or fallback text
    if (!description && ctaImages.length > 0) {
      const p = document.createElement('p');
      let btnLabels = [];
      ctaImages.forEach(cta => {
        const img = cta.querySelector('img');
        // Try to extract alt or fallback to generic labels
        let label = img && img.getAttribute('alt') ? img.getAttribute('alt').trim() : '';
        if (!label) {
          // Try to guess from src
          if (img && img.src.match(/registrados/i)) {
            label = 'Acceso usuarios registrados';
          } else if (img && img.src.match(/nuevos/i)) {
            label = 'Registro nuevos usuarios';
          }
        }
        if (label) btnLabels.push(label);
      });
      // Only add synthesized description if we have button labels
      if (btnLabels.length > 0) {
        p.textContent = btnLabels.join(' | ');
        description = p;
      }
    }
    // Compose cell parts
    const cellParts = [];
    if (title) { cellParts.push(title); }
    if (description && (!title || (description !== title))) cellParts.push(description);
    ctaImages.forEach(cta => { cellParts.push(cta); });
    // Only include contentful parts
    const filteredParts = cellParts.filter((el) => {
      if ('classList' in el && el.classList.contains('dynamicText')) {
        return el.textContent.trim().replace(/\u00a0/g, '').length > 0;
      }
      return true;
    });
    rows.push([
      imgCell || '',
      filteredParts.length > 1 ? filteredParts : (filteredParts[0] || '')
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
