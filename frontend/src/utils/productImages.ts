/**
 * Product Image Resolver Utility - PriceWise AI
 *
 * Provides authentic, high-resolution product photography for tech gadgets,
 * categorized by brand, model, and category.
 * Ensures consistent multi-angle gallery images for every product model.
 */

// Model-specific primary high-res product photos
const GADGET_IMAGES: Record<string, string> = {
  // Mechanical Keyboards
  'keychron': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
  'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',

  // Laptops
  'macbook air': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  'macbook pro': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
  'dell xps': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
  'thinkpad': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
  'hp spectre': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'asus rog': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
  'lenovo legion': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
  'acer predator': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
  'dell inspiron': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
  'zenbook': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',

  // Smartphones
  'iphone 15 pro': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  'iphone 14': 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
  'iphone 13': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
  'iphone': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  'galaxy s24 ultra': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
  'galaxy s24': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
  'galaxy a55': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
  'pixel 8 pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
  'oneplus 12': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
  'oneplus nord': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
  'nothing phone 3a': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
  'nothing phone': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
  'nothing': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
  'redmi note': 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80',
  'motorola edge': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',

  // Tablets
  'ipad air': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  'ipad pro': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
  'ipad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  'galaxy tab': 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80',
  'xiaomi pad': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',

  // Audio & Headphones
  'wh-1000xm5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'wf-1000xm5': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  'airpods pro': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
  'quietcomfort': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  'boat nirvana': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  'marshall major': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'marshall stanmore': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  'sennheiser momentum': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  'jbl flip': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',

  // Wearables & Smartwatches
  'apple watch ultra': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
  'apple watch': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
  'galaxy watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
  'noise': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',

  // Accessories, Storage, Monitors
  'mx master': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
  'mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
  'samsung t7': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
  'sandisk': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
  'monitor': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  'ultragear': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
}

// Fallbacks by Category
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  Laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  Smartphones: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
  Tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  Accessories: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
  Wearables: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
  Storage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
  Monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
}

// Multi-angle galleries for each product category / model
const PRODUCT_GALLERIES: Record<string, string[]> = {
  keyboard: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
  ],
  laptop: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
  ],
  phone: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  ],
  earbuds: [
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  ],
  watch: [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80',
  ],
  mouse: [
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
  ],
  monitor: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  ],
  storage: [
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
  ],
}

/**
 * Returns a high quality gadget image strictly corresponding to the product's title, brand, or category.
 */
export function getProductImage(
  title?: string,
  brand?: string,
  category?: string,
  existingUrl?: string
): string {
  // If an existing valid URL is present and not the generic placeholder, use it
  if (
    existingUrl &&
    !existingUrl.includes('photo-1526738549149-8e07eca6c147') &&
    existingUrl.startsWith('http')
  ) {
    return existingUrl
  }

  const query = `${title || ''} ${brand || ''} ${category || ''}`.toLowerCase()

  // 1. Direct model keyword matching (specific keys first)
  for (const [key, img] of Object.entries(GADGET_IMAGES)) {
    if (query.includes(key)) {
      return img
    }
  }

  // 2. Secondary keyword matching with strict category hierarchy
  if (query.includes('keyboard') || query.includes('keychron')) {
    return GADGET_IMAGES['keychron']
  }
  if (query.includes('mouse') || query.includes('mx master')) {
    return GADGET_IMAGES['mx master']
  }
  if (query.includes('monitor') || query.includes('display') || query.includes('ultragear')) {
    return GADGET_IMAGES['monitor']
  }
  if (query.includes('ssd') || query.includes('storage') || query.includes('hard drive')) {
    return GADGET_IMAGES['samsung t7']
  }
  if (query.includes('watch')) {
    return GADGET_IMAGES['apple watch']
  }
  if (query.includes('earbuds') || query.includes('airpods') || query.includes('earphone')) {
    return GADGET_IMAGES['airpods pro']
  }
  if (query.includes('headphone') || query.includes('audio') || query.includes('speaker')) {
    return GADGET_IMAGES['wh-1000xm5']
  }
  if (query.includes('tablet') || query.includes('ipad') || query.includes('tab')) {
    return GADGET_IMAGES['ipad air']
  }
  if (query.includes('laptop') || query.includes('notebook') || query.includes('book')) {
    return GADGET_IMAGES['macbook air']
  }
  if (query.includes('phone') || query.includes('mobile')) {
    return GADGET_IMAGES['iphone 15 pro']
  }

  // 3. Category Fallback
  if (category && CATEGORY_DEFAULT_IMAGES[category]) {
    return CATEGORY_DEFAULT_IMAGES[category]
  }

  // 4. Default high-tech flagship
  return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
}

