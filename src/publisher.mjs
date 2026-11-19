import fs from 'fs';

export async function publishSinglePost(imagePath, caption, pageToken, pageId, igUserId) {
  console.log('--- 1. FACEBOOK SAYFASINA GÖRSEL YÜKLENİYOR ---');
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('source', blob, 'post.jpg');
  formData.append('caption', caption);
  formData.append('access_token', pageToken);

  const fbUploadRes = await fetch(`https://graph.facebook.com/v22.0/${pageId}/photos`, {
    method: 'POST',
    body: formData
  });

  const fbData = await fbUploadRes.json();
  if (!fbData.id) {
    throw new Error('Facebook yükleme hatası: ' + JSON.stringify(fbData));
  }
  console.log(`Facebook Gönderi ID: ${fbData.post_id || fbData.id}`);

  // Fetch CDN URL
  const photoDetailsRes = await fetch(`https://graph.facebook.com/v22.0/${fbData.id}?fields=images&access_token=${pageToken}`);
  const photoDetails = await photoDetailsRes.json();
  const cdnImageUrl = photoDetails.images[0].source;

  // Instagram Container
  console.log('--- 2. INSTAGRAM MEDYA KONTEYNERİ OLUŞTURULUYOR ---');
  const igContainerRes = await fetch(`https://graph.facebook.com/v22.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: cdnImageUrl,
      caption: caption,
      access_token: pageToken
    })
  });
  const igContainerData = await igContainerRes.json();
  if (!igContainerData.id) {
    throw new Error('Instagram konteyner hatası: ' + JSON.stringify(igContainerData));
  }

  console.log('Medya işleniyor, 5 saniye bekleniyor...');
  await new Promise(r => setTimeout(r, 5000));

  // Instagram Publish
  console.log('--- 3. INSTAGRAM GÖNDERİSİ YAYINLANIYOR ---');
  const igPublishRes = await fetch(`https://graph.facebook.com/v22.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: igContainerData.id,
      access_token: pageToken
    })
  });
  const igPublishData = await igPublishRes.json();
  if (!igPublishData.id) {
    throw new Error('Instagram yayınlama hatası: ' + JSON.stringify(igPublishData));
  }

  console.log(`🎉 Tekli görsel gönderi başarıyla yayınlandı! IG ID: ${igPublishData.id}`);
  return { fbPostId: fbData.post_id || fbData.id, igMediaId: igPublishData.id };
}

export async function publishCarouselPost(slidePaths, caption, pageToken, pageId, igUserId) {
  console.log(`--- 1. ${slidePaths.length} SLAYT META ÜZERİNE YÜKLENİYOR ---`);
  const uploadedPhotos = [];

  for (let i = 0; i < slidePaths.length; i++) {
    const buffer = fs.readFileSync(slidePaths[i]);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('source', blob, `slide_${i + 1}.jpg`);
    formData.append('published', 'false');
    formData.append('access_token', pageToken);

    const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/photos`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    const detailsRes = await fetch(`https://graph.facebook.com/v22.0/${data.id}?fields=images&access_token=${pageToken}`);
    const details = await detailsRes.json();

    uploadedPhotos.push({
      fbid: data.id,
      cdnUrl: details.images[0].source
    });
    console.log(`Slayt ${i + 1} yüklendi, FBID: ${data.id}`);
  }

  // Facebook Multi-Photo Post
  console.log('--- 2. FACEBOOK ÇOKLU GÖRSEL GÖNDERİSİ PAYLAŞILIYOR ---');
  const attachedMedia = uploadedPhotos.map(p => ({ media_fbid: p.fbid }));
  const fbFeedRes = await fetch(`https://graph.facebook.com/v22.0/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: caption,
      attached_media: attachedMedia,
      access_token: pageToken
    })
  });
  const fbFeedData = await fbFeedRes.json();
  console.log('Facebook Karusel Gönderi ID:', fbFeedData.id);

  // Instagram Carousel Items
  console.log('--- 3. INSTAGRAM CAROUSEL İTEMLERİ OLUŞTURULUYOR ---');
  const igItemIds = [];
  for (let i = 0; i < uploadedPhotos.length; i++) {
    const itemRes = await fetch(`https://graph.facebook.com/v22.0/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: uploadedPhotos[i].cdnUrl,
        is_carousel_item: true,
        access_token: pageToken
      })
    });
    const itemData = await itemRes.json();
    igItemIds.push(itemData.id);
  }

  // Instagram Carousel Parent Container
  console.log('--- 4. INSTAGRAM CAROUSEL ANA KONTEYNERİ OLUŞTURULUYOR ---');
  const carouselRes = await fetch(`https://graph.facebook.com/v22.0/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: igItemIds,
      caption: caption,
      access_token: pageToken
    })
  });
  const carouselData = await carouselRes.json();

  console.log('Karusel işleniyor, 5 saniye bekleniyor...');
  await new Promise(r => setTimeout(r, 5000));

  // Instagram Carousel Publish
  console.log('--- 5. INSTAGRAM CAROUSEL YAYINLANIYOR ---');
  const publishRes = await fetch(`https://graph.facebook.com/v22.0/${igUserId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: carouselData.id,
      access_token: pageToken
    })
  });
  const publishData = await publishRes.json();

  console.log(`🎉 Karusel başarıyla yayınlandı! IG ID: ${publishData.id}`);
  return { fbPostId: fbFeedData.id, igMediaId: publishData.id };
}
