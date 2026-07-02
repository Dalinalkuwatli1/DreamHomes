import { createContext, useContext, useState } from 'react';

type Lang = 'en' | 'ar';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tProp: (property: any, field: 'title' | 'description' | 'address' | 'city' | 'type' | 'features') => any;
  isRtl: boolean;
}

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.properties': { en: 'Properties', ar: 'العقارات' },
  'nav.about': { en: 'About', ar: 'من نحن' },
  'nav.contact': { en: 'Contact', ar: 'تواصل معنا' },
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.profile': { en: 'Profile', ar: 'الملف الشخصي' },
  'nav.signout': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'nav.signin': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.register': { en: 'Register', ar: 'إنشاء حساب' },
  'nav.favorites': { en: 'Favorites', ar: 'المفضلة' },
  'nav.messages': { en: 'Messages', ar: 'الرسائل' },

  // Hero
  'hero.badge': { en: 'Trusted by 8,500+ homebuyers worldwide', ar: 'موثوق من قِبَل أكثر من 8,500 عميل حول العالم' },
  'hero.title1': { en: 'Find Your', ar: 'اعثر على' },
  'hero.title2': { en: 'Dream Home', ar: 'منزل أحلامك' },
  'hero.subtitle': { en: 'Explore thousands of verified properties for sale and rent. Your perfect home is just a search away.', ar: 'استكشف آلاف العقارات الموثقة للبيع والإيجار. منزلك المثالي يبدأ من هنا.' },
  'hero.searchPlaceholder': { en: 'Search by title or address...', ar: 'ابحث عن عنوان أو موقع...' },
  'hero.allCities': { en: 'All Cities', ar: 'جميع المدن' },
  'hero.search': { en: 'Search Properties', ar: 'ابحث عن عقار' },
  'hero.all': { en: 'All', ar: 'الكل' },
  'hero.sale': { en: 'For Sale', ar: 'للبيع' },
  'hero.rent': { en: 'For Rent', ar: 'للإيجار' },

  // Stats
  'stats.properties': { en: 'Properties Listed', ar: 'عقار مدرج' },
  'stats.clients': { en: 'Happy Clients', ar: 'عميل سعيد' },
  'stats.satisfaction': { en: 'Client Satisfaction', ar: 'رضا العملاء' },
  'stats.support': { en: 'Expert Support', ar: 'دعم متخصص' },

  // Why Us
  'why.title': { en: 'Why Choose DreamHomes?', ar: 'لماذا تختار دريم هومز؟' },
  'why.subtitle': { en: 'We make finding your perfect property simple and trustworthy', ar: 'نجعل البحث عن عقارك المثالي سهلاً وموثوقاً' },
  'why.verified': { en: 'Verified Listings', ar: 'عقارات موثقة' },
  'why.verified.desc': { en: 'Every property is verified by our experts to ensure accuracy and trust.', ar: 'كل عقار يتم التحقق منه بواسطة خبرائنا لضمان الدقة والثقة.' },
  'why.transparent': { en: 'Transparent Process', ar: 'عملية شفافة' },
  'why.transparent.desc': { en: 'No hidden fees, no surprises. Just straightforward real estate.', ar: 'لا رسوم خفية، لا مفاجآت. فقط عقارات واضحة وصريحة.' },
  'why.expert': { en: 'Expert Agents', ar: 'وكلاء متخصصون' },
  'why.expert.desc': { en: 'Our top agents have decades of combined market experience.', ar: 'وكلاؤنا المتميزون يمتلكون عقوداً من الخبرة في السوق.' },
  'why.fast': { en: 'Fast & Secure', ar: 'سريع وآمن' },
  'why.fast.desc': { en: 'Close deals quickly with our secure and streamlined platform.', ar: 'أنجز صفقاتك بسرعة مع منصتنا الآمنة والمتطورة.' },

  // Sections
  'section.featured': { en: 'Featured Properties', ar: 'العقارات المميزة' },
  'section.featured.sub': { en: 'Hand-picked premium listings by our experts', ar: 'عقارات مختارة بعناية من قِبَل خبرائنا' },
  'section.latest': { en: 'Latest Listings', ar: 'أحدث العقارات' },
  'section.latest.sub': { en: 'Recently added properties across the region', ar: 'عقارات أضيفت مؤخراً في المنطقة' },
  'section.viewAll': { en: 'View All', ar: 'عرض الكل' },
  'section.browseAll': { en: 'Browse All', ar: 'تصفح الكل' },
  'section.viewAllProperties': { en: 'View All Properties', ar: 'عرض جميع العقارات' },

  // CTA
  'cta.title': { en: 'Ready to List Your Property?', ar: 'هل أنت مستعد لعرض عقارك؟' },
  'cta.sub': { en: 'Join thousands of homeowners who trust DreamHomes to find buyers and renters quickly.', ar: 'انضم إلى آلاف أصحاب العقارات الذين يثقون بدريم هومز للعثور على المشترين والمستأجرين.' },
  'cta.list': { en: 'List Your Property', ar: 'أضف عقارك' },
  'cta.agent': { en: 'Talk to an Agent', ar: 'تحدث مع وكيل' },

  // Footer
  'footer.desc': { en: 'Find your perfect home with DreamHomes. Premium real estate listings, transparent process, and expert support every step of the way.', ar: 'اعثر على منزل أحلامك مع دريم هومز. قوائم عقارية متميزة، وعملية شفافة، ودعم متخصص في كل خطوة.' },
  'footer.rights': { en: '© 2025 DreamHomes. All rights reserved.', ar: '© 2025 دريم هومز. جميع الحقوق محفوظة.' },
  'footer.by': { en: 'By Dalin Alkuwatli', ar: 'بواسطة دالين القوتلي' },
  'footer.properties': { en: 'Properties', ar: 'العقارات' },
  'footer.company': { en: 'Company', ar: 'الشركة' },
  'footer.account': { en: 'Account', ar: 'الحساب' },
  'footer.forsale': { en: 'For Sale', ar: 'للبيع' },
  'footer.forrent': { en: 'For Rent', ar: 'للإيجار' },
  'footer.featured': { en: 'Featured', ar: 'مميزة' },
  'footer.new': { en: 'New Listings', ar: 'جديدة' },
  'footer.about': { en: 'About Us', ar: 'من نحن' },
  'footer.contact': { en: 'Contact', ar: 'تواصل' },
  'footer.careers': { en: 'Careers', ar: 'وظائف' },
  'footer.blog': { en: 'Blog', ar: 'المدونة' },
  'footer.signin': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'footer.register': { en: 'Register', ar: 'إنشاء حساب' },
  'footer.favorites': { en: 'My Favorites', ar: 'المفضلة' },
  'footer.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },

  // Role
  'role.user': { en: 'Regular User', ar: 'مستخدم عادي' },
  'role.owner': { en: 'Property Owner', ar: 'مالك عقار' },
  'role.switch': { en: 'Switch Role (Demo)', ar: 'تبديل الدور (تجريبي)' },
  'role.label': { en: 'Role:', ar: 'الدور:' },

  // Properties Page Filters & Info
  'prop.title': { en: 'Browse Properties', ar: 'تصفح العقارات' },
  'prop.found': { en: 'properties found', ar: 'عقارات تم العثور عليها' },
  'prop.showing': { en: 'Showing', ar: 'عرض' },
  'prop.of': { en: 'of', ar: 'من' },
  'prop.filters': { en: 'Filters', ar: 'الفلاتر' },
  'prop.clearAll': { en: 'Clear all', ar: 'مسح الكل' },
  'prop.search': { en: 'Search', ar: 'البحث' },
  'prop.searchPlaceholder': { en: 'Title, address, city...', ar: 'العنوان، الموقع، المدينة...' },
  'prop.listingType': { en: 'Listing Type', ar: 'نوع العرض' },
  'prop.allTypes': { en: 'All Types', ar: 'كل الأنواع' },
  'prop.propertyType': { en: 'Property Type', ar: 'نوع العقار' },
  'prop.city': { en: 'City', ar: 'المدينة' },
  'prop.minBeds': { en: 'Min Bedrooms', ar: 'الحد الأدنى لغرف النوم' },
  'prop.minBaths': { en: 'Min Bathrooms', ar: 'الحد الأدنى للحمامات' },
  'prop.maxPrice': { en: 'Max Price', ar: 'الحد الأقصى للسعر' },
  'prop.any': { en: 'Any', ar: 'أي عدد' },
  'prop.noProperties': { en: 'No properties found', ar: 'لم يتم العثور على أي عقار' },
  'prop.noPropertiesSub': { en: 'Try adjusting your filters to see more results.', ar: 'حاول تعديل خيارات الفلاتر لرؤية المزيد من النتائج.' },
  'prop.clearFilters': { en: 'Clear Filters', ar: 'إعادة تعيين الفلاتر' },
  'prop.sortBy': { en: 'Sort By', ar: 'ترتيب حسب' },

  // Property Card / Details
  'card.forSale': { en: 'For Sale', ar: 'للبيع' },
  'card.forRent': { en: 'For Rent', ar: 'للإيجار' },
  'card.new': { en: 'New', ar: 'جديد' },
  'card.featured': { en: 'Featured', ar: 'مميز' },
  'card.bed': { en: 'Bed', ar: 'غرفة' },
  'card.beds': { en: 'Beds', ar: 'غرف' },
  'card.bath': { en: 'Bath', ar: 'حمام' },
  'card.baths': { en: 'Baths', ar: 'حمامات' },
  'card.sqft': { en: 'ft²', ar: 'قدم²' },
  'card.mo': { en: '/mo', ar: '/شهرياً' },
  'card.views': { en: 'views', ar: 'مشاهدة' },

  // Property Detail Page
  'detail.back': { en: 'Back to Properties', ar: 'العودة إلى العقارات' },
  'detail.notFound': { en: 'Property Not Found', ar: 'العقار غير موجود' },
  'detail.notFoundSub': { en: "This property may have been removed or doesn't exist.", ar: 'ربما تم حذف هذا العقار أو أنه غير موجود.' },
  'detail.overview': { en: 'Property Overview', ar: 'نظرة عامة على العقار' },
  'detail.features': { en: 'Features & Amenities', ar: 'الميزات والمرافق' },
  'detail.contactOwner': { en: 'Contact Owner', ar: 'تواصل مع المالك' },
  'detail.messageSent': { en: 'Message Sent!', ar: 'تم إرسال الرسالة!' },
  'detail.messageSentSub': { en: 'Your conversation has been started. You can view it in your messages tab.', ar: 'لقد بدأت المحادثة مع المالك. يمكنك متابعتها في تبويب الرسائل.' },
  'detail.goToMessages': { en: 'Go to Messages', ar: 'الذهاب إلى الرسائل' },
  'detail.share': { en: 'Share Property', ar: 'مشاركة العقار' },
  'detail.addedFav': { en: 'Added to favorites!', ar: 'تمت الإضافة للمفضلة!' },
  'detail.removedFav': { en: 'Removed from favorites', ar: 'تمت الإزالة من المفضلة' },
  'detail.linkCopied': { en: 'Link copied to clipboard!', ar: 'تم نسخ الرابط إلى الحافظة!' },

  // About Page
  'about.title1': { en: "We're Reimagining", ar: 'نحن نعيد تصور' },
  'about.title2': { en: 'Real Estate', ar: 'العالم العقاري' },
  'about.subtitle': { en: 'DreamHomes was built on a simple belief: finding your dream home should be exciting, not stressful. We combine technology with human expertise to make every step seamless.', ar: 'تم بناء دريم هومز على إيمان بسيط: العثور على منزل أحلامك يجب أن يكون ممتعاً، لا مرهقاً. نحن ندمج التكنولوجيا والخبرة البشرية لجعل كل خطوة سهلة وسلسة.' },
  'about.milestoneTitle': { en: 'Our Journey', ar: 'رحلتنا المستمرة' },
  'about.teamTitle': { en: 'Meet the Team', ar: 'فريق العمل المتميز' },
  'about.missionTitle': { en: 'Our Mission', ar: 'مهمتنا' },
  'about.missionDesc': { en: "To empower every person in America to find a place they can call home—whether they're buying their first property, renting in a new city, or listing their investment portfolio. We do this through transparent data, expert guidance, and technology that puts the human experience first.", ar: 'تمكين الجميع من العثور على مكان يمكنهم تسميته بيتاً - سواء كانوا يشترون عقارهم الأول، أو يستأجرون في مدينة جديدة، أو يعرضون محفظتهم الاستثمارية. نحن نفعل ذلك من خلال البيانات الشفافة والتوجيه المهني والتكنولوجيا التي تضع التجربة البشرية أولاً.' },

  // Contact Page
  'contact.title': { en: 'Get in Touch', ar: 'تواصل معنا' },
  'contact.subtitle': { en: "We'd love to hear from you. Our team is ready to help.", ar: 'يسعدنا سماع صوتك. فريقنا متواجد دائماً لمساعدتك في أي استفسار.' },
  'contact.infoTitle': { en: 'Contact Information', ar: 'معلومات الاتصال' },
  'contact.hq': { en: 'DreamHomes HQ', ar: 'المقر الرئيسي لدريم هومز' },
  'contact.sendMessage': { en: 'Send a Message', ar: 'أرسل رسالة' },
  'contact.name': { en: 'Name *', ar: 'الاسم الكلي *' },
  'contact.namePlaceholder': { en: 'Your name', ar: 'اكتب اسمك هنا' },
  'contact.phone': { en: 'Phone', ar: 'رقم الهاتف' },
  'contact.email': { en: 'Email *', ar: 'البريد الإلكتروني *' },
  'contact.subject': { en: 'Subject', ar: 'الموضوع' },
  'contact.subjectPlaceholder': { en: 'Select a subject', ar: 'اختر موضوع الاستفسار' },
  'contact.message': { en: 'Message *', ar: 'الرسالة *' },
  'contact.messagePlaceholder': { en: 'Tell us about your requirements...', ar: 'أخبرنا عن متطلباتك بالتفصيل...' },
  'contact.sending': { en: 'Sending...', ar: 'جاري الإرسال...' },
  'contact.sendBtn': { en: 'Send Message', ar: 'إرسال الرسالة' },
  'contact.success': { en: 'Message Sent Successfully!', ar: 'تم إرسال الرسالة بنجاح!' },
  'contact.successSub': { en: 'Thank you for contacting us. We will get back to you within 24 hours.', ar: 'نشكرك على التواصل معنا. سنقوم بالرد عليك خلال 24 ساعة.' },
  'contact.sendAnother': { en: 'Send Another Message', ar: 'إرسال رسالة أخرى' },
  'contact.officeLabel': { en: 'Office', ar: 'المكتب الرئيسي' },
  'contact.emailLabel': { en: 'Email', ar: 'البريد الإلكتروني' },
  'contact.phoneLabel': { en: 'Phone', ar: 'الهاتف' },
  'contact.hoursLabel': { en: 'Hours', ar: 'أوقات العمل' },

  // Auth (Login / Register)
  'auth.welcomeBack': { en: 'Welcome Back', ar: 'مرحباً بعودتك' },
  'auth.signInToAccount': { en: 'Sign in to your DreamHomes account', ar: 'سجل الدخول إلى حسابك في دريم هومز' },
  'auth.demoHint': { en: 'Demo: Use any email/password to sign in', ar: 'تجريبي: استخدم أي بريد إلكتروني/كلمة مرور لتسجيل الدخول' },
  'auth.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'auth.password': { en: 'Password', ar: 'كلمة المرور' },
  'auth.rememberMe': { en: 'Remember me', ar: 'تذكرني' },
  'auth.forgotPassword': { en: 'Forgot password?', ar: 'نسيت كلمة المرور؟' },
  'auth.signIn': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'auth.signingIn': { en: 'Signing in...', ar: 'جاري تسجيل الدخول...' },
  'auth.dontHaveAccount': { en: "Don't have an account?", ar: 'ليس لديك حساب؟' },
  'auth.createAccount': { en: 'Create account', ar: 'أنشئ حساباً' },
  'auth.joinThousands': { en: 'Join thousands of home seekers & sellers', ar: 'انضم إلى آلاف الباحثين عن المنازل والبائعين' },
  'auth.iWantTo': { en: 'I want to...', ar: 'أنا أريد...' },
  'auth.findHome': { en: 'Find a Home', ar: 'العثور على منزل' },
  'auth.listProperty': { en: 'List Property', ar: 'عرض عقار' },
  'auth.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'auth.fullNamePlaceholder': { en: 'John Doe', ar: 'جون دو' },
  'auth.phone': { en: 'Phone', ar: 'رقم الهاتف' },
  'auth.confirmPassword': { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' },
  'auth.repeatPassword': { en: 'Repeat password', ar: 'كرر كلمة المرور' },
  'auth.agreeTerms': { en: 'I agree to the Terms of Service and Privacy Policy', ar: 'أوافق على شروط الخدمة وسياسة الخصوصية' },
  'auth.registering': { en: 'Registering...', ar: 'جاري التسجيل...' },
  'auth.haveAccount': { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },
  'auth.login': { en: 'Login', ar: 'تسجيل الدخول' },
  'auth.passwordMin': { en: 'Min. 6 characters', ar: '6 أحرف كحد أدنى' },

  // Messages
  'msg.title': { en: 'Messages', ar: 'الرسائل' },
  'msg.conversations': { en: 'conversations', ar: 'محادثة' },
  'msg.conversation': { en: 'conversation', ar: 'محادثة' },
  'msg.writeMessage': { en: 'Type a message...', ar: 'اكتب رسالة...' },
  'msg.send': { en: 'Send', ar: 'إرسال' },

  // Profile
  'profile.info': { en: 'Profile Info', ar: 'معلومات الحساب' },
  'profile.security': { en: 'Security', ar: 'الأمان' },
  'profile.personalInfo': { en: 'Personal Information', ar: 'معلوماتك الشخصية' },
  'profile.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'profile.phone': { en: 'Phone', ar: 'رقم الهاتف' },
  'profile.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'profile.bio': { en: 'Bio', ar: 'نبذة شخصية' },
  'profile.bioPlaceholder': { en: 'Looking for my dream home in a vibrant city.', ar: 'أبحث عن منزل أحلامي في مدينة مفعمة بالحيوية.' },
  'profile.memberSince': { en: 'Member Since', ar: 'عضو منذ' },
  'profile.saveChanges': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'profile.saving': { en: 'Saving...', ar: 'جاري الحفظ...' },

  // Dashboard
  'dash.welcome': { en: 'Welcome back', ar: 'مرحباً بعودتك' },
  'dash.addProperty': { en: 'Add Property', ar: 'إضافة عقار' },
  'dash.totalListings': { en: 'Total Listings', ar: 'إجمالي العقارات' },
  'dash.activeListings': { en: 'Active Listings', ar: 'العقارات النشطة' },
  'dash.forSale': { en: 'For Sale', ar: 'للبيع' },
  'dash.forRent': { en: 'For Rent', ar: 'للإيجار' },
  'dash.saved': { en: 'Saved', ar: 'المفضلة' },
  'dash.messages': { en: 'Messages', ar: 'الرسائل' },
  'dash.myProperties': { en: 'My Properties', ar: 'عقاراتي' },
  'dash.addNew': { en: 'Add New', ar: 'إضافة جديد' },
  'dash.noProperties': { en: 'No Properties Yet', ar: 'لا توجد عقارات بعد' },
  'dash.noPropertiesSub': { en: 'Start listing your first property today.', ar: 'ابدأ بعرض عقارك الأول اليوم.' },
};

