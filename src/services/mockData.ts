import { Product } from '../types/product';
import { Category } from '../types/category';

// Sample categories for our mock data
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic gadgets and devices',
    image: '/Electronics-1.png'
  },
  {
    id: 'cat-2',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes and accessories',
    image: '/Fashion-2.jpg'
  },
  {
    id: 'cat-3',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, decor and household items',
    image: '/Hom-3.jpg'
  },
  {
    id: 'cat-4',
    name: 'Beauty & Health',
    slug: 'beauty-health',
    description: 'Skincare, makeup and wellness products',
    image: '/Makeup-4.jpg'
  },
  {
    id: 'cat-5',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sporting goods, equipment and outdoor gear',
    image: '/sports-5.jpg'
  }
];

// Sample products for our mock data
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Smartphone XR Pro',
    slug: 'smartphone-xr-pro',
    description: 'The latest smartphone with advanced camera features and all-day battery life.',
    price: 999.99,
    discountPrice: 799.99,
    stockQuantity: 50,
    categoryId: 'cat-1',
    brand: 'TechX',
    images: [
      'https://i.ibb.co/k6pj0Pt/smartphone-1.jpg',
      'https://i.ibb.co/tPXjDw9/smartphone-2.jpg',
      'https://i.ibb.co/n8Wm760/smartphone-3.jpg'
    ],
    features: [
      '6.7-inch Super Retina XDR display',
      'Triple-camera system with 12MP Ultra Wide',
      'All-day battery life up to 17 hours',
      'Water and dust resistant (IP68)'
    ],
    rating: 4.8,
    reviews: [
      {
        id: 'rev-1',
        productId: 'prod-1',
        userName: 'Ahmed Khan',
        rating: 5,
        comment: 'Excellent phone! The camera quality is amazing.',
        date: new Date('2023-01-15')
      },
      {
        id: 'rev-2',
        productId: 'prod-1',
        userName: 'Fatima Mahmood',
        rating: 4,
        comment: 'Great overall, but battery could be better.',
        date: new Date('2023-02-05')
      },
      {
        id: 'rev-1-3',
        productId: 'prod-1',
        userName: 'Muhammad Ali',
        rating: 5,
        comment: 'Best smartphone I\'ve used. Worth every penny!',
        date: new Date('2023-03-10')
      },
      {
        id: 'rev-1-4',
        productId: 'prod-1',
        userName: 'Zainab Akhtar',
        rating: 4,
        comment: 'Beautiful display and fantastic performance. Slightly overpriced though.',
        date: new Date('2023-04-22')
      },
      {
        id: 'rev-1-5',
        productId: 'prod-1',
        userName: 'Bilal Hassan',
        rating: 5,
        comment: 'The camera takes amazing photos even in low light. Very impressed!',
        date: new Date('2023-05-15')
      }
    ],
    createdAt: new Date('2022-12-01'),
    updatedAt: new Date('2023-01-10')
  },
  {
    id: 'prod-2',
    title: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    description: 'Premium headphones with industry-leading noise cancellation and long battery life.',
    price: 349.99,
    discountPrice: 299.99,
    stockQuantity: 30,
    categoryId: 'cat-1',
    brand: 'AudioPro',
    images: [
      'https://i.ibb.co/Xy9vRrk/headphones-1.jpg',
      'https://i.ibb.co/MZTchBY/headphones-2.jpg'
    ],
    features: [
      'Industry-leading noise cancellation',
      '30-hour battery life',
      'Touch sensor controls',
      'High-quality wireless audio'
    ],
    rating: 4.6,
    reviews: [
      {
        id: 'rev-3',
        productId: 'prod-2',
        userName: 'Imran Ahmed',
        rating: 5,
        comment: 'The noise cancellation is unbelievable!',
        date: new Date('2023-01-20')
      },
      {
        id: 'rev-2-2',
        productId: 'prod-2',
        userName: 'Saad Malik',
        rating: 4,
        comment: 'Great sound quality, very comfortable for long sessions.',
        date: new Date('2023-02-12')
      },
      {
        id: 'rev-2-3',
        productId: 'prod-2',
        userName: 'Ayesha Siddiqui',
        rating: 5,
        comment: 'Perfect for my daily commute. Blocks out all noise in the bus!',
        date: new Date('2023-03-05')
      },
      {
        id: 'rev-2-4',
        productId: 'prod-2',
        userName: 'Tariq Mahmood',
        rating: 4,
        comment: 'Battery life is excellent. Sound could be a bit more balanced though.',
        date: new Date('2023-04-18')
      },
      {
        id: 'rev-2-5',
        productId: 'prod-2',
        userName: 'Nadia Sharif',
        rating: 5,
        comment: 'These headphones are worth every rupee. Amazing quality!',
        date: new Date('2023-05-22')
      }
    ],
    createdAt: new Date('2022-11-15'),
    updatedAt: new Date('2023-01-05')
  },
  {
    id: 'prod-3',
    title: 'Men\'s Classic Fit Shirt',
    slug: 'mens-classic-fit-shirt',
    description: 'Comfortable and stylish classic fit shirt made from premium cotton.',
    price: 49.99,
    discountPrice: 39.99,
    stockQuantity: 100,
    categoryId: 'cat-2',
    brand: 'FashionPlus',
    images: [
      'https://i.ibb.co/NV2FQs7/shirt-1.jpg',
      'https://i.ibb.co/gTv6yt1/shirt-2.jpg'
    ],
    features: [
      '100% premium cotton',
      'Classic fit',
      'Button-down collar',
      'Machine washable'
    ],
    rating: 4.3,
    reviews: [
      {
        id: 'rev-4',
        productId: 'prod-3',
        userName: 'Omar Farooq',
        rating: 4,
        comment: 'Great quality and comfortable. Runs slightly large.',
        date: new Date('2023-02-10')
      },
      {
        id: 'rev-3-2',
        productId: 'prod-3',
        userName: 'Hassan Ali',
        rating: 5,
        comment: 'Perfect fit and excellent fabric quality. Will buy more colors!',
        date: new Date('2023-03-15')
      },
      {
        id: 'rev-3-3',
        productId: 'prod-3',
        userName: 'Faisal Khan',
        rating: 4,
        comment: 'Great for formal occasions. Material is breathable even in hot weather.',
        date: new Date('2023-04-02')
      },
      {
        id: 'rev-3-4',
        productId: 'prod-3',
        userName: 'Amir Sohail',
        rating: 3,
        comment: 'Decent shirt but color faded slightly after washing.',
        date: new Date('2023-04-30')
      },
      {
        id: 'rev-3-5',
        productId: 'prod-3',
        userName: 'Kamran Ahmed',
        rating: 5,
        comment: 'Excellent stitching and comfortable fit. Perfect for office wear.',
        date: new Date('2023-05-18')
      }
    ],
    createdAt: new Date('2022-10-20'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: 'prod-4',
    title: 'Smart 4K TV 55-inch',
    slug: 'smart-4k-tv-55-inch',
    description: 'Ultra HD Smart TV with voice control and streaming apps built-in.',
    price: 699.99,
    discountPrice: 549.99,
    stockQuantity: 25,
    categoryId: 'cat-1',
    brand: 'VisionPlus',
    images: [
      'https://i.ibb.co/m45ny63/tv-1.jpg',
      'https://i.ibb.co/xLkQKHd/tv-2.jpg'
    ],
    features: [
      '4K Ultra HD (3840 x 2160) resolution',
      'Smart TV with built-in voice assistant',
      'HDR technology for enhanced color and contrast',
      'Multiple HDMI and USB ports'
    ],
    rating: 4.7,
    reviews: [
      {
        id: 'rev-5',
        productId: 'prod-4',
        userName: 'Asad Raza',
        rating: 5,
        comment: 'Picture quality is incredible. Smart features work flawlessly.',
        date: new Date('2023-01-25')
      },
      {
        id: 'rev-4-2',
        productId: 'prod-4',
        userName: 'Samina Chaudhry',
        rating: 4,
        comment: 'Excellent TV for the price. Setup was easy and picture is crystal clear.',
        date: new Date('2023-02-18')
      },
      {
        id: 'rev-4-3',
        productId: 'prod-4',
        userName: 'Adnan Malik',
        rating: 5,
        comment: 'The 4K quality is amazing! Best TV I\'ve owned.',
        date: new Date('2023-03-22')
      },
      {
        id: 'rev-4-4',
        productId: 'prod-4',
        userName: 'Farah Kamal',
        rating: 5,
        comment: 'Voice control works perfectly and the smart features are intuitive.',
        date: new Date('2023-04-15')
      },
      {
        id: 'rev-4-5',
        productId: 'prod-4',
        userName: 'Yasir Hussain',
        rating: 4,
        comment: 'Great TV with excellent sound. Remote could be better designed.',
        date: new Date('2023-05-10')
      }
    ],
    createdAt: new Date('2022-12-10'),
    updatedAt: new Date('2023-01-20')
  },
  {
    id: 'prod-5',
    title: 'Modern Coffee Table',
    slug: 'modern-coffee-table',
    description: 'Elegant and minimalist coffee table that complements any living room.',
    price: 199.99,
    discountPrice: 149.99,
    stockQuantity: 15,
    categoryId: 'cat-3',
    brand: 'HomeStyle',
    images: [
      'https://i.ibb.co/3Y3s3Cy/coffee-table-1.jpg',
      'https://i.ibb.co/Wc1pjKB/coffee-table-2.jpg'
    ],
    features: [
      'Solid wood construction',
      'Modern, minimalist design',
      'Durable finish',
      'Easy assembly'
    ],
    rating: 4.5,
    reviews: [
      {
        id: 'rev-6',
        productId: 'prod-5',
        userName: 'Zara Ahmed',
        rating: 4,
        comment: 'Beautiful design and good quality. Assembly was straightforward.',
        date: new Date('2023-02-15')
      },
      {
        id: 'rev-5-2',
        productId: 'prod-5',
        userName: 'Usman Ali',
        rating: 5,
        comment: 'Stunning coffee table that fits perfectly in my living room.',
        date: new Date('2023-03-01')
      },
      {
        id: 'rev-5-3',
        productId: 'prod-5',
        userName: 'Rabia Iqbal',
        rating: 4,
        comment: 'Assembly was easy and the finish is beautiful. Great purchase!',
        date: new Date('2023-03-25')
      },
      {
        id: 'rev-5-4',
        productId: 'prod-5',
        userName: 'Naveed Khan',
        rating: 5,
        comment: 'Solid wood construction and elegant design. Highly recommend!',
        date: new Date('2023-04-12')
      },
      {
        id: 'rev-5-5',
        productId: 'prod-5',
        userName: 'Sadia Jabbar',
        rating: 4,
        comment: 'The table looks expensive and adds style to my room. Very satisfied.',
        date: new Date('2023-05-05')
      }
    ],
    createdAt: new Date('2022-11-01'),
    updatedAt: new Date('2023-01-25')
  },
  {
    id: 'prod-6',
    title: 'Organic Face Moisturizer',
    slug: 'organic-face-moisturizer',
    description: 'Hydrating face moisturizer made with natural and organic ingredients.',
    price: 29.99,
    discountPrice: null,
    stockQuantity: 80,
    categoryId: 'cat-4',
    brand: 'NatureCare',
    images: [
      'https://i.imgur.com/OpLmcNV.jpg',
      'https://i.imgur.com/oMpU1Ct.jpg'
    ],
    features: [
      'Made with organic ingredients',
      'Suitable for all skin types',
      'No harsh chemicals or parabens',
      'Cruelty-free and vegan'
    ],
    rating: 4.9,
    reviews: [
      {
        id: 'rev-7',
        productId: 'prod-6',
        userName: 'Hina Akhtar',
        rating: 5,
        comment: 'Best moisturizer I\'ve ever used! My skin feels amazing.',
        date: new Date('2023-02-01')
      },
      {
        id: 'rev-6-2',
        productId: 'prod-6',
        userName: 'Mehwish Hayat',
        rating: 5,
        comment: 'My skin has never looked better! Love that it\'s all natural ingredients.',
        date: new Date('2023-03-10')
      },
      {
        id: 'rev-6-3',
        productId: 'prod-6',
        userName: 'Sana Javed',
        rating: 5,
        comment: 'Perfect for sensitive skin. No reaction and keeps my face hydrated all day.',
        date: new Date('2023-04-05')
      },
      {
        id: 'rev-6-4',
        productId: 'prod-6',
        userName: 'Amna Ilyas',
        rating: 4,
        comment: 'Great product, but wish it had SPF included. Otherwise perfect!',
        date: new Date('2023-04-28')
      },
      {
        id: 'rev-6-5',
        productId: 'prod-6',
        userName: 'Maryam Nawaz',
        rating: 5,
        comment: 'This moisturizer has transformed my dry skin completely. Will repurchase!',
        date: new Date('2023-05-20')
      }
    ],
    createdAt: new Date('2022-12-15'),
    updatedAt: new Date('2023-02-05')
  },
  {
    id: 'prod-7',
    title: 'Professional Running Shoes',
    slug: 'professional-running-shoes',
    description: 'High-performance running shoes designed for serious runners and athletes.',
    price: 129.99,
    discountPrice: 99.99,
    stockQuantity: 40,
    categoryId: 'cat-5',
    brand: 'AthleticPro',
    images: [
      'https://i.imgur.com/wkDLoT6.jpg',
      'https://i.imgur.com/JLpnZc0.jpg'
    ],
    features: [
      'Lightweight design for maximum speed',
      'Advanced cushioning for comfort',
      'Breathable mesh upper',
      'Durable rubber outsole'
    ],
    rating: 4.7,
    reviews: [
      {
        id: 'rev-8',
        productId: 'prod-7',
        userName: 'Shoaib Akhtar',
        rating: 5,
        comment: 'These shoes have improved my running times. Very comfortable.',
        date: new Date('2023-01-05')
      },
      {
        id: 'rev-7-2',
        productId: 'prod-7',
        userName: 'Wasim Akram',
        rating: 5,
        comment: 'Perfect for my morning jogs. Great grip and extremely comfortable.',
        date: new Date('2023-02-22')
      },
      {
        id: 'rev-7-3',
        productId: 'prod-7',
        userName: 'Sana Mir',
        rating: 4,
        comment: 'Excellent support and cushioning. My feet don\'t hurt after long runs.',
        date: new Date('2023-03-18')
      },
      {
        id: 'rev-7-4',
        productId: 'prod-7',
        userName: 'Shahid Afridi',
        rating: 5,
        comment: 'Best running shoes I\'ve owned. Perfect fit and very durable.',
        date: new Date('2023-04-09')
      },
      {
        id: 'rev-7-5',
        productId: 'prod-7',
        userName: 'Amir Khan',
        rating: 4,
        comment: 'Great for training sessions. Breathable and comfortable for long hours.',
        date: new Date('2023-05-12')
      }
    ],
    createdAt: new Date('2022-11-20'),
    updatedAt: new Date('2023-01-30')
  },
  {
    id: 'prod-8',
    title: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Eco-friendly vacuum insulated water bottle that keeps drinks cold or hot for hours.',
    price: 34.99,
    discountPrice: 24.99,
    stockQuantity: 120,
    categoryId: 'cat-5',
    brand: 'EcoLife',
    images: [
      'https://i.imgur.com/CnDlmBY.jpg',
      'https://i.imgur.com/2w3mOAy.jpg'
    ],
    features: [
      'Double-wall vacuum insulation',
      'Keeps drinks cold for 24 hours, hot for 12 hours',
      'BPA-free and eco-friendly',
      'Leak-proof lid'
    ],
    rating: 4.8,
    reviews: [
      {
        id: 'rev-9',
        productId: 'prod-8',
        userName: 'Babar Azam',
        rating: 5,
        comment: 'Best water bottle I\'ve owned. Keeps water cold all day on the trail.',
        date: new Date('2023-02-20')
      },
      {
        id: 'rev-8-2',
        productId: 'prod-8',
        userName: 'Haris Rauf',
        rating: 5,
        comment: 'Perfect for cricket practice. Keeps my water cold for hours in the heat.',
        date: new Date('2023-03-05')
      },
      {
        id: 'rev-8-3',
        productId: 'prod-8',
        userName: 'Naseem Shah',
        rating: 4,
        comment: 'Great bottle! Durable and doesn\'t leak. Ice stays solid for hours.',
        date: new Date('2023-03-30')
      },
      {
        id: 'rev-8-4',
        productId: 'prod-8',
        userName: 'Shadab Khan',
        rating: 5,
        comment: 'This bottle is perfect for gym sessions. Doesn\'t sweat or leak.',
        date: new Date('2023-04-25')
      },
      {
        id: 'rev-8-5',
        productId: 'prod-8',
        userName: 'Mohammad Rizwan',
        rating: 5,
        comment: 'Excellent quality and keeps tea hot all morning. Very satisfied!',
        date: new Date('2023-05-17')
      }
    ],
    createdAt: new Date('2022-10-15'),
    updatedAt: new Date('2023-02-10')
  }
]; 