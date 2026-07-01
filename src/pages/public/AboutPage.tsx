import { useState, useEffect, useRef } from 'react';
import { 
  Compass, Eye, Heart, Target, Star, Shield, 
  ChevronDown, ArrowUpRight, 
  Sparkles, CheckCircle2, Award, Users, MapPin, Building2, Send
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

/* ── Interactive Count-up Component ── */
function AnimatedCounter({ value, duration = 2000, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [started, value, duration]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function AboutPage() {
  const { lang, isRtl } = useLanguage();
  
  // Custom dictionary for the premium About Page sections
  const content = {
    en: {
      heroSub: "DreamHomes is a premium real-estate advisory and platform. We curate the finest residential spaces in Turkey for international visionaries.",
      heroTitle1: "Reimagining the",
      heroTitle2: "Art of Living",
      scrollText: "Scroll to discover",
      
      missionTitle: "Defining the Standard of Modern Living",
      missionSubtitle: "A private investment and advisory firm dedicated to luxury real estate.",
      missionHeading: "Our Essence",
      missionDesc: "DreamHomes was founded with a singular, uncompromising vision: to elevate the property discovery journey into a luxury experience. We do not just catalog listings; we match legacy properties with their future curators.",
      
      visionTitle: "Our Vision",
      visionDesc: "To establish the ultimate global ecosystem for ultra-high-net-worth real estate transactions, powered by advanced technology and transparent client advisory.",
      
      valuesTitle: "Core Values",
      val1Title: "Uncompromising Integrity",
      val1Desc: "Every transaction is executed with absolute transparency, honesty, and verified legal frameworks.",
      val2Title: "Curated Excellence",
      val2Desc: "We only list properties that meet our stringent criteria for architectural significance, build quality, and location prestige.",
      val3Title: "Client-Centric Philosophy",
      val3Desc: "Tailoring every aspect of our advisory to fit the unique lifestyle and privacy needs of our global clients.",
      
      statsTitle: "Performance in Numbers",
      statsSubtitle: "A testament to our unwavering dedication to excellence.",
      stat1Label: "Curated Properties",
      stat2Label: "Major Cities Covered",
      stat3Label: "Dedicated Premium Agents",
      stat4Label: "Customer Satisfaction Rate",
      stat5Label: "Years of Market Leadership",

      timelineTitle: "Our Journey",
      timelineSubtitle: "How we redefined the digital landscape of luxury real estate.",
      t1Title: "The Genesis",
      t1Desc: "Founded in Istanbul with a portfolio of 50 exclusive waterfront villas. Pioneered the first fully-bilingual digital interface.",
      t2Title: "National Expansion",
      t2Desc: "Extended services to Bodrum, Antalya, and Izmir. Successfully handled our first commercial portfolio transaction worth $120M.",
      t3Title: "Digital Revolution",
      t3Desc: "Integrated advanced real-time CRM and interactive 3D virtual walkthroughs for international buyers.",
      t4Title: "The Pinnacle",
      t4Desc: "Named Turkey's Leading Luxury Real Estate Platform with over $4.2B in closed transaction volume.",

      whyTitle: "Why Visionaries Choose Us",
      whySubtitle: "We bypass standard brokerage models to provide elite, institutional-grade service.",
      whyCard1Tag: "VERIFICATION",
      whyCard1Title: "Dual-Stage Legal Audits",
      whyCard1Desc: "Every villa and apartment listed undergoes rigorous background title deed (Tapu) verification and building quality certification by independent engineering firms.",
      whyCard2Tag: "TRANSPARENCY",
      whyCard2Title: "No Hidden Commissions",
      whyCard2Desc: "Our fees are clearly documented and structured. We align our incentives completely with your investment success.",
      whyCard3Tag: "EXPERTISE",
      whyCard3Title: "Elite Private Advisors",
      whyCard3Desc: "Our team consists of bilingual real estate attorneys, structural consultants, and local market specialists with decades of combined experience.",

      cultureTitle: "Our Culture & Lifestyle",
      cultureSubtitle: "An inside look at our private offices, client experiences, and architectural milestones.",
      
      ctaTitle: "Begin Your Architectural Journey",
      ctaDesc: "Contact our private client desk or explore our verified portfolio of luxury estates.",
      ctaBtn1: "Browse Portfolio",
      ctaBtn2: "Talk to an Advisor",
    },
    ar: {
      heroSub: "دريم هومز هي منصة استشارية عقارية فاخرة. نقوم برعاية وتنسيق أرقى المساحات السكنية في تركيا للمستثمرين وأصحاب الرؤى.",
      heroTitle1: "إعادة تعريف",
      heroTitle2: "فن العيش الراقي",
      scrollText: "اكتشف المزيد",
      
      missionTitle: "تحديد معايير المعيشة الحديثة والفاخرة",
      missionSubtitle: "شركة استشارات واستثمار خاصة مخصصة للعقارات الفاخرة والاستثنائية.",
      missionHeading: "جوهـرنا",
      missionDesc: "تأسست دريم هومز برؤية فريدة لا تهاون فيها: الارتقاء برحلة البحث عن العقار إلى تجربة فاخرة متكاملة. نحن لا نعرض العقارات فحسب، بل نطابق العقارات التاريخية والحديثة مع ملاكها المستقبليين.",
      
      visionTitle: "رؤيتنـا",
      visionDesc: "تأسيس المنظومة العالمية الأفضل لصفقات العقارات الفاخرة، مدعومة بالتكنولوجيا المتقدمة والشفافية التامة والمصداقية المطلقة.",
      
      valuesTitle: "قيمنا الأساسية",
      val1Title: "نزاهة لا تهاون فيها",
      val1Desc: "تتم كل صفقة بشفافية مطلقة، وأطر قانونية موثقة تضمن حقوق المستثمر بشكل كامل.",
      val2Title: "التميز المنسق",
      val2Desc: "نحن ندرج فقط العقارات التي تلبي معاييرنا الصارمة للأهمية المعمارية وجودة البناء والموقع الاستراتيجي المميز.",
      val3Title: "التركيز المطلق على العميل",
      val3Desc: "تفصيل كل جانب من جوانب استشاراتنا لتناسب نمط الحياة الفريد واحتياجات الخصوصية لعملائنا العالميين.",
      
      statsTitle: "الأداء في أرقام",
      statsSubtitle: "شهادة على التزامنا الراسخ بالتميز والريادة في السوق.",
      stat1Label: "عقار فاخر منسق",
      stat2Label: "مدن رئيسية مغطاة",
      stat3Label: "مستشار عقاري معتمد",
      stat4Label: "معدل رضا العملاء",
      stat5Label: "سنوات من ريادة السوق",

      timelineTitle: "رحلتنا المستمرة",
      timelineSubtitle: "كيف أعدنا صياغة المشهد الرقمي للعقارات الفاخرة والحديثة.",
      t1Title: "البداية والتأسيس",
      t1Desc: "تأسست في إسطنبول بمحفظة تضم 50 فيلا بحرية حصرية. أطلقنا أول واجهة رقمية ثنائية اللغة بالكامل.",
      t2Title: "التوسع الوطني",
      t2Desc: "توسيع الخدمات إلى بودروم، أنطاليا، وإزمير. نجحنا في إتمام أول صفقة لمحفظة تجارية بقيمة 120 مليون دولار.",
      t3Title: "الثورة الرقمية",
      t3Desc: "دمج أنظمة متقدمة لخدمة العملاء والجولات الافتراضية التفاعلية ثلاثية الأبعاد للمشترين الدوليين.",
      t4Title: "القمة والريادة",
      t4Desc: "تم تصنيفنا كأفضل منصة للعقارات الفاخرة في تركيا بحجم صفقات مغلقة تجاوز 4.2 مليار دولار.",

      whyTitle: "لماذا يختارنا أصحاب الرؤى",
      whySubtitle: "نتجاوز نماذج الوساطة التقليدية لتقديم خدمة مؤسسية حصرية تليق بطلباتكم.",
      whyCard1Tag: "التحقق القانوني",
      whyCard1Title: "تدقيق قانوني مزدوج",
      whyCard1Desc: "تخضع كل فيلا أو شقة مدرجة للتحقق الدقيق من الطابو (Tapu) وشهادة جودة البناء من شركات هندسية مستقلة.",
      whyCard2Tag: "الشفافية التامة",
      whyCard2Title: "لا عمولات خفية",
      whyCard2Desc: "رسومنا موثقة وواضحة تماماً. نحن نوائم حوافزنا بالكامل مع نجاح استثمارك العقاري.",
      whyCard3Tag: "الخبرة العميقة",
      whyCard3Title: "نخبة المستشارين الخصوصيين",
      whyCard3Desc: "يتكون فريقنا من محامين عقاريين ثنائيي اللغة ومستشارين إنشائيين وأخصائيي سوق محلي ذوي خبرة طويلة.",

      cultureTitle: "ثقافتنا وأسلوب حياتنا",
      cultureSubtitle: "نظرة عن قرب لبيئة العمل الفاخرة، تجارب عملائنا، والتحف المعمارية التي نديرها.",
      
      ctaTitle: "ابدأ رحلتك المعمارية الفريدة",
      ctaDesc: "تواصل مع مكتب عملائنا الخاص أو استكشف محفظتنا الموثقة من العقارات الفاخرة.",
      ctaBtn1: "تصفح المحفظة العقارية",
      ctaBtn2: "تحدث مع مستشار خاص",
    }
  };

  const t = (key: keyof typeof content.en) => {
    return content[lang === 'ar' ? 'ar' : 'en'][key];
  };

  const team = [
    {
      name: 'James Mitchell',
      role: lang === 'ar' ? 'الرئيس التنفيذي والشريك المؤسس' : 'CEO & Co-Founder',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      bio: lang === 'ar' ? '20+ عاماً في صفقات العقارات الفاخرة والمحافظ الاستثمارية الكبرى.' : '20+ years in international real estate markets & institutional portfolios.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Priya Sharma',
      role: lang === 'ar' ? 'رئيسة قسم المنتجات والابتكار' : 'Head of Product & Innovation',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      bio: lang === 'ar' ? 'مصممة سابقة في Airbnb تقود البنية الرقمية والتجارب الافتراضية العقارية.' : 'Former Airbnb designer crafting our luxury virtual viewing platforms.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Carlos Rivera',
      role: lang === 'ar' ? 'رئيس الاستشارات الخاصة والصفقات' : 'Chief of Private Clients & Deals',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      bio: lang === 'ar' ? 'أشرف على صفقات حصرية وقصور تاريخية تجاوزت قيمتها 2 مليار دولار.' : 'Closed $2B+ in high-end waterfront residential transactions.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'dalin alkuwatli',
      role: lang === 'ar' ? 'مديرة هندسة البرمجيات والأنظمة' : 'Lead Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      bio: lang === 'ar' ? 'مطور ومصمم البنية التحتية البرمجية والأنظمة التقنية لمنصة دريم هومز.' : 'Developer & architect of the software infrastructure and digital systems for DreamHomes.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
  ];

  const milestones = [
    {
      year: '2019',
      title: t('t1Title'),
      desc: t('t1Desc'),
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80'
    },
    {
      year: '2021',
      title: t('t2Title'),
      desc: t('t2Desc'),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'
    },
    {
      year: '2023',
      title: t('t3Title'),
      desc: t('t3Desc'),
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80'
    },
    {
      year: '2025',
      title: t('t4Title'),
      desc: t('t4Desc'),
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'
    },
  ];

  return (
    <div className="bg-bg text-custom overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── 1. HERO SECTION (Full Viewport Storytelling) ── */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Ken Burns Zoom animation effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90" 
            alt="Luxury Villa Background" 
            className="w-full h-full object-cover scale-105 animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          {/* Layered dark overlay to give premium film look */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />
        </div>

        {/* Floating Architectural wireframe/lines */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-30">
          <div className="absolute left-[10%] top-[20%] w-[1px] h-32 bg-sky-400/50" />
          <div className="absolute right-[15%] bottom-[25%] w-40 h-[1px] bg-indigo-400/50" />
          <div className="absolute left-[5%] bottom-[15%] w-24 h-24 border border-white/10 rounded-full" />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-white text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} className="text-sky-400" />
            <span>{lang === 'ar' ? 'الفخامة الحقيقية' : 'The Pinnacle of Real Estate'}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
            {t('heroTitle1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-300">
              {t('heroTitle2')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('heroSub')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/properties" className="btn-primary px-8 py-3.5 rounded-2xl w-full sm:w-auto justify-center">
              {lang === 'ar' ? 'استكشف الفلل والقصور' : 'Explore Properties'}
            </Link>
            <Link to="/contact" className="btn-secondary text-white border-white/20 hover:bg-white/10 px-8 py-3.5 rounded-2xl w-full sm:w-auto justify-center">
              {lang === 'ar' ? 'اتصل بمستشار خاص' : 'Talk to Advisor'}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center gap-2 cursor-pointer">
          <span className="text-[11px] uppercase tracking-widest text-white/40 font-semibold">{t('scrollText')}</span>
          <ChevronDown className="text-white/60 animate-bounce" size={18} />
        </div>
      </section>

      {/* ── 2. MISSION & VISION & VALUES (Split Layout) ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sticky/Large Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <span className="text-sky-500 font-bold uppercase text-xs tracking-widest mb-3 block">
              {t('missionHeading')}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-custom leading-tight mb-6">
              {t('missionTitle')}
            </h2>
            <p className="text-base text-muted leading-relaxed mb-8">
              {t('missionSubtitle')}
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full" />
          </div>

          {/* Right Detailed Column */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            
            {/* The Essence */}
            <div className="p-8 rounded-3xl bg-dh-card/40 border border-custom relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold text-custom mb-3 flex items-center gap-2">
                <Target size={18} className="text-sky-500" />
                {lang === 'ar' ? 'مهمتنا ورسالتنا' : 'Our Mission'}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t('missionDesc')}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-3xl bg-dh-card/40 border border-custom relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold text-custom mb-3 flex items-center gap-2">
                <Compass size={18} className="text-indigo-500" />
                {t('visionTitle')}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t('visionDesc')}
              </p>
            </div>

            {/* Values */}
            <div>
              <h3 className="text-xl font-bold text-custom mb-6 flex items-center gap-2">
                <Award size={18} className="text-amber-500" />
                {t('valuesTitle')}
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { title: t('val1Title'), desc: t('val1Desc'), icon: <Shield size={16} className="text-emerald-500" />, bg: 'rgba(16,185,129,0.1)' },
                  { title: t('val2Title'), desc: t('val2Desc'), icon: <Star size={16} className="text-sky-500" />, bg: 'rgba(14,165,233,0.1)' },
                  { title: t('val3Title'), desc: t('val3Desc'), icon: <Heart size={16} className="text-indigo-500" />, bg: 'rgba(99,102,241,0.1)' }
                ].map((val, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl hover:bg-dh-card/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: val.bg }}>
                      {val.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-custom mb-1">{val.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. PREMIUM ANIMATED STATISTICS ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'rgba(14,165,233,0.03)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <span className="text-sky-500 font-bold uppercase text-xs tracking-widest block mb-2">{lang === 'ar' ? 'الريادة الموثقة' : 'Verified Supremacy'}</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-custom">{t('statsTitle')}</h2>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">{t('statsSubtitle')}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { value: 500, suffix: "+", label: t('stat1Label'), icon: <Building2 className="text-sky-400" size={20} /> },
            { value: 10, suffix: "", label: t('stat2Label'), icon: <MapPin className="text-indigo-400" size={20} /> },
            { value: 45, suffix: "+", label: t('stat3Label'), icon: <Users className="text-emerald-400" size={20} /> },
            { value: 98, suffix: "%", label: t('stat4Label'), icon: <Star className="text-amber-400" size={20} /> },
            { value: 6, suffix: "+", label: t('stat5Label'), icon: <Award className="text-rose-400" size={20} /> },
          ].map((stat, idx) => (
            <div key={idx} className="dh-card p-6 text-center relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-3 text-muted/80">{stat.icon}</div>
              <p className="text-3xl sm:text-4xl font-extrabold text-custom mb-1.5">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-muted font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. JOURNEY TIMELINE (Interactive Vertical Timeline) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-custom">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-bold uppercase text-xs tracking-widest block mb-2">{lang === 'ar' ? 'التطور' : 'Evolution'}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-custom">{t('timelineTitle')}</h2>
          <p className="text-muted text-sm mt-2">{t('timelineSubtitle')}</p>
        </div>

        <div className="relative">
          {/* Vertical central line */}
          <div className={`absolute ${isRtl ? 'right-1/2' : 'left-1/2'} top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-sky-500 via-indigo-500 to-transparent hidden md:block`} />

          <div className="flex flex-col gap-12">
            {milestones.map((m, i) => (
              <div 
                key={m.year} 
                className={`flex gap-6 items-stretch md:items-center ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className="flex-1">
                  <div className="dh-card p-6 hover:shadow-xl transition-all duration-300 group hover:border-sky-500/40 relative overflow-hidden">
                    <div className="h-44 sm:h-56 rounded-2xl overflow-hidden mb-4 relative">
                      <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className={`absolute bottom-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 rounded-xl text-xs font-bold bg-sky-500 text-white`}>
                        {m.year}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-custom mb-2">{m.title}</h3>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">{m.desc}</p>
                  </div>
                </div>

                {/* Timeline Node dot */}
                <div className="w-12 h-12 rounded-full bg-dh-card border-2 border-sky-500/80 flex items-center justify-center font-bold text-sm text-sky-500 shrink-0 z-10 hidden md:flex shadow-lg">
                  {i + 1}
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHY CHOOSE US (Feature blocks with illustration & Badges) ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-custom">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-bold uppercase text-xs tracking-widest block mb-2">{lang === 'ar' ? 'فلسفتنا' : 'Philosophy'}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-custom">{t('whyTitle')}</h2>
          <p className="text-muted text-sm mt-2 max-w-xl mx-auto">{t('whySubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="dh-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <span className="inline-flex text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full self-start">
              {t('whyCard1Tag')}
            </span>
            <div>
              <h3 className="text-xl font-bold text-custom mb-3">{t('whyCard1Title')}</h3>
              <p className="text-sm text-muted leading-relaxed">{t('whyCard1Desc')}</p>
            </div>
            <div className="mt-auto pt-6 border-t border-custom flex items-center gap-2 text-xs font-semibold text-emerald-500">
              <CheckCircle2 size={14} />
              <span>{lang === 'ar' ? 'معتمد ومحمي 100%' : '100% Guarded & Certified'}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="dh-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
            <span className="inline-flex text-[10px] font-bold text-sky-500 uppercase tracking-widest bg-sky-500/10 px-2.5 py-1 rounded-full self-start">
              {t('whyCard2Tag')}
            </span>
            <div>
              <h3 className="text-xl font-bold text-custom mb-3">{t('whyCard2Title')}</h3>
              <p className="text-sm text-muted leading-relaxed">{t('whyCard2Desc')}</p>
            </div>
            <div className="mt-auto pt-6 border-t border-custom flex items-center gap-2 text-xs font-semibold text-sky-500">
              <CheckCircle2 size={14} />
              <span>{lang === 'ar' ? 'شفافية كاملة في الفواتير' : 'Pure Transparent Ledger'}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="dh-card p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <span className="inline-flex text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-full self-start">
              {t('whyCard3Tag')}
            </span>
            <div>
              <h3 className="text-xl font-bold text-custom mb-3">{t('whyCard3Title')}</h3>
              <p className="text-sm text-muted leading-relaxed">{t('whyCard3Desc')}</p>
            </div>
            <div className="mt-auto pt-6 border-t border-custom flex items-center gap-2 text-xs font-semibold text-indigo-500">
              <CheckCircle2 size={14} />
              <span>{lang === 'ar' ? 'فريق مستشارين متعدد الجنسيات' : 'Bilingual Legal & Advisory Teams'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. TEAM SECTION (Premium cards with floating gradient backgrounds) ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-custom">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-bold uppercase text-xs tracking-widest block mb-2">{lang === 'ar' ? 'المستشارون' : 'Advisors'}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-custom">{lang === 'ar' ? 'فريق العمل والقيادة' : 'Leadership & Board'}</h2>
          <p className="text-muted text-sm mt-2">{lang === 'ar' ? 'نخبة من خبراء العقارات والمستشارين القانونيين على أتم الاستعداد لخدمتك.' : 'Global visionaries building the infrastructure of real estate advisory.'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, idx) => (
            <div key={idx} className="dh-card p-5 group flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
              {/* Floating gradient backgrounds inside cards */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-sky-400/5 to-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              
              <div className="w-32 h-32 rounded-3xl overflow-hidden mb-4 relative border-2 border-custom shadow-md">
                <img src={m.avatar} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              
              <h3 className="font-extrabold text-custom mb-1 text-base">{m.name}</h3>
              <span className="text-sky-500 font-semibold text-xs mb-3">{m.role}</span>
              <p className="text-xs text-muted leading-relaxed mb-6 flex-1 px-2">{m.bio}</p>

              {/* Social icons */}
              <div className="flex items-center gap-3 mt-auto">
                <a href={m.social.twitter} className="text-muted hover:text-sky-500 transition-colors p-1.5 hover:bg-sky-500/5 rounded-lg" aria-label="Twitter">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href={m.social.linkedin} className="text-muted hover:text-indigo-500 transition-colors p-1.5 hover:bg-indigo-500/5 rounded-lg" aria-label="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </a>
                <a href={m.social.github} className="text-muted hover:text-custom transition-colors p-1.5 hover:bg-dh-card rounded-lg" aria-label="Github">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. CULTURE COLLAGE (Masonry layout) ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-500 font-bold uppercase text-xs tracking-widest block mb-2">{t('cultureTitle')}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-custom">{t('cultureTitle')}</h2>
          <p className="text-muted text-sm mt-2">{t('cultureSubtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl overflow-hidden h-40 md:h-64 shadow-md group">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" alt="Office meeting room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-3xl overflow-hidden h-40 md:h-48 shadow-md group">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" alt="Consultant discussing tapu" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8 md:mt-12">
            <div className="rounded-3xl overflow-hidden h-48 md:h-56 shadow-md group">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" alt="Luxury apartment deal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-3xl overflow-hidden h-40 md:h-64 shadow-md group">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" alt="Bosphorus villa waterfront view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl overflow-hidden h-40 md:h-64 shadow-md group">
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" alt="Clients in luxury lounge" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-3xl overflow-hidden h-40 md:h-48 shadow-md group">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80" alt="Premium workspace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8 md:mt-12">
            <div className="rounded-3xl overflow-hidden h-48 md:h-48 shadow-md group">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Modern villa facade" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-3xl overflow-hidden h-40 md:h-72 shadow-md group">
              <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80" alt="Istanbul skyline" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. LUXURY CTA ── */}
      <section className="relative py-24 overflow-hidden border-t border-custom">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80" 
            alt="Luxury lounge backdrop" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-start flex flex-col justify-center h-full">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/70 text-base mb-8 leading-relaxed">
              {t('ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link to="/properties" className="btn-primary justify-center px-8 py-3.5 rounded-2xl w-full sm:w-auto">
                {t('ctaBtn1')}
              </Link>
              <Link to="/contact" className="btn-secondary text-white border-white/20 hover:bg-white/10 justify-center px-8 py-3.5 rounded-2xl w-full sm:w-auto">
                {t('ctaBtn2')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