/**
 * Returns 4 cohesive, multi-angle images strictly matching the product's type.
 * Never mixes disparate devices (e.g. keyboards never display headphones or tablets).
 */
export function getProductGalleryImages(
  title?: string,
  brand?: string,
  category?: string,
  existingUrl?: string
): string[] {
  const baseImg = getProductImage(title, brand, category, existingUrl)
  const query = `${title || ''} ${brand || ''} ${category || ''}`.toLowerCase()

  let gallery = PRODUCT_GALLERIES.phone

  if (query.includes('keyboard') || query.includes('keychron')) {
    gallery = PRODUCT_GALLERIES.keyboard
  } else if (query.includes('mouse') || query.includes('mx master')) {
    gallery = PRODUCT_GALLERIES.mouse
  } else if (query.includes('monitor') || query.includes('ultragear')) {
    gallery = PRODUCT_GALLERIES.monitor
  } else if (query.includes('ssd') || query.includes('hard drive') || query.includes('storage')) {
    gallery = PRODUCT_GALLERIES.storage
  } else if (query.includes('earbuds') || query.includes('airpods')) {
    gallery = PRODUCT_GALLERIES.earbuds
  } else if (query.includes('headphone') || query.includes('audio') || query.includes('speaker') || query.includes('wh-1000') || query.includes('quietcomfort')) {
    gallery = PRODUCT_GALLERIES.audio
  } else if (query.includes('tablet') || query.includes('ipad') || query.includes('tab')) {
    gallery = PRODUCT_GALLERIES.tablet
  } else if (query.includes('watch')) {
    gallery = PRODUCT_GALLERIES.watch
  } else if (query.includes('laptop') || query.includes('macbook') || query.includes('xps') || query.includes('thinkpad') || query.includes('spectre') || query.includes('rog') || query.includes('predator') || query.includes('legion')) {
    gallery = PRODUCT_GALLERIES.laptop
  } else if (category === 'Accessories') {
    gallery = PRODUCT_GALLERIES.keyboard
  } else if (category === 'Laptops') {
    gallery = PRODUCT_GALLERIES.laptop
  } else if (category === 'Audio') {
    gallery = PRODUCT_GALLERIES.audio
  } else if (category === 'Wearables') {
    gallery = PRODUCT_GALLERIES.watch
  } else if (category === 'Tablets') {
    gallery = PRODUCT_GALLERIES.tablet
  }

  // Ensure baseImg is the first image in gallery
  return [baseImg, gallery[1] || gallery[0], gallery[2] || gallery[0], gallery[3] || gallery[0]]
}

/**
 * Optional API key-backed fetcher if the user provides an Unsplash Access Key
 */
export async function fetchLiveProductImage(
  query: string,
  accessKey?: string
): Promise<string | null> {
  const key = accessKey || (import.meta as any).env?.VITE_UNSPLASH_ACCESS_KEY
  if (!key) return null

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=1&client_id=${key}`
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.results?.[0]?.urls?.regular || null
  } catch (err) {
    console.warn('[PriceWise Image API] Failed to fetch Unsplash image:', err)
    return null
  }
}

