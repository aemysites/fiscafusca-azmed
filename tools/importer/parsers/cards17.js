/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column container
  const main = element.querySelector('.multi-column-container');
  if (!main) return;

  // Find all columns (cards)
  const cardColumns = Array.from(main.querySelectorAll(':scope > .row > div[class*="col-"]'));
  const cards = [];

  cardColumns.forEach(col => {
    // Gather image: first .newImage .expand-img-desktop img
    let cardImage = null;
    const imageWrapper = col.querySelector('.newImage.parbase.section');
    if (imageWrapper) {
      const desktopImg = imageWrapper.querySelector('.expand-img-desktop img');
      if (desktopImg) cardImage = desktopImg;
    }

    // Gather title: first .text.parbase.section h3 (may contain a link)
    let cardTitle = null;
    let cardTitleLink = null;
    const textSections = col.querySelectorAll('.text.parbase.section');
    if (textSections[0]) {
      const h3 = textSections[0].querySelector('h3');
      if (h3) {
        const a = h3.querySelector('a');
        if (a) {
          cardTitleLink = a;
        } else {
          cardTitle = h3;
        }
      }
    }

    // Gather description: second .text.parbase.section p
    let cardDesc = null;
    if (textSections[1]) {
      const p = textSections[1].querySelector('p');
      if (p) cardDesc = p;
    }

    // Gather CTA buttons: get all .newImage.parbase.section after image
    const ctaImages = Array.from(col.querySelectorAll('.newImage.parbase.section'));
    // First .newImage is card image, second and third are buttons
    let cta1 = null, cta2 = null;
    if (ctaImages.length > 1) cta1 = ctaImages[1];
    if (ctaImages.length > 2) cta2 = ctaImages[2];
    const ctas = [];
    if (cta1) ctas.push(cta1);
    if (cta2) ctas.push(cta2);

    // Compose text cell content
    const textCellContent = [];
    if (cardTitleLink) textCellContent.push(cardTitleLink);
    else if (cardTitle) textCellContent.push(cardTitle);
    if (cardDesc) textCellContent.push(cardDesc);
    if (ctas.length) textCellContent.push(...ctas);

    // If textCellContent is empty, insert empty string to avoid empty cell
    cards.push([
      cardImage ? cardImage : '',
      textCellContent.length ? (textCellContent.length === 1 ? textCellContent[0] : textCellContent) : ''
    ]);
  });

  // Table header EXACTLY as specified
  const cells = [
    ['Cards (cards17)'],
    ...cards
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
