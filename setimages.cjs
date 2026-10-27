const fs = require('fs')
const file = 'src/data/catalog.json'
const data = JSON.parse(fs.readFileSync(file, 'utf8'))

const images = {
  // books
  1: 'Pride and Prejudice.jpeg',
  2: 'The Great Gatsby.jpeg',
  4: 'Things Fall Apart.jpeg',
  6: 'Cosmos.jpeg',
  7: 'Selfish Gene.jpeg',
  8: 'Sapiens.jpeg',
  9: 'guns,germs,and steel.jpeg',
  10: 'The pragmite programmer.jpeg',
  11: 'Clean Code.jpeg',
  12: 'Designing Data-Intensive Applications.jpeg',
  25: 'below the barrel.jpg',
  26: 'the kite runner.jpeg',
  27: 'a thousand splendid suns.jpeg',
  28: 'Haruki Murakami.jpeg',

  // accessories
  13: 'eather Bookmarks set 3.jpeg',
  14: 'brass bookmark 2.jpeg',
  15: 'Magnetic Bookmark set 6.jpeg',
  16: 'floating wall shelf.jpeg',
  17: 'table oak shelf.jpeg',
  18: 'The Rolling Cart.jpeg',
  19: 'Foldable Wooden Reading Stand,.jpeg',
  20: 'Page Holder Single Hand.jpeg',
  21: 'Brown Marble Bookends.jpeg',
  22: 'clip on light.jpeg',
  23: 'neck reading light.jpeg',
  24: 'warm led.jpeg',
  29: 'brass bookmark.jpeg',
  30: 'Magnetic Bookmark.jpeg',
}

data.products.forEach((p) => { p.image = images[p.id] || null })
fs.writeFileSync(file, JSON.stringify(data, null, 1))
console.log('done')