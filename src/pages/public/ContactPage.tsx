import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppStore';
import { addToast } from '../../store/slices/uiSlice';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const { t, isRtl, lang } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsLoading(false);
      dispatch(addToast({ 
        message: lang === 'ar' ? 'تم إرسال الرسالة! سنتواصل معك قريباً.' : 'Message sent! We\'ll be in touch soon.', 
        type: 'success' 
      }));
    }, 1000);
  };

  const contactInfo = [
    { 
      icon: <Phone size={20} className="text-sky-400" />, 
      title: t('contact.phoneLabel'), 
      value: '+1 (800) DREAM-HM', 
      sub: lang === 'ar' ? 'من الإثنين للجمعة 9ص - 7م' : 'Mon-Fri 9am-7pm EST' 
    },
    { 
      icon: <Mail size={20} className="text-sky-400" />, 
      title: t('contact.emailLabel'), 
      value: 'dreamhomes@gmail.com', 
      sub: lang === 'ar' ? 'نرد خلال 24 ساعة' : 'We respond within 24h' 
    },
    { 
      icon: <MapPin size={20} className="text-sky-400" />, 
      title: t('contact.officeLabel'), 
      value: lang === 'ar' ? '123 شارع العقارات' : '123 Realty Ave', 
      sub: lang === 'ar' ? 'نيويورك، NY 10001' : 'New York, NY 10001' 
    },
    { 
      icon: <Clock size={20} className="text-sky-400" />, 
      title: t('contact.hoursLabel'), 
      value: lang === 'ar' ? 'الإثنين - الجمعة' : 'Mon - Fri', 
      sub: lang === 'ar' ? '9:00 صباحاً – 7:00 مساءً' : '9:00 AM – 7:00 PM' 
    },
  ];

  return (
    <div className="animate-fade-in text-custom" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="py-16" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(99,102,241,0.06) 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold text-custom mb-3">{t('contact.title')}</h1>
          <p className="text-muted text-lg">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Info */}
          <div>
            <h2 className="text-2xl font-bold text-custom mb-6">{t('contact.infoTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map(info => (
                <div key={info.title} className="dh-card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(14,165,233,0.1)' }}>
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-0.5">{info.title}</p>
                    <p className="text-sm font-semibold text-custom">{info.value}</p>
                    <p className="text-xs text-muted">{info.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="dh-card overflow-hidden h-64" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))' }}>
              <div className="h-full flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin size={40} className="text-sky-500 mx-auto mb-3" />
                  <p className="font-semibold text-custom">{t('contact.hq')}</p>
                  <p className="text-sm text-muted">{lang === 'ar' ? '123 شارع العقارات، نيويورك، NY 10001' : '123 Realty Ave, New York, NY 10001'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="dh-card p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-custom mb-2">{t('contact.success')}</h3>
                <p className="text-muted mb-6">{t('contact.successSub')}</p>
                <button onClick={() => setSubmitted(false)} className="btn-primary">{t('contact.sendAnother')}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-custom mb-2">{t('contact.sendMessage')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('contact.name')}</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="dh-input" placeholder={t('contact.namePlaceholder')} />
                  </div>
                  <div>
                    <label className="label">{t('contact.phone')}</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="dh-input" placeholder="+1 555-000-0000" />
                  </div>
                </div>
                <div>
                  <label className="label">{t('contact.email')}</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="dh-input" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="label">{t('contact.subject')}</label>
                  <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="dh-input">
                    <option value="">{t('contact.subjectPlaceholder')}</option>
                    <option>{lang === 'ar' ? 'استفسار عن عقار' : 'Property Inquiry'}</option>
                    <option>{lang === 'ar' ? 'إضافة عقاري الخاص' : 'List My Property'}</option>
                    <option>{lang === 'ar' ? 'سؤال عام' : 'General Question'}</option>
                    <option>{lang === 'ar' ? 'شراكة أعمال' : 'Partnership'}</option>
                    <option>{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label className="label">{t('contact.message')}</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="dh-input resize-none" placeholder={t('contact.messagePlaceholder')} />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary justify-center w-full mt-2">
                  <Send size={16} />
                  {isLoading ? t('contact.sending') : t('contact.sendBtn')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
