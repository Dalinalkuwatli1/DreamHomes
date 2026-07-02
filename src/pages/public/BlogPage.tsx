import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BlogPage() {
  const { lang, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    document.title = lang === 'ar' ? 'المدونة العقارية | دريم هومز' : 'Real Estate Blog | DreamHomes';
  }, [lang]);

  const categories = [
    { id: 'all', label_ar: 'الكل', label_en: 'All' },
    { id: 'guide', label_ar: 'أدلة الشراء', label_en: 'Buying Guides' },
    { id: 'investment', label_ar: 'الاستثمار', label_en: 'Investment' },
    { id: 'lifestyle', label_ar: 'نمط الحياة', label_en: 'Lifestyle' },
  ];

  const articles = [
    {
      id: 'art-1',
      category: 'investment',
      title_ar: 'أفضل المناطق للاستثمار العقاري في إسطنبول لعام 2026',
      title_en: 'Best Areas for Real Estate Investment in Istanbul in 2026',
      desc_ar: 'تحليل شامل لأكثر المناطق تحقيقاً للأرباح والعوائد الإيجارية المرتفعة مع نظرة مستقبلية لنمو الأسعار.',
      desc_en: 'Comprehensive analysis of the most profitable areas yielding high rental returns with future price growth prospects.',
      author: lang === 'ar' ? 'أحمد الشريف' : 'Ahmed Al-Sharif',
      date: '2026-06-15',
      readTime_ar: 'قراءة في 5 دقائق',
      readTime_en: '5 min read',
      image: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'art-2',
      category: 'guide',
      title_ar: 'خطوات الحصول على الجنسية التركية عبر شراء عقار بالتفصيل',
      title_en: 'Steps to Obtain Turkish Citizenship via Property Purchase',
      desc_ar: 'دليلك القانوني والعملي الشامل من التقديم وحتى استلام الهوية التركية وجواز السفر.',
      desc_en: 'Your comprehensive legal and practical guide from application submission to obtaining your Turkish passport.',
      author: lang === 'ar' ? 'سليم الدجاني' : 'Selim Al-Dajani',
      date: '2026-06-20',
      readTime_ar: 'قراءة في 8 دقائق',
      readTime_en: '8 min read',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'art-3',
      category: 'lifestyle',
      title_ar: 'الحياة في بودروم: دليل العيش الفاخر على ساحل البحر التركي',
      title_en: 'Life in Bodrum: Luxury Living Guide on the Turkish Coast',
      desc_ar: 'اكتشف روعة الفلل الفاخرة، والمنتجعات، ونمط الحياة الهادئ في شبه جزيرة بودروم الساحرة.',
      desc_en: 'Discover stunning luxury villas, premium resorts, and the tranquil lifestyle on the Bodrum peninsula.',
      author: lang === 'ar' ? 'ياسمين مارديني' : 'Yasmin Mardini',
      date: '2026-06-28',
      readTime_ar: 'قراءة في 4 دقائق',
      readTime_en: '4 min read',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
      const titleText = (lang === 'ar' ? art.title_ar : art.title_en).toLowerCase();
      const descText = (lang === 'ar' ? art.desc_ar : art.desc_en).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = titleText.includes(query) || descText.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory, lang]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors pt-28 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <BookOpen size={44} className="text-sky-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-serif mb-4">
            {lang === 'ar' ? 'المدونة العقارية' : 'Real Estate Blog'}
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            {lang === 'ar' ? 'اقرأ أحدث المقالات والنصائح والتحليلات السوقية المقدمة من خبرائنا العقاريين.' : 'Read the latest articles, advice, and market insights provided by our real estate experts.'}
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
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

          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3.5 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث في المدونة...' : 'Search articles...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-neutral-800 dark:text-white"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full text-center py-16 text-neutral-500">
              {lang === 'ar' ? 'لم يتم العثور على أي مقالات.' : 'No articles found.'}
            </div>
          ) : (
            filteredArticles.map(art => (
              <motion.article
                key={art.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={art.image}
                    alt={lang === 'ar' ? art.title_ar : art.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {lang === 'ar'
                      ? categories.find(c => c.id === art.category)?.label_ar
                      : categories.find(c => c.id === art.category)?.label_en}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] text-neutral-400 dark:text-neutral-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {lang === 'ar' ? art.readTime_ar : art.readTime_en}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-white mb-2 leading-snug group-hover:text-sky-500 transition-colors">
                    {lang === 'ar' ? art.title_ar : art.title_en}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-3 leading-relaxed">
                    {lang === 'ar' ? art.desc_ar : art.desc_en}
                  </p>

                  <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                        <User size={12} />
                      </div>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{art.author}</span>
                    </div>
                    <span className="text-sky-500 flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform">
                      {lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                      <ArrowRight size={12} className={isRtl ? 'rotate-180' : ''} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
