/* Catalogue data: colours, sizes, categories and the 13 sample products */
var COLORS = { sage: ['Sage', '#5d7f6c'], sand: ['Sand', '#b9a36e'], ink: ['Ink', '#2c3550'], sea: ['Sea', '#3f7d8f'], plum: ['Plum', '#7a4568'], clay: ['Clay', '#b0644f'] };
var SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '40', '41', '42', '43', 'One size'];
var CATS = [['all', 'All'], ['women', 'Women'], ['men', 'Men'], ['accessories', 'Accessories'], ['footwear', 'Footwear']];
var CAT_LABEL = { women: 'Women', men: 'Men', accessories: 'Accessories', footwear: 'Footwear' };
var P = [
  { id: 'linen-shirt', name: 'Linen Shirt', cat: 'men', type: 'Shirt', price: 2490, sym: 'shirt', vb: '0 0 220 260', colors: ['sage', 'sand', 'ink'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], tag: 'New', kw: 'top' },
  { id: 'poplin-shirt', name: 'Poplin Shirt', cat: 'men', type: 'Shirt', price: 2190, sym: 'shirt', vb: '0 0 220 260', colors: ['sea', 'ink', 'sand'], sizes: ['S', 'M', 'L', 'XL'], kw: 'cotton top' },
  { id: 'overshirt', name: 'Overshirt Jacket', cat: 'men', type: 'Jacket', price: 4990, sym: 'coat', vb: '0 0 220 340', colors: ['ink', 'sage'], sizes: ['M', 'L', 'XL', 'XXL'], kw: 'outerwear coat' },
  { id: 'wrap-dress', name: 'Wrap Dress', cat: 'women', type: 'Dress', price: 4290, sym: 'dress', vb: '0 0 200 320', colors: ['plum', 'clay', 'ink'], sizes: ['XS', 'S', 'M', 'L'], tag: 'New', kw: '' },
  { id: 'midi-dress', name: 'Midi Dress', cat: 'women', type: 'Dress', price: 3890, sym: 'dress', vb: '0 0 200 320', colors: ['sage', 'sea'], sizes: ['XS', 'S', 'M', 'L', 'XL'], kw: '' },
  { id: 'festive-dress', name: 'Festive Dress', cat: 'women', type: 'Dress', price: 5490, sym: 'dress', vb: '0 0 200 320', colors: ['plum', 'sand'], sizes: ['S', 'M', 'L'], tag: 'Limited', kw: 'party occasion' },
  { id: 'trousers', name: 'Tailored Trousers', cat: 'women', type: 'Trousers', price: 2990, sym: 'trouser', vb: '0 0 160 300', colors: ['ink', 'sand'], sizes: ['XS', 'S', 'M', 'L', 'XL'], kw: 'pants' },
  { id: 'long-coat', name: 'Long Coat', cat: 'women', type: 'Coat', price: 5990, sym: 'coat', vb: '0 0 220 340', colors: ['ink', 'clay'], sizes: ['S', 'M', 'L'], tag: 'New', kw: 'outerwear jacket' },
  { id: 'crossbody', name: 'Crossbody Bag', cat: 'accessories', type: 'Bag', price: 3490, sym: 'bag', vb: '0 0 220 220', colors: ['clay', 'ink', 'sand'], sizes: ['One size'], kw: 'handbag leather' },
  { id: 'tote', name: 'Everyday Tote', cat: 'accessories', type: 'Bag', price: 2790, sym: 'bag', vb: '0 0 220 220', colors: ['sand', 'sage'], sizes: ['One size'], kw: 'handbag' },
  { id: 'cap', name: 'Canvas Cap', cat: 'accessories', type: 'Cap', price: 990, sym: 'cap', vb: '0 0 240 140', colors: ['ink', 'sea', 'sand'], sizes: ['One size'], kw: 'hat' },
  { id: 'sneakers', name: 'Leather Sneakers', cat: 'footwear', type: 'Sneakers', price: 5990, sym: 'shoe', vb: '0 0 260 140', colors: ['ink', 'sand'], sizes: ['40', '41', '42', '43'], kw: 'shoes' },
  { id: 'loafers', name: 'Suede Loafers', cat: 'footwear', type: 'Loafers', price: 4690, sym: 'shoe', vb: '0 0 260 140', colors: ['clay', 'ink'], sizes: ['40', '41', '42', '43'], kw: 'shoes' }
];
var MAXP = 6000;
