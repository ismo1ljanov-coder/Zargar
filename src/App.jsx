import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon, Map as MapIcon, Trophy, User, Compass,
  Send, MapPin, Clock, Wallet, Navigation2, ChevronRight, ChevronLeft,
  Sparkles, Check, X, Moon, Sun, Footprints, Car, Sunrise,
  ArrowLeft, Star, Award, Flame, Globe, Settings, Bell, ChevronDown,
  Utensils, Landmark, ShoppingBag, Trees, BookOpen, PlayCircle, PauseCircle,
} from "lucide-react";

/* ============================== THEME ============================== */
const T = {
  emerald: "#0F5C4C",
  emeraldDark: "#0A3D32",
  emeraldDeep: "#082A22",
  turquoise: "#1E9C88",
  turquoiseSoft: "#CDE9E1",
  gold: "#C9973E",
  goldLight: "#E3C077",
  goldDeep: "#9C7326",
  cream: "#FBF7EC",
  sand: "#EFE6D2",
  sandDeep: "#E2D5B8",
  ink: "#16231F",
  inkSoft: "#5C6B64",
  white: "#FFFFFF",
};
const DARK = {
  bg: "#0A1512",
  card: "#11201B",
  card2: "#152922",
  text: "#F3EFE2",
  textSoft: "#9DAEA6",
  border: "#1E332B",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..800&family=Manrope:wght@400;500;600;700;800&display=swap');`;

/* ============================== GIRIH STAR (signature motif) ============================== */
function GirihStar({ size = 24, color = T.gold, opacity = 1 }) {
  // 8-pointed star, inspired by Uzbek majolica tilework
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      <polygon
        points="50,2 61,32 91,29 68,50 91,71 61,68 50,98 39,68 9,71 32,50 9,29 39,32"
        fill={color}
      />
    </svg>
  );
}

