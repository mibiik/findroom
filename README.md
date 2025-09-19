# 🏠 Dorm Swap - Yurt Değişim Platformu

Modern ve kullanıcı dostu yurt değişim platformu. Öğrenciler kolayca yurt değişimi yapabilir ve oda arkadaşı bulabilir.

## ✨ Özellikler

### 🔄 Yurt Değişimi
- Mevcut yurt bilgilerinizi girin
- İstediğiniz yurt özelliklerini belirleyin
- Otomatik eşleşme sistemi
- Detaylı filtreleme seçenekleri

### 👥 Oda Arkadaşı Arama
- Oda arkadaşı arama oluşturun
- Uyumlu kişileri bulun
- İletişim bilgilerini paylaşın

### 📊 Analitik Dashboard
- İstatistiklerinizi görün
- Eşleşme sayılarını takip edin
- Platform kullanım verileri

### 🔔 Bildirim Sistemi
- Yeni eşleşmeler için bildirimler
- Sistem güncellemeleri
- Önemli duyurular

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- Firebase hesabı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/mibiik/findroom.git
cd findroom
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Firebase yapılandırması**
- Firebase Console'da yeni proje oluşturun
- Firestore Database'i etkinleştirin
- `firebase/config.ts` dosyasına yapılandırma bilgilerinizi ekleyin

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:5173
```

## 🛠️ Teknolojiler

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Backend**: Firebase Firestore
- **Build Tool**: Vite
- **State Management**: React Hooks

## 📱 Kullanım

### Yurt Değişimi
1. "Talep Oluştur" sayfasına gidin
2. Mevcut yurt bilgilerinizi girin
3. İstediğiniz yurt özelliklerini seçin
4. İletişim bilgilerinizi ekleyin
5. Talebinizi yayınlayın

### Oda Arkadaşı Arama
1. "Oda Arkadaşı" sayfasına gidin
2. "Arama Oluştur" butonuna tıklayın
3. Arama kriterlerinizi belirleyin
4. Arama talebinizi oluşturun

### Eşleşmeleri Görüntüleme
1. "Eşleşmelerim" sayfasına gidin
2. Uyumlu talepleri görün
3. İletişim bilgilerini kullanarak iletişime geçin

## 🔧 Geliştirme

### Proje Yapısı
```
dorm-swap/
├── components/          # React bileşenleri
├── firebase/           # Firebase yapılandırması
├── types.ts           # TypeScript tip tanımları
├── constants.ts       # Sabitler
└── App.tsx           # Ana uygulama
```

### Önemli Dosyalar
- `App.tsx` - Ana uygulama mantığı
- `firebase/firestoreService.ts` - Veritabanı işlemleri
- `types.ts` - Veri yapıları
- `components/` - UI bileşenleri

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- GitHub: [@mibiik](https://github.com/mibiik)
- Proje Linki: [https://github.com/mibiik/findroom](https://github.com/mibiik/findroom)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

