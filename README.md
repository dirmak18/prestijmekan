# Prestij Mekan

Bu proje, firmalar hakkında röportajların yayınlandığı basit bir Node.js uygulamasıdır. Uygulama özel bir framework kullanmaz ve tüm içerik `data/interviews.json` dosyasında saklanır.

## Kurulum

Gereksinim sadece Node.js'tir. Aşağıdaki adımlarla uygulamayı başlatabilirsiniz:

1. Bağımlılıkları yükleyin (ilk kurulum için):

```bash
npm install
```

2. Sunucuyu başlatın:

```bash
npm start        # veya node server.js
```

3. Farklı bir port kullanmak isterseniz `PORT` değişkenini tanımlayın:

```bash
PORT=4000 npm start
```

Sunucu varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışır.

## Admin Paneli

`/admin` adresinden ulaşılabilen basit bir panel vardır. Şifre varsayılan olarak `admin123` olarak tanımlanmıştır. Buradan yeni röportaj ekleyebilir veya mevcutları silebilirsiniz.

## Notlar

Uygulama geliştirilmeye açıktır ve daha güçlü özellikler için bir framework kullanılabilir.
