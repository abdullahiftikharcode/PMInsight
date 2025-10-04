/**
 * Utility functions for formatting text content with proper HTML structure
 */

/**
 * Formats text content by converting em dashes to bullet points and adding proper paragraph breaks
 * @param content - The raw text content
 * @returns Formatted HTML string
 */
export function formatTextContent(content: string): string {
  if (!content) return '';

  let formatted = content;

  // Step 1: Handle bullet point patterns with em dashes
  // Look for patterns like "text: — item1; — item2; — item3"
  formatted = formatted.replace(
    /([^—\n]+?):\s*—\s*([^—]+?)(?=\s*—\s*|$)/g,
    (match, prefix, items) => {
      // Split items by semicolon and clean them up
      const itemList = items.split(';')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);

      if (itemList.length === 0) return match;

      // Create HTML list
      const listItems = itemList
        .map((item: string) => `<li>${item}${item.endsWith('.') ? '' : '.'}</li>`)
        .join('');

      return `${prefix}:<ul>${listItems}</ul>`;
    }
  );

  // Step 2: Handle standalone bullet points (— at the beginning of sentences)
  // This handles cases where bullet points are not part of a list pattern
  formatted = formatted.replace(
    /—\s*([^—\n]+?)(?=\s*—\s*|$)/g,
    '<li>$1</li>'
  );

  // Step 3: Wrap consecutive <li> elements in <ul> tags
  // This ensures that multiple list items are properly grouped
  formatted = formatted.replace(
    /(<li>.*?<\/li>)(\s*<li>.*?<\/li>)+/g,
    (match) => `<ul>${match}</ul>`
  );

  // Step 4: Handle paragraph breaks
  // Split on sentence endings followed by capital letters
  formatted = formatted.replace(
    /([.!?])\s+([A-Z])/g,
    '$1</p><p>$2'
  );

  // Step 5: Handle line breaks within paragraphs
  formatted = formatted.replace(/\n\s*\n/g, '</p><p>');

  // Step 6: Wrap the entire content in paragraph tags if not already wrapped
  if (!formatted.startsWith('<p>') && !formatted.startsWith('<ul>')) {
    formatted = `<p>${formatted}</p>`;
  }

  // Step 7: Clean up any empty paragraphs
  formatted = formatted.replace(/<p>\s*<\/p>/g, '');
  formatted = formatted.replace(/<p><\/p>/g, '');

  // Step 8: Clean up any malformed HTML
  formatted = formatted.replace(/<p>\s*<ul>/g, '<ul>');
  formatted = formatted.replace(/<\/ul>\s*<\/p>/g, '</ul>');

  // Step 9: Final cleanup
  formatted = formatted.replace(/\s+/g, ' '); // Normalize whitespace
  formatted = formatted.replace(/>\s+</g, '><'); // Remove spaces between tags

  return formatted;
}

/**
 * Formats text content for display in React components
 * @param content - The raw text content
 * @returns Object with formatted HTML and plain text
 */
export function formatContentForDisplay(content: string): {
  formattedHtml: string;
  plainText: string;
} {
  const formattedHtml = formatTextContent(content);
  const plainText = content; // Keep original for fallback

  return {
    formattedHtml,
    plainText
  };
}

/**
 * Safely renders formatted content in React
 * @param content - The raw text content
 * @returns JSX element with formatted content
 */
export function FormattedContent({ content }: { content: string }) {
  const { formattedHtml } = formatContentForDisplay(content);
  
  return {
    type: 'div',
    props: {
      className: 'formatted-content',
      dangerouslySetInnerHTML: { __html: formattedHtml },
      style: {
        lineHeight: '1.6',
        fontSize: '1rem'
      }
    }
  };
}
