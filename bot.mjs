import fs from 'fs';
import path from 'path';
import { SINGLE_DOCTRINES, CAROUSEL_DOCTRINES } from './src/doctrines.mjs';
import { renderSingleStatueCard, renderCarouselSlides } from './src/renderer.mjs';
import { publishSinglePost, publishCarouselPost } from './src/publisher.mjs';

// Environment credentials (from process.env or defaults)
const PAGE_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAAQDhiLqN5gBTDnVKOj8xAGoH7oCl6vN1hEXoCZCosGK3MLBDI2vybsoNVQB4t66bAu1nLXh7GfMSbZCrCPmNZAgorrSJDHfpD5CFGZBoR4Pd5qRRuZCV0qDZCJheJ5Et8RUIuNBt5LUatDFL4J1MTpO8Iu0Y98QAbkeZAiwgN3ZBCg1P9fECmu0NgsKHETxZCWcbvQ31oZB6u';
const PAGE_ID = process.env.PAGE_ID || '1450379981489571';
const IG_USER_ID = process.env.IG_USER_ID || '17841459536500089';

const args = process.argv.slice(2);
let slot = 'noon'; // default

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--slot' && args[i + 1]) {
    slot = args[i + 1].toLowerCase();
  }
}

// Ensure temp output directory exists
const tempDir = path.resolve('temp_output');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function run() {
  console.log(`========================================`);
  console.log(`🏛 ZİHİN DOKTRİNİ BULUT YAYIN BOTU`);
  console.log(`⏰ Zaman Dilimi (Slot): ${slot.toUpperCase()}`);
  console.log(`========================================\n`);

  if (slot === 'noon') {
    // NOON SLOT -> 5-Slide Deep Carousel
    console.log('📌 ÖĞLE SEANSI: 5 Slaytlık Kaydırmalı Karusel Hazırlanıyor...');
    const carouselIndex = Math.floor(Math.random() * CAROUSEL_DOCTRINES.length);
    const selectedCarousel = CAROUSEL_DOCTRINES[carouselIndex];

    const slidePaths = await renderCarouselSlides(selectedCarousel, tempDir);
    console.log(`Slaytlar render edildi: ${slidePaths.length} adet 1080x1350 görsel`);

    const result = await publishCarouselPost(
      slidePaths,
      selectedCarousel.caption,
      PAGE_TOKEN,
      PAGE_ID,
      IG_USER_ID
    );

    console.log('\n✅ Karusel yayını başarıyla tamamlandı!', result);
  } else {
    // MORNING or EVENING SLOT -> High-Impact Single Statue Card
    console.log(`📌 ${slot.toUpperCase()} SEANSI: Heykelli Sinematik Doktrin Kartı Hazırlanıyor...`);
    const docIndex = Math.floor(Math.random() * SINGLE_DOCTRINES.length);
    const selectedDoc = SINGLE_DOCTRINES[docIndex];

    const cardPath = path.join(tempDir, 'single_card.jpg');
    await renderSingleStatueCard(selectedDoc, cardPath);
    console.log(`Görsel render edildi: ${cardPath}`);

    const result = await publishSinglePost(
      cardPath,
      selectedDoc.caption,
      PAGE_TOKEN,
      PAGE_ID,
      IG_USER_ID
    );

    console.log('\n✅ Tekli kart yayını başarıyla tamamlandı!', result);
  }
}

run().catch(err => {
  console.error('\n❌ HATA OLUŞTU:', err);
  process.exit(1);
});