function GirihPattern({ opacity = 0.06, color = T.gold, id = "girih" }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          <polygon
            points="30,4 37,22 56,20 42,32 56,44 37,42 30,60 23,42 4,44 18,32 4,20 23,22"
            fill={color}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ============================== DATA ============================== */
const CATEGORY_META = {
  historical: { label: "Historical", icon: Landmark, color: T.gold },
  religious: { label: "Religious", icon: Sunrise, color: T.turquoise },
  food: { label: "Food", icon: Utensils, color: "#C1552F" },
  shopping: { label: "Shopping", icon: ShoppingBag, color: "#7A5CC8" },
  nature: { label: "Nature", icon: Trees, color: "#3C8A4E" },
};

const PLACE_DB = {
  Samarkand: [
    { name: "Registan Square", category: "historical", desc: "The heart of Samarkand — three grand madrasas covered in turquoise mosaics.", price: "50,000 UZS", duration: "60 min" },
    { name: "Bibi-Khanym Mosque", category: "religious", desc: "One of the largest mosques of the Islamic world, built by Amir Timur.", price: "30,000 UZS", duration: "40 min" },
    { name: "Siab Bazaar", category: "food", desc: "A lively local market for fresh bread, dried fruit, and spices.", price: "Free entry", duration: "45 min" },
    { name: "Shah-i-Zinda", category: "religious", desc: "An avenue of dazzling mausoleums wrapped in glazed tile.", price: "40,000 UZS", duration: "50 min" },
    { name: "Gur-e-Amir Mausoleum", category: "historical", desc: "The resting place of Amir Timur, crowned with a ribbed azure dome.", price: "35,000 UZS", duration: "35 min" },
  ],
  Bukhara: [
    { name: "Ark of Bukhara", category: "historical", desc: "A royal fortress that ruled the city for over a millennium.", price: "40,000 UZS", duration: "50 min" },
    { name: "Lyabi-Hauz", category: "food", desc: "A shaded pool-side square lined with teahouses and mulberry trees.", price: "Free entry", duration: "40 min" },
    { name: "Kalyan Minaret", category: "religious", desc: "A soaring 12th-century minaret that once guided desert caravans.", price: "30,000 UZS", duration: "30 min" },
    { name: "Chor Minor", category: "historical", desc: "A whimsical gatehouse with four uniquely-topped towers.", price: "15,000 UZS", duration: "20 min" },
  ],
  Tashkent: [
    { name: "Chorsu Bazaar", category: "shopping", desc: "A vast domed bazaar for spices, textiles, and street food.", price: "Free entry", duration: "50 min" },
    { name: "Amir Timur Square", category: "historical", desc: "A leafy central square anchored by an equestrian statue.", price: "Free entry", duration: "25 min" },
    { name: "Khast Imam Complex", category: "religious", desc: "Home to the Uthman Quran, one of the oldest in the world.", price: "25,000 UZS", duration: "45 min" },
    { name: "Magic City", category: "nature", desc: "A riverside park with fountains and evening light shows.", price: "20,000 UZS", duration: "40 min" },
  ],
  Namangan: [
    { name: "Mullah Kirgiz Madrasa", category: "historical", desc: "A finely carved brick madrasa in the old quarter.", price: "15,000 UZS", duration: "30 min" },
    { name: "Namangan Bazaar", category: "food", desc: "Fergana Valley's freshest produce and hot samsa.", price: "Free entry", duration: "35 min" },
    { name: "Davlat Park", category: "nature", desc: "A calm riverside walking park in the city centre.", price: "Free entry", duration: "30 min" },
  ],
};

const ACHIEVEMENTS = [
  { id: "first_key", icon: GirihStar },
  { id: "five_keys", icon: Award },
  { id: "one_city", icon: Flame },
  { id: "three_trips", icon: Trophy },
];

/* ============================== LOCALIZATION (EN / UZ / RU) ============================== */
const LANG = {
  uz: {
    code: "uz", name: "O'zbekcha", aiLangName: "Uzbek",
    nav: { home: "Bosh sahifa", trips: "Sayohat", map: "Xarita", keys: "Kalit", profile: "Profil" },
    onboarding: {
      skip: "O'tkazib yuborish", continueBtn: "Davom etish", start: "Boshlash",
      slides: [
        { title: "AI sayohat yo'lboshchingiz bilan tanishing", body: "Xazinaga nima xohlayotganingizni ayting — u butun kuningizni rejalashtiradi. Forma yo'q, ortiqcha narsa yo'q." },
        { title: "Shaxsiylashtirilgan marshrutlar", body: "Vaqt, byudjet, qiziqishlar, namoz vaqtlari — Xazina hammasini bitta silliq marshrutga joylaydi." },
        { title: "Yashirin joylarni kashf eting", body: "Yo'riqnomalardan tashqarida — mahalliy bozorlar, tinch hovlilar va halol taom." },
        { title: "Sayohat davomida Kalitlar to'plang", body: "Tashrif buyurgan har bir joy sizga Kalit beradi. Butun O'zbekiston bo'ylab xazinangizni to'ldiring." },
      ],
    },
    home: {
      greeting: "Xush kelibsiz", heading: (n) => `Bugun qayerga boramiz, ${n}?`,
      placeholder: "Bugun nima qilmoqchisiz?", tryAsking: "Shunday deb so'rang",
      exploreCity: "Shaharni tanlang", recentTrip: "Oxirgi sayohatingiz", stopsWord: "to'xtash",
      examples: ["Namanganda 5 soatim bor.", "Tarixiy joylarni ko'rmoqchiman.", "Oila bilan sayohat qilyapman.", "Halol taom istayman.", "Atigi 150,000 so'mim bor."],
    },
    chat: { title: "Xazina AI", placeholder: "Javobingizni yozing...", fallback: "Mana sizning marshrutingiz!" },
    itinerary: { todaySuffix: "· Bugun", totalTime: "Umumiy vaqt", walking: "Piyoda yo'l", budget: "Byudjet", start: "Sayohatni boshlash" },
    liveTrip: {
      title: "Jonli sayohat", stopOf: (a, b) => `${a}-bosqich, jami ${b} ta`,
      headingTo: "Yo'ldasiz:", arrivedAt: "Siz yetib keldingiz:", onFoot: "piyoda", byTaxi: "taksida",
      keyCollected: "Kalit qo'lga kiritildi!", ready: "Keyingi bekatga tayyormisiz?", finish: "Sayohatni yakunlash",
      simulate: "Kelishni tezlashtirish", remainingToast: "15 daqiqa qoldi.", arrivedToast: "Siz yetib keldingiz.",
    },
    achievements: {
      title: "Kalitlar va yutuqlar", treasury: "Xazinangiz", keysCount: (n) => `${n} ta Kalit`,
      across: (n) => `${n} ta shahar bo'ylab`, collectedKeys: "To'plangan kalitlar",
      noKeys: "Birinchi Kalitni qo'lga kiritish uchun sayohatni yakunlang.", achievementsLabel: "Yutuqlar",
      list: {
        first_key: { label: "Birinchi kalit", desc: "Birinchi Kalitingizni to'plang" },
        five_keys: { label: "Xazina ovchisi", desc: "5 ta Kalit to'plang" },
        one_city: { label: "Shahar sayohatchisi", desc: "Bitta shaharni yakunlang" },
        three_trips: { label: "Sarguzashtchi", desc: "3 ta sayohatni yakunlang" },
      },
    },
    trips: { title: "Sayohatlaringiz", none: "Hali sayohatlar yo'q", ask: "Birinchi kuningizni rejalashtirish uchun Xazina AI'dan so'rang.", completed: "Yakunlangan", planned: "Rejalashtirilgan", stopsWord: "to'xtash" },
    map: { title: "Xarita", plan: "Marshrutni ko'rish uchun sayohat tuzing", stopsIn: (n, c) => `${c}da ${n} ta to'xtash`, caption: "Xarita — Xazina AI tuzgan marshrutlarni ko'rsatish uchun yordamchi vosita, u asosiy tajriba emas." },
    profile: { title: "Profil", subtitle: "O'zbekiston bo'ylab sayohatchi", trips: "Sayohat", cities: "Shahar", keys: "Kalit", settings: "Sozlamalar", darkMode: "Tungi rejim", language: "Til", notifications: "Bildirishnomalar", account: "Hisob" },
    categories: { historical: "Tarixiy", religious: "Diniy", food: "Taom", shopping: "Xarid", nature: "Tabiat" },
  },
  ru: {
    code: "ru", name: "Русский", aiLangName: "Russian",
    nav: { home: "Главная", trips: "Поездки", map: "Карта", keys: "Ключи", profile: "Профиль" },
    onboarding: {
      skip: "Пропустить", continueBtn: "Далее", start: "Начать",
      slides: [
        { title: "Знакомьтесь с ИИ-гидом", body: "Расскажите Xazina, чего хотите — и он спланирует весь день. Без анкет и лишнего." },
        { title: "Персональные маршруты", body: "Время, бюджет, интересы, время намаза — всё уместится в один удобный маршрут." },
        { title: "Открывайте скрытые места", body: "За пределами путеводителей — местные базары, тихие дворики и честная еда." },
        { title: "Собирайте Ключи в путешествии", body: "За каждое посещённое место вы получаете Ключ. Соберите сокровищницу по всему Узбекистану." },
      ],
    },
    home: {
      greeting: "Добро пожаловать", heading: (n) => `Куда отправимся сегодня, ${n}?`,
      placeholder: "Что вы хотите сделать сегодня?", tryAsking: "Попробуйте спросить",
      exploreCity: "Исследовать город", recentTrip: "Ваша последняя поездка", stopsWord: "остановок",
      examples: ["У меня есть 5 часов в Намангане.", "Хочу увидеть исторические места.", "Путешествую с семьёй.", "Хочу халяльную еду.", "У меня только 150 000 сум."],
    },
    chat: { title: "Xazina AI", placeholder: "Введите ваш ответ...", fallback: "Вот ваш маршрут!" },
    itinerary: { todaySuffix: "· Сегодня", totalTime: "Общее время", walking: "Пешком", budget: "Бюджет", start: "Начать поездку" },
    liveTrip: {
      title: "Живая поездка", stopOf: (a, b) => `Остановка ${a} из ${b}`,
      headingTo: "Вы направляетесь к:", arrivedAt: "Вы прибыли в:", onFoot: "пешком", byTaxi: "на такси",
      keyCollected: "Ключ получен!", ready: "Готовы к следующей остановке?", finish: "Завершить поездку",
      simulate: "Ускорить прибытие", remainingToast: "Осталось 15 минут.", arrivedToast: "Вы прибыли.",
    },
    achievements: {
      title: "Ключи и достижения", treasury: "Ваша сокровищница", keysCount: (n) => `${n} ${n === 1 ? "ключ" : "ключей"}`,
      across: (n) => `По ${n} ${n === 1 ? "городу" : "городам"}`, collectedKeys: "Собранные ключи",
      noKeys: "Завершите поездку, чтобы получить первый Ключ.", achievementsLabel: "Достижения",
      list: {
        first_key: { label: "Первый ключ", desc: "Соберите свой первый Ключ" },
        five_keys: { label: "Охотник за сокровищами", desc: "Соберите 5 Ключей" },
        one_city: { label: "Исследователь города", desc: "Завершите город" },
        three_trips: { label: "Путешественник", desc: "Завершите 3 поездки" },
      },
    },
    trips: { title: "Ваши поездки", none: "Поездок пока нет", ask: "Спросите Xazina AI, чтобы спланировать первый день.", completed: "Завершено", planned: "Запланировано", stopsWord: "остановок" },
    map: { title: "Карта", plan: "Спланируйте поездку, чтобы увидеть маршрут здесь", stopsIn: (n, c) => `${n} остановок в городе ${c}`, caption: "Карта — вспомогательный инструмент для визуализации маршрутов Xazina AI, а не основной опыт." },
    profile: { title: "Профиль", subtitle: "Исследователь Узбекистана", trips: "Поездки", cities: "Города", keys: "Ключи", settings: "Настройки", darkMode: "Тёмная тема", language: "Язык", notifications: "Уведомления", account: "Аккаунт" },
    categories: { historical: "Исторический", religious: "Религиозный", food: "Еда", shopping: "Покупки", nature: "Природа" },
  },
  en: {
    code: "en", name: "English", aiLangName: "English",
    nav: { home: "Home", trips: "Trips", map: "Map", keys: "Keys", profile: "Profile" },
    onboarding: {
      skip: "Skip", continueBtn: "Continue", start: "Get started",
      slides: [
        { title: "Meet your AI travel guide", body: "Tell Xazina what you want and it plans your entire day — no forms, no clutter." },
        { title: "Personalized itineraries", body: "Time, budget, interests, prayer schedule — Xazina fits everything into one smooth route." },
        { title: "Discover hidden places", body: "Beyond the guidebooks — local bazaars, quiet courtyards, and honest food." },
        { title: "Collect Keys as you explore", body: "Every place you visit earns a Key. Fill your treasury across all of Uzbekistan." },
      ],
    },
    home: {
      greeting: "Welcome", heading: (n) => `Where shall we wander today, ${n}?`,
      placeholder: "What would you like to do today?", tryAsking: "Try asking",
      exploreCity: "Explore a city", recentTrip: "Your recent trip", stopsWord: "stops",
      examples: ["I have 5 hours in Namangan.", "I want historical places.", "I'm travelling with family.", "I want halal food.", "I only have 150,000 UZS."],
    },
    chat: { title: "Xazina AI", placeholder: "Type your answer...", fallback: "Here is your itinerary!" },
    itinerary: { todaySuffix: "· Today", totalTime: "Total time", walking: "Walking", budget: "Budget", start: "Start this trip" },
    liveTrip: {
      title: "Live Trip", stopOf: (a, b) => `Stop ${a} of ${b}`,
      headingTo: "Heading to", arrivedAt: "You have arrived at", onFoot: "on foot", byTaxi: "by taxi",
      keyCollected: "Key collected!", ready: "Ready for next stop?", finish: "Finish trip",
      simulate: "Simulate arrival", remainingToast: "15 minutes remaining.", arrivedToast: "You arrived.",
    },
    achievements: {
      title: "Keys & Achievements", treasury: "Your treasury", keysCount: (n) => `${n} Keys`,
      across: (n) => `Across ${n} ${n === 1 ? "city" : "cities"}`, collectedKeys: "Collected keys",
      noKeys: "Complete a trip to earn your first Key.", achievementsLabel: "Achievements",
      list: {
        first_key: { label: "First Key", desc: "Collect your first Key" },
        five_keys: { label: "Treasure Hunter", desc: "Collect 5 Keys" },
        one_city: { label: "City Explorer", desc: "Complete a city" },
        three_trips: { label: "Wanderer", desc: "Finish 3 trips" },
      },
    },
    trips: { title: "Your Trips", none: "No trips yet", ask: "Ask Xazina AI to plan your first day out.", completed: "Completed", planned: "Planned", stopsWord: "stops" },
    map: { title: "Map", plan: "Plan a trip to see your route here", stopsIn: (n, c) => `${n} stops in ${c}`, caption: "The map visualizes routes Xazina AI plans for you — it's a companion to your itinerary, not the starting point." },
    profile: { title: "Profile", subtitle: "Explorer of Uzbekistan", trips: "Trips", cities: "Cities", keys: "Keys", settings: "Settings", darkMode: "Dark mode", language: "Language", notifications: "Notifications", account: "Account" },
    categories: { historical: "Historical", religious: "Religious", food: "Food", shopping: "Shopping", nature: "Nature" },
  },
};

/* ============================== AI ENGINE ============================== */
function buildSystemPrompt(aiLangName) {
  return `You are Xazina AI, a warm, highly practical professional local travel guide for Uzbekistan (cities: Tashkent, Samarkand, Bukhara, Khiva, Namangan, Fergana).
Given the conversation so far, decide if you have enough information to build a full day itinerary. You need at minimum: city/location, available time, and interests (or budget/travel style). Ask at most one short question at a time if something important is missing (max 4 questions total), optionally offering 3-4 short quickReplies. Once you have enough, produce a complete itinerary.
Respond with ONLY minified JSON, no markdown fences, no prose, matching exactly one shape:
{"type":"question","message":"<short question>","quickReplies":["opt1","opt2","opt3"]}
or
{"type":"itinerary","city":"<city>","summary":"<one warm sentence>","totalTime":"<e.g. 5 hours>","totalWalking":"<e.g. 3.2 km>","totalBudget":"<e.g. 120,000 UZS>","stops":[{"name":"<real place name>","category":"historical|religious|food|shopping|nature","description":"<1-2 sentences>","arrivalTime":"<HH:MM>","duration":"<e.g. 45 min>","distanceFromPrev":"<e.g. 600 m>","travelMethod":"walk|taxi","price":"<e.g. 20,000 UZS or Free>"}]}
Use real, well-known places in the given city. Order stops for minimum travel time and logical geographic flow. If the user wants prayer times considered, insert short notes/breaks near Dhuhr/Asr. Keep descriptions vivid but brief.
IMPORTANT: Write every human-readable value (message, quickReplies, summary, description, place names may stay in their original script) in ${aiLangName}. Never include text outside the JSON object.`;
}

async function callXazinaAI(messages, aiLangName) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: buildSystemPrompt(aiLangName),
      messages,
    }),
  });
  const data = await response.json();
  const text = (data.content || []).map((b) => b.text || "").join("\n");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function fallbackItinerary(city = "Samarkand", lang = "en") {
  const places = PLACE_DB[city] || PLACE_DB.Samarkand;
  let t = 9 * 60;
  const stops = places.slice(0, 4).map((p, i) => {
    const arrival = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    t += 60 + 20;
    return {
      name: p.name, category: p.category, description: p.desc,
      arrivalTime: arrival, duration: p.duration,
      distanceFromPrev: i === 0 ? "—" : `${(300 + i * 150)} m`,
      travelMethod: i === 0 ? "walk" : (i % 2 === 0 ? "taxi" : "walk"),
      price: p.price,
    };
  });
  const summaries = {
    uz: `${city} bo'ylab tinch, tarixga boy kun.`,
    ru: `Спокойный день по самым ярким историческим местам города ${city}.`,
    en: `A relaxed day through ${city}'s finest historical corners.`,
  };
  return {
    type: "itinerary", city,
    summary: summaries[lang] || summaries.en,
    totalTime: "4.5 hours", totalWalking: "2.8 km", totalBudget: "95,000 UZS",
    stops,
  };
}

