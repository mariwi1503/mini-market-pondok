export interface Product {
  id: string;
  name: string;
  handle: string;
  description: string;
  price: number; // in rupiah
  image: string;
  category: string;
  categoryId: string;
  stock: number;
  unit: string;
  discount?: number;
  isPromo?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  handle: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'makanan', name: 'Makanan', icon: '🍜', handle: 'makanan', color: '#E8F5E9' },
  { id: 'minuman', name: 'Minuman', icon: '🥤', handle: 'minuman', color: '#E3F2FD' },
  { id: 'snack', name: 'Snack', icon: '🍪', handle: 'snack', color: '#FFF3E0' },
  { id: 'bumbu', name: 'Bumbu Dapur', icon: '🧂', handle: 'bumbu-dapur', color: '#FCE4EC' },
  { id: 'harian', name: 'Kebutuhan Harian', icon: '🧴', handle: 'kebutuhan-harian', color: '#F3E5F5' },
  { id: 'sholat', name: 'Perlengkapan Sholat', icon: '🕌', handle: 'perlengkapan-sholat', color: '#E8EAF6' },
];

export const products: Product[] = [
  // Makanan
  {
    id: 'p1',
    name: 'Indomie Goreng',
    handle: 'indomie-goreng',
    description: 'Mie instan goreng favorit semua orang. Rasa original yang selalu nikmat.',
    price: 3500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158297915_ce369148.jpg',
    category: 'Makanan',
    categoryId: 'makanan',
    stock: 100,
    unit: 'pcs',
    isPromo: true,
    discount: 10,
  },
  {
    id: 'p2',
    name: 'Indomie Kuah Soto',
    handle: 'indomie-kuah-soto',
    description: 'Mie instan kuah rasa soto yang hangat dan lezat.',
    price: 3500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158421045_941d0078.jpg',
    category: 'Makanan',
    categoryId: 'makanan',
    stock: 80,
    unit: 'pcs',
  },
  {
    id: 'p3',
    name: 'Mie Sedaap Goreng',
    handle: 'mie-sedaap-goreng',
    description: 'Mie instan goreng dengan bumbu khas yang sedap.',
    price: 3000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158407523_756ad525.jpg',
    category: 'Makanan',
    categoryId: 'makanan',
    stock: 60,
    unit: 'pcs',
  },
  {
    id: 'p4',
    name: 'Sarimi Isi 2',
    handle: 'sarimi-isi-2',
    description: 'Mie instan isi 2 yang mengenyangkan.',
    price: 4000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158306897_c26aff1a.jpg',
    category: 'Makanan',
    categoryId: 'makanan',
    stock: 45,
    unit: 'pcs',
    isPromo: true,
    discount: 15,
  },
  // Minuman
  {
    id: 'p5',
    name: 'Aqua 600ml',
    handle: 'aqua-600ml',
    description: 'Air mineral murni Aqua kemasan 600ml.',
    price: 4000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158450436_2f77e031.png',
    category: 'Minuman',
    categoryId: 'minuman',
    stock: 200,
    unit: 'botol',
  },
  {
    id: 'p6',
    name: 'Teh Botol Sosro',
    handle: 'teh-botol-sosro',
    description: 'Teh manis dalam kemasan botol yang menyegarkan.',
    price: 5000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158442376_1186dccd.jpg',
    category: 'Minuman',
    categoryId: 'minuman',
    stock: 150,
    unit: 'botol',
    isPromo: true,
    discount: 5,
  },
  {
    id: 'p7',
    name: 'Pocari Sweat 500ml',
    handle: 'pocari-sweat-500ml',
    description: 'Minuman isotonik pengganti ion tubuh.',
    price: 8000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158442337_9cec066c.jpg',
    category: 'Minuman',
    categoryId: 'minuman',
    stock: 75,
    unit: 'botol',
  },
  {
    id: 'p8',
    name: 'Susu Ultra 250ml',
    handle: 'susu-ultra-250ml',
    description: 'Susu UHT segar dalam kemasan kotak.',
    price: 6500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158568121_585040ed.jpg',
    category: 'Minuman',
    categoryId: 'minuman',
    stock: 90,
    unit: 'kotak',
  },
  {
    id: 'p9',
    name: 'Kopi Good Day 250ml',
    handle: 'kopi-good-day-250ml',
    description: 'Kopi susu siap minum dalam kemasan botol.',
    price: 7000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158448615_cb874e26.jpg',
    category: 'Minuman',
    categoryId: 'minuman',
    stock: 60,
    unit: 'botol',
  },
  {
    id: 'p10',
    name: 'Sprite 390ml',
    handle: 'sprite-390ml',
    description: 'Minuman bersoda rasa lemon-lime yang menyegarkan.',
    price: 6000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158446998_b76d3f7d.jpg',
    category: 'Minuman',
    categoryId: 'minuman',
    stock: 80,
    unit: 'botol',
  },
  // Snack
  {
    id: 'p11',
    name: 'Chitato Sapi Panggang',
    handle: 'chitato-sapi-panggang',
    description: 'Keripik kentang rasa sapi panggang yang renyah.',
    price: 10000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158625171_6a96ce41.jpg',
    category: 'Snack',
    categoryId: 'snack',
    stock: 50,
    unit: 'pcs',
    isPromo: true,
    discount: 20,
  },
  {
    id: 'p12',
    name: 'Taro Net',
    handle: 'taro-net',
    description: 'Snack net rasa rumput laut yang gurih.',
    price: 5000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158625215_0b929883.jpg',
    category: 'Snack',
    categoryId: 'snack',
    stock: 70,
    unit: 'pcs',
  },
  {
    id: 'p13',
    name: 'Oreo Original',
    handle: 'oreo-original',
    description: 'Biskuit sandwich coklat dengan krim vanilla.',
    price: 8500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158624192_b1d968f3.jpg',
    category: 'Snack',
    categoryId: 'snack',
    stock: 40,
    unit: 'pcs',
  },
  {
    id: 'p14',
    name: 'Richeese Nabati',
    handle: 'richeese-nabati',
    description: 'Wafer keju yang renyah dan lezat.',
    price: 4000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158624266_29dacbf6.jpg',
    category: 'Snack',
    categoryId: 'snack',
    stock: 55,
    unit: 'pcs',
  },
  {
    id: 'p15',
    name: 'Beng-Beng',
    handle: 'beng-beng',
    description: 'Wafer karamel berlapis coklat yang nikmat.',
    price: 3000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158629323_5a28837d.png',
    category: 'Snack',
    categoryId: 'snack',
    stock: 80,
    unit: 'pcs',
  },
  {
    id: 'p16',
    name: 'Lays Classic',
    handle: 'lays-classic',
    description: 'Keripik kentang rasa original yang gurih.',
    price: 12000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158624464_6c7ef0f1.jpg',
    category: 'Snack',
    categoryId: 'snack',
    stock: 35,
    unit: 'pcs',
  },
  // Bumbu Dapur
  {
    id: 'p17',
    name: 'Kecap Manis ABC',
    handle: 'kecap-manis-abc',
    description: 'Kecap manis kualitas terbaik untuk masakan.',
    price: 15000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158301147_e8410cac.jpg',
    category: 'Bumbu Dapur',
    categoryId: 'bumbu',
    stock: 30,
    unit: 'botol',
  },
  {
    id: 'p18',
    name: 'Minyak Goreng Bimoli 1L',
    handle: 'minyak-goreng-bimoli',
    description: 'Minyak goreng sawit berkualitas 1 liter.',
    price: 18000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158302946_cac90ec8.jpg',
    category: 'Bumbu Dapur',
    categoryId: 'bumbu',
    stock: 25,
    unit: 'botol',
    isPromo: true,
    discount: 10,
  },
  {
    id: 'p19',
    name: 'Gula Pasir 1kg',
    handle: 'gula-pasir-1kg',
    description: 'Gula pasir putih berkualitas untuk kebutuhan dapur.',
    price: 16000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158304948_59fda262.jpg',
    category: 'Bumbu Dapur',
    categoryId: 'bumbu',
    stock: 40,
    unit: 'kg',
  },
  {
    id: 'p20',
    name: 'Garam Dapur 250g',
    handle: 'garam-dapur-250g',
    description: 'Garam dapur beryodium untuk masakan sehari-hari.',
    price: 5000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158304121_6b6fcaaf.jpg',
    category: 'Bumbu Dapur',
    categoryId: 'bumbu',
    stock: 60,
    unit: 'pcs',
  },
  // Kebutuhan Harian
  {
    id: 'p21',
    name: 'Sabun Lifebuoy',
    handle: 'sabun-lifebuoy',
    description: 'Sabun mandi antibakteri untuk kebersihan keluarga.',
    price: 4500,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158305069_eb126f5d.jpg',
    category: 'Kebutuhan Harian',
    categoryId: 'harian',
    stock: 50,
    unit: 'pcs',
  },
  {
    id: 'p22',
    name: 'Pasta Gigi Pepsodent',
    handle: 'pasta-gigi-pepsodent',
    description: 'Pasta gigi untuk gigi kuat dan sehat.',
    price: 12000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158445629_3d3d8390.jpg',
    category: 'Kebutuhan Harian',
    categoryId: 'harian',
    stock: 35,
    unit: 'pcs',
  },
  {
    id: 'p23',
    name: 'Shampo Sunsilk',
    handle: 'shampo-sunsilk',
    description: 'Shampo untuk rambut lembut dan berkilau.',
    price: 14000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158447837_3ffea4a7.jpg',
    category: 'Kebutuhan Harian',
    categoryId: 'harian',
    stock: 40,
    unit: 'botol',
  },
  {
    id: 'p24',
    name: 'Deterjen Rinso 900g',
    handle: 'deterjen-rinso-900g',
    description: 'Deterjen bubuk untuk cucian bersih dan wangi.',
    price: 22000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158446941_4e8fa6f3.jpg',
    category: 'Kebutuhan Harian',
    categoryId: 'harian',
    stock: 20,
    unit: 'pcs',
    isPromo: true,
    discount: 12,
  },
  // Perlengkapan Sholat
  {
    id: 'p25',
    name: 'Sajadah Travel',
    handle: 'sajadah-travel',
    description: 'Sajadah lipat praktis untuk dibawa bepergian.',
    price: 35000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158599090_9af8bc6b.jpg',
    category: 'Perlengkapan Sholat',
    categoryId: 'sholat',
    stock: 15,
    unit: 'pcs',
  },
  {
    id: 'p26',
    name: 'Peci Hitam',
    handle: 'peci-hitam',
    description: 'Peci hitam polos berkualitas untuk ibadah.',
    price: 25000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158594345_8fd8ce14.jpg',
    category: 'Perlengkapan Sholat',
    categoryId: 'sholat',
    stock: 20,
    unit: 'pcs',
  },
  {
    id: 'p27',
    name: 'Tasbih Digital',
    handle: 'tasbih-digital',
    description: 'Tasbih digital penghitung dzikir elektronik.',
    price: 15000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158594087_4940cdaa.jpg',
    category: 'Perlengkapan Sholat',
    categoryId: 'sholat',
    stock: 30,
    unit: 'pcs',
    isPromo: true,
    discount: 25,
  },
  {
    id: 'p28',
    name: 'Mukena Putih',
    handle: 'mukena-putih',
    description: 'Mukena putih bersih dan nyaman untuk sholat.',
    price: 85000,
    image: 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158595210_6ce77911.jpg',
    category: 'Perlengkapan Sholat',
    categoryId: 'sholat',
    stock: 10,
    unit: 'pcs',
  },
];

export const getProductByHandle = (handle: string): Product | undefined => {
  return products.find(p => p.handle === handle);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.categoryId === categoryId);
};

export const getPromoProducts = (): Product[] => {
  return products.filter(p => p.isPromo);
};

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getDiscountedPrice = (price: number, discount?: number): number => {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
};
