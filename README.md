Deployment Link:
https://planescape-eight.vercel.app/



![image](https://github.com/user-attachments/assets/b7f4c221-9893-4e6b-a160-dc7f42fe92c2)



# PlaneScape

PlaneScape, kullanıcıların uçuş rezervasyonlarını yapmalarını ve mevcut rezervasyonlarını yönetmelerini sağlayan bir web uygulamasıdır. Bu proje, modern web teknolojileri kullanılarak geliştirilmiştir ve kullanıcı dostu bir arayüz sunar.

## Özellikler

- Uçuş arama ve rezervasyon yapma
- Mevcut rezervasyonları görüntüleme ve yönetme
- Uçuş detaylarını görüntüleme
- Responsive tasarım ile tüm cihazlarda uyumlu

## Kullanılan Teknolojiler

- **Next.js**: React tabanlı bir framework olup, sunucu tarafı render (SSR) ve statik site oluşturma (SSG) özellikleri sunar.
- **React**: Kullanıcı arayüzleri oluşturmak için kullanılan bir JavaScript kütüphanesidir.
- **TypeScript**: JavaScript'in statik tip kontrolü sağlayan bir süper setidir.
- **Tailwind CSS**: Hızlı ve verimli bir şekilde stil oluşturmak için kullanılan bir CSS framework'üdür.
- **Axios**: HTTP istekleri yapmak için kullanılan bir kütüphanedir.
- **MongoDB**: NoSQL veritabanı olarak kullanılmıştır.
- **Framer Motion**: Animasyonlar ve geçişler için kullanılan bir kütüphanedir.

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/planescape.git
    ```

2. Proje dizinine gidin:
    ```bash
    cd planescape
    ```

3. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
4. Gerekli çevresel değişkenleri `.env` dosyasına ekleyin:
    ```env
    SCHIPHOL_APP_ID=your_schiphol_app_id
    SCHIPHOL_APP_KEY=your_schiphol_app_key
    MONGODB_URI=your_mongodb_uri
    ```

5. Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```

6. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyin.

## Proje Yapısı

- **src/app/page.tsx**: Ana sayfa bileşeni, uçuş arama ve rezervasyon yapma işlemlerini içerir.
- **src/app/my-flights/page.tsx**: Kullanıcının mevcut rezervasyonlarını görüntülediği ve yönettiği sayfa.
- **src/components**: Uygulamanın çeşitli bileşenlerini içerir.
- **src/lib**: Yardımcı fonksiyonlar ve veritabanı bağlantı dosyalarını içerir.
- **public**: Statik dosyalar (resimler, ikonlar vb.) bu dizinde bulunur.
- **styles**: Global stil dosyalarını içerir.

## CSS Bilgileri

- **Tailwind CSS**: Projede stil oluşturmak için Tailwind CSS kullanılmıştır. Tailwind CSS, utility-first bir CSS framework'üdür ve hızlı bir şekilde stil oluşturmayı sağlar.
- **Responsive Tasarım**: Proje, farklı ekran boyutlarına uyum sağlayacak şekilde tasarlanmıştır. Tailwind CSS'in medya sorguları (`sm:`, `md:`, `lg:`, `xl:`) kullanılarak responsive tasarım sağlanmıştır.

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir pull request gönderin. Her türlü katkı ve geri bildirim memnuniyetle karşılanır.

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.