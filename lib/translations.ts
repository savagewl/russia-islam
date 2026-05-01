type Lang = 'ru' | 'en' | 'ar'

const translations = {
  nav: {
    about_group:         { ru: 'О группе',                   en: 'About the Group',         ar: 'عن المجموعة' },
    group_members:       { ru: 'Члены группы',               en: 'Group Members',           ar: 'أعضاء المجموعة' },
    islam_in_russia:     { ru: 'Ислам в России',             en: 'Islam in Russia',         ar: 'الإسلام في روسيا' },
    photo_video:         { ru: 'Фото и видео',               en: 'Photo & Video',           ar: 'صور وفيديوهات' },
    contact:             { ru: 'Контактная информация',      en: 'Contact Information',     ar: 'معلومات الاتصال' },
    news:                { ru: 'Новости',                    en: 'News',                    ar: 'أخبار' },
    group_news:          { ru: 'Новости группы',             en: 'Group News',              ar: 'أخبار المجموعة' },
    key_projects:        { ru: 'Ключевые проекты',           en: 'Key Projects',            ar: 'مشاريع رئيسية' },
    opportunities:       { ru: 'Возможности',                en: 'Opportunities',           ar: 'إمكانيات' },
    events:              { ru: 'Анонсы',                     en: 'Announcements',           ar: 'إعلانات' },
    experts:             { ru: 'Эксперты',                   en: 'Experts',                 ar: 'خبراء' },
    scientific_articles: { ru: 'Научные статьи',             en: 'Articles',     ar: 'مقالات' },
  },

  search: {
    placeholder:     { ru: 'Поиск',                       en: 'Search',                  ar: 'بحث' },
    placeholder_mobile: { ru: 'Поиск...',                 en: 'Search...',               ar: 'بحث...' },
    searching:       { ru: 'Поиск...',                    en: 'Searching...',            ar: 'جارٍ البحث...' },
    not_found:       { ru: 'Ничего не найдено',           en: 'Nothing found',           ar: 'لم يتم العثور على نتائج' },
    show_all:        { ru: 'Показать все результаты →',   en: 'Show all results →',      ar: '← عرض كل النتائج' },
    cancel:          { ru: 'Отмена',                      en: 'Cancel',                  ar: 'إلغاء' },
  },

  news: {
    title:              { ru: 'Новости',          en: 'News',           ar: 'أخبار' },
    more:               { ru: 'Подробнее',        en: 'More',           ar: 'المزيد' },
    group_badge:        { ru: 'НОВОСТИ ГРУППЫ',   en: 'GROUP NEWS',     ar: 'أخبار المجموعة' },
    key_projects_badge: { ru: 'КЛЮЧЕВЫЕ ПРОЕКТЫ', en: 'KEY PROJECTS',   ar: 'مشاريع رئيسية' },
    opportunities_badge:{ ru: 'ВОЗМОЖНОСТИ',      en: 'OPPORTUNITIES',  ar: 'إمكانيات' },
    events_badge:       { ru: 'АНОНСЫ',           en: 'ANNOUNCEMENTS',  ar: 'إعلانات' },
    no_content:         { ru: 'Нет материалов',   en: 'No content',     ar: 'لا يوجد محتوى' },
  },

  experts: {
    title: { ru: 'Эксперты',    en: 'Experts',  ar: 'خبراء' },
    more:  { ru: 'Подробнее',   en: 'More',     ar: 'المزيد' },
  },

  scientific: {
    more:     { ru: 'Подробнее',       en: 'More',       ar: 'المزيد' },
    see_also: { ru: 'Смотрите также',  en: 'See Also',   ar: 'اقرأ أيضًا' },
    title:    { ru: 'Научные статьи',  en: 'Articles', ar: 'مقالات' },
  },

  members: {
    title:    { ru: 'Члены группы',     en: 'Group Members',           ar: 'أعضاء المجموعة' },
    countries:{ ru: 'стран мира',       en: 'countries worldwide',  ar: 'دولة حول العالم' },
    regions:  { ru: 'регионов России',  en: 'regions of Russia',       ar: 'إقليمًا من روسيا' },
  },

  calendar: {
    filter_by_date:    { ru: 'Фильтровать по дате',  en: 'Sort by date',        ar: 'ترتيب حسب التاريخ' },
    reset:             { ru: 'Сбросить',             en: 'Reset',                 ar: 'إلغاء' },
    showing_articles:  { ru: 'Показаны статьи за',   en: 'Showing articles for',  ar: 'عرض المقالات لـ' },
  },

  articles: {
    not_found:        { ru: 'Статьи не найдены',                                en: 'No articles found',                               ar: 'لم يتم العثور على نتائج خلال الفترة المحددة' },
    author:           { ru: 'Автор:',                                           en: 'Author:',                                         ar: 'المؤلف:' },
    category:         { ru: 'Категория:',                                       en: 'Category:',                                       ar: 'الفئة:' },
    for_query:        { ru: 'По запросу',                                       en: 'For query',                                       ar: 'للاستعلام' },
    found:            { ru: 'найдено:',                                         en: 'found:',                                          ar: 'وجد:' },
    articles_word:    { ru: 'статей',                                           en: 'articles',                                        ar: 'مقالات' },
    see_also:         { ru: 'Смотрите также',                                   en: 'See Also',                                        ar: 'اقرأ أيضًا' },
    source:           { ru: 'Источник',                                         en: 'Source',                                          ar: 'المصدر' },
    tab_article:      { ru: 'Статья',                                           en: 'Article',                                         ar: 'مقالة' },
    tab_photos:       { ru: 'Фотографии',                                       en: 'Photos',                                          ar: 'صور' },
    tab_video:        { ru: 'Видео',                                            en: 'Video',                                           ar: 'فيديو' },
    video_unsupported:{ ru: 'Видео недоступно для встроенного просмотра',       en: 'This video is not available for inline viewing',  ar: 'هذا الفيديو غير متاح للعرض المضمّن' },
    open_video:       { ru: 'Открыть видео',                                    en: 'Open video',                                      ar: 'فتح الفيديو' },
  },

  footer: {
    about_portal:      { ru: 'О портале',                             en: 'About the Portal',                      ar: 'عن المنصة' },
    about_group_full:  { ru: 'О группе',                              en: 'About the Group',                       ar: 'عن المجموعة' },
    news_section:      { ru: 'Новости',                               en: 'News',                                  ar: 'أخبار' },
    projects_section:  { ru: 'Проекты',                               en: 'Projects',                              ar: 'مشاريع' },
    events_link:       { ru: 'Анонсы',                           en: 'Announcements',                              ar: 'إعلانات' },
    subscribe_title:   { ru: 'Подписка',                              en: 'Subscription',                          ar: 'الاشتراك' },
    subscribe_subtitle:{ ru: 'Получайте новости о сотрудничестве',    en: 'Get updates on cooperation',            ar: 'تلقّوا آخر أخبار التعاون' },
    email_placeholder: { ru: 'Ваш email',                             en: 'Your email address',                    ar: 'بريدكم الإلكتروني' },
    subscribe_btn:     { ru: 'Подписаться',                           en: 'Subscribe',                             ar: 'الاشتراك' },
    sending:           { ru: 'Отправка...',                           en: 'Sending...',                            ar: 'إرسال...' },
    invalid_email:     { ru: 'Введите корректный email',              en: 'Enter a valid email',                   ar: 'أدخل بريداً إلكترونياً صالحاً' },
    success:           { ru: 'Вы успешно подписались!',               en: 'Successfully subscribed!',              ar: 'تم الاشتراك بنجاح!' },
    error:             { ru: 'Ошибка. Попробуйте снова.',             en: 'Error. Please try again.',              ar: 'خطأ. حاول مرة أخرى.' },
    copyright:         { ru: '© 2026 Группа стратегического видения «Россия – Исламский мир»', en: '© 2026 Strategic Vision Group «Russia – Islamic world»', ar: '© 2026 مجموعة الرؤية الإستراتيجية "روسيا – العالم الإسلامي"' },
    made_by:           { ru: 'Сделано в ACRELIS',                     en: 'Made in ACRELIS',                       ar: 'صُنع في  ACRELIS' },
    privacy:           { ru: 'Политика конфиденциальности',           en: 'Privacy Policy',                        ar: 'سياسة الخصوصية' },
    terms:             { ru: 'Условия использования',                 en: 'Terms of Use',                          ar: 'شروط الاستخدام' },
  },

  photo_video: {
    title:             { ru: 'Фото и видео',                   en: 'Photos and Video',                  ar: 'صور وفيديوهات' },
    tab_photos:        { ru: 'Фотографии',                     en: 'Photos',                            ar: 'صور' },
    tab_videos:        { ru: 'Видео',                          en: 'Videos',                            ar: 'فيديو' },
    tab_broadcasts:    { ru: 'Трансляции',                     en: 'Live Broadcasts',                   ar: 'بث' },
    select_date:       { ru: 'Выбрать дату',                   en: 'Select date',                       ar: 'اختر التاريخ' },
    filter_by_pub:     { ru: 'Фильтр по дате публикации',      en: 'Filter by publication date',        ar: 'ترتيب حسب تاريخ النشر' },
    date_from:         { ru: 'С',                               en: 'From',                              ar: 'من' },
    date_to:           { ru: 'По',                              en: 'To',                                ar: 'إلى' },
    apply:             { ru: 'Применить',                      en: 'Apply',                             ar: 'تطبيق' },
    reset:             { ru: 'Сбросить',                       en: 'Reset',                             ar: 'إلغاء' },
    not_found_period:  { ru: 'Ничего не найдено за выбранный период', en: 'Nothing found for the selected period', ar: 'لم يتم العثور على شيء للفترة المحددة' },
    no_broadcasts:     { ru: 'Трансляций пока нет',            en: 'No broadcasts yet',                 ar: 'لا توجد بث مباشر بعد' },
    broadcast_label:   { ru: 'Трансляция',                     en: 'Broadcast',                         ar: 'بث مباشر' },
    video_unsupported: { ru: 'Этот формат видео не поддерживается для встроенного просмотра', en: 'This video format is not supported for inline viewing', ar: 'هذا التنسيق غير مدعوم للعرض المضمّن' },
    open_broadcast:    { ru: 'Открыть трансляцию',             en: 'Open broadcast',                    ar: 'فتح البث' },
    player_error:      { ru: 'Не удалось загрузить плеер',     en: 'Failed to load player',             ar: 'تعذّر تحميل المشغّل' },
    select_prompt_broadcast: { ru: 'Выберите трансляцию слева чтобы увидеть подробности', en: 'Select a broadcast on the left to see details', ar: 'اختر بثاً من اليسار لعرض التفاصيل' },
    select_prompt_article:   { ru: 'Выберите статью слева чтобы увидеть подробности',    en: 'Select an article on the left to view more',   ar: 'اختر المقالة من القائمة على اليمين لعرض المزيد' },
    article_load_error:{ ru: 'Не удалось загрузить статью',    en: 'Failed to load article',            ar: 'تعذّر تحميل المقال' },
    tab_article:       { ru: 'Статья',                         en: 'Article',                           ar: 'المقال' },
  },

  // Contact page
  contact: {
    title:          { ru: 'Контактная информация', en: 'Contact Information',        ar: 'معلومات الاتصال' },
    socials:        { ru: 'Мы в соцсетях',         en: 'FOLLOW US ON SOCIAL MEDIA',  ar: 'تابعونا على وسائل التواصل الاجتماعي' },
    kazan:          { ru: 'Казань',                en: 'KAZAN',                       ar: 'قازان' },
    moscow:         { ru: 'Москва',                en: 'MOSCOW',                      ar: 'موسكو' },
    address_kazan:  { ru: '420015, Россия, Республика Татарстан, г. Казань, ул. Горького, д.3 (офис 14)', en: '420015, Russia, Republic of Tatarstan, Kazan, 3 Gorky St., Office 14', ar: '420015، روسيا، جمهورية تتارستان، قازان، شارع غوركي 3، مكتب 14' },
    address_moscow: { ru: '115172, Россия, г. Москва, ул. Котельническая наб., д.29 (офис 13)',           en: '115172, Russia, Moscow, 29 Kotelnicheskaya Embankment (Office 13)',                 ar: '115172، روسيا، موسكو، رصيف كوتيلنيتشيسكايا 29، مكتب 13' },
  },

  common: {
    back: { ru: 'Назад', en: 'Back', ar: 'رجوع' },
  },
} as const

type TranslationKey = typeof translations

function get<
  S extends keyof TranslationKey,
  K extends keyof TranslationKey[S]
>(section: S, key: K, lang: string): string {
  const l = (['ru', 'en', 'ar'].includes(lang) ? lang : 'ru') as Lang
  const entry = translations[section][key] as Record<Lang, string>
  return entry[l] ?? entry['ru']
}

export function makeT<S extends keyof TranslationKey>(section: S, lang: string) {
  return (key: keyof TranslationKey[S]): string => get(section, key, lang)
}

export default translations
