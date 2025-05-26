const MALE_PRODUCT_IMAGE = 'https://qitxftuzktzxbkacneve.supabase.co/storage/v1/object/sign/imagery/blue%20pill.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2IyMWZiMzgwLWY3MjQtNGYwMy1iOWZmLWQ2ODQwNTM2NzI0OSJ9.eyJ1cmwiOiJpbWFnZXJ5L2JsdWUgcGlsbC5wbmciLCJpYXQiOjE3NDgyNzA4MTksImV4cCI6MTc3OTgwNjgxOX0.F3Nu5-ggl1-g1chrxJ5cPOaWD2Ki3D-axAd25pd7eJY'
const FEMALE_PRODUCT_IMAGE = 'https://qitxftuzktzxbkacneve.supabase.co/storage/v1/object/sign/imagery/pink%20pill.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2IyMWZiMzgwLWY3MjQtNGYwMy1iOWZmLWQ2ODQwNTM2NzI0OSJ9.eyJ1cmwiOiJpbWFnZXJ5L3BpbmsgcGlsbC5wbmciLCJpYXQiOjE3NDgyNzEwOTksImV4cCI6MTc3OTgwNzA5OX0.pPSxX96_VcN5UD2fpP88tUcj5h1MMGDL-hHpNEweFjU'
const REPLENS_PRODUCT_IMAGE = 'https://qitxftuzktzxbkacneve.supabase.co/storage/v1/object/sign/imagery/mixpill.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2IyMWZiMzgwLWY3MjQtNGYwMy1iOWZmLWQ2ODQwNTM2NzI0OSJ9.eyJ1cmwiOiJpbWFnZXJ5L21peHBpbGwucG5nIiwiaWF0IjoxNzQ4MjczOTYwLCJleHAiOjE3Nzk4MDk5NjB9.Demh553MTqM-K8IkOb1dvWdnpD42iFLZKhEbFylR0-Y'

export function getProductImageUrl(product: { image_url: string | null, gender: 'male' | 'female' | 'either' | null, name?: string }) {
  // Check for specific product names first
  if (product.name?.toLowerCase().includes('replens')) {
    return REPLENS_PRODUCT_IMAGE
  }
  
  // Then check gender-based images
  if (product.gender === 'male') {
    return MALE_PRODUCT_IMAGE
  }
  if (product.gender === 'female') {
    return FEMALE_PRODUCT_IMAGE
  }
  return product.image_url
} 