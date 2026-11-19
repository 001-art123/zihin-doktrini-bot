# 🏛 Zihin Doktrini — 24/7 Otonom Meta Yayın Botu

Bu proje, **Zihin Doktrini** markası için Instagram (`@zihindoktrini`) ve Facebook (`Zihin Doktrini`) hesaplarında bilgisayarınız kapalıyken bile günde 3 kez tamamen otonom olarak görsel ve kaydırmalı (carousel) doktrin paylaşımları yapar.

---

## ⏰ Yayın Takvimi (Günde 3 Kez)

| Seans | Türkiye Saati | Format | İçerik |
|---|---|---|---|
| **Sabah** | `08:30` | Tekli Heykel Kartı | Güne başlarken zihin disiplini & odaklanma ilkesi |
| **Öğle** | `12:30` | 5-6 Slaytlık Karusel | En çok kaydedilen ve paylaşılan derin Stoacı rehber |
| **Akşam** | `20:30` | Tekli Heykel Kartı | Günün muhasebesi, dinginlik ve içsel güç ilkesi |

---

## 🚀 Kurulum (Sadece 2 Dakika)

### 1. Yeni Bir GitHub Deposu (Repository) Oluşturun
1. [github.com/new](https://github.com/new) adresine gidin.
2. Depo adı olarak `zihin-doktrini-bot` yazın.
3. İster **Private** (Gizli) ister **Public** seçin (Private önerilir).
4. Bu klasördeki tüm dosyaları depoya yükleyin (veya `git push` yapın).

### 2. GitHub Secrets (Anahtarları) Ekleyin
GitHub deponuzda sırasıyla:
`Settings` ➔ `Secrets and variables` ➔ `Actions` ➔ `New repository secret` butonuna tıklayın ve şu 3 anahtarı ekleyin:

1. **`PAGE_ACCESS_TOKEN`**:  
   `EAAQDhiLqN5gBTDnVKOj8xAGoH7oCl6vN1hEXoCZCosGK3MLBDI2vybsoNVQB4t66bAu1nLXh7GfMSbZCrCPmNZAgorrSJDHfpD5CFGZBoR4Pd5qRRuZCV0qDZCJheJ5Et8RUIuNBt5LUatDFL4J1MTpO8Iu0Y98QAbkeZAiwgN3ZBCg1P9fECmu0NgsKHETxZCWcbvQ31oZB6u`

2. **`PAGE_ID`**:  
   `1450379981489571`

3. **`IG_USER_ID`**:  
   `17841459536500089`

---

## ⚡️ Manuel Test (İstediğin Zaman Tek Tıkla Çalıştır)
Herhangi bir zamanda beklemeden anında paylaşım yaptırmak istersen:
1. GitHub deponuzda **Actions** sekmesine gidin.
2. Soldan **Zihin Doktrini 24/7 Autonomous Publisher** seçin.
3. Sağdaki **Run workflow** butonuna tıklayıp seansı seçin (`morning`, `noon`, `evening`) ve çalıştırın!
