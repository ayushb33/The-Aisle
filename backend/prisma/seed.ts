import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion items' },
  { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and jewelry' },
  { name: 'Footwear', slug: 'footwear', description: 'Shoes and sneakers' },
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets and tech' },
  { name: 'Home & Living', slug: 'home-living', description: 'Furniture and decor' },
];

const products = [
  {
    name: 'Minimalist Cotton T-Shirt',
    slug: 'minimalist-cotton-t-shirt',
    description: 'A premium heavy-weight cotton t-shirt with a relaxed fit. Perfect for everyday wear.',
    shortDesc: 'Premium heavy-weight cotton t-shirt',
    price: 1499.00,
    comparePrice: 1999.00,
    costPrice: 600.00,
    sku: 'TS-001',
    stock: 50,
    brand: 'The Aisle',
    isFeatured: true,
    isNewArrival: true,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
    categorySlug: 'clothing',
  },
  {
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description: 'Timeless denim jacket with a comfortable, slightly oversized fit. Features branded buttons and twin chest pockets.',
    shortDesc: 'Timeless slightly oversized denim jacket',
    price: 3999.00,
    comparePrice: 4999.00,
    sku: 'DJ-001',
    stock: 20,
    brand: 'The Aisle',
    isFeatured: true,
    isNewArrival: false,
    images: ['https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80'],
    categorySlug: 'clothing',
  },
  {
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Genuine leather crossbody bag with adjustable strap. Perfect for carrying your daily essentials.',
    shortDesc: 'Genuine leather adjustable crossbody bag',
    price: 2499.00,
    sku: 'LB-001',
    stock: 15,
    brand: 'Artisan',
    isFeatured: false,
    isNewArrival: true,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
    categorySlug: 'accessories',
  },
  {
    name: 'Minimalist Watch',
    slug: 'minimalist-watch',
    description: 'Sleek, minimalist watch with a matte black dial and leather strap.',
    shortDesc: 'Sleek watch with matte black dial',
    price: 5999.00,
    comparePrice: 6999.00,
    sku: 'MW-001',
    stock: 5,
    brand: 'Timepiece',
    isFeatured: true,
    isNewArrival: false,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80'],
    categorySlug: 'accessories',
  },
  {
    name: 'Canvas Sneakers',
    slug: 'canvas-sneakers',
    description: 'Classic canvas low-top sneakers. Comfortable and versatile for any casual outfit.',
    shortDesc: 'Classic canvas low-top sneakers',
    price: 2999.00,
    sku: 'CS-001',
    stock: 30,
    brand: 'The Aisle',
    isFeatured: false,
    isNewArrival: true,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80'],
    categorySlug: 'footwear',
  },
  {
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    description: 'High-fidelity wireless earbuds with active noise cancellation and long battery life.',
    shortDesc: 'ANC wireless earbuds',
    price: 8999.00,
    comparePrice: 9999.00,
    sku: 'WE-001',
    stock: 10,
    brand: 'TechSound',
    isFeatured: true,
    isNewArrival: true,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    categorySlug: 'electronics',
  },
  {
    name: 'Ceramic Coffee Mug',
    slug: 'ceramic-coffee-mug',
    description: 'Handcrafted ceramic coffee mug. Microwave and dishwasher safe.',
    shortDesc: 'Handcrafted ceramic coffee mug',
    price: 799.00,
    sku: 'CM-001',
    stock: 100,
    brand: 'Artisan',
    isFeatured: false,
    isNewArrival: false,
    images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
    categorySlug: 'home-living',
  }
];

async function main() {
  console.log('Seeding database...');
  
  // Create Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categories seeded.');

  const dbCategories = await prisma.category.findMany();

  // Create Products
  for (const p of products) {
    const cat = dbCategories.find(c => c.slug === p.categorySlug);
    
    if (!cat) {
      console.warn(`Category ${p.categorySlug} not found for product ${p.name}`);
      continue;
    }
    
    const { images, categorySlug, ...productData } = p;
    
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        categoryId: cat.id,
        images: {
          create: images.map((url, i) => ({
            url,
            sortOrder: i,
          }))
        }
      }
    });
  }
  console.log('Products seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
