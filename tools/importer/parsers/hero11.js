/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero section
  const heroSection = element.querySelector('.component-section.full-width');
  if (!heroSection) return;
  const inner = heroSection.querySelector('.page-section-inner');
  if (!inner) return;

  // Get all content blocks (children) of .page-section-inner
  const blocks = Array.from(inner.children);

  // Extract the headline (first .text.parbase .rte-node p)
  let titleEl = null;
  for (const block of blocks) {
    if (block.classList.contains('text')) {
      const node = block.querySelector('.rte-node > p.dark-blue-heading');
      if (node) {
        titleEl = node;
        break;
      }
    }
  }

  // Extract the subheading (next .text.parbase .rte-node p.welcome)
  let subheadingEl = null;
  for (const block of blocks) {
    if (block.classList.contains('text')) {
      const node = block.querySelector('.rte-node > p.welcome');
      if (node) {
        subheadingEl = node;
        break;
      }
    }
  }

  // Extract the CTA (the div.download inside a .text.parbase)
  let ctaEl = null;
  for (const block of blocks) {
    if (block.classList.contains('text')) {
      const downloadDiv = block.querySelector('.download');
      if (downloadDiv) {
        ctaEl = downloadDiv;
        break;
      }
    }
  }

  // Compose the content cell in correct order (title, subheading, CTA)
  const contentCell = [];
  if (titleEl) contentCell.push(titleEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  if (ctaEl) contentCell.push(ctaEl);

  // Table construction: header, empty background image, content
  const cells = [
    ['Hero (hero11)'],
    [''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