/* ============================== SMALL UI ATOMS ============================== */
function GButton({ children, onClick, variant = "primary", className = "", icon: Icon, dark }) {
  const base = "flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all active:scale-95 select-none";
  const styles = {
    primary: { background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})`, color: T.white, boxShadow: "0 8px 24px -8px rgba(15,92,76,0.5)" },
    gold: { background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`, color: T.emeraldDeep, boxShadow: "0 8px 24px -8px rgba(201,151,62,0.5)" },
    ghost: { background: dark ? DARK.card2 : T.white, color: dark ? DARK.text : T.ink, border: `1px solid ${dark ? DARK.border : T.sandDeep}` },
    text: { background: "transparent", color: dark ? DARK.textSoft : T.inkSoft },
  };
  return (
    <button onClick={onClick} className={`${base} px-5 py-3.5 text-sm ${className}`} style={styles[variant]}>
      {Icon && <Icon size={17} strokeWidth={2.3} />}
      {children}
    </button>
  );
}

function Chip({ children, onClick, active, dark }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 border"
      style={{
        background: active ? T.emerald : (dark ? DARK.card2 : T.white),
        color: active ? T.white : (dark ? DARK.text : T.ink),
        borderColor: active ? T.emerald : (dark ? DARK.border : T.sandDeep),
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "", dark, style = {} }) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={{
        background: dark ? DARK.card : T.white,
        boxShadow: dark ? "none" : "0 12px 32px -16px rgba(22,35,31,0.18)",
        border: `1px solid ${dark ? DARK.border : T.sand}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TopBar({ title, onBack, dark, right }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-3">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: dark ? DARK.card2 : T.sand }}>
            <ArrowLeft size={17} color={dark ? DARK.text : T.ink} />
          </button>
        )}
        <h1 className="text-lg font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}

/* ============================== ONBOARDING ============================== */
const ONBOARD_ICONS = [Sparkles, Compass, MapPin, GirihStar];

function Onboarding({ onDone, dark, lang, setLang }) {
  const t = LANG[lang];
  const [i, setI] = useState(0);
  const slides = t.onboarding.slides;
  const slide = slides[i];
  const Icon = ONBOARD_ICONS[i];
  return (
    <div className="h-full flex flex-col justify-between relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${T.emeraldDeep}, ${T.emerald} 60%, ${T.turquoise})` }}>
      <GirihPattern opacity={0.08} color={T.gold} id="onb" />
      <div className="flex justify-between items-center p-5 relative z-10">
        <div className="flex gap-1.5">
          {Object.keys(LANG).map((code) => (
            <button key={code} onClick={() => setLang(code)} className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: lang === code ? "rgba(227,192,119,0.25)" : "transparent", color: lang === code ? T.goldLight : "rgba(255,255,255,0.5)", border: `1px solid ${lang === code ? T.goldLight : "rgba(255,255,255,0.2)"}` }}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        {i < slides.length - 1 && (
          <button onClick={() => onDone()} className="text-sm font-medium" style={{ color: T.goldLight }}>{t.onboarding.skip}</button>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
            className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center mb-8" style={{ borderRadius: 28, background: "rgba(255,255,255,0.1)", border: `1px solid rgba(227,192,119,0.3)` }}>
              <Icon size={38} color={T.goldLight} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: "Fraunces, serif" }}>{slide.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative z-10 px-6 pb-8">
        <div className="flex items-center justify-center gap-2 mb-7">
          {slides.map((_, idx) => (
            <div key={idx} className="rounded-full transition-all" style={{ height: 6, width: idx === i ? 22 : 6, background: idx === i ? T.gold : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
        <GButton
          variant="gold"
          className="w-full"
          icon={i === slides.length - 1 ? Check : ChevronRight}
          onClick={() => (i === slides.length - 1 ? onDone() : setI(i + 1))}
        >
          {i === slides.length - 1 ? t.onboarding.start : t.onboarding.continueBtn}
        </GButton>
      </div>
    </div>
  );
}

/* ============================== BOTTOM NAV ============================== */
function BottomNav({ screen, setScreen, dark, lang }) {
  const t = LANG[lang];
  const items = [
    { id: "home", label: t.nav.home, icon: HomeIcon },
    { id: "trips", label: t.nav.trips, icon: BookOpen },
    { id: "map", label: t.nav.map, icon: MapIcon },
    { id: "achievements", label: t.nav.keys, icon: GirihStar },
    { id: "profile", label: t.nav.profile, icon: User },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 z-30" style={{ background: dark ? `linear-gradient(0deg, ${DARK.bg} 60%, transparent)` : `linear-gradient(0deg, ${T.cream} 60%, transparent)` }}>
      <div className="flex items-center justify-between px-2 py-2.5" style={{ borderRadius: 26, background: dark ? DARK.card : T.white, boxShadow: "0 12px 32px -12px rgba(22,35,31,0.25)", border: `1px solid ${dark ? DARK.border : T.sand}` }}>
        {items.map((it) => {
          const active = screen === it.id;
          const Icon = it.icon;
          return (
            <button key={it.id} onClick={() => setScreen(it.id)} className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all">
              <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all" style={{ background: active ? T.emerald : "transparent" }}>
                {it.id === "achievements" ? <GirihStar size={17} color={active ? T.white : (dark ? DARK.textSoft : T.inkSoft)} /> : <Icon size={17} color={active ? T.white : (dark ? DARK.textSoft : T.inkSoft)} strokeWidth={2.2} />}
              </div>
              <span className="text-xs font-semibold" style={{ color: active ? T.emerald : (dark ? DARK.textSoft : T.inkSoft) }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== HOME SCREEN ============================== */
function HomeScreen({ onSubmit, dark, trips, userName, lang }) {
  const t = LANG[lang];
  const [text, setText] = useState("");
  return (
    <div className="h-full overflow-y-auto pb-32">
      <div className="px-5 pt-7 pb-2">
        <p className="text-sm font-medium mb-1" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.home.greeting}</p>
        <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>
          {t.home.heading(userName)}
        </h1>
      </div>

      <div className="px-5 mt-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          className="relative overflow-hidden"
          style={{ borderRadius: 28, padding: 1.5, background: `linear-gradient(120deg, ${T.gold}, ${T.turquoise}, ${T.gold})`, backgroundSize: "200% 200%" }}
        >
          <div className="p-5" style={{ borderRadius: 27, background: dark ? DARK.card : T.white }}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})` }}>
                <Sparkles size={16} color="white" />
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.home.placeholder}
                rows={2}
                className="flex-1 bg-transparent outline-none resize-none text-base pt-1.5"
                style={{ color: dark ? DARK.text : T.ink, fontFamily: "Manrope, sans-serif" }}
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                disabled={!text.trim()}
                onClick={() => text.trim() && onSubmit(text.trim())}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
                style={{ background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})` }}
              >
                <Send size={16} color="white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-5 pl-5">
        <p className="text-xs font-semibold mb-2.5 uppercase tracking-wide" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.home.tryAsking}</p>
        <div className="flex gap-2 overflow-x-auto pb-1 pr-5" style={{ scrollbarWidth: "none" }}>
          {t.home.examples.map((ex) => (
            <Chip key={ex} dark={dark} onClick={() => onSubmit(ex)}>{ex}</Chip>
          ))}
        </div>
      </div>

      <div className="mt-7 px-5">
        <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.home.exploreCity}</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(PLACE_DB).map((city) => (
            <button key={city} onClick={() => onSubmit(`${city}`)} className="relative rounded-2xl overflow-hidden h-24 text-left">
              <img src={`https://picsum.photos/seed/${city}/300/200`} alt={city} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(10,20,17,0.75), rgba(10,20,17,0.05))" }} />
              <span className="absolute bottom-2.5 left-3 text-white font-bold text-sm" style={{ fontFamily: "Fraunces, serif" }}>{city}</span>
            </button>
          ))}
        </div>
      </div>

      {trips.length > 0 && (
        <div className="mt-7 px-5">
          <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.home.recentTrip}</p>
          <Card dark={dark} className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: T.sand }}>
              <MapPin size={18} color={T.emerald} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: dark ? DARK.text : T.ink }}>{trips[trips.length - 1].city}</p>
              <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{trips[trips.length - 1].stops.length} {t.home.stopsWord} · {trips[trips.length - 1].totalTime}</p>
            </div>
            <ChevronRight size={16} color={dark ? DARK.textSoft : T.inkSoft} />
          </Card>
        </div>
      )}
    </div>
  );
}

