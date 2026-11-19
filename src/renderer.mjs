import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

const STATUE_PATH = path.resolve('assets/statue.jpg');

function drawBaseStatueCard(ctx, w, h, statueImg, badgeText, rightText) {
  // 1. Black BG
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  // 2. Draw Antique Statue in BG (grayscale & darkened)
  if (statueImg) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(statueImg, 0, 0, w, h);
    ctx.restore();
  }

  // 3. Vignette & Dark Overlay for maximum contrast
  const vignette = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, 800);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.85)');
  vignette.addColorStop(1, '#000000');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // 4. Subtle Gold Ambient Glow at Top
  const topGlow = ctx.createRadialGradient(w / 2, 220, 20, w / 2, 300, 600);
  topGlow.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
  topGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, w, h);

  // 5. Gold Top Line
  const topBorderGlow = ctx.createLinearGradient(120, 0, w - 120, 0);
  topBorderGlow.addColorStop(0, 'rgba(212, 175, 55, 0)');
  topBorderGlow.addColorStop(0.5, 'rgba(212, 175, 55, 0.8)');
  topBorderGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = topBorderGlow;
  ctx.fillRect(120, 0, w - 240, 3);

  // Double Border Frame
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(45, 45, w - 90, h - 90);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(55, 55, w - 110, h - 110);

  // Header: Logo Badge
  const logoX = 120;
  const logoY = 135;
  ctx.beginPath();
  ctx.arc(logoX, logoY, 36, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a0a';
  ctx.fill();
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#D4AF37';
  ctx.stroke();

  ctx.font = '800 24px serif';
  ctx.fillStyle = '#D4AF37';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZD', logoX, logoY + 1);

  // Header Meta
  ctx.textAlign = 'left';
  ctx.font = '800 22px serif';
  ctx.fillStyle = '#F5F5F5';
  ctx.fillText(badgeText, 178, 125);

  ctx.font = '600 13px sans-serif';
  ctx.fillStyle = '#8E8E93';
  ctx.fillText('ZİHİN DOKTRİNİ • STOACILIK', 178, 150);

  // Header Right Tag
  if (rightText) {
    const tagW = 145;
    const tagH = 38;
    const tagX = w - 115 - tagW;
    const tagY = 116;

    ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagW, tagH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '700 15px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(rightText, tagX + (tagW / 2), tagY + (tagH / 2) + 1);
  }

  // Header Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, 200);
  ctx.lineTo(w - 90, 200);
  ctx.stroke();

  // Footer Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(90, 1215);
  ctx.lineTo(w - 90, 1215);
  ctx.stroke();

  // Footer Handle
  ctx.textAlign = 'left';
  ctx.font = '800 22px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('@zihindoktrini', 115, 1265);
}

// Render Single Statue Card (1080x1350)
export async function renderSingleStatueCard(doc, outputPath) {
  const w = 1080;
  const h = 1350;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  let statueImg = null;
  if (fs.existsSync(STATUE_PATH)) {
    statueImg = await loadImage(STATUE_PATH);
  }

  drawBaseStatueCard(ctx, w, h, statueImg, doc.category || 'ÖZ DİSİPLİN KODU', doc.ruleCode || 'KURAL #01');

  // Body
  ctx.textAlign = 'center';
  ctx.font = 'italic 110px serif';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.fillText('“', w / 2, 420);

  // Line 1
  ctx.font = '600 44px serif';
  ctx.fillStyle = '#E5E5EA';
  ctx.fillText(doc.line1, w / 2, 510);

  // Line 2 (Highlighted)
  ctx.font = '700 48px serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText(doc.line2_highlight, w / 2, 580);

  // Line 3
  ctx.font = '600 44px serif';
  ctx.fillStyle = '#E5E5EA';
  ctx.fillText(doc.line3, w / 2, 665);

  // Line 4 (Gold Accent)
  ctx.font = '800 50px serif';
  ctx.fillStyle = '#FFD700';
  ctx.fillText(doc.line4_gold, w / 2, 735);

  // Gold Divider
  const divGrad = ctx.createLinearGradient((w / 2) - 60, 0, (w / 2) + 60, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.9)');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = divGrad;
  ctx.fillRect((w / 2) - 60, 810, 120, 3);

  // Author
  ctx.font = '800 30px serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText(doc.author, w / 2, 875);

  ctx.font = '500 17px sans-serif';
  ctx.fillStyle = '#9E9EA5';
  ctx.fillText(doc.authorTitle, w / 2, 915);

  // Footer CTA
  ctx.textAlign = 'right';
  ctx.font = '600 18px sans-serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText('Bu duruşu hikayende paylaş ➔', w - 115, 1265);

  const jpegBuffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(outputPath, jpegBuffer);
  return outputPath;
}

