export const SHEET_CSV_URL = import.meta.env.VITE_SHEET_URL ?? ''

export const TAG_KEYWORDS = {
  Furniture: ['furniture', 'couch', 'sofa', 'table', 'chair', 'desk', 'dresser', 'cabinet', 'shelf', 'bookcase', 'recliner', 'ottoman', 'nightstand'],
  Clothing: ['clothing', 'clothes', 'shirt', 'pants', 'dress', 'shoes', 'jacket', 'coat', 'jeans', 'blouse', 'sweater', 'boots', 'socks', 'hats', 'scarves'],
  Tools: ['tools', 'drill', 'saw', 'wrench', 'hammer', 'screwdriver', 'toolbox', 'ladder', 'power tool', 'hand tool', 'level', 'tape measure'],
  Electronics: ['electronics', 'tv', 'television', 'computer', 'laptop', 'phone', 'tablet', 'speaker', 'camera', 'stereo', 'radio', 'printer', 'monitor', 'keyboard'],
  Books: ['books', 'book', 'novel', 'textbook', 'magazine', 'comics', 'paperback', 'hardcover', 'dvd', 'cd', 'vinyl', 'records'],
  Toys: ['toys', 'toy', 'lego', 'puzzle', 'doll', 'action figure', 'stuffed animal', 'plush', 'blocks', 'play'],
  Kitchen: ['kitchen', 'dishes', 'pots', 'pans', 'appliance', 'blender', 'toaster', 'cookware', 'utensils', 'crockpot', 'mixer', 'bakeware', 'cups', 'glasses', 'mugs'],
  Sports: ['sports', 'bicycle', 'bike', 'weights', 'yoga', 'golf', 'tennis', 'camping', 'fishing', 'gym', 'exercise', 'ski', 'snowboard', 'kayak', 'helmet'],
  'Baby/Kids': ['baby', 'kids', 'children', 'stroller', 'crib', 'infant', 'toddler', 'car seat', 'highchair', 'maternity'],
  Jewelry: ['jewelry', 'necklace', 'bracelet', 'earrings', 'ring', 'watch', 'pendant', 'brooch', 'gemstone'],
  Collectibles: ['collectibles', 'collectible', 'figurine', 'coins', 'stamps', 'cards', 'sports cards', 'trading cards', 'memorabilia', 'comic'],
  'Vintage/Antiques': ['vintage', 'antique', 'retro', 'classic', 'mid-century', 'antiques', 'heirloom', 'old'],
  Garden: ['garden', 'plants', 'pots', 'lawn', 'outdoor', 'patio', 'seeds', 'garden tools', 'shovel', 'rake', 'hose', 'planter'],
  Games: ['games', 'board game', 'video game', 'console', 'nintendo', 'playstation', 'xbox', 'card game', 'chess', 'puzzles'],
}

export const ALL_TAGS = Object.keys(TAG_KEYWORDS)