export const cityTranslations: Record<string, string> = {
  'Istanbul': 'إسطنبول',
  'Bodrum': 'بودروم',
  'Antalya': 'أنطاليا',
  'New York': 'نيويورك',
  'Los Angeles': 'لوس أنجلوس',
  'Chicago': 'شيكاغو',
  'Miami': 'ميامي',
  'Houston': 'هيوستن',
  'San Francisco': 'سان فرانسيسكو',
  'Seattle': 'سياتل',
  'Boston': 'بوسطن',
  'Austin': 'أوستن',
  'Denver': 'دنفر',
};

export const typeTranslations: Record<string, string> = {
  'House': 'منزل',
  'Apartment': 'شقة',
  'Condo': 'شقة سكنية',
  'Villa': 'فيلا',
  'Townhouse': 'تاون هاوس',
  'Studio': 'استوديو',
  'Penthouse': 'بنتهاوس',
  'Duplex': 'دوبلكس',
};

export const featureTranslations: Record<string, string> = {
  'Swimming Pool': 'مسبح خاص',
  'Gym': 'صالة ألعاب رياضية',
  'Parking': 'موقف سيارات',
  'Garden': 'حديقة واسعة',
  'Balcony': 'شرفة مطلة',
  'Fireplace': 'مدفأة حميمية',
  'Air Conditioning': 'تكييف مركزي',
  'Heating': 'تدفئة مركزي',
  'Dishwasher': 'غسالة أطباق',
  'Laundry': 'غرفة غسيل',
  'Pet Friendly': 'صديق للحيوانات الأليفة',
  'Security System': 'نظام حماية متطور',
  'Elevator': 'مصعد كهربائي',
  'Rooftop Access': 'وصول للسطح',
  'Smart Home': 'منزل ذكي بالكامل',
  'Solar Panels': 'أجهزة طاقة شمسية',
};

