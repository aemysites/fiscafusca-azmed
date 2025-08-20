/* global WebImporter */
export default function parse(element, { document }) {
  // Find main hero section (flexible for variants)
  let section = element.querySelector('.component-section.full-width.container');
  if (!section) section = element;

  // --- Extract background image ---
  let imageEl = null;
  // Try new image block
  let newImageSection = section.querySelector('.newImage .new-image');
  if (!newImageSection) {
    // Fallback: try any image in section
    newImageSection = section;
  }

  // Prefer desktop image, then mobile, then any img
  const desktopImg = newImageSection.querySelector('.expand-img-desktop img');
  const mobileImg = newImageSection.querySelector('.expand-img-mobile img');
  if (desktopImg) {
    imageEl = desktopImg;
  } else if (mobileImg) {
    imageEl = mobileImg;
  } else {
    // fallback: first img in section
    const anyImg = newImageSection.querySelector('img');
    if (anyImg) imageEl = anyImg;
  }

  // --- Extract text content: headings, paragraphs, lists, links ---
  // Only include elements with actual textual content
  const textContentElements = [];

  // Select common block-level elements typically used for hero copy
  const candidates = section.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, a, span, strong, em');
  candidates.forEach(el => {
    // Exclude images, empty, and structural elements
    if (el.textContent && el.textContent.trim()) {
      textContentElements.push(el);
    }
  });

  // If no text found, fallback to any div with text
  if (textContentElements.length === 0) {
    section.querySelectorAll('div').forEach(div => {
      // Only top-level divs with text, not structural wrappers
      if (div.textContent && div.textContent.trim() && div.children.length === 0) {
        textContentElements.push(div);
      }
    });
  }

  // Ensure semantic meaning is kept (referencing elements directly)
  const textContentCell = textContentElements.length ? textContentElements : [''];

  // Construct table rows
  const rows = [];
  // Header row (exact)
  rows.push(['Hero (hero21)']);
  // Row with image (can be empty)
  rows.push([imageEl || '']);
  // Row with text content (can be empty)
  rows.push([textContentCell]);

  // Create table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}