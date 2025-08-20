/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header
  const headerRow = ['Cards (cards16)'];
  const cells = [headerRow];

  // Find all columns (cards)
  const cardColumns = element.querySelectorAll('.multi-column-container > .row > [class*="col-"]');

  cardColumns.forEach((col) => {
    // --- IMAGE ---
    let imgEl = null;
    const newImageSection = col.querySelector('.newImage.parbase.section');
    if (newImageSection) {
      // Prefer desktop image
      let img = newImageSection.querySelector('.expand-img-desktop img');
      if (!img) {
        img = newImageSection.querySelector('.expand-img-mobile img');
      }
      if (img) {
        imgEl = img;
      }
    }

    // --- TITLE ---
    let titleNode = null;
    // Find the first .text.parbase.section .rte-node h3 (or fallback to first .text.parbase.section .rte-node)
    const textSections = Array.from(col.querySelectorAll('.text.parbase.section .rte-node'));
    if (textSections.length > 0) {
      const h3 = textSections[0].querySelector('h3');
      if (h3) {
        titleNode = h3;
      } else {
        titleNode = textSections[0];
      }
    }

    // --- DESCRIPTION ---
    let descNode = null;
    if (textSections.length > 1) {
      // Second text section is typically the description
      // Prefer p, but fallback to the section
      const p = textSections[1].querySelector('p');
      descNode = p || textSections[1];
    }

    // --- CTA BUTTON ---
    let ctaNode = null;
    // Find a button within dynamicText section
    const btnSection = col.querySelector('.dynamicText.parbase.section .rte-node button');
    if (btnSection) {
      ctaNode = btnSection;
    }

    // --- Compose text cell content ---
    const textCell = [];
    if (titleNode) textCell.push(titleNode);
    if (descNode) textCell.push(descNode);
    if (ctaNode) textCell.push(ctaNode);

    // Even if some elements are missing, still push a row
    cells.push([
      imgEl, // may be null
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