/* ============================== CHAT SCREEN ============================== */
function ChatScreen({ initialMessage, onItinerary, onBack, dark, lang }) {
  const t = LANG[lang];
  const [chat, setChat] = useState([]); // {role, display, quickReplies}
  const [apiMessages, setApiMessages] = useState([]); // anthropic format
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const started = useRef(false);

  const pushAndAsk = useCallback(async (nextApiMessages) => {
    setLoading(true);
    let result;
    try {
      result = await callXazinaAI(nextApiMessages, t.aiLangName);
    } catch (e) {
      result = fallbackItinerary(undefined, lang);
    }
    setLoading(false);
    if (result.type === "itinerary") {
      setChat((c) => [...c, { role: "assistant", display: result.summary || t.chat.fallback }]);
      setTimeout(() => onItinerary(result), 500);
    } else {
      setChat((c) => [...c, { role: "assistant", display: result.message, quickReplies: result.quickReplies }]);
      setApiMessages([...nextApiMessages, { role: "assistant", content: JSON.stringify(result) }]);
    }
  }, [onItinerary, lang]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setChat([{ role: "user", display: initialMessage }]);
    const first = [{ role: "user", content: initialMessage }];
    setApiMessages(first);
    pushAndAsk(first);
  }, [initialMessage, pushAndAsk]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, loading]);

  const send = (val) => {
    if (!val.trim()) return;
    setChat((c) => [...c, { role: "user", display: val }]);
    const next = [...apiMessages, { role: "user", content: val }];
    setApiMessages(next);
    setInput("");
    pushAndAsk(next);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={t.chat.title} onBack={onBack} dark={dark}
        right={<div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})` }}><Sparkles size={15} color="white" /></div>} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5">
        {chat.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div style={{ maxWidth: "82%" }}>
              <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed" style={
                m.role === "user"
                  ? { background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})`, color: "white", borderBottomRightRadius: 6 }
                  : { background: dark ? DARK.card : T.white, color: dark ? DARK.text : T.ink, border: `1px solid ${dark ? DARK.border : T.sand}`, borderBottomLeftRadius: 6 }
              }>
                {m.display}
              </div>
              {m.quickReplies && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {m.quickReplies.map((qr) => (
                    <Chip key={qr} dark={dark} onClick={() => send(qr)}>{qr}</Chip>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 flex gap-1.5 items-center" style={{ background: dark ? DARK.card : T.white, border: `1px solid ${dark ? DARK.border : T.sand}` }}>
              {[0, 1, 2].map((d) => (
                <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: T.gold }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-4 pb-5 pt-2">
        <div className="flex items-center gap-2 rounded-full px-2 py-2" style={{ background: dark ? DARK.card : T.white, border: `1px solid ${dark ? DARK.border : T.sandDeep}` }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={t.chat.placeholder}
            className="flex-1 bg-transparent outline-none px-3 text-sm"
            style={{ color: dark ? DARK.text : T.ink }}
          />
          <button onClick={() => send(input)} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})` }}>
            <Send size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== ITINERARY SCREEN ============================== */
function StopCard({ stop, index, dark, isLast, lang }) {
  const t = LANG[lang];
  const meta = CATEGORY_META[stop.category] || CATEGORY_META.historical;
  const Icon = meta.icon;
  const label = t.categories[stop.category] || t.categories.historical;
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: meta.color, color: "white" }}>
          {index + 1}
        </div>
        {!isLast && <div className="flex-1 my-1" style={{ width: 2, background: dark ? DARK.border : T.sandDeep }} />}
      </div>
      <Card dark={dark} className="flex-1 mb-4 overflow-hidden">
        <img src={`https://picsum.photos/seed/${encodeURIComponent(stop.name)}/500/260`} alt={stop.name} className="w-full h-32 object-cover" />
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Icon size={12.5} color={meta.color} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: meta.color }}>{label}</span>
          </div>
          <h3 className="font-bold text-base mb-1" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{stop.name}</h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{stop.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>
            <span className="flex items-center gap-1"><Clock size={12} />{stop.arrivalTime} · {stop.duration}</span>
            <span className="flex items-center gap-1">{stop.travelMethod === "taxi" ? <Car size={12} /> : <Footprints size={12} />}{stop.distanceFromPrev}</span>
            <span className="flex items-center gap-1"><Wallet size={12} />{stop.price}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ItineraryScreen({ itinerary, onBack, onStart, dark, lang }) {
  const t = LANG[lang];
  return (
    <div className="h-full overflow-y-auto pb-28" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={`${itinerary.city} ${t.itinerary.todaySuffix}`} onBack={onBack} dark={dark} />
      <div className="px-5">
        <p className="text-sm leading-relaxed mb-4" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{itinerary.summary}</p>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[{ icon: Clock, label: t.itinerary.totalTime, val: itinerary.totalTime },
            { icon: Footprints, label: t.itinerary.walking, val: itinerary.totalWalking },
            { icon: Wallet, label: t.itinerary.budget, val: itinerary.totalBudget }].map((s) => (
            <Card key={s.label} dark={dark} className="p-3.5 text-center">
              <s.icon size={16} color={T.gold} className="mx-auto mb-1.5" />
              <p className="text-xs font-bold" style={{ color: dark ? DARK.text : T.ink }}>{s.val}</p>
              <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{s.label}</p>
            </Card>
          ))}
        </div>
        <div>
          {itinerary.stops.map((s, i) => (
            <StopCard key={i} stop={s} index={i} dark={dark} isLast={i === itinerary.stops.length - 1} lang={lang} />
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 mx-auto px-5 pb-6 pt-3" style={{ maxWidth: 430, background: dark ? `linear-gradient(0deg, ${DARK.bg} 55%, transparent)` : `linear-gradient(0deg, ${T.cream} 55%, transparent)` }}>
        <GButton variant="primary" className="w-full" icon={PlayCircle} onClick={onStart}>{t.itinerary.start}</GButton>
      </div>
    </div>
  );
}

/* ============================== LIVE TRIP MODE ============================== */
function LiveTripScreen({ itinerary, onFinish, onExit, dark, onKeyCollected, lang }) {
  const t = LANG[lang];
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("travel"); // travel | arrived
  const [seconds, setSeconds] = useState(12); // demo countdown
  const [toast, setToast] = useState(null);
  const [showKeyAnim, setShowKeyAnim] = useState(false);
  const stop = itinerary.stops[idx];
  const isLast = idx === itinerary.stops.length - 1;

  useEffect(() => {
    setSeconds(12);
    setPhase("travel");
  }, [idx]);

  useEffect(() => {
    if (phase !== "travel") return;
    if (seconds === 6) setToast(t.liveTrip.remainingToast);
    if (seconds <= 0) {
      setPhase("arrived");
      setToast(t.liveTrip.arrivedToast);
      setShowKeyAnim(true);
      onKeyCollected(stop.name);
      return;
    }
    const tm = setTimeout(() => setSeconds((s) => s - 1), 700);
    return () => clearTimeout(tm);
  }, [seconds, phase]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const progress = ((idx + (phase === "arrived" ? 1 : 0.5)) / itinerary.stops.length) * 100;

  return (
    <div className="h-full flex flex-col" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={t.liveTrip.title} onBack={onExit} dark={dark} />
      <div className="px-5">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: dark ? DARK.card2 : T.sand }}>
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${T.gold}, ${T.emerald})` }} />
        </div>
        <p className="text-xs mt-1.5 font-medium" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.liveTrip.stopOf(idx + 1, itinerary.stops.length)}</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <AnimatePresence mode="wait">
          {!showKeyAnim || phase === "travel" ? (
            <motion.div key={idx + phase} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
              <Card dark={dark} className="overflow-hidden">
                <img src={`https://picsum.photos/seed/${encodeURIComponent(stop.name)}/500/300`} className="w-full h-40 object-cover" />
                <div className="p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: T.gold }}>{phase === "travel" ? t.liveTrip.headingTo : t.liveTrip.arrivedAt}</p>
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{stop.name}</h2>
                  {phase === "travel" ? (
                    <div className="flex flex-col items-center gap-1 mt-3">
                      <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-4xl font-bold" style={{ fontFamily: "Fraunces, serif", color: T.emerald }}>
                        {seconds}s
                      </motion.div>
                      <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{stop.distanceFromPrev} · {stop.travelMethod === "taxi" ? t.liveTrip.byTaxi : t.liveTrip.onFoot}</p>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{stop.description}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="key" initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex flex-col items-center" onAnimationComplete={() => setTimeout(() => setShowKeyAnim(false), 900)}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}>
                <GirihStar size={90} color={T.gold} />
              </motion.div>
              <p className="mt-5 text-base font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{t.liveTrip.keyCollected}</p>
              <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{stop.name}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="absolute top-2 left-6 right-6 rounded-2xl px-4 py-3 flex items-center gap-2.5" style={{ background: T.emeraldDeep }}>
              <Bell size={14} color={T.goldLight} />
              <span className="text-xs font-medium text-white">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 pb-7 pt-3">
        {phase === "arrived" && (
          <GButton variant="primary" className="w-full" icon={isLast ? Check : ChevronRight}
            onClick={() => (isLast ? onFinish() : setIdx(idx + 1))}>
            {isLast ? t.liveTrip.finish : t.liveTrip.ready}
          </GButton>
        )}
        {phase === "travel" && (
          <GButton variant="ghost" dark={dark} className="w-full" icon={Navigation2} onClick={() => setSeconds(0)}>
            {t.liveTrip.simulate}
          </GButton>
        )}
      </div>
    </div>
  );
}

/* ============================== ACHIEVEMENTS SCREEN ============================== */
function AchievementsScreen({ keys, trips, dark, lang }) {
  const t = LANG[lang];
  const cities = new Set(trips.map((tr) => tr.city));
  const unlocked = new Set();
  if (keys.length >= 1) unlocked.add("first_key");
  if (keys.length >= 5) unlocked.add("five_keys");
  if (cities.size >= 1) unlocked.add("one_city");
  if (trips.length >= 3) unlocked.add("three_trips");

  return (
    <div className="h-full overflow-y-auto pb-28" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={t.achievements.title} dark={dark} />
      <div className="px-5">
        <Card dark={dark} className="p-5 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ opacity: 0.5 }}><GirihPattern opacity={dark ? 0.05 : 0.05} color={T.gold} id="ach" /></div>
          <p className="text-xs font-semibold uppercase tracking-wide relative" style={{ color: T.gold }}>{t.achievements.treasury}</p>
          <p className="text-4xl font-bold mt-1 relative" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{t.achievements.keysCount(keys.length)}</p>
          <p className="text-xs relative" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.achievements.across(cities.size)}</p>
        </Card>

        <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.achievements.collectedKeys}</p>
        {keys.length === 0 ? (
          <Card dark={dark} className="p-6 text-center mb-6">
            <GirihStar size={30} color={dark ? DARK.border : T.sandDeep} />
            <p className="text-sm mt-2" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.achievements.noKeys}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-7">
            {keys.map((k, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                <Card dark={dark} className="p-3 flex flex-col items-center gap-1.5 aspect-square justify-center">
                  <GirihStar size={30} color={T.gold} />
                  <span className="text-xs text-center font-medium leading-tight" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{k}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.achievements.achievementsLabel}</p>
        <div className="space-y-2.5">
          {ACHIEVEMENTS.map((a) => {
            const on = unlocked.has(a.id);
            const Icon = a.icon;
            const copy = t.achievements.list[a.id];
            return (
              <Card key={a.id} dark={dark} className="p-4 flex items-center gap-3.5" style={{ opacity: on ? 1 : 0.5 }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: on ? `linear-gradient(135deg, ${T.gold}, ${T.goldLight})` : (dark ? DARK.card2 : T.sand) }}>
                  {a.id === "first_key" ? <GirihStar size={18} color={on ? T.emeraldDeep : (dark ? DARK.textSoft : T.inkSoft)} /> : <Icon size={18} color={on ? T.emeraldDeep : (dark ? DARK.textSoft : T.inkSoft)} />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: dark ? DARK.text : T.ink }}>{copy.label}</p>
                  <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{copy.desc}</p>
                </div>
                {on && <Check size={16} color={T.emerald} />}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================== TRIPS SCREEN ============================== */
function TripsScreen({ trips, dark, onOpen, lang }) {
  const t = LANG[lang];
  return (
    <div className="h-full overflow-y-auto pb-28" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={t.trips.title} dark={dark} />
      <div className="px-5">
        {trips.length === 0 ? (
          <Card dark={dark} className="p-8 text-center mt-4">
            <Compass size={28} color={dark ? DARK.border : T.sandDeep} className="mx-auto mb-3" />
            <p className="font-bold text-sm mb-1" style={{ color: dark ? DARK.text : T.ink, fontFamily: "Fraunces, serif" }}>{t.trips.none}</p>
            <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.trips.ask}</p>
          </Card>
        ) : (
          <div className="space-y-3 mt-2">
            {[...trips].reverse().map((tr, i) => (
              <button key={i} onClick={() => onOpen(tr)} className="w-full text-left">
                <Card dark={dark} className="p-4 flex items-center gap-3.5">
                  <img src={`https://picsum.photos/seed/${tr.city}/120/120`} className="w-14 h-14 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: dark ? DARK.text : T.ink, fontFamily: "Fraunces, serif" }}>{tr.city}</p>
                    <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{tr.stops.length} {t.trips.stopsWord} · {tr.totalTime} · {tr.completed ? t.trips.completed : t.trips.planned}</p>
                  </div>
                  {tr.completed && <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: T.turquoiseSoft }}><Check size={13} color={T.emerald} /></div>}
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== MAP SCREEN (supportive only) ============================== */
function MapScreen({ trips, dark, lang }) {
  const t = LANG[lang];
  const latest = trips[trips.length - 1];
  return (
    <div className="h-full overflow-y-auto pb-28" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={t.map.title} dark={dark} />
      <div className="px-5">
        <Card dark={dark} className="overflow-hidden mb-5">
          <div className="h-52 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${T.turquoiseSoft}, ${T.sand})` }}>
            <GirihPattern opacity={0.12} color={T.emerald} id="mapp" />
            {latest ? (
              <div className="flex flex-col items-center gap-1 relative">
                <MapPin size={26} color={T.emerald} />
                <p className="text-xs font-bold" style={{ color: T.emeraldDeep }}>{t.map.stopsIn(latest.stops.length, latest.city)}</p>
              </div>
            ) : (
              <p className="text-xs relative" style={{ color: T.emeraldDeep }}>{t.map.plan}</p>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.map.caption}</p>
          </div>
        </Card>
        {latest && (
          <div className="space-y-2">
            {latest.stops.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: T.gold, color: "white" }}>{i + 1}</div>
                <span className="text-sm font-medium" style={{ color: dark ? DARK.text : T.ink }}>{s.name}</span>
                <span className="text-xs ml-auto" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{s.arrivalTime}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== PROFILE SCREEN ============================== */
function ProfileScreen({ dark, setDark, keys, trips, userName, lang, setLang }) {
  const t = LANG[lang];
  const [langOpen, setLangOpen] = useState(false);
  const completed = trips.filter((tr) => tr.completed).length;
  const cities = new Set(trips.map((tr) => tr.city)).size;
  return (
    <div className="h-full overflow-y-auto pb-28" style={{ background: dark ? DARK.bg : T.cream }}>
      <TopBar title={t.profile.title} dark={dark} />
      <div className="px-5">
        <Card dark={dark} className="p-5 flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold" style={{ background: `linear-gradient(135deg, ${T.emerald}, ${T.turquoise})`, color: "white", fontFamily: "Fraunces, serif" }}>
            {userName[0]}
          </div>
          <div>
            <p className="font-bold text-base" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{userName}</p>
            <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.profile.subtitle}</p>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[{ label: t.profile.trips, val: completed }, { label: t.profile.cities, val: cities }, { label: t.profile.keys, val: keys.length }].map((s) => (
            <Card key={s.label} dark={dark} className="p-3.5 text-center">
              <p className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif", color: dark ? DARK.text : T.ink }}>{s.val}</p>
              <p className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{s.label}</p>
            </Card>
          ))}
        </div>

        <p className="text-xs font-semibold mb-2.5 uppercase tracking-wide" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.profile.settings}</p>
        <Card dark={dark} style={{ borderColor: dark ? DARK.border : T.sand }}>
          <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-3 p-4" style={{ borderColor: dark ? DARK.border : T.sand }}>
            {dark ? <Moon size={17} color={T.gold} /> : <Sun size={17} color={T.gold} />}
            <span className="text-sm font-medium flex-1 text-left" style={{ color: dark ? DARK.text : T.ink }}>{t.profile.darkMode}</span>
            <div className="w-10 h-6 rounded-full relative transition-all" style={{ background: dark ? T.emerald : T.sandDeep }}>
              <motion.div animate={{ x: dark ? 16 : 2 }} className="w-5 h-5 rounded-full bg-white absolute top-0.5" />
            </div>
          </button>
          <button onClick={() => setLangOpen((o) => !o)} className="w-full flex items-center gap-3 p-4 border-t" style={{ borderColor: dark ? DARK.border : T.sand }}>
            <Globe size={17} color={T.gold} />
            <span className="text-sm font-medium flex-1 text-left" style={{ color: dark ? DARK.text : T.ink }}>{t.profile.language}</span>
            <span className="text-xs" style={{ color: dark ? DARK.textSoft : T.inkSoft }}>{t.name}</span>
            <ChevronDown size={15} color={dark ? DARK.textSoft : T.inkSoft} style={{ transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t" style={{ borderColor: dark ? DARK.border : T.sand }}>
                <div className="flex gap-2 p-4">
                  {Object.values(LANG).map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: lang === l.code ? T.emerald : (dark ? DARK.card2 : T.sand), color: lang === l.code ? "white" : (dark ? DARK.text : T.ink) }}>
                      {l.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button className="w-full flex items-center gap-3 p-4 border-t" style={{ borderColor: dark ? DARK.border : T.sand }}>
            <Bell size={17} color={T.gold} />
            <span className="text-sm font-medium flex-1 text-left" style={{ color: dark ? DARK.text : T.ink }}>{t.profile.notifications}</span>
            <ChevronRight size={15} color={dark ? DARK.textSoft : T.inkSoft} />
          </button>
          <button className="w-full flex items-center gap-3 p-4 border-t" style={{ borderColor: dark ? DARK.border : T.sand }}>
            <Settings size={17} color={T.gold} />
            <span className="text-sm font-medium flex-1 text-left" style={{ color: dark ? DARK.text : T.ink }}>{t.profile.account}</span>
            <ChevronRight size={15} color={dark ? DARK.textSoft : T.inkSoft} />
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ============================== APP ROOT ============================== */
export default function XazinaApp() {
  const [booted, setBooted] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("uz");
  const [screen, setScreen] = useState("home");
  const [chatInput, setChatInput] = useState(null);
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [trips, setTrips] = useState([]);
  const [keys, setKeys] = useState([]);
  const userName = "Aziz";

  const handleHomeSubmit = (text) => {
    setChatInput(text);
    setScreen("chat");
  };

  const handleItineraryReady = (result) => {
    const trip = { ...result, completed: false, id: Date.now() };
    setActiveItinerary(trip);
    setTrips((t) => [...t, trip]);
    setScreen("itinerary");
  };

  const handleStartTrip = () => setScreen("liveTrip");

  const handleKeyCollected = (name) => setKeys((k) => [...k, name]);

  const handleFinishTrip = () => {
    setTrips((t) => t.map((tr) => (tr.id === activeItinerary.id ? { ...tr, completed: true } : tr)));
    setScreen("achievements");
  };

  const openTrip = (t) => { setActiveItinerary(t); setScreen("itinerary"); };

  return (
    <div className="w-full flex items-center justify-center" style={{ height: "100vh", background: dark ? "#000" : "#EDEAE0", fontFamily: "Manrope, sans-serif" }}>
      <style>{`${FONT_IMPORT} * { box-sizing: border-box; } ::-webkit-scrollbar{display:none;}`}</style>
      <div className="relative w-full overflow-hidden sm:my-4 sm:shadow-2xl" style={{ maxWidth: 430, height: "100dvh", maxHeight: 932, borderRadius: 0, background: dark ? DARK.bg : T.cream }}>
        <AnimatePresence mode="wait">
          {!booted ? (
            <motion.div key="onboarding" className="absolute inset-0" exit={{ opacity: 0 }}>
              <Onboarding onDone={() => setBooted(true)} dark={dark} lang={lang} setLang={setLang} />
            </motion.div>
          ) : (
            <motion.div key={screen} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
              {screen === "home" && <HomeScreen onSubmit={handleHomeSubmit} dark={dark} trips={trips} userName={userName} lang={lang} />}
              {screen === "chat" && <ChatScreen initialMessage={chatInput} onItinerary={handleItineraryReady} onBack={() => setScreen("home")} dark={dark} lang={lang} />}
              {screen === "itinerary" && activeItinerary && <ItineraryScreen itinerary={activeItinerary} onBack={() => setScreen("home")} onStart={handleStartTrip} dark={dark} lang={lang} />}
              {screen === "liveTrip" && activeItinerary && <LiveTripScreen itinerary={activeItinerary} onFinish={handleFinishTrip} onExit={() => setScreen("itinerary")} dark={dark} onKeyCollected={handleKeyCollected} lang={lang} />}
              {screen === "achievements" && <AchievementsScreen keys={keys} trips={trips} dark={dark} lang={lang} />}
              {screen === "trips" && <TripsScreen trips={trips} dark={dark} onOpen={openTrip} lang={lang} />}
              {screen === "map" && <MapScreen trips={trips} dark={dark} lang={lang} />}
              {screen === "profile" && <ProfileScreen dark={dark} setDark={setDark} keys={keys} trips={trips} userName={userName} lang={lang} setLang={setLang} />}
            </motion.div>
          )}
        </AnimatePresence>
        {booted && !["chat", "itinerary", "liveTrip"].includes(screen) && (
          <BottomNav screen={screen} setScreen={setScreen} dark={dark} lang={lang} />
        )}
      </div>
    </div>
  );
}
