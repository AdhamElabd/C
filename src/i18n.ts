import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export type Locale = "en" | "ar";

export const resources = {
  en: {
    translation: {
      nav: { about: "Philosophy", services: "Expertise", work: "Selected Works", contact: "Contact" },
      hero: {
        kicker: "Freelance web developer",
        title: "Adham Elabd | CoreLogic",
        typed: ["web experiences", "product interfaces", "performance systems", "bilingual platforms"],
        cta: "Start a Project",
        secondary: "Explore work",
        statA: "Milliseconds matter",
        statB: "Every interface has a physics",
        statC: "Arabic-first when needed"
      },
      about: {
        eyebrow: "Philosophy",
        title: "I build websites like intelligent instruments: fast, tactile, precise, and ready to carry a brand's actual ambition.",
        body: "CoreLogic is Adham Elabd's independent studio practice for founders, creators, and teams who need the web to feel engineered and alive. The work sits between product thinking, expressive motion, and production-grade frontend architecture."
      },
      services: {
        eyebrow: "Expertise",
        title: "Quiet systems. Loud impressions.",
        items: [
          {
            title: "Custom Web Development",
            text: "React, Next-style architecture, headless content, API integrations, and maintainable component systems built for real launches."
          },
          {
            title: "UI/UX Direction",
            text: "Interaction models, bilingual flows, conversion-focused screens, and visual systems that feel intentional from first touch."
          },
          {
            title: "Performance Optimization",
            text: "Core Web Vitals, animation budgets, asset strategy, rendering audits, and UX speed that users can feel."
          }
        ]
      },
      work: {
        eyebrow: "Selected Works",
        title: "Real products, built across the stack.",
        items: [
          { name: "SPA KLU", type: "Booking system · Backend development", year: "BACKEND" },
          { name: "WSC", type: "Company portfolio · Full-stack development", year: "FULL STACK" },
          { name: "5 STARS RC", type: "Car rental showroom in Dubai · Full-stack development", year: "FULL STACK" }
        ]
      },
      contact: {
        eyebrow: "Contact",
        title: "Bring a sharp idea. I will bring the system around it.",
        name: "Name",
        email: "Email",
        brief: "Project brief",
        send: "Send Signal",
        required: "This field needs a little signal.",
        emailError: "Use a valid email address.",
        success: "Signal received. I will reply with a clear next step."
      }
    }
  },
  ar: {
    translation: {
      nav: { about: "الفلسفة", services: "الخبرات", work: "الأعمال", contact: "تواصل" },
      hero: {
        kicker: "مطوّر ويب مستقل",
        title: "أدهم العبد | كورلوجيك",
        typed: ["تجارب ويب", "واجهات منتجات", "أنظمة أداء", "منصات ثنائية اللغة"],
        cta: "ابدأ مشروعك",
        secondary: "استكشف الأعمال",
        statA: "كل جزء من الثانية مهم",
        statB: "لكل واجهة حركة ومنطق",
        statC: "عربي أولاً عند الحاجة"
      },
      about: {
        eyebrow: "الفلسفة",
        title: "أبني المواقع كأنها أدوات ذكية: سريعة، ملموسة، دقيقة، وقادرة على حمل طموح العلامة الحقيقي.",
        body: "كورلوجيك هي ممارسة أدهم العبد المستقلة للمؤسسين وصناع المحتوى والفرق التي تحتاج إلى ويب يشعر المستخدم أنه مصمم بعناية ومبني بقوة. العمل يجمع بين تفكير المنتج، الحركة التعبيرية، وهندسة الواجهات الجاهزة للإطلاق."
      },
      services: {
        eyebrow: "الخبرات",
        title: "أنظمة هادئة. انطباعات عالية.",
        items: [
          {
            title: "تطوير ويب مخصص",
            text: "React، معمارية حديثة، محتوى Headless، تكاملات API، وأنظمة مكونات قابلة للصيانة والإطلاق."
          },
          {
            title: "تصميم UI/UX",
            text: "نماذج تفاعل، تجارب ثنائية اللغة، شاشات موجهة للتحويل، وأنظمة بصرية تبدو مقصودة منذ اللمسة الأولى."
          },
          {
            title: "تحسين الأداء",
            text: "Core Web Vitals، ميزانيات حركة، استراتيجية أصول، تدقيق عرض، وسرعة يشعر بها المستخدم."
          }
        ]
      },
      work: {
        eyebrow: "الأعمال المختارة",
        title: "منتجات حقيقية بنيتها عبر مختلف طبقات التطوير.",
        items: [
          { name: "SPA KLU", type: "نظام حجز · تطوير الباك إند", year: "BACKEND" },
          { name: "WSC", type: "بورتفوليو للشركة · تطوير Full Stack", year: "FULL STACK" },
          { name: "5 STARS RC", type: "معرض تأجير سيارات في دبي · تطوير Full Stack", year: "FULL STACK" }
        ]
      },
      contact: {
        eyebrow: "تواصل",
        title: "أحضر فكرة حادة. وسأبني النظام حولها.",
        name: "الاسم",
        email: "البريد الإلكتروني",
        brief: "نبذة عن المشروع",
        send: "أرسل الإشارة",
        required: "هذا الحقل يحتاج إلى إشارة صغيرة.",
        emailError: "استخدم بريدًا إلكترونيًا صحيحًا.",
        success: "وصلت الإشارة. سأرد بخطوة تالية واضحة."
      }
    }
  }
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
