import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting product seeding...');

  // Get existing categories
  const categories = await prisma.category.findMany();
  const spray = categories.find(c => c.name === 'Spray Paint');
  const marker = categories.find(c => c.name === 'Marker and Ink');
  const nozzle = categories.find(c => c.name === 'Nozzle/Caps');
  const sketchbook = categories.find(c => c.name === 'Sketchbook');
  const merch = categories.find(c => c.name === 'Apparel/Merch');

  if (!spray || !marker || !nozzle || !sketchbook || !merch) {
    throw new Error('Categories not found. Please run seed.ts first.');
  }

  // Define all products
  const products = [
    // SPRAY PAINT (11 products)
    {
      name: 'Belazo 400ml',
      description: 'Cat semprot Belazo 400ml berkualitas tinggi dengan hasil akhir yang halus dan merata. Cocok untuk berbagai permukaan dan proyek seni grafiti.',
      price: 35000,
      stock: 150,
      images: '/product/spray/Belazo 400ml.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Belazo 600ml',
      description: 'Cat semprot Belazo 600ml dengan kapasitas lebih besar untuk proyek skala menengah. Memberikan coverage yang excellent dan warna yang vibrant.',
      price: 48000,
      stock: 120,
      images: '/product/spray/BELAZO 600ML.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Belazo 750ml',
      description: 'Cat semprot Belazo 750ml ukuran jumbo untuk proyek besar. Hemat dan efisien dengan kualitas professional grade.',
      price: 58000,
      stock: 100,
      images: '/product/spray/BELAZO 750ML.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Belazo Webs Marble Effect',
      description: 'Cat semprot Belazo dengan efek marble/web yang unik. Sempurna untuk menciptakan tekstur dan pola artistik yang eye-catching.',
      price: 65000,
      stock: 80,
      images: '/product/spray/BELAZO WEBS MARBLE EFFECT.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Diton King 300ml',
      description: 'Cat semprot Diton King 300ml dengan formula premium. Cepat kering, tahan lama, dan memberikan hasil finishing yang professional.',
      price: 32000,
      stock: 140,
      images: '/product/spray/Diton king 300ml.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Diton King 400ml',
      description: 'Cat semprot Diton King 400ml dengan pigmen berkualitas tinggi. Ideal untuk mural, grafiti, dan berbagai aplikasi seni jalanan.',
      price: 38000,
      stock: 130,
      images: '/product/spray/Diton King 400ml.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Diton King Garuda 750ml',
      description: 'Cat semprot Diton King Garuda 750ml edisi spesial dengan kualitas premium. Coverage maksimal untuk proyek besar dengan hasil yang konsisten.',
      price: 62000,
      stock: 90,
      images: '/product/spray/DITON KING GARUDA 750ML.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Diton King Nusantara 600ml',
      description: 'Cat semprot Diton King Nusantara 600ml dengan formula khusus. Tahan cuaca tropis Indonesia dan memberikan warna yang tahan lama.',
      price: 52000,
      stock: 110,
      images: '/product/spray/DITON KING NUSANTARA 600ML.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Molotow Premium Neon Spray Paint',
      description: 'Cat semprot Molotow Premium dengan warna neon yang striking. Imported quality dengan pigmen fluorescent yang sangat visible.',
      price: 125000,
      stock: 60,
      images: '/product/spray/Molotow Premium Neon Spray Paint.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Molotow Premium Spray Paint',
      description: 'Cat semprot Molotow Premium kualitas Eropa. High-pressure valve system dengan warna yang rich dan coverage yang superior.',
      price: 115000,
      stock: 70,
      images: '/product/spray/Molotow Premium Spray Paint.jpeg',
      categoryId: spray.id,
      variantType: null
    },
    {
      name: 'Titans Paint 400ml',
      description: 'Cat semprot Titans Paint 400ml dengan formula quick-dry. Excellent untuk outdoor projects dengan hasil yang weather-resistant.',
      price: 42000,
      stock: 125,
      images: '/product/spray/TITANS PAINT 400ML.jpeg',
      categoryId: spray.id,
      variantType: null
    },

    // MARKER & INK (20 products)
    {
      name: 'Ammo Acrylic Marker 2-5mm',
      description: 'Spidol akrilik Ammo dengan tip 2-5mm yang versatile. Paint-based marker dengan coverage yang opaque dan permanen pada berbagai permukaan.',
      price: 35000,
      stock: 0, // Will use variants
      images: '/product/marker and ink/Ammo Acrylic Marker 2-5mm.jpeg',
      categoryId: marker.id,
      variantType: 'Color'
    },
    {
      name: 'Ammo Acrylic Paint Refill 100ml',
      description: 'Refill cat akrilik Ammo 100ml untuk mengisi ulang marker. Formula berkualitas tinggi dengan pigmen yang kaya dan tahan lama.',
      price: 28000,
      stock: 100,
      images: '/product/marker and ink/Ammo Acrylic Paint Refill 100ml.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Ammo Empty Marker 15mm',
      description: 'Marker kosong Ammo dengan tip 15mm yang dapat diisi dengan cat pilihan Anda. Ideal untuk custom colors dan experimen.',
      price: 25000,
      stock: 80,
      images: '/product/marker and ink/AMMO Empty Marker 15mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Ammo Marker 10mm',
      description: 'Spidol Ammo dengan tip 10mm untuk garis medium. Perfect untuk detail work dan fill-in pada mural atau canvas.',
      price: 32000,
      stock: 95,
      images: '/product/marker and ink/ammo marker 10mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Ammo Marker 15mm',
      description: 'Spidol Ammo 15mm dengan tip yang lebih lebar. Excellent untuk coverage yang cepat dengan hasil yang smooth dan even.',
      price: 38000,
      stock: 85,
      images: '/product/marker and ink/Ammo Marker 15mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Ammo Marker 30mm',
      description: 'Spidol jumbo Ammo 30mm untuk area coverage yang luas. Professional tool untuk muralists dan street artists.',
      price: 55000,
      stock: 70,
      images: '/product/marker and ink/ammo marker 30mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Dripink Heavy Drips 100ml Refill',
      description: 'Refill Dripink Heavy Drips 100ml dengan formula extra runny untuk efek tetes yang dramatis. Perfect untuk drip art style.',
      price: 32000,
      stock: 90,
      images: '/product/marker and ink/Dripink Heavy Drips 100ml Refill.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Dripink Paint Marker 3mm',
      description: 'Spidol paint Dripink dengan tip 3mm untuk detail work. Permanent dan waterproof dengan flow yang konsisten.',
      price: 28000,
      stock: 110,
      images: '/product/marker and ink/Dripink Paint Marker  3mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Dripink Pointed Marker 0.7mm',
      description: 'Spidol Dripink dengan tip runcing 0.7mm untuk detail presisi tinggi. Ideal untuk outlining dan fine details.',
      price: 25000,
      stock: 100,
      images: '/product/marker and ink/Dripink Pointed Marker 0.7mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Dripink Refill 100ml',
      description: 'Refill standard Dripink 100ml dengan formula ink berkualitas. Compatible dengan semua marker series Dripink.',
      price: 30000,
      stock: 120,
      images: '/product/marker and ink/Dripink Refill 100ml.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Dripink Refill 250ml',
      description: 'Refill jumbo Dripink 250ml untuk heavy users. Ekonomis dan praktis dengan kualitas yang konsisten.',
      price: 65000,
      stock: 75,
      images: '/product/marker and ink/Dripink Refill 250ml.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Dripink Wider Marker 10mm',
      description: 'Spidol Dripink 10mm dengan tip lebar untuk coverage yang efisien. Smooth flow dengan hasil yang opaque.',
      price: 35000,
      stock: 95,
      images: '/product/marker and ink/Dripink Wider Marker 10mm.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Fat Mop Dripink',
      description: 'Fat mop marker Dripink untuk tagging dan bombing style. Large capacity dengan flow yang heavy dan consistent.',
      price: 75000,
      stock: 60,
      images: '/product/marker and ink/FAT MOP DRIPINK.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Posca PC-17K',
      description: 'Posca PC-17K dengan tip jumbo 15mm. Water-based paint marker yang versatile untuk berbagai permukaan dengan warna yang vibrant.',
      price: 68000,
      stock: 70,
      images: '/product/marker and ink/POSCA PC 17 K.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Posca PC-1M',
      description: 'Posca PC-1M extra fine 0.7mm untuk detail work yang presisi. Water-based, permanent setelah kering, dan sangat populer di kalangan artists.',
      price: 32000,
      stock: 0, // Will use variants
      images: '/product/marker and ink/Posca PC 1m.jpeg',
      categoryId: marker.id,
      variantType: 'Color'
    },
    {
      name: 'Posca PC-3M',
      description: 'Posca PC-3M fine bullet tip 0.9-1.3mm. Best-seller Posca yang serbaguna untuk berbagai aplikasi dari doodling hingga professional art.',
      price: 35000,
      stock: 0, // Will use variants
      images: '/product/marker and ink/Posca PC 3M.jpeg',
      categoryId: marker.id,
      variantType: 'Color'
    },
    {
      name: 'Posca PC-8K',
      description: 'Posca PC-8K chisel tip 8mm untuk bold strokes. Perfect untuk poster, signage, dan large-scale artwork.',
      price: 55000,
      stock: 85,
      images: '/product/marker and ink/Posca Pc 8K.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Posca PC-5M',
      description: 'Posca PC-5M medium bullet tip 1.8-2.5mm. Versatile size yang ideal untuk berbagai teknik dan permukaan.',
      price: 42000,
      stock: 100,
      images: '/product/marker and ink/POSCA PC-5M.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Reloader Refill for Dripink Paint Marker Series',
      description: 'Reloader refill untuk semua series Dripink paint marker. Quick-fill system dengan formula premium yang flow-optimized.',
      price: 35000,
      stock: 90,
      images: '/product/marker and ink/Reloader Refill for Dripink Paint Marker Series.jpeg',
      categoryId: marker.id,
      variantType: null
    },
    {
      name: 'Replacement Nib for Bullet Marker and City Crusher',
      description: 'Replacement nib/tip untuk bullet marker dan city crusher series. Berbagai ukuran tersedia untuk mengganti tip yang aus.',
      price: 15000,
      stock: 150,
      images: '/product/marker and ink/Replacement Nib for Bullet Marker and City Crusher.jpg',
      categoryId: marker.id,
      variantType: null
    },

    // NOZZLE & CAPS (47 products)
    {
      name: '81 Cap Male Graffiti',
      description: 'Cap male 81 Cap untuk spray paint dengan output medium. Universal fit untuk berbagai merek spray paint.',
      price: 8000,
      stock: 200,
      images: '/product/nozzle and caps/81 CAP Caps Male Graffiti.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Adapter untuk Caps Male',
      description: 'Adapter converter untuk menggunakan male caps pada female valve cans. Essential tool untuk spray paint enthusiasts.',
      price: 12000,
      stock: 150,
      images: '/product/nozzle and caps/adapter untuk caps male.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Astro Fat Cap',
      description: 'Astro Fat Cap untuk output lebar dengan coverage maksimal. Ideal untuk fill-ins dan background work.',
      price: 10000,
      stock: 180,
      images: '/product/nozzle and caps/Astro Fat Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Banana Universal Cap',
      description: 'Banana Cap universal yang versatile dengan spray pattern medium-wide. Populer untuk all-around usage.',
      price: 9000,
      stock: 190,
      images: '/product/nozzle and caps/Banana Universal Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Calligraphy Caps White',
      description: 'Calligraphy caps putih untuk membuat garis calligraphy/chisel effect. Unik dan perfect untuk lettering style.',
      price: 11000,
      stock: 120,
      images: '/product/nozzle and caps/CALLIGRAPHY CAPS WHITE.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Clash Super Skinny Cap',
      description: 'Clash Super Skinny Cap untuk garis extra tipis dan detail presisi. Essential untuk outline dan detail work.',
      price: 9000,
      stock: 160,
      images: '/product/nozzle and caps/Clash Super Skinny Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'CMC Jiffy Caps',
      description: 'CMC Jiffy Caps dengan soft pressure dan medium output. Comfortable untuk extended use dengan control yang excellent.',
      price: 10000,
      stock: 170,
      images: '/product/nozzle and caps/CMC Jiffy Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'CMC Wally Male Cap',
      description: 'CMC Wally Male Cap dengan design ergonomis. Medium-fat output dengan spray pattern yang konsisten.',
      price: 11000,
      stock: 140,
      images: '/product/nozzle and caps/CMC Wally Male Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Fadebomb Green Male Adapter',
      description: 'Fadebomb Green male adapter untuk fat cap systems. Quality adapter dengan durability yang tinggi.',
      price: 13000,
      stock: 130,
      images: '/product/nozzle and caps/Fadebomb Green male adapter.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Frogger Caps',
      description: 'Frogger Caps dengan spray pattern yang unique. Medium-wide output perfect untuk berbagai techniques.',
      price: 10000,
      stock: 155,
      images: '/product/nozzle and caps/Frogger Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'G-C 50 Pressure Limiter Cap Adapter',
      description: 'G-C 50 Pressure Limiter untuk mengontrol pressure spray paint. Perfect untuk low-pressure applications dan control work.',
      price: 15000,
      stock: 100,
      images: '/product/nozzle and caps/G-C 50 Pressure Limiter Cap Adapter.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Hardcore Fat Cap',
      description: 'Hardcore Fat Cap untuk maximum coverage. Extra wide spray pattern untuk quick fills dan large areas.',
      price: 12000,
      stock: 145,
      images: '/product/nozzle and caps/Hardcore Fat Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Kobra Black Dot Cap',
      description: 'Kobra Black Dot Cap dengan precision output. Fine line capability dengan control yang superior.',
      price: 10000,
      stock: 175,
      images: '/product/nozzle and caps/Kobra Black Dot Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Kobra Monster Fat Cap',
      description: 'Kobra Monster Fat Cap untuk extreme coverage. Super wide output untuk maximum efficiency pada large surfaces.',
      price: 13000,
      stock: 120,
      images: '/product/nozzle and caps/Kobra Monster Fat Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Kobra White Banana Caps',
      description: 'Kobra White Banana Caps universal design. Reliable dan versatile untuk berbagai spray paint brands.',
      price: 9000,
      stock: 185,
      images: '/product/nozzle and caps/Kobra White Banana Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Kobra Yellow Fat',
      description: 'Kobra Yellow Fat Cap dengan wide spray pattern. Popular choice untuk fill work dengan coverage yang excellent.',
      price: 11000,
      stock: 165,
      images: '/product/nozzle and caps/Kobra Yellow Fat.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Lego Thin Cap',
      description: 'Lego Thin Cap untuk garis tipis dan detail work. Precise control dengan thin line output.',
      price: 9000,
      stock: 170,
      images: '/product/nozzle and caps/Lego Thin Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Molotow Soft Cap',
      description: 'Molotow Soft Cap dengan low pressure output. Perfect untuk smooth gradients dan detail control work.',
      price: 12000,
      stock: 140,
      images: '/product/nozzle and caps/Molotow - Soft Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Molotow Blue Dot Soft Caps',
      description: 'Molotow Blue Dot Soft Caps untuk soft output dengan fine control. Excellent untuk blending dan fades.',
      price: 13000,
      stock: 135,
      images: '/product/nozzle and caps/Molotow Blue Dot Soft Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Molotow Pink Dot Caps',
      description: 'Molotow Pink Dot Caps dengan medium output. Balanced spray pattern untuk general purpose use.',
      price: 12000,
      stock: 145,
      images: '/product/nozzle and caps/MOLOTOW PINK DOT CAPS.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Molotow Super Fat Caps',
      description: 'Molotow Super Fat Caps untuk maximum coverage. Extra wide untuk quick work pada large surfaces.',
      price: 14000,
      stock: 130,
      images: '/product/nozzle and caps/MOLOTOW SUPER FAT CAPS.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Fat Cap Silver',
      description: 'Montana Fat Cap Silver untuk wide coverage. High quality cap dengan spray pattern yang konsisten.',
      price: 11000,
      stock: 160,
      images: '/product/nozzle and caps/Montana Fat Cap Silver.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Flat Jet Medium Caps',
      description: 'Montana Flat Jet Medium untuk flat spray pattern. Ideal untuk sharp edges dan straight lines.',
      price: 13000,
      stock: 125,
      images: '/product/nozzle and caps/MONTANA FLAT JET MEDIUM CAPS.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Flat Jet Wide Caps',
      description: 'Montana Flat Jet Wide untuk extra wide flat spray. Perfect untuk large areas dengan clean edges.',
      price: 14000,
      stock: 115,
      images: '/product/nozzle and caps/MONTANA FLAT JET WIDE CAPS.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level 1 Cap',
      description: 'Montana Level 1 Cap untuk ultra thin lines. Finest output dalam Montana level series untuk detail presisi.',
      price: 10000,
      stock: 150,
      images: '/product/nozzle and caps/Montana Level 1 Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level 2 Caps',
      description: 'Montana Level 2 Caps untuk thin-medium lines. Popular choice untuk outline dan detail work.',
      price: 10000,
      stock: 155,
      images: '/product/nozzle and caps/Montana Level 2 Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level 3 Cap',
      description: 'Montana Level 3 Cap medium output. Versatile cap untuk berbagai techniques dari outline hingga fill.',
      price: 11000,
      stock: 160,
      images: '/product/nozzle and caps/Montana Level 3 Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level 4 Cap',
      description: 'Montana Level 4 Cap untuk medium-fat output. Excellent balance untuk detail dan coverage work.',
      price: 11000,
      stock: 150,
      images: '/product/nozzle and caps/Montana Level 4 Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level 5 Cap',
      description: 'Montana Level 5 Cap fat output untuk quick coverage. Great untuk fill-ins dengan speed dan efficiency.',
      price: 12000,
      stock: 140,
      images: '/product/nozzle and caps/Montana Level 5 Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level 6 Cap',
      description: 'Montana Level 6 Cap ultra fat untuk maximum coverage. Widest dalam Montana series untuk extreme efficiency.',
      price: 13000,
      stock: 130,
      images: '/product/nozzle and caps/Montana Level 6 Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Level Pack Caps',
      description: 'Montana Level Pack berisi variety caps dari Level 1-6. Complete set untuk semua kebutuhan dari fine lines hingga fat coverage.',
      price: 65000,
      stock: 80,
      images: '/product/nozzle and caps/Montana Level Pack Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Pocket Cap',
      description: 'Montana Pocket Cap portable size dengan medium output. Compact dan convenient untuk on-the-go work.',
      price: 10000,
      stock: 165,
      images: '/product/nozzle and caps/MONTANA POCKET CAP.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Montana Pocket Fat Cap',
      description: 'Montana Pocket Fat Cap portable dengan fat output. Compact size dengan wide spray pattern capability.',
      price: 11000,
      stock: 155,
      images: '/product/nozzle and caps/Montana Pocket Fat Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'MTN Hardcore Medium Caps',
      description: 'MTN Hardcore Medium Caps dengan balanced output. Reliable dan consistent untuk various applications.',
      price: 10000,
      stock: 170,
      images: '/product/nozzle and caps/MTN Hardcore Medium Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Needle Cap',
      description: 'Needle Cap untuk extreme precision work. Ultra fine output untuk detailed line work dan intricate designs.',
      price: 12000,
      stock: 135,
      images: '/product/nozzle and caps/Needle Cap.jpg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Needle Fine Liner Caps',
      description: 'Needle Fine Liner Caps untuk technical line work. Precision engineered untuk consistent fine lines.',
      price: 13000,
      stock: 125,
      images: '/product/nozzle and caps/Needle Fine Liner Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Night Quill Big Shotty Cap',
      description: 'Night Quill Big Shotty Cap untuk extra wide coverage. Premium cap dengan superior spray pattern.',
      price: 14000,
      stock: 120,
      images: '/product/nozzle and caps/NIGHT QUILL BIG SHOTTY CAP.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Night Quill Heavy Dart Cap',
      description: 'Night Quill Heavy Dart Cap dengan concentrated spray pattern. Perfect untuk heavy coverage dengan control.',
      price: 13000,
      stock: 130,
      images: '/product/nozzle and caps/Night Quill Heavy Dart Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Night Quill Hydra Cap Female',
      description: 'Night Quill Hydra Cap Female dengan unique spray characteristics. Versatile output untuk creative applications.',
      price: 12000,
      stock: 140,
      images: '/product/nozzle and caps/NIGHT QUILL HYDRA CAP FEMALE CAP.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'NY Fat Caps',
      description: 'NY Fat Caps classic design untuk wide coverage. Time-tested design yang reliable dan efficient.',
      price: 11000,
      stock: 150,
      images: '/product/nozzle and caps/Ny Fat Caps.jpg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Skinny Cream Cap',
      description: 'Skinny Cream Cap untuk thin lines dengan soft output. Gentle pressure untuk control work.',
      price: 9000,
      stock: 165,
      images: '/product/nozzle and caps/Skinny Cream Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Skinny Mclaim Cap',
      description: 'Skinny Mclaim Cap popular choice untuk detail work. Consistent thin line output dengan excellent control.',
      price: 9000,
      stock: 170,
      images: '/product/nozzle and caps/Skinny Mclaim Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Skinny Pro Black',
      description: 'Skinny Pro Black professional grade untuk ultra fine lines. Premium quality untuk precision work.',
      price: 11000,
      stock: 145,
      images: '/product/nozzle and caps/Skinny Pro Black.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Skinny Pro Blue Cap',
      description: 'Skinny Pro Blue Cap professional series. High quality thin output untuk detailed artwork.',
      price: 11000,
      stock: 145,
      images: '/product/nozzle and caps/Skinny Pro Blue Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Stencil Caps',
      description: 'Stencil Caps specially designed untuk stencil work. Controlled spray pattern untuk clean stencil edges.',
      price: 10000,
      stock: 155,
      images: '/product/nozzle and caps/Stencil Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Super Boost Caps',
      description: 'Super Boost Caps dengan high pressure output. Extra power untuk maximum paint flow dan coverage.',
      price: 13000,
      stock: 125,
      images: '/product/nozzle and caps/Super Boost Caps.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Transparent Universal Cap',
      description: 'Transparent Universal Cap dengan clear body. Easy untuk monitor paint flow dengan universal compatibility.',
      price: 10000,
      stock: 160,
      images: '/product/nozzle and caps/TRANSPARENT UNIVERSAL CAP.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },
    {
      name: 'Transversal Variator Cap',
      description: 'Transversal Variator Cap dengan adjustable spray pattern. Variable output untuk multiple effects dalam satu cap.',
      price: 15000,
      stock: 110,
      images: '/product/nozzle and caps/Transversal Variator Cap.jpeg',
      categoryId: nozzle.id,
      variantType: null
    },

    // SKETCHBOOK (4 products)
    {
      name: 'Peron SuperSix Outlined Sketchbook',
      description: 'Sketchbook Peron SuperSix dengan outline design. Premium paper quality untuk sketching, drawing, dan graffiti designs.',
      price: 45000,
      stock: 100,
      images: '/product/sketchbook/Peron SuperSix Outlinded SketchBook.jpeg',
      categoryId: sketchbook.id,
      variantType: null
    },
    {
      name: 'Sketch Book V-TEC 20 Sheets',
      description: 'Sketchbook V-TEC dengan 20 lembar kertas berkualitas. Cocok untuk sketsa pensil, pulpen, dan marker.',
      price: 35000,
      stock: 120,
      images: '/product/sketchbook/SKETCH BOOK V-TEC 20 SHEETS.jpg',
      categoryId: sketchbook.id,
      variantType: null
    },
    {
      name: 'V-TEC Sketchbook 30 Sheets 130gsm Vellum Surface',
      description: 'V-TEC Sketchbook premium 30 lembar dengan kertas 130gsm vellum surface. Ideal untuk berbagai media drawing termasuk marker dan cat air.',
      price: 48000,
      stock: 110,
      images: '/product/sketchbook/V-TEC SKETCHBOOK - 30 SHEETS (130GSM) VELLUM SURFACE.jpeg',
      categoryId: sketchbook.id,
      variantType: null
    },
    {
      name: 'V-TEC Visual Art Diary 60 Sheets 120gsm',
      description: 'V-TEC Visual Art Diary dengan 60 lembar kertas 120gsm. Perfect untuk art journaling, sketching, dan mixed media artwork.',
      price: 65000,
      stock: 90,
      images: '/product/sketchbook/V-TEC VISUAL ART DIARY 60 SHEETS 120 GSM.jpeg',
      categoryId: sketchbook.id,
      variantType: null
    },

    // MERCH (11 products)
    {
      name: 'Chaos Black On Black T-Shirt',
      description: 'Kaos Peron x Chaos dengan design black on black yang eksklusif. Premium cotton material dengan print berkualitas tinggi. Tersedia dalam berbagai ukuran.',
      price: 150000,
      stock: 0, // Will use variants
      images: '/product/merch/Chaos - Black On Black Tshirt Black.jpeg',
      categoryId: merch.id,
      variantType: 'Size'
    },
    {
      name: 'Chaos Bombing Long Sleeve T-Shirt',
      description: 'Kaos lengan panjang Chaos Bombing edition. Comfortable dan stylish dengan design yang bold. Perfect untuk street style fashion.',
      price: 180000,
      stock: 0, // Will use variants
      images: '/product/merch/Chaos - Bombing Tshirt Long Slevee.jpeg',
      categoryId: merch.id,
      variantType: 'Size'
    },
    {
      name: 'Discover & Explore Long Sleeve T-Shirt',
      description: 'Kaos lengan panjang Discover & Explore dengan message yang inspiring. Premium quality fabric untuk all-day comfort.',
      price: 180000,
      stock: 0, // Will use variants
      images: '/product/merch/Discover & Explore Tshirt Long Slevee.jpeg',
      categoryId: merch.id,
      variantType: 'Size'
    },
    {
      name: 'Discover Fire T-Shirt Black',
      description: 'Kaos Discover Fire edition dengan design yang striking pada bahan hitam. Eye-catching graphic untuk urban wear.',
      price: 150000,
      stock: 0, // Will use variants
      images: '/product/merch/Discover - Fire Tshirt Black.jpeg',
      categoryId: merch.id,
      variantType: 'Size'
    },
    {
      name: 'Discover SuperSix T-Shirt',
      description: 'Kaos Discover SuperSix dengan logo signature Peron. Must-have merchandise untuk fans dan collectors.',
      price: 150000,
      stock: 0, // Will use variants
      images: '/product/merch/Discover - SuperSix Tshirt.jpeg',
      categoryId: merch.id,
      variantType: 'Size'
    },
    {
      name: 'Discover Worldwide T-Shirt',
      description: 'Kaos Discover Worldwide yang merepresentasikan global street art culture. Comfortable fit dengan design yang iconic.',
      price: 150000,
      stock: 0, // Will use variants
      images: '/product/merch/Discover - Worldwide Tshirt.jpeg',
      categoryId: merch.id,
      variantType: 'Size'
    },
    {
      name: 'Stickerun Stiker Polos Slap Graffiti',
      description: 'Stiker polos blank untuk custom designs. Perfect untuk slaps, tags, dan personal artwork. Pack isi multiple sheets.',
      price: 15000,
      stock: 200,
      images: '/product/merch/STICKERUN stiker polos stiker slap stiker graffiti.jpeg',
      categoryId: merch.id,
      variantType: null
    },
    {
      name: 'Stiker Hello My Name Cromo Small 10x6cm',
      description: 'Stiker Hello My Name chrome finish ukuran kecil 10x6cm. Glossy metallic effect yang eye-catching untuk name tags.',
      price: 5000,
      stock: 300,
      images: '/product/merch/STIKER HELLO MY NAME CROMO SMALL (10X6CM).jpeg',
      categoryId: merch.id,
      variantType: null
    },
    {
      name: 'Stiker Hello My Name Cromo Besar',
      description: 'Stiker Hello My Name chrome finish ukuran besar. Premium metallic stickers untuk maksimum visibility dan impact.',
      price: 8000,
      stock: 250,
      images: '/product/merch/STIKER HELLO my name is CROMO besar.jpeg',
      categoryId: merch.id,
      variantType: null
    },
    {
      name: 'Stiker Hello My Name Vinyl Besar',
      description: 'Stiker Hello My Name vinyl finish ukuran besar. Durable dan weather-resistant untuk outdoor use.',
      price: 7000,
      stock: 250,
      images: '/product/merch/STIKER HELLO my name is Vinyl besar.jpeg',
      categoryId: merch.id,
      variantType: null
    },
    {
      name: 'Stiker Hello My Name Vinyl Small 10x6cm',
      description: 'Stiker Hello My Name vinyl finish ukuran kecil 10x6cm. Classic matte finish yang long-lasting untuk name tags.',
      price: 4000,
      stock: 300,
      images: '/product/merch/STIKER HELLO MY NAME VINYL SMALL (10X6CM).jpeg',
      categoryId: merch.id,
      variantType: null
    }
  ];

  console.log(`Seeding ${products.length} products...`);

  // Create products and store IDs for variants
  const createdProducts: { [key: string]: string } = {};
  
  for (const prod of products) {
    const created = await prisma.product.create({ data: prod });
    createdProducts[prod.name] = created.id;
    console.log(`✓ Created: ${prod.name}`);
  }

  // Create variants for specific products
  const variants = [
    // Ammo Acrylic Marker 2-5mm colors
    { productId: createdProducts['Ammo Acrylic Marker 2-5mm'], name: 'Black', stock: 50 },
    { productId: createdProducts['Ammo Acrylic Marker 2-5mm'], name: 'White', stock: 50 },
    { productId: createdProducts['Ammo Acrylic Marker 2-5mm'], name: 'Red', stock: 40 },
    { productId: createdProducts['Ammo Acrylic Marker 2-5mm'], name: 'Blue', stock: 40 },
    { productId: createdProducts['Ammo Acrylic Marker 2-5mm'], name: 'Yellow', stock: 35 },
    { productId: createdProducts['Ammo Acrylic Marker 2-5mm'], name: 'Green', stock: 35 },

    // Posca PC-1M colors
    { productId: createdProducts['Posca PC-1M'], name: 'Black', stock: 45 },
    { productId: createdProducts['Posca PC-1M'], name: 'White', stock: 45 },
    { productId: createdProducts['Posca PC-1M'], name: 'Red', stock: 35 },
    { productId: createdProducts['Posca PC-1M'], name: 'Blue', stock: 35 },
    { productId: createdProducts['Posca PC-1M'], name: 'Yellow', stock: 30 },
    { productId: createdProducts['Posca PC-1M'], name: 'Green', stock: 30 },
    { productId: createdProducts['Posca PC-1M'], name: 'Pink', stock: 30 },

    // Posca PC-3M colors
    { productId: createdProducts['Posca PC-3M'], name: 'Black', stock: 50 },
    { productId: createdProducts['Posca PC-3M'], name: 'White', stock: 50 },
    { productId: createdProducts['Posca PC-3M'], name: 'Red', stock: 40 },
    { productId: createdProducts['Posca PC-3M'], name: 'Blue', stock: 40 },
    { productId: createdProducts['Posca PC-3M'], name: 'Yellow', stock: 35 },
    { productId: createdProducts['Posca PC-3M'], name: 'Green', stock: 35 },
    { productId: createdProducts['Posca PC-3M'], name: 'Pink', stock: 35 },
    { productId: createdProducts['Posca PC-3M'], name: 'Orange', stock: 30 },

    // T-Shirt sizes for all merch t-shirts
    { productId: createdProducts['Chaos Black On Black T-Shirt'], name: 'S', stock: 15 },
    { productId: createdProducts['Chaos Black On Black T-Shirt'], name: 'M', stock: 20 },
    { productId: createdProducts['Chaos Black On Black T-Shirt'], name: 'L', stock: 20 },
    { productId: createdProducts['Chaos Black On Black T-Shirt'], name: 'XL', stock: 15 },

    { productId: createdProducts['Chaos Bombing Long Sleeve T-Shirt'], name: 'S', stock: 15 },
    { productId: createdProducts['Chaos Bombing Long Sleeve T-Shirt'], name: 'M', stock: 20 },
    { productId: createdProducts['Chaos Bombing Long Sleeve T-Shirt'], name: 'L', stock: 20 },
    { productId: createdProducts['Chaos Bombing Long Sleeve T-Shirt'], name: 'XL', stock: 15 },

    { productId: createdProducts['Discover & Explore Long Sleeve T-Shirt'], name: 'S', stock: 15 },
    { productId: createdProducts['Discover & Explore Long Sleeve T-Shirt'], name: 'M', stock: 20 },
    { productId: createdProducts['Discover & Explore Long Sleeve T-Shirt'], name: 'L', stock: 20 },
    { productId: createdProducts['Discover & Explore Long Sleeve T-Shirt'], name: 'XL', stock: 15 },

    { productId: createdProducts['Discover Fire T-Shirt Black'], name: 'S', stock: 15 },
    { productId: createdProducts['Discover Fire T-Shirt Black'], name: 'M', stock: 20 },
    { productId: createdProducts['Discover Fire T-Shirt Black'], name: 'L', stock: 20 },
    { productId: createdProducts['Discover Fire T-Shirt Black'], name: 'XL', stock: 15 },

    { productId: createdProducts['Discover SuperSix T-Shirt'], name: 'S', stock: 15 },
    { productId: createdProducts['Discover SuperSix T-Shirt'], name: 'M', stock: 20 },
    { productId: createdProducts['Discover SuperSix T-Shirt'], name: 'L', stock: 20 },
    { productId: createdProducts['Discover SuperSix T-Shirt'], name: 'XL', stock: 15 },

    { productId: createdProducts['Discover Worldwide T-Shirt'], name: 'S', stock: 15 },
    { productId: createdProducts['Discover Worldwide T-Shirt'], name: 'M', stock: 20 },
    { productId: createdProducts['Discover Worldwide T-Shirt'], name: 'L', stock: 20 },
    { productId: createdProducts['Discover Worldwide T-Shirt'], name: 'XL', stock: 15 }
  ];

  console.log(`\nSeeding ${variants.length} variants...`);
  
  for (const variant of variants) {
    await prisma.variant.create({ data: variant });
    console.log(`✓ Created variant: ${variant.name} for product ID ${variant.productId}`);
  }

  console.log('\n✅ Product seeding completed!');
  console.log(`Total products created: ${products.length}`);
  console.log(`Total variants created: ${variants.length}`);
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
