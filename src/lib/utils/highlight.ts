/**
 * Highlights search terms in text by wrapping them in a mark tag
 * @param text The text to highlight
 * @param searchTerm The search term to highlight
 * @returns HTML string with highlighted terms
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm || !text) return text

  // Escape special characters in the search term for use in a regex
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  
  // Create a case-insensitive regex that matches whole words
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')
  
  // Replace matches with highlighted spans
  return text.replace(regex, '<mark class="bg-yellow-100 text-yellow-800 px-0.5 rounded">$1</mark>')
} 