const propertyTranslations: Record<string, {
  title: string;
  description: string;
  address: string;
}> = {
  '1': {
    title: 'فيلا فاخرة مطلة على المياه (بودروم)',
    description: 'فيلا استثنائية مطلة على مياه بودروم مع إطلالات بانورامية خلابة على البحر الإيجي. تتميز بنوافذ تمتد من الأرض حتى السقف، ومطبخ مجهز بالكامل، وسينما منزلية، ومسبح إنفينيتي خاص يطل على خليج ياليكافاك. مثالية للمشتري المميز.',
    address: 'مرسى ياليكافاك، بودروم، تركيا',
  },
  '2': {
    title: 'بنتهاوس حديث في وسط المدينة',
    description: 'العيش في السماء بأفضل صوره. يقع هذا البنتهاوس العصري للغاية فوق أحد أكثر مباني مانهاتن تميزاً، مما يوفر إطلالات بزاوية 360 درجة على أفق مدينة نيويورك الشهير. تشتمل الميزات على شرفة خاصة ومطبخ فاخر ووصول كامل لجميع مرافق المبنى العالمية.',
    address: '432 بارك أفينيو، مانهاتن، نيويورك 10022',
  },
  '3': {
    title: 'قصر فاخر على البوسفور',
    description: 'قصر أيقوني على مضيق البوسفور في إسطنبول خلف بوابات خاصة. يوفر رفاهية لا تضاهى مع مدخل مهيب وقبو نبيذ وسينما منزلية وسبا وملعب تنس وبيت ضيافة. إطلالات مباشرة على البوسفور.',
    address: 'بيبك، إسطنبول، تركيا',
  },
  '4': {
    title: 'استوديو مريح في سوهو',
    description: 'شقة استوديو ساحرة في قلب سوهو. تتميز بأسقف عالية وجدران من الطوب المكشوف وأرضيات خشبية، وهي مغمورة بالضوء الطبيعي. على مسافة قصيرة سيراً على الأقدام من المعارض الفنية والمحلات التجارية والمطاعم العالمية. مثالية للمهنيين الباحثين عن نمط حياة حيوي.',
    address: '168 شارع برنس، سوهو، نيويورك 10012',
  },
  '5': {
    title: 'منزل عائلي واسع في ساريير',
    description: 'بيت عائلي جميل في منطقة ساريير الراقية بإسطنبول. تصميم مفتوح، مطبخ محدث، جناح رئيسي مع حمام سبا، وساحة خلفية واسعة. قريب من المدارس الدولية وعلى بعد دقائق من مضيق البوسفور.',
    address: 'تارابيا، ساريير، إسطنبول، تركيا',
  },
  '6': {
    title: 'شقة لوفت أنيقة',
    description: 'شقة لوفت مذهلة في شارع ميشيغان الشهير في شيكاغو. تصميم صناعي مفتوح مع أسقف شاهقة بارتفاع 14 قدماً، وتمديدات مكشوفة، وأرضيات خرسانية مصقولة، وإطلالات بانورامية على البحيرة. يتميز المبنى بخدمة بواب على مدار الساعة وطوال أيام الأسبوع وتراس على السطح.',
    address: '900 إن ميشيغان أفينيو، شيكاغو، إلينوي 60611',
  },
  '7': {
    title: 'شقة سكنية مطلة على الجبل',
    description: 'شقة معاصرة مع إطلالات خلابة على جبال روكي. مصممة بعناية مع مخطط مفتوح، وتشطيبات راقية، وشرفة كبيرة ملتفة. تشمل مرافق المبنى مركزاً للياقة البدنية ومسبحاً وموقف سيارات مغطى وآمن تحت الأرض.',
    address: '1600 غلينارم بليس، دنفر، كولورادو 80202',
  },
  '8': {
    title: 'تاون هاوس فيكتوري',
    description: 'تاون هاوس فيكتوري تم تجديده بالكامل في حي باسيفيك هايتس المرموق. هندسة معمارية تاريخية تمتزج بسلاسة مع الفخامة الحديثة. تفاصيل أصلية، ومطبخ مجهز بالكامل، وسطح مراقبة يطل على جسر الخليج، وحديقة خاصة.',
    address: '2851 شارع كلاي، باسيفيك هايتس، كاليفورنيا 94115',
  },
  '9': {
    title: 'شقة شاطئية مطلة على الخليج',
    description: 'شقة أنيقة في أحد أكثر المباني المرغوبة في هيوستن. إطلالات ساحرة على الخليج، ومرافق تشبه المنتجعات، وموقع لا ممثل له. تتميز بنوافذ تمتد من الأرض حتى السقف ومطبخ فاخر وشرفة خاصة مثالية للترفيه.',
    address: '2323 طريق ويستهايمر، هيوستن، تكساس 77098',
  },
  '10': {
    title: 'ملاذ على ساحل البحر المتوسط',
    description: 'عقار مذهل على ساحل أنطاليا المتوسطي مع وصول مباشر للشاطئ. إطلالات رائعة على البحر من كل غرفة. يشتمل على مطبخ فاخر وشرفة واسعة ممتدة وحديقة خاصة منسقة.',
    address: 'ساحل لارا، أنطاليا، تركيا',
  },
  '11': {
    title: 'قصر تاريخي في كاراكوي',
    description: 'قصر تاريخي مكون من أربعة طوابق تم ترميمه بشكل مثالي في منطقة كاراكوي الإسطنبولية. أقواس طوب أصيلة تكملها مطبخ حديث وحمامات سبا وفناء خاص. ملاذ حضري لا مثيل له في قلب المدينة.',
    address: 'كاراكوي، إسطنبول، تركيا',
  },
  '12': {
    title: 'شقة إيجار حديثة',
    description: 'شقة أنيقة بغرفة نوم واحدة في بيفرلي هيلز. تم تجديدها حديثاً مع أسطح عمل من الكوارتز، وأجهزة من الفولاذ المقاوم للصدأ، وغسالة ومجفف داخل الشقة. تشمل مرافق المبنى مسبحاً على طراز المنتجعات ومركزاً للياقة البدنية وموقف سيارات تحت الأرض.',
    address: '8500 ويلشاير بلوفارد، بيفرلي هيلز، كاليفورنيا 90211',
  },
};

