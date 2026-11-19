import fs from 'fs';
import path from 'path';
import { SINGLE_DOCTRINES, CAROUSEL_DOCTRINES } from './src/doctrines.mjs';
import { renderSingleStatueCard, renderCarouselSlides } from './src/renderer.mjs';
import { publishSinglePost, publishCarouselPost } from './src/publisher.mjs';

// Environment credentials
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

// ----------------------------------------------------
// BAŞLANGIÇ ÇIPASI (STARTING ANCHOR): 20 KASIM 2026 (GÜN 0)
// Tam 10 gün boyunca sıfır tekrar; her seans tamamen benzersiz!
// ----------------------------------------------------
const anchorDate = new Date('2026-11-20T00:00:00+03:00');
const now = new Date();
const diffMs = now.getTime() - anchorDate.getTime();
const dayIndex = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

async function run() {
  console.log(`========================================`);
  console.log(`🏛 ZİHİN DOKTRİNİ 7/24 BULUT YAYIN BOTU`);
  console.log(`⏰ Hedef Seans: ${slot.toUpperCase()}`);
  console.log(`📅 Gün İndeksi (Day Index): ${dayIndex} (Başlangıç: 20 Kasım 2026)`);
  console.log(`========================================\n`);

  if (slot === 'noon') {
    // ----------------------------------------------------
    // KURAL: HER GÜN ÖĞLEN 12:30 SEANSI KESİNLİKLE 5 SLAYTLIK KAYDIRMALI KARUSELDİR!
    // 10 gün boyunca 10 farklı dev karusel serisi döner.
    // ----------------------------------------------------
    console.log('📌 ÖĞLE SEANSI (12:30): 5 Slaytlık Kaydırmalı Karusel Hazırlanıyor...');
    const carouselIndex = dayIndex % CAROUSEL_DOCTRINES.length;
    const selectedCarousel = CAROUSEL_DOCTRINES[carouselIndex];

    console.log(`Seçilen Karusel [Paket ${carouselIndex + 1}/10]: "${selectedCarousel.cover.line1} ${selectedCarousel.cover.line2_gold}"`);
    const slidePaths = await renderCarouselSlides(selectedCarousel, tempDir);
    console.log(`Slaytlar render edildi: ${slidePaths.length} adet 1080x1350 görsel`);

    const result = await publishCarouselPost(
      slidePaths,
      selectedCarousel.caption,
      PAGE_TOKEN,
      PAGE_ID,
      IG_USER_ID
    );

    console.log('\n✅ 5 Slaytlık Karusel yayını başarıyla tamamlandı!', result);
  } else {
    // ----------------------------------------------------
    // SABAH (08:30) VE AKŞAM (20:30): TEKLİ SİNEMATİK DOKTRİN KARTI
    // 10 gün boyunca 20 farklı benzersiz doktrin (#001'den #020'ye)
    // ----------------------------------------------------
    console.log(`📌 ${slot.toUpperCase()} SEANSI: Heykelli Sinematik Doktrin Kartı Hazırlanıyor...`);
    const isEvening = slot === 'evening';
    const globalSeq = (dayIndex * 2 + (isEvening ? 1 : 0));
    const docIndex = globalSeq % SINGLE_DOCTRINES.length;
    const selectedDoc = SINGLE_DOCTRINES[docIndex];

    const postNumber = String(globalSeq + 1).padStart(3, '0');
    console.log(`Seçilen Doktrin [No: #${postNumber}]: "${selectedDoc.title_gold} ${selectedDoc.title_white}"`);

    const fullCaption = `🏛 ZİHİN DOKTRİNİ #${postNumber}
${selectedDoc.title_gold} ${selectedDoc.title_white}

${selectedDoc.captionSummary}

📍 Zihin disiplini için takip et: @zihindoktrini
💾 İleride tekrar hatırlamak için bu gönderiyi KAYDET.
👥 Zihnini güçlendirmesini istediğin bir dostunla PAYLAŞ.

• • •
#zihindoktrini #stoacılık #felsefe #özdisiplin #irade #zihin #kişiselgelişim #motivasyon #stoic #bilgelik`;

    const cardPath = path.join(tempDir, 'single_card.jpg');
    await renderSingleStatueCard(selectedDoc, cardPath);
    console.log(`Görsel render edildi: ${cardPath}`);

    const result = await publishSinglePost(
      cardPath,
      fullCaption,
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
