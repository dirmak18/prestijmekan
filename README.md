# Prestij Mekan

Bu proje, firmalar hakkında röportajların yayınlandığı basit bir Node.js uygulamasıdır. Uygulama özel bir framework kullanmaz ve tüm içerik `data/interviews.json` dosyasında saklanır.

## Kurulum

Gereksinim sadece Node.js'tir. Aşağıdaki adımları izleyerek uygulamayı başlatabilirsiniz:

1. Repoyu klonlayın veya dosyaları indirin.
2. Komut satırında proje klasörüne geçin.
3. Opsiyonel olarak `npm install` komutunu çalıştırarak gerekli paketleri yükleyin. (Bu proje harici paket kullanmaz.)
4. Sunucuyu başlatmak için şu komutlardan birini kullanın:

```bash
npm start
# veya
node server.js
```

Sunucu varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışır. Portu değiştirmek isterseniz `PORT` ortam değişkenini belirleyebilirsiniz:

```bash
PORT=4000 node server.js
```

## Admin Paneli

`/admin` adresinden ulaşılabilen basit bir panel vardır. Şifre varsayılan olarak `admin123` olarak tanımlanmıştır. Buradan yeni röportaj ekleyebilir veya mevcutları silebilirsiniz.

## Notlar

Uygulama geliştirilmeye açıktır ve daha güçlü özellikler için bir framework kullanılabilir.
