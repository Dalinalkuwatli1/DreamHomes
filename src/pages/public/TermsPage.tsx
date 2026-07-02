import { useEffect } from 'react';
import { FileText, ShieldAlert, CheckSquare, Scale } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TermsPage() {
  const { lang, isRtl } = useLanguage();

  useEffect(() => {
    document.title = lang === 'ar' ? 'الشروط والأحكام | دريم هومز' : 'Terms & Conditions | DreamHomes';
  }, [lang]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors pt-28 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Scale size={44} className="text-sky-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-serif mb-4">
            {lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {lang === 'ar' ? 'آخر تحديث: 2 يوليو 2026' : 'Last Updated: July 2, 2026'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
          <p>
            {lang === 'ar'
              ? 'مرحباً بكم في منصة دريم هومز. دخولك واستخدامك للموقع يعني موافقتك الكاملة على الشروط والأحكام التالية، يرجى قراءتها بعناية.'
              : 'Welcome to the DreamHomes platform. Accessing and using the website indicates your full agreement to the following terms and conditions, please read them carefully.'}
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <CheckSquare size={18} className="text-sky-500" />
              {lang === 'ar' ? '1. شروط الاستخدام المقبول' : '1. Acceptable Use Policy'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'يُحظر استخدام الموقع لأي غرض غير قانوني أو قد يعرض سلامة المنصة للخطر. يجب تقديم معلومات دقيقة وموثوقة عند نشر العقارات أو إنشاء حساب.'
                : 'It is prohibited to use the website for any illegal purpose or any activity that may jeopardize the platform security. Accurate and reliable information must be provided when publishing properties or creating an account.'}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-sky-500" />
              {lang === 'ar' ? '2. إخلاء المسؤولية عن المحتوى' : '2. Content Disclaimer'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'المعلومات العقارية المقدمة على الموقع مقدمة من الملاك والشركاء بشكل مباشر. على الرغم من أننا نبذل قصارى جهدنا للتحقق من مصداقية المحتوى، إلا أننا لا نضمن صحتها المطلقة ويتحمل المستخدم مسؤولية التحقق منها قبل التعاقد.'
                : 'Real estate information provided on the website is directly submitted by owners and partners. Although we make our best efforts to verify content credibility, we do not guarantee absolute accuracy and the user is responsible for verification before contracting.'}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-sky-500" />
              {lang === 'ar' ? '3. حقوق الملكية الفكرية' : '3. Intellectual Property Rights'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'جميع العلامات التجارية، والشعارات، والبرمجيات، والتصميمات، والمحتوى النصي والمرئي في دريم هومز هي ملك حصري لنا ولا يجوز نسخها أو استخدامها دون إذن خطي مسبق.'
                : 'All trademarks, logos, software, designs, text, and visual content on DreamHomes are our exclusive property and may not be copied or used without prior written permission.'}
            </p>
          </section>

          <p className="border-t border-neutral-100 dark:border-neutral-800 pt-6 text-center text-xs text-neutral-400">
            {lang === 'ar'
              ? 'باستخدامك للموقع، فإنك تقر بأنك قرأت وفهمت هذه الشروط وتوافق على الالتزام بها.'
              : 'By using the website, you acknowledge that you have read, understood, and agree to be bound by these terms.'}
          </p>
        </div>
      </div>
    </div>
  );
}
