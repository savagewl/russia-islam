'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import '../../styles/group-members.css'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

type L = 'ru' | 'en' | 'ar'

interface MemberPerson {
  names: Record<L, string>
  roles: Record<L, string>
  img: string
}

interface MemberCountry {
  id: string
  names: Record<L, string>
  desc: string
  people: MemberPerson[]
}

export default function GroupMembersSection() {
  const { lang } = useLang()
  const t = makeT('members', lang)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isRtl = mounted && lang === 'ar'
  const countriesListRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const peopleScrollRef = useRef<HTMLDivElement>(null)
  const peopleThumbRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const l: L = (lang === 'ar' || lang === 'en') ? lang as L : 'ru'

  const memberCountries: MemberCountry[] = [
    {
      id: 'dz',
      names: { ru: 'Алжир', en: 'Algeria', ar: 'الجزائر' },
      desc: '',
      people: [{
        names: { ru: 'АЛЬ-ХЕЙР Мабрук Зейд', en: 'Mabrouk Zeid AL-KHEIR', ar: 'الدكتور مبروك زيد الخير' },
        roles: {
          ru: 'Председатель Высшего исламского совета Алжира',
          en: 'Chairman of the High Islamic Council of Algeria',
          ar: 'رئيس المجلس الإسلامي الأعلى في الجزائر',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'bd',
      names: { ru: 'Бангладеш', en: 'Bangladesh', ar: 'بنغلاديش' },
      desc: '',
      people: [{
        names: { ru: 'МАИЗВАНДАРИ Саид Наджибулла', en: 'Alhaj Syed Nazibul Bashar MAIZVANDARI', ar: 'سعيد نجيب الله مائزفانداري' },
        roles: {
          ru: 'Председатель партии «Бангладеш Тарикат Федерейшн»',
          en: 'Chairman of the Bangladesh party "Bangladesh Tariqat Federation"',
          ar: 'رئيس اللجنة الوطنية لحقوق الإنسان، زعيم حزب - Bangladesh Tarikat Federation',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'bh',
      names: { ru: 'Бахрейн', en: 'Bahrain', ar: 'مملكة البحرين' },
      desc: '',
      people: [{
        names: { ru: 'АЛЬ-ХАЛИФА Абдулрахман Мохамед Рашид', en: 'Abdulrahman bin Mohamed bin Rashid AL KHALIFA', ar: 'عبد الرحمن محمد راشد آل خليفة' },
        roles: {
          ru: 'Председатель Высшего Совета по делам Ислама Королевства Бахрейн',
          en: 'Chairman of the Supreme Islamic Affairs Council of the Bahrain',
          ar: 'رئيس المجلس الأعلى للشؤون الإسلامية',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'eg',
      names: { ru: 'Египет', en: 'Egypt', ar: 'مصر' },
      desc: '',
      people: [{
        names: { ru: 'СААД Иззат', en: 'Ezzat SAAD', ar: 'عزت سعد' },
        roles: {
          ru: 'Директор Египетского совета по международным делам, бывший заместитель Министра МИД АРЕ (бывший губернатор провинции Луксор, бывший посол АРЕ в РФ)',
          en: 'Director of the Egyptian Council for International Affairs (former Governor of Luxor, former Ambassador of Egypt to Russia)',
          ar: 'مدير المجلس المصري للشؤون الدولية، محافظ سابق للأقصر، سفير جمهورية مصر العربية السابق لدى روسيا الاتحادية',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'id',
      names: { ru: 'Индонезия', en: 'Indonesia', ar: 'إندونيسيا' },
      desc: '',
      people: [{
        names: { ru: 'ШАМСУДДИН Дин', en: 'Din SHAMSUDDIN', ar: 'دين شمس الدين' },
        roles: {
          ru: 'Профессор Национального исламского университета в Джакарте',
          en: 'Professor at the National Islamic University in Jakarta',
          ar: 'بروفيسور في الجامعة الإسلامية الوطنية في جاكرتا',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'ir',
      names: { ru: 'Иран', en: 'Iran', ar: 'إيران' },
      desc: '',
      people: [{
        names: { ru: 'ШАХРИЯРИ Хамид Хавали', en: 'Hamid Khavali SHAHRIARI', ar: 'حميد حوالي شهرياري' },
        roles: {
          ru: 'Генеральный секретарь Всемирной организации по сближению мазхабов',
          en: 'Secretary General of the World Forum for Proximity of Islamic schools of thoughts',
          ar: 'الأمين العام للمجمع العالمي للتقريب بين المذاهب الإسلامية',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'iq',
      names: { ru: 'Ирак', en: 'Iraq', ar: 'العراق' },
      desc: '',
      people: [{
        names: { ru: 'ХАММУДИ Хумам', en: 'Humam HAMOUDI', ar: 'همام حمودي' },
        roles: {
          ru: 'Председатель Высшего исламского совета Ирака',
          en: 'Chairman of the Islamic Supreme Council',
          ar: 'رئيس المجلس الإسلامي الأعلى',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'jo',
      names: { ru: 'Иордания', en: 'Jordan', ar: 'الأردن' },
      desc: '',
      people: [{
        names: { ru: 'АБУ РУММАН Мухаммед', en: 'Muhammad ABU RUMMAN', ar: 'محمد أبو رمان' },
        roles: {
          ru: 'Бывший министр культуры, бывший министр по делам молодежи',
          en: 'Former Minister of Culture, Former Minister of Youth Affairs',
          ar: 'وزير سابق، شغل منصب وزير الثقافة ومنصب وزير الشباب',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'kw',
      names: { ru: 'Кувейт', en: 'Kuwait', ar: 'الكويت' },
      desc: '',
      people: [{
        names: { ru: 'АЛЬ-МААТУК Абдулла', en: 'Abdullah Matouq Al-MAATOUK', ar: 'عبد الله المعتوق' },
        roles: {
          ru: 'Бывший министр Юстиции Кувейта, бывший министр вакфов и исламских дел',
          en: 'Advisor to the Emir of Kuwait, Chairman of the International Islamic Charity Organization',
          ar: 'مستشار أمير الكويت، رئيس المنظمة الخيرية الإسلامية العالمية',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'kg',
      names: { ru: 'Кыргызстан', en: 'Kyrgyzstan', ar: 'قيرغيزستان' },
      desc: '',
      people: [{
        names: { ru: 'АСИЗБАЕВ Рустам Эмилжанович', en: 'Rustam ASIZBAEV', ar: 'رستم أسيزبايف' },
        roles: {
          ru: 'Заместитель Председателя — Главный ученый секретарь Национальной аттестационной комиссии при Президенте Киргизии',
          en: 'Deputy Chairman - Chief Scientific Secretary of the National Certification Commission under the President of Kyrgyzstan',
          ar: 'نائب رئيس السكرتير العلمي الأول للجنة الوطنية',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'lb',
      names: { ru: 'Ливан', en: 'Lebanon', ar: 'لبنان' },
      desc: '',
      people: [
        {
          names: { ru: 'КАЛААДЖИЕ Вассим Халиль', en: 'Waseem Khalil KALAAJI', ar: 'وسيم خليل قلعجيه' },
          roles: {
            ru: 'Ливанский общественный и политический деятель',
            en: 'Public and political figure',
            ar: 'ناشط إجتماعي وسياسي',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'МИКАТИ Наджиб Азми', en: 'Najib Azmi MIKATI', ar: 'نجيب عزمي ميقاتي' },
          roles: {
            ru: 'Бывший Премьер-министр Ливана',
            en: 'Former Prime Minister of Lebanon',
            ar: 'رئيس وزراء لبنان الأسبق',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'ly',
      names: { ru: 'Ливия', en: 'Libya', ar: 'ليبيا' },
      desc: '',
      people: [
        {
          names: { ru: 'АЛЬ-МАГРАУИ Абдулла Эмхеммед Мухаммед', en: 'Abdullah Emhemmed Mohammed AL-MAGRAUI', ar: 'عبدالله امحمد محمد المغراوي' },
          roles: {
            ru: 'Общественно-политический деятель',
            en: 'Social and political figure',
            ar: 'شخصية اجتماعية وسياسية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'РАМАДАН Салем', en: 'Salem RAMADAN', ar: 'سالم عبدالسلام رمضان' },
          roles: {
            ru: 'Председатель Совета директоров Благотворительного фонда имени Шейха Тахера аз-Зави (STFCO)',
            en: 'Chairman of the Board of the Sheikh T. Al-Zawi Charitable Foundation',
            ar: 'رئيس مجلس إدارة مؤسسة الشيخ الزاوي الخيرية',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'my',
      names: { ru: 'Малайзия', en: 'Malaysia', ar: 'ماليزيا' },
      desc: '',
      people: [{
        names: { ru: 'ДЗУЛКИФЛИ Абдул Разак', en: 'Abdul Razak DZULKIFLI', ar: 'ذوالكفل عبد الرزاق' },
        roles: {
          ru: 'Бывший ректор Международного исламского университета Малайзии',
          en: 'Former Rector of the International Islamic University of Malaysia',
          ar: 'رئيس الجامعة الإسلامية العالمية بماليزيا الأسبق',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'ma',
      names: { ru: 'Марокко', en: 'Morocco', ar: 'المغرب' },
      desc: '',
      people: [
        {
          names: { ru: 'ФИХРИ Брахим Фасси', en: 'Brahim Fassi FIHRI', ar: 'إبراهيم الفاسي الفهري' },
          roles: {
            ru: 'Президент «Института Амадеус»',
            en: 'President of the Amadeus Institute',
            ar: 'الرئيس لمعهد "أماديوس"',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АББАДИ Ахмед', en: 'Ahmed ABBADI', ar: 'أحمد عبادي' },
          roles: {
            ru: 'Председатель совета Улемов Марокко',
            en: 'Chairman of the Ulema Council of Morocco',
            ar: 'الأمين العام لرابطة علماء المغرب',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ХАММАМИ Каис', en: 'Kais HAMMAMI', ar: 'قيس الهمامي' },
          roles: {
            ru: 'Директор Центра стратегического прогнозирования ИСЕСКО',
            en: 'Director of ICESCO Center of Strategic Foresight',
            ar: 'مدير مركز الدراسات الإستراتيجية بالإيسيسكو (المنظمة الإسلامية للتربية والعلوم والثقافة)',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'ng',
      names: { ru: 'Нигерия', en: 'Nigeria', ar: 'نيجيريا' },
      desc: '',
      people: [{
        names: { ru: 'ОЛОЙЕДЕ Исхак Оланреваджу', en: 'Ishaq Olanrewaju OLOYEDE', ar: 'أولويدي إسحق أولانريفادجو' },
        roles: {
          ru: 'Генеральный секретарь Верховного Совета по вопросам ислама Нигерии',
          en: 'President General of the Nigeria Supreme Council for Islamic Affairs',
          ar: 'الأمين العام للمجلس الأعلى للشؤون الإسلامية',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'om',
      names: { ru: 'Оман', en: 'Oman', ar: 'سلطنة عُمان' },
      desc: '',
      people: [{
        names: { ru: 'АЛЬ-РИЯМИ Хабиб', en: 'Habib AL-RIYAMI', ar: 'حبيب الريامي' },
        roles: {
          ru: 'Председатель Высшего центра культуры и науки имени Султана Кабуса',
          en: 'Chairman of Sultan Qaboos Higher Centre for Culture and Science',
          ar: 'أمين عام مركز "السلطان قابوس" العالي للثقافة والعلوم',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'ae',
      names: { ru: 'ОАЭ', en: 'UAE', ar: 'الإمارات العربية المتحدة' },
      desc: '',
      people: [
        {
          names: { ru: 'АЛЬ-КЕТБИ Эбтесам', en: 'Ebtesam AL-KETBI', ar: 'ابتسام الكتبي' },
          roles: {
            ru: 'Президент Центра эмиратской политики в Абу-Даби',
            en: 'President of the Emirates Policy Center',
            ar: 'رئيسة مركز "السياسة الإماراتية" في أبوظبي',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АЗ-ЗАХИРИ Халифа Мубарак', en: 'Khalifa Mubarak AL DHAHERI', ar: 'خليفة مبارك الظاهري' },
          roles: {
            ru: 'Ректор университета гуманитарных наук имени Мухаммада бен Зайеда, исполнительный директор Форума Абу Даби по укреплению мира',
            en: 'Rector of the Mohammed bin Zayed University for Humanities, Executive Director of the Abu Dhabi Forum for Peace',
            ar: 'مدير جامعة "محمد بن زايد للعلوم الإنسانية"، والمدير التنفيذي لمنتدى أبوظبي للسلم',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'ps',
      names: { ru: 'Палестина', en: 'Palestine', ar: 'فلسطين' },
      desc: '',
      people: [{
        names: { ru: 'АЛЬ-ХАББАШ Махмуд Судки', en: 'Dr. Mahmoud Sudki AL-HABBASH', ar: 'د. محمود صدقي الهباش' },
        roles: {
          ru: 'Верховный судья Палестины',
          en: 'Supreme Judge of Palestine',
          ar: 'رئيس قضاة فلسطين',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'ru',
      names: { ru: 'Российская Федерация', en: 'Russian Federation', ar: 'روسيا الاتحادية' },
      desc: '',
      people: [
        {
          names: { ru: 'МИННИХАНОВ Рустам Нургалиевич', en: 'Rustam MINNIKHANOV', ar: 'رستم مينيخانوف' },
          roles: {
            ru: 'Раис Республики Татарстан, Председатель Группы стратегического видения «Россия — исламский мир»',
            en: 'Rais (Head) of the Republic of Tatarstan, Chairman of the Group',
            ar: 'رئيس جمهورية تتارستان، رئيس مجموعة الرؤية الإستراتيجية "روسيا – العالم الإسلامي"',
          },
          img: '/images/min1.jpg',
        },
        {
          names: { ru: 'ГАТИН Марат Илшатович', en: 'Marat GATIN', ar: 'مارات غاتين' },
          roles: {
            ru: 'Помощник Раиса Республики Татарстан, Заместитель Председателя Группы стратегического видения «Россия — исламский мир»',
            en: 'Aide to Rais of the Republic of Tatarstan, Deputy Chairman of the Group',
            ar: 'مساعد رئيس جمهورية تتارستان، نائب رئيس مجموعة الرؤية الإستراتيجية "روسيا – العالم الإسلامي"',
          },
          img: '/images/marat.jpg',
        },
        {
          names: { ru: 'МУХАМЕТШИН Фарит Мубаракшевич', en: 'Farit MUKHAMETSHIN', ar: 'فريد محمدشين' },
          roles: {
            ru: 'Советник Председателя Группы, Чрезвычайный и Полномочный Посол',
            en: 'Advisor to the Chairman of the Group, Ambassador Extraordinary and Plenipotentiary',
            ar: 'مستشار رئيس المجموعة، سفير فوق العادة ومفوض',
          },
          img: '/images/farit.jpg',
        },
        {
          names: { ru: 'САДЫКОВА Эльмира Ленаровна', en: 'Elmira SADYKOVA', ar: 'إلميرا صديقوفا' },
          roles: {
            ru: 'Заместитель исполнительного директора Фонда содействия стратегическому диалогу и партнерству, доктор политических наук',
            en: 'Deputy Executive Director of the Fund for the assistance of strategic dialogue and partnership, Doctor of Political Science',
            ar: 'نائبة المدير التنفيذي لمؤسسة دعم الحوار الاستراتيجي والشراكة، دكتورة في العلوم السياسية',
          },
          img: '/images/sad.jpg',
        },
        {
          names: { ru: 'УМАХАНОВ Ильяс Магомед-Саламович', en: 'Ilyas UMAKHANOV', ar: 'إلياس أوماخانوف' },
          roles: {
            ru: 'Первый заместитель Председателя Комитета Совета Федерации по науке, образованию и культуре',
            en: 'First Deputy Chairman of the Federation Council Committee on Science, Education and Culture',
            ar: 'النائب الأول لرئيس لجنة العلوم والتربية والثقافة في مجلس الاتحاد الروسي، دكتوراه في الفلسفة',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АЗИМОВ Рахим Азизбоевич', en: 'Rakhim AZIMOV', ar: 'رحيم عزيموف' },
          roles: {
            ru: 'Первый заместитель Председателя комитета Государственной Думы по безопасности и противодействию коррупции',
            en: 'First Deputy Chairman of the State Duma Committee on Security and Anti-Corruption',
            ar: 'النائب الأول لرئيس لجنة مجلس الـ "دوما" للأمن ومكافحة الفساد',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'БОГУСЛАВСКИЙ Ирек Борисович', en: 'Irek BOGUSLAVSKY', ar: 'إيريك بوغسلافسكي' },
          roles: {
            ru: 'Заместитель Председателя Комитета Государственной Думы по контролю',
            en: 'Deputy of the State Duma, Deputy Chairman of the State Duma Committee on Control',
            ar: 'نائب رئيس لجنة مجلس الـ "دوما" للرقابة',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'СИДЯКИН Александр Геннадьевич', en: 'Alexander SIDYAKIN', ar: 'ألكسندر سيدياكين' },
          roles: {
            ru: 'Член Комитета Государственной Думы по строительству и жилищно-коммунальному хозяйству',
            en: 'Member of the State Duma Committee on Construction and Housing and Communal Services',
            ar: 'عضو لجنة دوما الدولة للبناء والإسكان والخدمات المجتمعية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ЕРЕМИН Евгений Владимирович', en: 'Yevgeny EREMIN', ar: 'يفغيني يريومين' },
          roles: {
            ru: 'Начальник Департамента по взаимодействию с религиозными организациями Управления Президента РФ по внутренней политике',
            en: 'Head of the Department for Interaction with Religious Organizations of the Administration of the President of the Russian Federation for Domestic Policy',
            ar: 'رئيس قسم التفاعل مع المنظمات الدينية في مكتب رئيس روسيا الاتحادية للسياسة الداخلية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ДАУДОВ Турко Илмадиевич', en: 'Turko DAUDOV', ar: 'توركو داودوف' },
          roles: {
            ru: 'Постоянный представитель России при Организации исламского сотрудничества (Джидда, Королевство Саудовская Аравия)',
            en: 'Permanent Representative of Russia to the Organization of Islamic Cooperation (Jeddah, Kingdom of Saudi Arabia)',
            ar: 'مندوب روسيا الدائم لدى منظمة التعاون الإسلامي (جدة - المملكة العربية السعودية)',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АБДУЛАТИПОВ Рамазан Гаджимурадович', en: 'Ramazan ABDULATIPOV', ar: 'رمضان عبد اللطيبوف' },
          roles: {
            ru: 'Чрезвычайный и полномочный Посол, доктор философских наук',
            en: 'Ambassador Extraordinary and Plenipotentiary',
            ar: 'دكتور في الفلسفة، سفير فوق العادة ومفوّض',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ХАТУОВ Джамбулат Хизирович', en: 'Dzhambulat KHATUOV', ar: 'جمبلاط خاتوف' },
          roles: {
            ru: 'Заместитель руководителя Секретариата Заместителя Председателя Правительства Российской Федерации',
            en: 'Deputy Head of the Secretariat of the Deputy Chairman',
            ar: 'نائب رئيس أمانة نائب رئيس الحكومة الروسية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'БАЙСУЛТАНОВ Одес Хасаевич', en: 'Odes BAISULTANOV', ar: 'أوديس بايسولطانوف' },
          roles: {
            ru: 'Первый заместитель Министра спорта Российской Федерации',
            en: 'First Deputy Minister of Sport of the Russian Federation',
            ar: 'نائب الأول لوزير الرياضة في روسيا الاتحادية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АКСЕНОВ Сергей Валерьевич', en: 'Sergey AKSENOV', ar: 'سيرغي أكسيونوف' },
          roles: {
            ru: 'Глава Республики Крым',
            en: 'Head of the Republic of Crimea',
            ar: 'رئيس جمهورية القرم',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'МЕЛИКОВ Сергей Алимович', en: 'Sergey MELIKOV', ar: 'سيرغي ميليكوف' },
          roles: {
            ru: '   ',
            en: '   ',
            ar: '  ',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'КАЛИМАТОВ Махмуд-Али Макшарипович', en: 'Mahmud-Ali KALIMATOV', ar: 'محمود علي كليماتوف' },
          roles: {
            ru: 'Глава Республики Ингушетия',
            en: 'Head of the Republic of Ingushetia',
            ar: 'رئيس جمهورية إنغوشيتيا',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'КОКОВ Казбек Валерьевич', en: 'Kazbek KOKOV', ar: 'كازبيك كوكوف' },
          roles: {
            ru: 'Глава Кабардино-Балкарской Республики',
            en: 'Head of the Republic of Kabardino-Balkaria',
            ar: 'رئيس جمهورية قبردينو- بلقاريا',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ТЕМРЕЗОВ Рашид Бориспиевич', en: 'Rashid TEMREZOV', ar: 'رشيد تمريزوف' },
          roles: {
            ru: 'Глава Карачаево-Черкесской Республики',
            en: 'Head of the Republic of Karachay-Cherkessia',
            ar: 'رئيس جمهورية قراتشاي - تشركيسيا',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ХАБИРОВ Радий Фаритович', en: 'Radiy KHABIROV', ar: 'راضي خابيروف' },
          roles: {
            ru: 'Глава Республики Башкортостан',
            en: 'Head of the Republic of Bashkortostan',
            ar: 'رئيس جمهورية باشكورتوستان',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АСКЕНДЕРОВ Заур Асевович', en: 'Zaur ASKENDEROV', ar: 'زاور أسكندروف' },
          roles: {
            ru: 'Председатель Народного Собрания Республики Дагестан',
            en: 'Chairman of the People\'s Assembly of the Republic of Dagestan',
            ar: 'رئيس المجلس الشعبي لجمهورية داغستان الروسية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'УСМАНОВ Анвар Аюбович', en: 'Anvar USMANOV', ar: 'أنوار عثمانوف' },
          roles: {
            ru: '   ',
            en: '   ',
            ar: '    ',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'САФАРОВ Асгат Ахметович', en: 'Asgat SAFAROV', ar: 'أسغات سافاروف' },
          roles: {
            ru: 'Руководитель Администрации Раиса Республики Татарстан',
            en: 'Head of Administration of the Rais of the Republic of Tatarstan',
            ar: 'رئيس مكتب رئيس جمهورية تتارستان',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'БАКИРОВ Газинур Тальгатович', en: 'Gazinur BAKIROV', ar: 'غازينور باكيروف' },
          roles: {
            ru: 'Помощник Раиса Республики Татарстан',
            en: 'Aide to the Rais of the Republic of Tatarstan',
            ar: 'مساعد رئيس جمهورية تتارستان',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'МАГАНОВ Наиль Ульфатович', en: 'Nail MAGANOV', ar: 'نائل ماغانوف' },
          roles: {
            ru: 'Генеральный директор ПАО «Татнефть»',
            en: 'General Director of "TATNEFT"',
            ar: 'مدير عام شركة "تاتنفت"',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ГАНЕЕВ Олег Владимирович', en: 'Oleg GANEEV', ar: 'أوليغ غانييف' },
          roles: {
            ru: 'Старший Вице-президент ПАО Сбербанк',
            en: 'Senior Vice President of "Sberbank"',
            ar: 'النائب الأول لرئيس إدارة "سبيربنك"',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'МАВЛЮТОВ Рамиль Минсазитович', en: 'Ramil MAVLYUTOV', ar: 'رميل ماوليوتوف' },
          roles: {
            ru: 'Директор торгового дома Tatarstan Trade House (Турция)',
            en: 'Director of Tatarstan Trade House (Türkiye)',
            ar: 'مدير غرفة تجارة "Tatarstan Trade House" (تركيا)',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ШАФРАНИК Юрий Константинович', en: 'Yuri SHAFRANIK', ar: 'يوري شافرانيك' },
          roles: {
            ru: 'Бывший министр энергетики и топлива РФ',
            en: 'Former Minister of Energy and Fuel of the Russian Federation',
            ar: 'وزير سابق للطاقة في روسيا الاتحادية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ХАФИЗОВ Марат Насихович', en: 'Marat KHAFIZOV', ar: 'مارات حفيظوف' },
          roles: {
            ru: 'Основатель ИТ-Корпорации «Универсальный Блокчейн»',
            en: 'Founder of the IT Corporation "Universal Blockchain"',
            ar: 'مؤسس شركة "يونيفرسال بلوكتشين" لتكنولوجيا المعلومات',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ГАЙНУТДИН Равиль хазрат', en: 'Ravil Hazrat GAINUTDIN', ar: 'راويل حضرة عين الدين' },
          roles: {
            ru: 'Председатель Совета муфтиев России и ДУМ Российской Федерации, Муфтий Шейх',
            en: 'Chairman of the Religious Board of Muslims of the Russian Federation, Chairman of the Council of Muftis of Russia, Mufti Sheikh',
            ar: 'رئيس الإدارة الدينية لمسلمي روسيا الاتحادية، رئيس مجلس مفتي روسيا، مفتي - شيخ',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'САМИГУЛЛИН Камиль хазрат', en: 'Kamil hazrat SAMIGULLIN', ar: 'كاميل حضرة ساميغولين' },
          roles: {
            ru: 'Председатель Духовного управления мусульман Республики Татарстан, Муфтий',
            en: 'Chairman of the Religious Board of Muslims of the Republic of Tatarstan, Mufti',
            ar: 'رئيس الإدارة الدينية لمسلمي جمهورية تتارستان - مفتي',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ТАДЖУТДИН Талгат хазрат', en: 'Talgat hazrat TADZHUDDIN', ar: 'طلعت حضرة تاج الدين' },
          roles: {
            ru: 'Председатель Центрального духовного управления мусульман, Верховный муфтий России',
            en: 'Chairman of the Central Religious Board of Muslims, Supreme Mufti of Russia, Sheikh-ul-Islam',
            ar: 'رئيس الإدارة الدينية المركزية للمسلمين، المفتي الأعلى لروسيا، شيخ الإسلام',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'БОТАШЕВ Расул Борисович', en: 'Rasul BOTASHEV', ar: 'رسول بوتاشيف' },
          roles: {
            ru: 'Заместитель руководителя ФГУП «Главный центр специальной связи»',
            en: 'Deputy Head of the Federal State Unitary Enterprise "Main Centre of Special Communications"',
            ar: 'نائب رئيس المؤسسة الفيدرالية الموحدة "المركز الرئيسي للاتصالات الخاصة"',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'БАТЫШЕВА Татьяна Тимофеевна', en: 'Tatyana BATYSHEVA', ar: 'تاتيانا باتيشيفا' },
          roles: {
            ru: 'Директор Научно-практического центра детской психоневрологии Департамента здравоохранения города Москвы, депутат Московской городской думы, доктор медицинских наук',
            en: 'Director of the Scientific and Practical Centre for Child Psychoneurology of the Moscow City Health Department, Moscow City Duma Deputy of the VII Convocation, Doctor of Medicine',
            ar: 'مدير المركز العلمي والعملي لأمراض الجهاز العصبي - النفسي للأطفال التابع لقسم صحة مدينة موسكو، نائب في مجلس الـ "دوما" بمدينة موسكو في الدورة السابعة، دكتوراه في العلوم الطبية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ЮСЕФ Юсеф', en: 'Yusef Naim Youssef', ar: 'يوسف نعيم يوسف' },
          roles: {
            ru: 'Директор ФГБНУ «Научно-исследовательского института глазных болезней имени М.М. Краснова»',
            en: 'Director of the Institute of Eye Diseases of the Russian Academy of Medical Sciences',
            ar: 'مدير معهد كراسنوف لبحوث أمراض العيون',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'НАУМКИН Виталий Вячеславович', en: 'Vitaly NAUMKIN', ar: 'فيتالي ناومكين' },
          roles: {
            ru: 'Научный руководитель Института востоковедения РАН, академик РАН, доктор исторических наук, профессор',
            en: 'Scientific Director of the Institute of Oriental Studies of the Russian Academy of Sciences, academician at the Russian Academy of Sciences, Doctor of History, professor',
            ar: 'المدير العلمي لمعهد "الدراسات الشرقية" التابع لأكاديمية العلوم الروسية، عضو أكاديمي في أكاديمية العلوم الروسية، دكتور في العلوم التاريخية، بروفيسور',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ПИОТРОВСКИЙ Михаил Борисович', en: 'Mikhail PIOTROVSKY', ar: 'ميخائيل بيوتروفسكي' },
          roles: {
            ru: 'Директор Государственного Эрмитажа, доктор исторических наук',
            en: 'Director of State Hermitage Museum, Doctor of History',
            ar: 'مدير متحف الـ "إرميتاج" الحكومي (سانت بطرسبورغ)',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'УМАРОВ Джамбулат Вахидович', en: 'Dzhambulat UMAROV', ar: 'جامبولات عمروف' },
          roles: {
            ru: 'Президент Академии наук Чеченской Республики',
            en: 'President of the Academy of Sciences of the Chechen Republic',
            ar: 'رئيس أكاديمية "العلوم" في جمهورية الشيشان',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'МАСЛОВ Алексей Александрович', en: 'Alexey MASLOV', ar: 'أليكسي ماسلوف' },
          roles: {
            ru: 'Директор Института стран Азии и Африки Московского государственного университета имени М.В. Ломоносова',
            en: 'Director of the Institute of Asian and African Studies of Moscow State University named after M. Lomonosov',
            ar: 'مدير معهد "بلدان آسيا وافريقيا" التابع لجامعة "موسكو" الحكومية (لومونوسوف)',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'КОРОЛЕВ Станислав Львович', en: 'Stanislav KOROLEV', ar: 'ستانيسلاف كوروليوف' },
          roles: {
            ru: 'Заместитель Генерального секретаря Ассамблеи народов Евразии, Председатель Правления Евразийского аналитического центра Ассамблеи Народов Евразии',
            en: 'Deputy Secretary General of the Assembly of the Peoples of Eurasia, Chairman of the Board of the Eurasian Analytical Centre of the Assembly of the Peoples of Eurasia',
            ar: 'نائب الأمين العام لجمعية "الشعوب الأوراسية"، رئيس مجلس إدارة المركز التحليلي الأوراسي التابع لجمعية الشعوب الأوراسية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'СУЛЕЙМАНОВ Махач Гаджикурбанович', en: 'Makhach SULEIMANOV', ar: 'ماخاتش سليمانوف' },
          roles: {
            ru: 'Президент фонда «Возрождение Рутульского района» Республики Дагестан',
            en: 'President of the "Revival of the Rutul District" Foundation, Republic of Dagestan',
            ar: 'رئيس مؤسسة "إحياء منطقة روتولسكي"، جمهورية داغستان',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ГАЦАЛОВ Хаджимурат хаджи', en: 'Khajimurat Khaji GATSALOV', ar: 'حاجي مراد غاتسالوف' },
          roles: {
            ru: 'Председатель Духовного управления мусульман Республики Северной Осетии – Алании, Муфтий',
            en: 'Chairman of the Religious Board of Muslims of North Ossetia-Alania, Mufti',
            ar: 'رئيس الإدارة الدينية لمسلمي أوسيتيا الشمالية - ألانيا، مفتي',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'КРГАНОВ Альбир Рифкатович', en: 'Albir Hazrat KRGANOV', ar: 'ألبِير حضرة كرغانوف' },
          roles: {
            ru: 'Глава Духовного собрания мусульман России, Муфтий',
            en: 'Head of the Religious Board of Muslims of Russia, Mufti',
            ar: 'رئيس "المجمع الروحي" لمسلمي روسيا، مفتي',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'МУХАМЕТШИН Рафик Мухаметшович', en: 'Rafik MUKHAMETSHIN', ar: 'رفيق محمدشين' },
          roles: {
            ru: 'Ректор Российского исламского института, заместитель председателя Духовного управления мусульман Республики Татарстан, доктор политических наук',
            en: 'Rector of the Russian Islamic Institute, Deputy Chairman of the Religious Board of Muslims of the Republic of Tatarstan, Doctor of Political Science',
            ar: 'رئيس المعهد الإسلامي الروسي، نائب رئيس الإدارة الدينية لمسلمي جمهورية تتارستان، دكتور في العلوم السياسية',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'Митрополит КИРИЛЛ (НАКОНЕЧНЫЙ Михаил Васильевич)', en: 'KIRILL (Mikhail NAKONECHNY)', ar: 'كيريل (ميخائيل ناكونيتشني)' },
          roles: {
            ru: 'Митрополит Казанский и Татарстанский',
            en: 'Metropolitan of Kazan and Tatarstan',
            ar: 'مطران قازان وتتارستان',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'sa',
      names: { ru: 'Саудовская Аравия', en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
      desc: '',
      people: [
        {
          names: { ru: 'АЛЬ-АРИФИ Мухаммад бин Абдельвахид', en: 'Mohammed bin Abdulwahed AL-ARIFI', ar: 'محمد بن عبد الواحد العريفي' },
          roles: {
            ru: 'Советник Министерства исламских дел, призыва и наставления',
            en: 'Advisor to the Ministry of Islamic Affairs, Invocation and Guidance',
            ar: 'مستشار الشؤون الإسلامية بوزارة الشؤون الإسلامية والدعوة والإرشاد',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АЛЬ-ШАХРАНИ Али Мухаммед', en: 'Ali Mohammed ALSHAHRANI', ar: 'د.علي بن محمد الشهراني' },
          roles: {
            ru: 'Член Консультативного совета (Маджлис Аль Шура)',
            en: 'Member of the Advisory Council (Majlis Al Shura)',
            ar: 'عضو في مجلس الشورى',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'АЙХАН Таха', en: 'Taha AYKHAN', ar: 'طه آيهان' },
          roles: {
            ru: 'Президент Молодёжного форума Организации исламского сотрудничества (ICYF)',
            en: 'President of the Organization of Islamic Cooperation Youth Forum (ICYF)',
            ar: 'رئيس منتدى "شباب التعاون الإسلامي" (ICYF)',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'sn',
      names: { ru: 'Сенегал', en: 'Senegal', ar: 'السنغال' },
      desc: '',
      people: [{
        names: { ru: 'ЭЛЬ-ЗЕЙН Шейх Абдула Монем', en: 'Sheikh Abdul Monem EL-ZEIN', ar: 'شيخ عبد المنعم الزين' },
        roles: {
          ru: 'Духовный лидер шиитской общины Сенегала',
          en: "Spiritual leader of Senegal's Shiite community",
          ar: 'الزعيم الروحي للطائفة الشيعية في السنغال',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'tj',
      names: { ru: 'Таджикистан', en: 'Tajikistan', ar: 'طاجيكستان' },
      desc: '',
      people: [{
        names: { ru: 'ДАВЛАТЗОДА Сулаймон Пирхон', en: 'Sulaimon Pirkhod DAVLATZODA', ar: 'سليمان دولة زوده بيرخون' },
        roles: {
          ru: 'Председатель Комитета по делам религий при Правительстве Республики Таджикистан',
          en: 'Chairman of the Committee for Religious Affairs of the Republic of Tajikistan',
          ar: 'رئيس لجنة الشؤون الدينية وتنظيم التقاليد والاحتفالات والشعائر في حكومة جمهورية طاجيكستان',
        },
        img: '/images/149452.png',
      }],
    },
    {
      id: 'tn',
      names: { ru: 'Тунис', en: 'Tunisia', ar: 'تونس' },
      desc: '',
      people: [
        {
          names: { ru: 'ДЖАЛЛЮЛЬ Нежи', en: 'Néji JALLOUL', ar: 'ناجي جلول' },
          roles: {
            ru: 'Политический и общественный деятель, бывший министр образования',
            en: 'Public and political figure, Former Minister of Education',
            ar: 'شخصية عامة وسياسية، وزير التربية السابق',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ГААЛУЛ Бадра', en: 'Badra GAALOUL', ar: 'بدرة قعلول' },
          roles: {
            ru: 'Директор Международного центра стратегических исследований в военной области и проблем безопасности',
            en: 'Director of the International Center for Strategic Studies in Military and Security Issues',
            ar: 'مديرة المركز الدولي للدراسات الاستراتيجية في القضايا العسكرية والأمنية',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'tr',
      names: { ru: 'Турция', en: 'Türkiye', ar: 'تركيا' },
      desc: '',
      people: [
        {
          names: { ru: 'САФИ Исмаил', en: 'Ismail SAFI', ar: 'إسماعيل صافي' },
          roles: {
            ru: 'Член Совета по безопасности и внешней политике при Президенте Турции',
            en: 'Member of the Security and Foreign Policy Council under the President of Türkiye',
            ar: 'عضو مجلس "الأمن الرئاسي والسياسة الخارجية" التابع للرئيس التركي',
          },
          img: '/images/149452.png',
        },
        {
          names: { ru: 'ЗЕЙБЕКДЖИ Нихат', en: 'Nihat ZEYBEKCI', ar: 'نيهات زيبكجي' },
          roles: {
            ru: 'Заместитель председателя Партии справедливости и развития Турции',
            en: 'Deputy Chairman of the Justice and Development Party of Türkiye',
            ar: 'نائب رئيس حزب "العدالة والتنمية"، رئيس مكتب الشؤون الاقتصادية',
          },
          img: '/images/149452.png',
        },
      ],
    },
    {
      id: 'uz',
      names: { ru: 'Узбекистан', en: 'Uzbekistan', ar: 'أوزبكستان' },
      desc: '',
      people: [{
        names: { ru: 'АБДУХАЛИКОВ Фирдавс Фридунович', en: 'Firdavs ABDUKHALIKOV', ar: 'فردوس عبد الخاليكوف' },
        roles: {
          ru: 'Руководитель Центра исламской цивилизации в Узбекистане при Кабинете Министров Республики Узбекистан',
          en: 'Director of the Center for Islamic Civilization under the Cabinet of Ministers of the Republic of Uzbekistan',
          ar: 'مدير السابق لمركز "الحضارة الإسلامية في أوزبكستان" التابع لمجلس الوزراء',
        },
        img: '/images/149452.png',
      }],
    },
  ].sort((a, b) => a.names.ru.localeCompare(b.names.ru, 'ru'))

  const [activeCountry, setActiveCountry] = useState<string | null>(null)
  const activeCountryData = activeCountry ? memberCountries.find(c => c.id === activeCountry) : null

  const updateThumb = () => {
    const container = countriesListRef.current
    const thumb = thumbRef.current
    const track = trackRef.current
    if (!container || !thumb || !track) return

    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollHeight <= clientHeight) {
      thumb.style.display = 'none'
      return
    }
    thumb.style.display = 'block'

    const trackHeight = track.clientHeight
    const thumbH = Math.max((clientHeight / scrollHeight) * trackHeight, 40)
    const maxThumbTop = trackHeight - thumbH
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop

    thumb.style.height = `${thumbH}px`
    thumb.style.transform = `translateY(${thumbTop}px)`
  }

  useEffect(() => {
    const container = countriesListRef.current
    if (!container) return
    container.addEventListener('scroll', updateThumb)
    setTimeout(updateThumb, 100)
    window.addEventListener('resize', updateThumb)
    return () => {
      container.removeEventListener('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
    }
  }, [])

  useEffect(() => {
    const thumb = thumbRef.current
    const track = trackRef.current
    const container = countriesListRef.current
    if (!thumb || !track || !container) return

    let isDragging = false
    let startY = 0
    let startScrollTop = 0

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      isDragging = true
      startY = e.clientY
      startScrollTop = container.scrollTop
      document.body.style.userSelect = 'none'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const trackHeight = track.clientHeight
      const thumbH = thumb.offsetHeight
      const maxThumbTop = trackHeight - thumbH
      const delta = e.clientY - startY
      const scrollDelta = (delta / maxThumbTop) * (container.scrollHeight - container.clientHeight)
      container.scrollTop = Math.max(0, Math.min(container.scrollHeight - container.clientHeight, startScrollTop + scrollDelta))
    }

    const onMouseUp = () => {
      isDragging = false
      document.body.style.userSelect = ''
    }

    const onTrackClick = (e: MouseEvent) => {
      if (e.target === thumb) return
      const trackRect = track.getBoundingClientRect()
      const clickY = e.clientY - trackRect.top
      const thumbH = thumb.offsetHeight
      const maxThumbTop = track.clientHeight - thumbH
      const ratio = Math.max(0, Math.min(1, (clickY - thumbH / 2) / maxThumbTop))
      container.scrollTop = ratio * (container.scrollHeight - container.clientHeight)
    }

    thumb.addEventListener('mousedown', onMouseDown)
    track.addEventListener('click', onTrackClick)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      thumb.removeEventListener('mousedown', onMouseDown)
      track.removeEventListener('click', onTrackClick)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) return
    fetch('/maps/world-map.svg')
      .then(res => res.text())
      .then(svgText => {
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = svgText
          const svg = mapContainerRef.current.querySelector('svg')
          if (svg) {
            svg.setAttribute('width', '100%')
            svg.setAttribute('height', '100%')
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
            const paths = svg.querySelectorAll('path')
            paths.forEach(path => {
              const countryId = path.id
              if (!countryId) return
              path.classList.add('map-country')
              path.addEventListener('click', () => setActiveCountry(countryId))
            })
          }
        }
      })
  }, [])

  useEffect(() => {
    if (!mapContainerRef.current) return
    const svg = mapContainerRef.current.querySelector('svg')
    if (!svg) return
    const paths = svg.querySelectorAll('path')
    paths.forEach(path => {
      if (path.id === activeCountry) path.classList.add('active')
      else path.classList.remove('active')
    })
  }, [activeCountry])

  const updatePeopleThumb = () => {
    const el = peopleScrollRef.current
    const thumb = peopleThumbRef.current
    if (!el || !thumb) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    if (scrollWidth <= clientWidth) { thumb.style.display = 'none'; return }
    thumb.style.display = 'block'
    const trackWidth = clientWidth
    const thumbW = Math.max((clientWidth / scrollWidth) * trackWidth, 30)
    const maxLeft = trackWidth - thumbW
    thumb.style.width = `${thumbW}px`
    thumb.style.transform = `translateX(${(scrollLeft / (scrollWidth - clientWidth)) * maxLeft}px)`
  }

  useEffect(() => {
    const thumb = peopleThumbRef.current
    const el = peopleScrollRef.current
    if (!thumb || !el) return

    let isDragging = false
    let startX = 0
    let startScrollLeft = 0

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      isDragging = true
      startX = e.clientX
      startScrollLeft = el.scrollLeft
      document.body.style.userSelect = 'none'
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const thumbW = thumb.offsetWidth
      const maxLeft = el.clientWidth - thumbW
      const delta = e.clientX - startX
      const scrollDelta = (delta / maxLeft) * (el.scrollWidth - el.clientWidth)
      el.scrollLeft = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, startScrollLeft + scrollDelta))
      updatePeopleThumb()
    }
    const onMouseUp = () => {
      isDragging = false
      document.body.style.userSelect = ''
    }

    thumb.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      thumb.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [activeCountry])

  useEffect(() => {
    setTimeout(updatePeopleThumb, 50)
  }, [activeCountry])

  const InfoCard = () => (
    <div className="country-info-card">
      <h4 className="info-card-title">
        <img
          src={`/flags/${activeCountry}.svg`}
          alt=""
          width={20}
          height={15}
          className="flag-icon"
        />
        {activeCountryData!.names[l]}
      </h4>
      <p className="info-card-desc">{activeCountryData!.desc}</p>
      {activeCountryData!.people.length > 0 && (
        <>
          <div className="info-card-people" ref={peopleScrollRef} onScroll={updatePeopleThumb}>
            {activeCountryData!.people.map((person, idx) => (
              <div key={idx} className="person-block">
                <Image src={person.img} alt={person.names.ru} width={100} height={100} className="person-img" />
                <div className="person-name">{person.names[l]}</div>
                <div className="person-role">{person.roles[l]}</div>
              </div>
            ))}
          </div>
          <div className="people-scroller-track">
            <div ref={peopleThumbRef} className="people-scroller-thumb" />
          </div>
        </>
      )}
    </div>
  )

  return (
    <section className="group-members-section">
      <div className="group-members-container">
        <h2 className="group-members-header" translate="no">{t('title')}</h2>

        <div className="group-members-content">

          <div className="countries-list-container">
            <div
              className="countries-scrollbar"
              ref={trackRef}
              style={{ cursor: 'pointer' }}
            >
              <div
                ref={thumbRef}
                className="countries-scrollbar-thumb"
                style={{ cursor: 'grab', top: 0 }}
              />
            </div>
            <div className="countries-list" ref={countriesListRef}>
              {memberCountries.map((country) => (
                <div
                  key={country.id}
                  className={`country-item ${activeCountry === country.id ? 'active' : ''}`}
                  onClick={() => setActiveCountry(country.id)}
                  style={isRtl ? { alignItems: 'flex-end' } : {}}
                >
                  <h4 className="country-item-title" style={isRtl ? { justifyContent: 'flex-end', width: '100%' } : {}}>
                    {isRtl ? (
                      <>
                        {country.names[l]}
                        <img src={`/flags/${country.id}.svg`} alt="" width={20} height={15} className="flag-icon" />
                      </>
                    ) : (
                      <>
                        <img src={`/flags/${country.id}.svg`} alt={`Flag ${country.names.en}`} width={20} height={15} className="flag-icon" />
                        {country.names[l]}
                      </>
                    )}
                  </h4>
                  <p className="country-item-desc" style={isRtl ? { textAlign: 'right', width: '100%' } : {}}>{country.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {isMobile && activeCountryData && <InfoCard />}

          <div className="map-center-container">
            {!isMobile && activeCountryData && <InfoCard />}
            <div ref={mapContainerRef} className="svg-map-wrapper" />
          </div>

          <div className="stats-container">
            <div className="stat-block">
              <div className="stat-number">25</div>
              <div className="stat-divider"></div>
              <div className="stat-label" translate="no">{t('countries')}</div>
            </div>
            <div className="stat-block">
              <div className="stat-number">77</div>
              <div className="stat-divider"></div>
              <div className="stat-label" translate="no">{t('regions')}</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
