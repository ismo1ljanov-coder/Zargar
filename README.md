# Xazina

O'zbekiston uchun AI sayohat rejalashtiruvchi (UZ / RU / EN).

Foydalanuvchi nima xohlashini aytadi — Xazina AI butun kunlik marshrutni tuzadi: vaqt, byudjet, qiziqishlar, namoz vaqtlari, piyoda masofa.

## Ishga tushirish
```
npm install
npm run dev
```

## Vercel'ga joylash
vercel.com → Add New Project → shu repo'ni tanlang → Deploy. Sozlash shart emas (Vite avtomatik aniqlanadi).

## Holat (MVP)
- Barcha ekranlar tayyor: Onboarding, Bosh sahifa, AI chat, Marshrut, Jonli sayohat, Kalitlar, Profil.
- AI so'rovi hozir to'g'ridan-to'g'ri brauzerdan yuboriladi. Ishlab chiqarishda API kalit server tomonda (Supabase Edge Function) bo'lishi kerak. Ungacha ilova zaxira marshrutni ko'rsatadi.
- Keyingi bosqich: Supabase (ma'lumotlar bazasi + Google/Apple/Email kirish), haqiqiy xarita.
