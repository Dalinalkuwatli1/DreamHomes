import { useEffect } from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PrivacyPage() {
  const { lang, isRtl } = useLanguage();

  useEffect(() => {
    document.title = lang === 'ar' ? 'سياسة الخصوصية | دريم هومز' : 'Privacy Policy | DreamHomes';
  }, [lang]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors pt-28 pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield size={44} className="text-sky-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white font-serif mb-4">
            {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {lang === 'ar' ? 'آخر تحديث: 2 يوليو 2026' : 'Last Updated: July 2, 2026'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
          <p>
            {lang === 'ar'
              ? 'نهتم في دريم هومز بخصوصيتك وسرية بياناتك الشخصية. توضح هذه السياسة كيف نجمع، ونستخدم، ونحمي معلوماتك الشخصية عند استخدام موقعنا الإلكتروني.'
              : 'At DreamHomes, we care about your privacy and the confidentiality of your personal data. This policy explains how we collect, use, and protect your personal information when using our website.'}
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <Eye size={18} className="text-sky-500" />
              {lang === 'ar' ? '1. المعلومات التي نجمعها' : '1. Information We Collect'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'نقوم بجمع المعلومات التي تقدمها لنا طواعية عند تسجيل حساب، أو تعبئة نموذج تواصل، أو إرسال استفسار حول أحد العقارات. وتشمل هذه البيانات: الاسم، البريد الإلكتروني، ورقم الهاتف.'
                : 'We collect information you voluntarily provide to us when registering an account, filling out a contact form, or sending an inquiry about a property. This data includes: name, email, and phone number.'}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <Lock size={18} className="text-sky-500" />
              {lang === 'ar' ? '2. كيف نستخدم معلوماتك' : '2. How We Use Your Information'}
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-4">
              {lang === 'ar' ? (
                <>
                  <li>لتسهيل عملية التواصل بين الملاك والمشترين والمستأجرين.</li>
                  <li>لتحسين خدماتنا وتخصيص تجربتك على الموقع.</li>
                  <li>لإرسال إشعارات وتحديثات هامة بخصوص حسابك أو طلباتك.</li>
                </>
              ) : (
                <>
                  <li>To facilitate communication between owners, buyers, and renters.</li>
                  <li>To improve our services and customize your experience on the website.</li>
                  <li>To send important notifications and updates regarding your account or requests.</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <FileText size={18} className="text-sky-500" />
              {lang === 'ar' ? '3. حماية وأمن البيانات' : '3. Data Security and Protection'}
            </h2>
            <p>
              {lang === 'ar'
                ? 'نحن نطبق مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية. نستخدم تشفير SSL متقدم لحماية البيانات الحساسة المنقولة عبر الإنترنت.'
                : 'We implement a variety of security measures to maintain the safety of your personal information. We use advanced SSL encryption to protect sensitive data transmitted online.'}
            </p>
          </section>

          <p className="border-t border-neutral-100 dark:border-neutral-800 pt-6 text-center text-xs text-neutral-400">
            {lang === 'ar'
              ? 'إذا كان لديك أي أسئلة أو مخاوف بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني dreamhomes@gmail.com'
              : 'If you have any questions or concerns regarding our Privacy Policy, please contact us at dreamhomes@gmail.com'}
          </p>
        </div>
      </div>
    </div>
  );
}
