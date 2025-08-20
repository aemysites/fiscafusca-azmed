/* global WebImporter */
export default function parse(element, { document }) {
  // Table header per block spec
  const headerRow = ['Cards (cards18)'];
  const rows = [];
  const multiCol = element.querySelector('.multi-column-container');
  if (!multiCol) return;
  // Find all columns in the row
  const cols = multiCol.querySelectorAll(':scope > .row > div[class*="col-"]');
  cols.forEach((col) => {
    // --- IMAGE ---
    let img = null;
    // Prefer desktop image
    const expandImgDesktop = col.querySelector('.newImage .expand-img-desktop img');
    const expandImgMobile = col.querySelector('.newImage .expand-img-mobile img');
    if (expandImgDesktop) {
      img = expandImgDesktop;
    } else if (expandImgMobile) {
      img = expandImgMobile;
    } else {
      // fallback to any img inside .newImage
      const fallbackImg = col.querySelector('.newImage img');
      if (fallbackImg) img = fallbackImg;
    }

    // --- TEXT (title/link) ---
    // Title is inside .text .rte-node h3 or h2 or h1
    let title = null;
    let titleEl = null;
    const textNode = col.querySelector('.text .rte-node');
    if (textNode) {
      titleEl = textNode.querySelector('h3, h2, h1');
      if (titleEl) {
        title = titleEl;
      }
    }

    // --- CTA BUTTON ---
    // Find any <button> inside a dynamicText .rte-node
    let button = null;
    const dynTexts = col.querySelectorAll('.dynamicText .rte-node');
    for (const dyn of dynTexts) {
      const btn = dyn.querySelector('button');
      if (btn) {
        button = btn;
        break;
      }
    }

    // Compose text cell elements
    const textCell = [];
    if (title) textCell.push(title);
    if (button) textCell.push(button);
    // Only create row if both image and text content are present
    if (img && textCell.length > 0) {
      rows.push([img, textCell]);
    }
  });

  if (rows.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
