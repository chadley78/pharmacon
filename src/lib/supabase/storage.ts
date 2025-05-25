// A simple gray placeholder image as a data URL
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBsb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=='

export async function getSignedUrl(path: string): Promise<string> {
  try {
    const response = await fetch(`/api/images/${encodeURIComponent(path)}`)
    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.statusText}`)
    }
    const data = await response.json()
    return data.url
  } catch (error) {
    console.error('Error getting signed URL:', error)
    return PLACEHOLDER_IMAGE
  }
}

// Helper function to get signed URLs for multiple images
export async function getSignedUrls(paths: string[]): Promise<Record<string, string>> {
  const urls: Record<string, string> = {}
  
  await Promise.all(
    paths.map(async (path) => {
      try {
        urls[path] = await getSignedUrl(path)
      } catch (error) {
        console.error(`Error generating signed URL for ${path}:`, error)
        urls[path] = PLACEHOLDER_IMAGE
      }
    })
  )

  return urls
} 