// Render 5-Slide Carousel (1080x1350 each)
export async function renderCarouselSlides(carouselDoc, outputDir) {
  const w = 1080;
  const h = 1350;
  let statueImg = null;
  if (fs.existsSync(STATUE_PATH)) {
    statueImg = await loadImage(STATUE_PATH);
  }

  const slidePaths = [];

  // Slide 1: Cover
  const c1 = createCanvas(w, h);
  const ctx1 = c1.getContext('2d');
  drawBaseStatueCard(ctx1, w, h, statueImg, 'DOKTRİN SERİSİ', carouselDoc.cover.seriesTitle);

  ctx1.textAlign = 'center';
  ctx1.font = '800 36px serif';
  ctx1.fillStyle = '#8E8E93';
  ctx1.fillText(carouselDoc.cover.line1, w / 2, 460);

  ctx1.font = '900 68px serif';
  ctx1.fillStyle = '#FFD700';
  ctx1.fillText(carouselDoc.cover.line2_gold, w / 2, 550);

  ctx1.font = '800 36px serif';
  ctx1.fillStyle = '#8E8E93';
  ctx1.fillText(carouselDoc.cover.line3, w / 2, 640);

  ctx1.font = '800 62px serif';
  ctx1.fillStyle = '#FFFFFF';
  ctx1.fillText(carouselDoc.cover.line4_white, w / 2, 725);

  const divGrad = ctx1.createLinearGradient((w / 2) - 80, 0, (w / 2) + 80, 0);
  divGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
  divGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.9)');
  divGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx1.fillStyle = divGrad;
  ctx1.fillRect((w / 2) - 80, 795, 160, 3);

  ctx1.font = '500 22px sans-serif';
  ctx1.fillStyle = '#A0A0A5';
  ctx1.fillText(carouselDoc.cover.sub, w / 2, 850);

  ctx1.textAlign = 'right';
  ctx1.font = '700 20px sans-serif';
  ctx1.fillStyle = '#D4AF37';
  ctx1.fillText("Kaydırın ➔", w - 115, 1265);

  const p1 = path.join(outputDir, 'carousel_slide_1.jpg');
  fs.writeFileSync(p1, c1.toBuffer('image/jpeg', { quality: 0.95 }));
  slidePaths.push(p1);

  // Slides 2 - 5: Rules
  for (let i = 0; i < carouselDoc.slides.length; i++) {
    const s = carouselDoc.slides[i];
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');
    drawBaseStatueCard(ctx, w, h, statueImg, `KURAL ${i + 1} / 4`, s.tag);

    ctx.textAlign = 'center';
    ctx.font = '700 24px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(s.num, w / 2, 380);

    ctx.font = '700 46px serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(s.title1, w / 2, 460);
    ctx.fillStyle = '#FFD700';
    ctx.fillText(s.title2_gold, w / 2, 525);

    ctx.fillStyle = '#D4AF37';
    ctx.fillRect((w / 2) - 40, 580, 80, 2.5);

    ctx.font = '400 24px sans-serif';
    ctx.fillStyle = '#C7C7CC';
    let sY = 650;
    for (const line of s.lines) {
      ctx.fillText(line, w / 2, sY);
      sY += 46;
    }

    ctx.font = '700 20px serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(s.author, w / 2, 980);

    ctx.textAlign = 'right';
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = '#8E8E93';
    ctx.fillText(`${i + 1} / 4 ➔`, w - 115, 1265);

    const p = path.join(outputDir, `carousel_slide_${i + 2}.jpg`);
    fs.writeFileSync(p, c.toBuffer('image/jpeg', { quality: 0.95 }));
    slidePaths.push(p);
  }

  // Slide 6 / Outro Summary
  const cOutro = createCanvas(w, h);
  const ctxOutro = cOutro.getContext('2d');
  drawBaseStatueCard(ctxOutro, w, h, statueImg, 'KAPANIŞ İLKESİ', 'ÖZET');

  ctxOutro.textAlign = 'center';
  ctxOutro.font = '700 22px serif';
  ctxOutro.fillStyle = '#D4AF37';
  ctxOutro.fillText("TEMEL DOKTRİN", w / 2, 380);

  const boxW = 860;
  const boxH = 260;
  const boxX = (w - boxW) / 2;
  const boxY = 430;

  ctxOutro.fillStyle = 'rgba(212, 175, 55, 0.08)';
  ctxOutro.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctxOutro.lineWidth = 1.5;
  ctxOutro.beginPath();
  ctxOutro.roundRect(boxX, boxY, boxW, boxH, 16);
  ctxOutro.fill();
  ctxOutro.stroke();

  ctxOutro.font = 'italic 700 42px serif';
  ctxOutro.fillStyle = '#FFFFFF';
  ctxOutro.fillText("“Kendi zihnini fethetmeyen,", w / 2, 530);
  ctxOutro.fillStyle = '#FFD700';
  ctxOutro.fillText("hiçbir şeyi fethedemez.”", w / 2, 600);

  ctxOutro.textAlign = 'left';
  ctxOutro.font = '600 24px sans-serif';
  const ctaItems = [
    { icon: "💾", text: "Bu kuralları unutmamak için KAYDET." },
    { icon: "👥", text: "Güçlü bir duruş kazanmasını istediğin DOSTUNA GÖNDER." },
    { icon: "⚡️", text: "Zihnini disipline etmek için TAKİP ET: @zihindoktrini" }
  ];

  let ctaY = 770;
  for (const item of ctaItems) {
    ctxOutro.fillStyle = '#D4AF37';
    ctxOutro.fillText(item.icon, 140, ctaY);
    ctxOutro.fillStyle = '#F5F5F5';
    ctxOutro.fillText(item.text, 190, ctaY);
    ctaY += 65;
  }

  ctxOutro.textAlign = 'right';
  ctxOutro.font = '600 18px sans-serif';
  ctxOutro.fillStyle = '#D4AF37';
  ctxOutro.fillText("Bu duruşu hikayende paylaş ➔", w - 115, 1265);

  const pOutro = path.join(outputDir, `carousel_slide_${carouselDoc.slides.length + 2}.jpg`);
  fs.writeFileSync(pOutro, cOutro.toBuffer('image/jpeg', { quality: 0.95 }));
  slidePaths.push(pOutro);

  return slidePaths;
}
