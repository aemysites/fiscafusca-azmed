/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all columns from the multi-column container (footer)
  function getFooterColumns(root) {
    // Try to find the two columns (Información adicional & Acciones)
    const multiCol = root.querySelector('.multi-column-container.footerCol-2');
    if (!multiCol) return [];
    const row = multiCol.querySelector('.row');
    if (!row) return [];
    return Array.from(row.querySelectorAll(':scope > div'));
  }

  // Column 1: left area (brand and disclaimer)
  const leftCol = element.querySelector('.col-sm-4');
  let leftCell = [];
  if (leftCol) {
    // Branding/title
    const brandLink = leftCol.querySelector('a.footer-brand');
    if (brandLink) leftCell.push(brandLink);
    // Footer disclaimer paragraph
    const para = leftCol.querySelector('p.footer-p');
    if (para) leftCell.push(para);
  }

  // Column 2/3: footer columns (Información adicional, Acciones)
  const footerCols = getFooterColumns(element);

  // Información adicional
  let infoCell = [];
  if (footerCols[0]) {
    // Gather h3, hr, ul (if exists)
    const h3 = footerCols[0].querySelector('h3');
    if (h3) infoCell.push(h3);
    const hr = footerCols[0].querySelector('hr');
    if (hr) infoCell.push(hr);
    const ul = footerCols[0].querySelector('ul');
    if (ul) infoCell.push(ul);
  }

  // Acciones
  let actionsCell = [];
  if (footerCols[1]) {
    const h3 = footerCols[1].querySelector('h3');
    if (h3) actionsCell.push(h3);
    const hr = footerCols[1].querySelector('hr');
    if (hr) actionsCell.push(hr);
    const ul = footerCols[1].querySelector('ul');
    if (ul) actionsCell.push(ul);
  }

  // Table header as specified in the example
  const headerRow = ['Columns (columns4)'];
  const cells = [headerRow, [leftCell, infoCell, actionsCell]];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
