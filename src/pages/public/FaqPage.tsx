import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FaqPage() {
  const { lang, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  useEffect(() => {
    document.title = lang === 'ar' ? 'الأسئلة الشائعة | دريم هومز' : 'FAQ | DreamHomes';
  }, [lang]);

  const categories = [
    { id: 'all', label_ar: 'الكل', label_en: 'All' },
    { id: 'buying', label_ar: 'الشراء والبيع', label_en: 'Buying & Selling' },
    { id: 'renting', label_ar: 'الإيجار', label_en: 'Renting' },
    { id: 'finance', label_ar: 'التمويل والأسعار', label_en: 'Finance & Pricing' },
    { id: 'legal', label_ar: 'القانون والضمان', label_en: 'Legal & Guarantee' },
  ];

  const faqs = [
    {
      id: 'buy-1',
      category: 'buying',
      q_ar: 'كيف يمكنني شراء عقار في تركيا؟',
      q_en: 'How can I buy a property in Turkey?',
      a_ar: 'خطوات الشراء بسيطة: اختيار العقار، توقيع عقد البيع المبدئي، دفع العربون، الحصول على الرقم الضريبي وفتح حساب بنكي، ثم نقل الملكية في دائرة الطابو.',
      a_en: 'The steps are simple: choose the property, sign the initial sales contract, pay a deposit, obtain a tax number and open a bank account, then transfer the title deed (Tapu).',
    },
    {
      id: 'buy-2',
      category: 'buying',
      q_ar: 'هل يمكن للأجانب تملك العقارات في تركيا؟',
      q_en: 'Can foreigners own property in Turkey?',
      a_ar: 'نعم، يسمح لمعظم الجنسيات بتملك العقارات السكنية والتجارية بنسبة تملك حر (Freehold) 100%.',
      a_en: 'Yes, most nationalities are allowed to purchase residential and commercial properties in Turkey with 100% freehold ownership.',
    },
    {
      id: 'rent-1',
      category: 'renting',
      q_ar: 'ما الأوراق المطلوبة لاستئجار شقة؟',
      q_en: 'What documents are required to rent an apartment?',
      a_ar: 'تحتاج إلى نسخة من جواز السفر أو الإقامة التركية، وعقد الإيجار الموقع، ودفع تأمين يعادل شهر أو شهرين كحد أقصى.',
      a_en: 'You need a copy of your passport or Turkish residency permit, the signed rental contract, and a deposit equivalent to 1 or 2 months of rent maximum.',
    },
    {
      id: 'finance-1',
      category: 'finance',
      q_ar: 'هل تقدمون خطط دفع أو تقسيط؟',
      q_en: 'Do you offer payment or installment plans?',
      a_ar: 'نعم، العديد من المشاريع قيد الإنشاء تقدم خطط تقسيط مرنة بدون فوائد بدفعة أولى تبدأ من 30% وفترات سداد تصل إلى 36 شهراً.',
      a_en: 'Yes, many under-construction projects offer flexible, interest-free installment plans with a down payment starting from 30% and payment periods up to 36 months.',
    },
    {
      id: 'legal-1',
      category: 'legal',
      q_ar: 'هل يمكنني الحصول على الجنسية التركية عبر الاستثمار العقاري؟',
      q_en: 'Can I get Turkish Citizenship via Real Estate Investment?',
      a_ar: 'نعم، يمكنك التقدم بطلب للحصول على الجنسية التركية عند شراء عقار أو عدة عقارات بقيمة إجمالية لا تقل عن 400,000 دولار أمريكي والاحتفاظ بها لمدة 3 سنوات.',
      a_en: 'Yes, you can apply for Turkish citizenship by purchasing property or properties with a total value of at least $400,000 USD and keeping them for 3 years.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const qText = (lang === 'ar' ? faq.q_ar : faq.q_en).toLowerCase();
      const aText = (lang === 'ar' ? faq.a_ar : faq.a_en).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = qText.includes(query) || aText.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, lang]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors pt-28 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle size={44} className="text-sky-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-serif mb-4">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            {lang === 'ar' ? 'ابحث عن إجابات سريعة لجميع استفساراتك حول شراء العقارات وتأجيرها والاستثمار في تركيا.' : 'Find quick answers to all your inquiries about buying, renting, and investing in real estate in Turkey.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث في الأسئلة الشائعة...' : 'Search FAQs...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-neutral-800 dark:text-white"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === cat.id ? 'bg-sky-500 text-white shadow-md' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'}`}
            >
              {lang === 'ar' ? cat.label_ar : cat.label_en}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-neutral-500">
                {lang === 'ar' ? 'لم يتم العثور على أي نتائج.' : 'No results found.'}
              </motion.div>
            ) : (
              filteredFaqs.map(faq => {
                const isOpen = openIndex === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    className="border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                      className="w-full p-5 flex justify-between items-center text-left"
                    >
                      <span className="font-semibold text-sm sm:text-base text-neutral-800 dark:text-white">
                        {lang === 'ar' ? faq.q_ar : faq.q_en}
                      </span>
                      <ChevronDown size={18} className={`text-sky-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-neutral-100 dark:border-neutral-800 px-5 py-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed"
                        >
                          {lang === 'ar' ? faq.a_ar : faq.a_en}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Still Have Questions Contact */}
        <section className="bg-neutral-900 text-white rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold font-serif mb-2">{lang === 'ar' ? 'هل لديك أسئلة أخرى؟' : 'Still Have Questions?'}</h3>
          <p className="text-xs text-neutral-400 mb-6">{lang === 'ar' ? 'تواصل مع فريق الدعم الفني أو الاستشاريين العقاريين لدينا مباشرة.' : 'Contact our support team or professional real estate consultants directly.'}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <Phone size={14} className="text-sky-400" />
              <span>+90 555 123 4567</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Mail size={14} className="text-sky-400" />
              <span>dreamhomes@gmail.com</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