const milestoneTranslations: Record<string, { title: string; desc: string }> = {
  'Founded': { title: 'تأسيس المنصة', desc: 'تم إطلاق دريم هومز برؤية واضحة لتحديث العالم العقاري وتسهيل عمليات البيع والشراء.' },
  'First 1,000 listings': { title: 'أول 1,000 عقار مدرج', desc: 'نمو سريع وواسع للمنصة في أسواق الساحل الشرقي.' },
  '55 Cities': { title: 'التوسع لـ 50 مدينة', desc: 'قمنا بتوسيع شبكتنا لتغطي 50 مدينة رئيسية بأمريكا.' },
  '50 Cities': { title: 'التوسع لـ 50 مدينة', desc: 'قمنا بتوسيع شبكتنا لتغطي 50 مدينة رئيسية بأمريكا.' },
  '12,000+ Properties': { title: 'أكثر من 12,000 عقار', desc: 'أصبحنا الآن واحدة من أسرع منصات العقارات نمواً في البلاد.' },
};

const teamTranslations: Record<string, { role: string; bio: string }> = {
  'James Mitchell': { role: 'الرئيس التنفيذي والشريك المؤسس', bio: 'أكثر من 20 عاماً من الخبرة في أسواق العقارات الفاخرة.' },
  'Priya Sharma': { role: 'مديرة قسم المنتجات', bio: 'مصممة منتجات سابقة في Airbnb متخصصة في بناء تجارب مستخدم ممتازة.' },
  'Carlos Rivera': { role: 'رئيس قسم المبيعات', bio: 'أشرف على صفقات سكنية تجاوزت قيمتها 2 مليار دولار على مستوى البلاد.' },
  'Anya Kowalski': { role: 'كبيرة المهندسين', bio: 'تقود البنية التحتية البرمجية التي تشغل وتطور منصة دريم هومز.' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (key) => key,
  tProp: (property) => property,
  isRtl: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = l;
    }
  };

  // Set initial dir
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  const tProp = (property: any, field: 'title' | 'description' | 'address' | 'city' | 'type' | 'features') => {
    if (!property) return '';
    if (lang === 'en') {
      if (field === 'features') return property.features || [];
      return property[field] || '';
    }

    // Arabic
    if (field === 'title' || field === 'description' || field === 'address') {
      return propertyTranslations[property.id]?.[field] ?? property[field] ?? '';
    }
    if (field === 'city') {
      return cityTranslations[property.city] ?? property.city ?? '';
    }
    if (field === 'type') {
      return typeTranslations[property.type] ?? property.type ?? '';
    }
    if (field === 'features') {
      return (property.features || []).map((f: string) => featureTranslations[f] ?? f);
    }
    return property[field] || '';
  };

  const translateMilestone = (title: string, year: string, originalDesc: string) => {
    if (lang === 'en') return { title, desc: originalDesc };
    return milestoneTranslations[title] ?? { title, desc: originalDesc };
  };

  const translateTeam = (name: string, originalRole: string, originalBio: string) => {
    if (lang === 'en') return { role: originalRole, bio: originalBio };
    return teamTranslations[name] ?? { role: originalRole, bio: originalBio };
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t,
      tProp,
      isRtl: lang === 'ar',
      ...({ translateMilestone, translateTeam } as any)
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);