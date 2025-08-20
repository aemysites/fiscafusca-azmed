/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero6)'];

  // 2. Background image: extract from data-background-image or related attribute
  let bgUrl = element.getAttribute('data-background-image') || element.getAttribute('data-img-desktop') || element.getAttribute('data-img-tablet') || element.getAttribute('data-img-mobile');
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    bgImgEl.alt = '';
  }

  // 3. Hero Content: gather all headings, subheadings & paragraphs inside .page-section-inner.container
  let textCellContent = [];
  const contentRoot = element.querySelector('.page-section-inner.container') || element;
  // Try .title.section, but fallback to all heading tags inside
  let foundContent = false;
  const titleSection = contentRoot.querySelector('.title.section') || contentRoot;
  // Find all direct h1, h2, h3, p under titleSection (or nested in one div)
  const contentEls = [];
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].forEach(tag => {
    titleSection.querySelectorAll(tag).forEach(el => {
      contentEls.push(el);
      foundContent = true;
    });
  });
  if (contentEls.length > 0) {
    textCellContent = contentEls;
  }
  // Edge case: if nothing found, just use the contentRoot itself (it will be empty if no text)
  if (!foundContent && contentRoot !== element) {
    textCellContent = [contentRoot];
  }

  // Assemble table rows as per requirements (1 column, 3 rows)
  const rows = [
    headerRow,
    [bgImgEl || ''],
    [textCellContent.length > 0 ? textCellContent : '']
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
