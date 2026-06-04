import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Camera,
  CalendarDays,
  Download,
  ExternalLink,
  Github,
  ImagePlus,
  Link as LinkIcon,
  Mail,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import './styles.css';

const profileStorageKey = 'personal-site-profile';
const newsHistoryStorageKey = 'repair-news-history';
const newsItemStatesStorageKey = 'repair-news-item-states';
const languageStorageKey = 'site-language';
const accountStorageKey = 'site-account';

const siteNavItems = [
  { href: '#home', label: 'Home' },
  { href: '#news', label: 'News library' },
  { href: '#pricing', label: 'Competitor prices' },
  { href: '#tools', label: 'DIY tools' },
  { href: '#about', label: 'About inexus' },
];

const newsTopics = [
  { id: 'all', label: 'All intelligence', hint: 'Latest collected repair market updates' },
  { id: 'iphone', label: 'iPhone repair', hint: 'Screens, batteries, parts demand, and Apple repair signals' },
  { id: 'samsung', label: 'Samsung repair', hint: 'Galaxy repair parts, displays, and service trends' },
  { id: 'pixel', label: 'Google Pixel', hint: 'Pixel parts, software issues, and repair topics' },
  { id: 'tools', label: 'DIY tools', hint: 'Tool kits, fixtures, adhesives, and repair workflow tips' },
  { id: 'peer', label: 'Peer activity', hint: 'Repair brands, blogs, channels, and competitor signals' },
];

const toolRecommendations = [
  {
    title: 'iPhone battery replacement starter kit',
    audience: 'Best for first-time DIY customers replacing worn batteries.',
    items: 'Pentalobe driver, tri-point driver, suction cup, opening picks, adhesive strips, anti-static mat.',
  },
  {
    title: 'Screen repair essentials',
    audience: 'Best for customers replacing cracked OLED/LCD assemblies.',
    items: 'Precision screwdriver set, spudger, tweezers, heating pad, dust stickers, pre-cut display adhesive.',
  },
  {
    title: 'Charging port and small-parts bench kit',
    audience: 'Best for repeat DIY users handling ports, cameras, buttons, and brackets.',
    items: 'Magnetic project mat, screw organiser, curved tweezers, nylon probes, isopropyl wipes, magnifier.',
  },
  {
    title: 'Safe diagnostics add-on bundle',
    audience: 'Best for retail buyers who want to test before ordering parts.',
    items: 'USB power meter, battery tester, ESD strap, SIM tool, soft brush, compressed air alternative.',
  },
];

const translations = {
  en: {
    languageLabel: 'English',
    switchLanguage: '中文',
    editorTitle: 'Website workspace',
    name: 'Name',
    positioning: 'Positioning',
    location: 'Location',
    email: 'Email',
    intro: 'Intro',
    avatar: 'Avatar',
    heroImage: 'Hero image',
    visualStyle: 'Visual style',
    accent: 'Accent',
    background: 'Background',
    text: 'Text',
    links: 'Links',
    website: 'Website',
    services: 'Services',
    add: 'Add',
    exportStaticPage: 'Export static page',
    newsArchive: 'News Archive',
    contact: 'Contact',
    marketKicker: 'DIY parts market radar',
    marketTitle: 'Peer repair and retail parts intelligence',
    marketDescription:
      'Auto-curated from peer repair videos, repair blogs, phone hardware news, and demand signals for iPhone, Samsung, Pixel, Huawei, Xiaomi parts, tools, and DIY repair kits.',
    latestFetchSaved: 'Latest fetch saved.',
    archivedItems: 'archived items.',
    syncingSources: 'Syncing sources...',
    fallbackStories: 'Showing fallback stories',
    viewAllIntelligence: 'View all saved intelligence',
    readSource: 'Read source',
    account: 'Account',
    accountTitle: 'Account and profile',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    password: 'Password',
    displayName: 'Display name',
    authHint: 'Create a local site account to manage profile content and saved intelligence.',
    profileSettings: 'Profile settings',
    favorites: 'Saved news',
    noFavorites: 'Saved items will appear here.',
    collectedAt: 'Collected',
    viewed: 'Viewed',
    unread: 'Unread',
    liked: 'Saved',
    notLiked: 'Save',
    savedIntelligence: 'News list',
    allFetchedNews: 'Latest phone repair news',
    archiveDescription: '',
    backToSite: 'Back to site',
    fetched: 'Fetched',
    published: 'Published',
    firstSaved: 'First saved',
    competitorKicker: 'Competitor product board',
    competitorTitle: 'Shared product and price table',
    competitorDescription:
      'Tracks competitor product pages by brand. Rows show extracted product details when public scraping is available; blocked pages stay visible as monitored manual-review links.',
    usingFallbackCompetitors: 'Using fallback competitor links',
    brand: 'Brand',
    competitor: 'Competitor',
    product: 'Product',
    price: 'Price',
    status: 'Status',
    link: 'Link',
    open: 'Open',
    repairCapability: 'Repair capability',
    servicesAndCases: 'Services and cases',
    item: 'Item',
    title: 'Title',
    description: 'Description',
    image: 'Image',
    emailAction: 'Email',
  },
  zh: {
    languageLabel: '中文',
    switchLanguage: 'English',
    editorTitle: '网站工作台',
    name: '名称',
    positioning: '定位',
    location: '地区',
    email: '邮箱',
    intro: '简介',
    avatar: '头像',
    heroImage: '首页图片',
    visualStyle: '视觉风格',
    accent: '强调色',
    background: '背景',
    text: '文字',
    links: '链接',
    website: '网站',
    services: '服务',
    add: '添加',
    exportStaticPage: '导出静态页面',
    newsArchive: '资讯归档',
    contact: '联系',
    marketKicker: 'DIY 零件市场雷达',
    marketTitle: '同行维修与零售零件情报',
    marketDescription:
      '自动聚合同业维修视频、维修博客、手机硬件新闻，以及 iPhone、Samsung、Pixel、Huawei、Xiaomi 零件、工具和 DIY 维修套装的需求信号。',
    latestFetchSaved: '最新抓取已保存。',
    archivedItems: '条归档资讯。',
    syncingSources: '正在同步来源...',
    fallbackStories: '正在显示备用内容',
    viewAllIntelligence: '查看全部已保存情报',
    readSource: '查看来源',
    favorites: '已收藏资讯',
    noFavorites: '点赞后的资讯会显示在这里。',
    collectedAt: '收集时间',
    viewed: '已浏览',
    unread: '未浏览',
    liked: '已点赞',
    notLiked: '点赞',
    savedIntelligence: '已保存情报',
    allFetchedNews: '全部已抓取维修资讯',
    archiveDescription: '按照本站最近一次抓取到该资讯的时间从新到旧排序。',
    backToSite: '返回网站',
    fetched: '抓取',
    published: '发布',
    firstSaved: '首次保存',
    competitorKicker: '竞品产品表',
    competitorTitle: '共享产品与价格表',
    competitorDescription:
      '按品牌追踪竞品产品页面。可公开抓取时显示产品和价格；被拦截页面会保留为需要人工查看的监控链接。',
    usingFallbackCompetitors: '正在使用备用竞品链接',
    brand: '品牌',
    competitor: '竞品',
    product: '产品',
    price: '价格',
    status: '状态',
    link: '链接',
    open: '打开',
    repairCapability: '维修能力',
    servicesAndCases: '服务与案例',
    item: '项目',
    title: '标题',
    description: '描述',
    image: '图片',
    emailAction: '发邮件',
  },
};

const zhOverrides = {
  languageLabel: '中文',
  switchLanguage: 'English',
  editorTitle: '网站工作台',
  name: '名称',
  positioning: '定位',
  location: '地区',
  email: '邮箱',
  intro: '简介',
  avatar: '头像',
  heroImage: '首页图片',
  visualStyle: '视觉风格',
  accent: '强调色',
  background: '背景',
  text: '文字',
  links: '链接',
  website: '网站',
  services: '服务',
  add: '添加',
  exportStaticPage: '导出静态页面',
  newsArchive: '资讯归档',
  contact: '联系',
  account: '账号',
  accountTitle: '账号与个人资料',
  register: '注册',
  login: '登录',
  logout: '退出登录',
  password: '密码',
  displayName: '显示名称',
  authHint: '创建本地网站账号，用来管理个人资料和已收藏资讯。',
  profileSettings: '个人资料设置',
  marketKicker: 'DIY 零件市场雷达',
  marketTitle: '同行维修与零售零件情报',
  marketDescription:
    '自动聚合同业维修视频、维修博客、手机硬件新闻，以及 iPhone、Samsung、Pixel、Huawei、Xiaomi 零件、工具和 DIY 维修套装的需求信号。',
  latestFetchSaved: '最新抓取已保存。',
  archivedItems: '条归档资讯。',
  syncingSources: '正在同步来源...',
  fallbackStories: '正在显示备用内容',
  viewAllIntelligence: '查看全部资讯',
  readSource: '查看来源',
  favorites: '已收藏资讯',
  noFavorites: '收藏后的资讯会显示在这里。',
  collectedAt: '收集时间',
  viewed: '已浏览',
  unread: '未浏览',
  liked: '已收藏',
  notLiked: '收藏',
  savedIntelligence: '资讯清单',
  allFetchedNews: '手机维修最新资讯',
  archiveDescription: '',
  fetched: '抓取',
  published: '发布',
  firstSaved: '首次保存',
  competitorKicker: '竞品产品表',
  competitorTitle: '共享产品与价格表',
  competitorDescription: '按品牌追踪竞品产品页面。可公开抓取时显示产品和价格；被拦截页面保留为人工查看链接。',
  usingFallbackCompetitors: '正在使用备用竞品链接',
  brand: '品牌',
  competitor: '竞品',
  product: '产品',
  price: '价格',
  status: '状态',
  link: '链接',
  open: '打开',
  repairCapability: '维修能力',
  servicesAndCases: '服务与案例',
  item: '项目',
  title: '标题',
  description: '描述',
  image: '图片',
  emailAction: '发邮件',
};

function getTranslations(language) {
  return language === 'zh' ? { ...translations.en, ...zhOverrides } : translations.en;
}

const fallbackCompetitorProducts = [
  {
    id: 'replacebase-iphone-blocked',
    competitor: 'ReplaceBase',
    brand: 'iPhone',
    productName: 'Automatic scrape blocked',
    price: '',
    availability: 'Manual review required',
    url: 'https://www.replacebase.co.uk/apple/iphone',
    sourceUrl: 'https://www.replacebase.co.uk/apple/iphone',
    fetchedAt: '',
    status: 'blocked',
    note: 'ReplaceBase currently blocks automated public scraping. Add an approved feed/API or manual import for exact prices.',
  },
  {
    id: 'replacebase-samsung-blocked',
    competitor: 'ReplaceBase',
    brand: 'Samsung',
    productName: 'Automatic scrape blocked',
    price: '',
    availability: 'Manual review required',
    url: 'https://www.replacebase.co.uk/samsung',
    sourceUrl: 'https://www.replacebase.co.uk/samsung',
    fetchedAt: '',
    status: 'blocked',
    note: 'Use this row as a tracked competitor link until an accessible source is available.',
  },
];

const fallbackNews = [
  {
    title: 'Peer repair channels reveal DIY kit and parts demand',
    link: 'https://www.youtube.com/@phonerepairguru',
    source: 'Peer video radar',
    region: 'Peer video / Global',
    publishedAt: '2026-05-01T00:00:00.000Z',
    summary: 'Track what repair creators publish to understand customer interest in screens, batteries, tools, and DIY kits.',
  },
  {
    title: 'iPhone and Samsung repair videos surface retail parts opportunities',
    link: 'https://www.youtube.com/@iDoctorUK',
    source: 'iDoctor UK',
    region: 'Peer video / UK',
    publishedAt: '2026-05-01T00:00:00.000Z',
    summary: 'Step-by-step repair content is useful for spotting demand around battery, display, charge port, and tool bundles.',
  },
  {
    title: 'Phone launches and leaks help forecast future replacement part demand',
    link: 'https://www.gsmarena.com/',
    source: 'Demand signal radar',
    region: 'Demand signal / Global',
    publishedAt: '2026-05-01T00:00:00.000Z',
    summary: 'Monitor iPhone, Samsung, Pixel, Huawei, and Xiaomi hardware news to prepare parts and kit positioning.',
  },
];

const defaultProfile = {
  name: 'inexus',
  title: 'UK Phone Repair Specialist',
  location: 'United Kingdom',
  email: 'hello@example.com',
  bio:
    'A technical repair hub for UK customers, focused on phone diagnostics, parts, screen and battery work, and practical device care.',
  accent: '#0f9f8f',
  background: '#f6f3ee',
  text: '#1c2326',
  avatar: '',
  heroImage: '/assets/phone-repair-hero.png',
  links: {
    github: 'https://github.com/',
    website: 'https://example.com',
  },
  projects: [
    {
      title: 'Screen and display repairs',
      description: 'Showcase OLED, LCD, touch, and glass repair capability for popular phone models.',
      image: '',
    },
    {
      title: 'Battery and charging diagnostics',
      description: 'Explain battery health checks, charging port faults, and power-related troubleshooting.',
      image: '',
    },
  ],
};

function readStoredProfile() {
  try {
    const value = localStorage.getItem(profileStorageKey);
    if (!value) return defaultProfile;

    const storedProfile = { ...defaultProfile, ...JSON.parse(value) };
    return {
      ...storedProfile,
      name: defaultProfile.name,
    };
  } catch {
    return defaultProfile;
  }
}

function readStoredNewsHistory() {
  try {
    const value = localStorage.getItem(newsHistoryStorageKey);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? sortNewsHistory(parsed) : [];
  } catch {
    return [];
  }
}

function readStoredNewsItemStates() {
  try {
    const value = localStorage.getItem(newsItemStatesStorageKey);
    const parsed = value ? JSON.parse(value) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function readStoredAccount() {
  try {
    const value = localStorage.getItem(accountStorageKey);
    const parsed = value ? JSON.parse(value) : null;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function currentPageFromHash() {
  const hash = window.location.hash || '#home';
  if (hash.startsWith('#account')) return 'account';
  if (hash.startsWith('#favorites')) return 'favorites';
  if (hash.startsWith('#news')) return 'news';
  if (hash.startsWith('#pricing')) return 'pricing';
  if (hash.startsWith('#tools')) return 'tools';
  if (hash.startsWith('#about')) return 'about';
  return 'home';
}

function App() {
  const [profile, setProfile] = useState(readStoredProfile);
  const [account, setAccount] = useState(readStoredAccount);
  const [authForm, setAuthForm] = useState({ displayName: '', email: '', password: '' });
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [newsPage, setNewsPage] = useState(0);
  const [language, setLanguage] = useState(() => localStorage.getItem(languageStorageKey) || 'en');
  const [page, setPage] = useState(currentPageFromHash);
  const [newsHistory, setNewsHistory] = useState(readStoredNewsHistory);
  const [newsItemStates, setNewsItemStates] = useState(readStoredNewsItemStates);
  const [news, setNews] = useState({ items: fallbackNews, generatedAt: '', status: 'loading' });
  const [competitorBoard, setCompetitorBoard] = useState({
    products: fallbackCompetitorProducts,
    fetchedAt: '',
    status: 'loading',
  });

  useEffect(() => {
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(languageStorageKey, language);
  }, [language]);

  useEffect(() => {
    if (account) {
      localStorage.setItem(accountStorageKey, JSON.stringify(account));
    }
  }, [account]);

  useEffect(() => {
    const handleHashChange = () => setPage(currentPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    fetch('/data/news-history.json')
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((data) => {
        if (!isCurrent || !Array.isArray(data.items) || !data.items.length) return;
        setNewsHistory((current) => {
          const next = sortNewsHistory(mergeExistingNewsItems(current, data.items)).slice(0, 500);
          localStorage.setItem(newsHistoryStorageKey, JSON.stringify(next));
          return next;
        });
      })
      .catch(() => {});

    fetch('/api/repair-news')
      .then((response) => {
        if (!response.ok) throw new Error('News request failed');
        return response.json();
      })
      .then((data) => {
        if (!isCurrent) return;
        const fetchedAt = data.generatedAt ?? new Date().toISOString();
        const items = Array.isArray(data.items) && data.items.length ? data.items : fallbackNews;

        setNews({
          items,
          generatedAt: fetchedAt,
          status: data.items?.length ? 'fresh' : 'fallback',
        });

        if (data.items?.length) {
          setNewsHistory((current) => {
            const next = mergeNewsHistory(current, data.items, fetchedAt);
            localStorage.setItem(newsHistoryStorageKey, JSON.stringify(next));
            return next;
          });
        }
      })
      .catch(() => {
        if (!isCurrent) return;
        setNews({ items: fallbackNews, generatedAt: '', status: 'fallback' });
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  function updateNewsItemState(item, patch) {
    setNewsItemStates((current) => {
      const key = newsKey(item);
      const next = {
        ...current,
        [key]: {
          ...current[key],
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      };
      localStorage.setItem(newsItemStatesStorageKey, JSON.stringify(next));
      return next;
    });
  }

  function markNewsViewed(item) {
    updateNewsItemState(item, { viewed: true, viewedAt: new Date().toISOString() });
  }

  function toggleNewsLiked(item) {
    const current = newsItemStates[newsKey(item)] ?? {};
    updateNewsItemState(item, { liked: !current.liked });
  }

  useEffect(() => {
    let isCurrent = true;

    fetch('/api/competitor-products')
      .then((response) => {
        if (!response.ok) throw new Error('Competitor request failed');
        return response.json();
      })
      .then((data) => {
        if (!isCurrent) return;
        setCompetitorBoard({
          products: Array.isArray(data.products) && data.products.length ? data.products : fallbackCompetitorProducts,
          fetchedAt: data.fetchedAt ?? '',
          status: data.products?.length ? 'fresh' : 'fallback',
        });
      })
      .catch(() => {
        if (!isCurrent) return;
        setCompetitorBoard({ products: fallbackCompetitorProducts, fetchedAt: '', status: 'fallback' });
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const cssVars = useMemo(
    () => ({
      '--accent': profile.accent,
      '--paper': profile.background,
      '--ink': profile.text,
    }),
    [profile.accent, profile.background, profile.text],
  );

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function updateLink(field, value) {
    setProfile((current) => ({
      ...current,
      links: { ...current.links, [field]: value },
    }));
  }

  function updateProject(index, field, value) {
    setProfile((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, [field]: value } : project,
      ),
    }));
  }

  function addProject() {
    setProfile((current) => ({
      ...current,
      projects: [
        ...current.projects,
        { title: 'New service', description: 'Add a concise description for this repair service or case study.', image: '' },
      ],
    }));
  }

  function removeProject(index) {
    setProfile((current) => ({
      ...current,
      projects: current.projects.filter((_, projectIndex) => projectIndex !== index),
    }));
  }

  function resetProfile() {
    setProfile(defaultProfile);
  }

  function toggleLanguage() {
    setLanguage((current) => (current === 'en' ? 'zh' : 'en'));
  }

  function updateAuthField(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function registerAccount() {
    const nextAccount = {
      displayName: authForm.displayName || profile.name,
      email: authForm.email,
      createdAt: new Date().toISOString(),
    };
    setAccount(nextAccount);
  }

  function loginAccount() {
    const stored = readStoredAccount();
    setAccount(stored ?? {
      displayName: authForm.displayName || profile.name,
      email: authForm.email,
      createdAt: new Date().toISOString(),
    });
  }

  function logoutAccount() {
    setAccount(null);
    localStorage.removeItem(accountStorageKey);
  }

  function toggleAccountMenu() {
    setAccountMenuOpen((current) => !current);
  }

  function exportHtml() {
    const pageHtml = buildStaticPage(profile, news.items, newsHistory, competitorBoard.products, language);
    const blob = new Blob([pageHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'personal-site.html';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell" style={cssVars}>
      <section className="preview-pane" aria-label="Live preview">
        <Portfolio
          profile={profile}
          news={news}
          newsHistory={newsHistory}
          newsItemStates={newsItemStates}
          competitorBoard={competitorBoard}
          page={page}
          language={language}
          account={account}
          authForm={authForm}
          accountMenuOpen={accountMenuOpen}
          newsPage={newsPage}
          onLanguageToggle={toggleLanguage}
          onAccountToggle={toggleAccountMenu}
          onNewsPage={setNewsPage}
          onViewed={markNewsViewed}
          onLiked={toggleNewsLiked}
          onAuthField={updateAuthField}
          onRegister={registerAccount}
          onLogin={loginAccount}
          onLogout={logoutAccount}
          onProfileField={updateField}
          onProfileLink={updateLink}
          onProjectChange={updateProject}
          onProjectAdd={addProject}
          onProjectRemove={removeProject}
          onProfileReset={resetProfile}
          onExport={exportHtml}
        />
      </section>
    </main>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ColorInput({ label, value, onChange }) {
  return (
    <label className="color-field">
      <span>{label}</span>
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ImageUpload({ icon, label, image, onImage }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => onImage(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <label className="upload-card">
      <input type="file" accept="image/*" onChange={handleFile} />
      <span className="upload-icon">{icon}</span>
      <span>{label}</span>
      {image ? <img src={image} alt="" /> : <Upload size={20} />}
    </label>
  );
}

function ProjectEditor({ project, index, onChange, onRemove, t }) {
  return (
    <article className="project-editor">
      <div className="project-editor-top">
        <strong>{t.item} {index + 1}</strong>
        <button className="icon-button small" onClick={() => onRemove(index)} aria-label="Delete item">
          <Trash2 size={16} />
        </button>
      </div>
      <TextInput label={t.title} value={project.title} onChange={(value) => onChange(index, 'title', value)} />
      <label className="field full">
        <span>{t.description}</span>
        <textarea value={project.description} onChange={(event) => onChange(index, 'description', event.target.value)} />
      </label>
      <ImageUpload label={t.image} image={project.image} onImage={(value) => onChange(index, 'image', value)} icon={<ImagePlus size={18} />} />
    </article>
  );
}

function AccountPage({
  account,
  authForm,
  profile,
  t,
  onAuthField,
  onRegister,
  onLogin,
  onLogout,
  onProfileField,
  onProfileLink,
  onProjectChange,
  onProjectAdd,
  onProjectRemove,
  onProfileReset,
  onExport,
}) {
  return (
    <section className="account-page">
      <div className="account-header">
        <div>
          <p className="kicker">{t.account ?? 'Account'}</p>
          <h1>{t.accountTitle ?? 'Account and profile'}</h1>
          <p>{t.authHint ?? 'Create a local site account to manage profile content.'}</p>
        </div>
        {account ? <button className="small-button" onClick={onLogout}>{t.logout ?? 'Logout'}</button> : null}
      </div>

      {!account ? (
        <div className="auth-panel">
          <TextInput label={t.displayName ?? 'Display name'} value={authForm.displayName} onChange={(value) => onAuthField('displayName', value)} />
          <TextInput label={t.email} value={authForm.email} onChange={(value) => onAuthField('email', value)} />
          <TextInput label={t.password ?? 'Password'} value={authForm.password} onChange={(value) => onAuthField('password', value)} />
          <div className="auth-actions">
            <button className="export-button" onClick={onRegister}>{t.register ?? 'Register'}</button>
            <button className="small-button secondary" onClick={onLogin}>{t.login ?? 'Login'}</button>
          </div>
        </div>
      ) : (
        <div className="profile-settings">
          <div className="profile-settings-title">
            <div>
              <p className="kicker">{account.displayName || account.email}</p>
              <h2>{t.profileSettings ?? 'Profile settings'}</h2>
            </div>
            <button className="icon-button" onClick={onProfileReset} aria-label="Reset profile">
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="field-grid">
            <TextInput label={t.name} value={profile.name} onChange={(value) => onProfileField('name', value)} />
            <TextInput label={t.positioning} value={profile.title} onChange={(value) => onProfileField('title', value)} />
            <TextInput label={t.location} value={profile.location} onChange={(value) => onProfileField('location', value)} />
            <TextInput label={t.email} value={profile.email} onChange={(value) => onProfileField('email', value)} />
          </div>

          <label className="field full">
            <span>{t.intro}</span>
            <textarea value={profile.bio} onChange={(event) => onProfileField('bio', event.target.value)} rows={4} />
          </label>

          <div className="upload-row">
            <ImageUpload icon={<Camera size={18} />} label={t.avatar} image={profile.avatar} onImage={(value) => onProfileField('avatar', value)} />
            <ImageUpload icon={<ImagePlus size={18} />} label={t.heroImage} image={profile.heroImage} onImage={(value) => onProfileField('heroImage', value)} />
          </div>

          <section className="control-section">
            <div className="section-title">
              <Palette size={18} />
              <h2>{t.visualStyle}</h2>
            </div>
            <div className="color-grid">
              <ColorInput label={t.accent} value={profile.accent} onChange={(value) => onProfileField('accent', value)} />
              <ColorInput label={t.background} value={profile.background} onChange={(value) => onProfileField('background', value)} />
              <ColorInput label={t.text} value={profile.text} onChange={(value) => onProfileField('text', value)} />
            </div>
          </section>

          <section className="control-section">
            <div className="section-title">
              <LinkIcon size={18} />
              <h2>{t.links}</h2>
            </div>
            <TextInput label="GitHub" value={profile.links.github} onChange={(value) => onProfileLink('github', value)} />
            <TextInput label={t.website} value={profile.links.website} onChange={(value) => onProfileLink('website', value)} />
          </section>

          <section className="control-section">
            <div className="section-title split">
              <div>
                <Sparkles size={18} />
                <h2>{t.services}</h2>
              </div>
              <button className="small-button" onClick={onProjectAdd}>
                <Plus size={16} />
                {t.add}
              </button>
            </div>
            <div className="project-editor-list">
              {profile.projects.map((project, index) => (
                <ProjectEditor
                  key={`${project.title}-${index}`}
                  project={project}
                  index={index}
                  onChange={onProjectChange}
                  onRemove={onProjectRemove}
                  t={t}
                />
              ))}
            </div>
          </section>

          <button className="export-button" onClick={onExport}>
            <Download size={18} />
            {t.exportStaticPage}
          </button>
        </div>
      )}
    </section>
  );
}

function AccountDropdown({ t }) {
  return (
    <div className="account-dropdown">
      <a href="#account">{t.profileSettings ?? 'Profile'}</a>
      <a href="#favorites">{t.favorites}</a>
    </div>
  );
}

function FavoritesPage({ items, itemStates, onViewed, onLiked, t }) {
  const favoriteItems = items.filter((item) => itemStates[newsKey(item)]?.liked);

  return (
    <section className="archive-page">
      <div className="archive-header">
        <div>
          <p className="kicker">{t.account ?? 'Account'}</p>
          <h1>{t.favorites}</h1>
        </div>
      </div>
      <div className="archive-list">
        {favoriteItems.length ? favoriteItems.map((item) => (
          <NewsListItem
            item={item}
            state={itemStates[newsKey(item)]}
            onViewed={onViewed}
            onLiked={onLiked}
            t={t}
            key={`favorite-page-${newsKey(item)}`}
          />
        )) : <p className="empty-note">{t.noFavorites}</p>}
      </div>
    </section>
  );
}

function Portfolio({
  profile,
  news,
  newsHistory,
  newsItemStates,
  competitorBoard,
  page,
  language,
  account,
  authForm,
  accountMenuOpen,
  newsPage,
  onLanguageToggle,
  onAccountToggle,
  onNewsPage,
  onViewed,
  onLiked,
  onAuthField,
  onRegister,
  onLogin,
  onLogout,
  onProfileField,
  onProfileLink,
  onProjectChange,
  onProjectAdd,
  onProjectRemove,
  onProfileReset,
  onExport,
}) {
  const t = getTranslations(language);

  return (
    <div className="site-preview">
      <DigitalClock />
      <nav className="site-nav">
        <a className="brand-link" href="#home">{profile.name}</a>
        <div className="nav-links">
          {siteNavItems.map((item) => (
            <a className={page === item.href.slice(1) ? 'active' : ''} href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="nav-language-button" onClick={onLanguageToggle}>{t.switchLanguage}</button>
          <div className="account-menu-wrap">
            <button className="account-menu-button" onClick={onAccountToggle}>{t.account ?? 'Account'}</button>
            {accountMenuOpen ? (
              <AccountDropdown
                t={t}
              />
            ) : null}
          </div>
        </div>
      </nav>

      {page === 'account' ? (
        <AccountPage
          account={account}
          authForm={authForm}
          profile={profile}
          t={t}
          onAuthField={onAuthField}
          onRegister={onRegister}
          onLogin={onLogin}
          onLogout={onLogout}
          onProfileField={onProfileField}
          onProfileLink={onProfileLink}
          onProjectChange={onProjectChange}
          onProjectAdd={onProjectAdd}
          onProjectRemove={onProjectRemove}
          onProfileReset={onProfileReset}
          onExport={onExport}
        />
      ) : page === 'favorites' ? (
        <FavoritesPage
          items={newsHistory}
          itemStates={newsItemStates}
          onViewed={onViewed}
          onLiked={onLiked}
          t={t}
        />
      ) : page === 'news' ? (
        <NewsArchive
          items={newsHistory}
          currentItems={news.items}
          itemStates={newsItemStates}
          page={newsPage}
          onPage={onNewsPage}
          onViewed={onViewed}
          onLiked={onLiked}
          t={t}
        />
      ) : page === 'pricing' ? (
        <CompetitorProductBoard board={competitorBoard} t={t} />
      ) : page === 'tools' ? (
        <ToolsPage />
      ) : page === 'about' ? (
        <AboutPage profile={profile} projects={profile.projects} t={t} />
      ) : (
        <>
          <ProfileHero profile={profile} t={t} />
          <HomeTopics />
          <HomeLatestNews
            items={newsHistory.length ? newsHistory : news.items}
            itemStates={newsItemStates}
            onViewed={onViewed}
            onLiked={onLiked}
            t={t}
          />
        </>
      )}
    </div>
  );
}

function DigitalClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeParts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const time = {
    hour: timeParts.find((part) => part.type === 'hour')?.value ?? '00',
    minute: timeParts.find((part) => part.type === 'minute')?.value ?? '00',
    second: timeParts.find((part) => part.type === 'second')?.value ?? '00',
  };

  return (
    <section className="digital-clock" aria-label="Live digital clock">
      <div className="clock-meta">
        <span>Live market time</span>
        <strong>{formatDate(now.toISOString())}</strong>
      </div>
      <div className="clock-face" aria-live="polite">
        <span>{time.hour}</span>
        <b>:</b>
        <span>{time.minute}</span>
        <b>:</b>
        <span className="clock-seconds">{time.second}</span>
      </div>
    </section>
  );
}

function HomeTopics() {
  return (
    <section className="topic-section">
      <div className="section-heading">
        <p className="kicker">Start by topic</p>
        <h2>Repair intelligence built around your market</h2>
      </div>
      <div className="topic-grid">
        {newsTopics.slice(1).map((topic) => (
          <a className="topic-card" href={`#news?topic=${topic.id}`} key={topic.id}>
            <span>{topic.label}</span>
            <p>{topic.hint}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function HomeLatestNews({ items, itemStates, onViewed, onLiked, t }) {
  const latestItems = items?.length ? items : fallbackNews;

  return (
    <section className="home-news-section">
      <div className="section-heading split">
        <div>
          <p className="kicker">Latest collected intelligence</p>
          <h2>Fresh phone repair signals</h2>
        </div>
        <a className="section-link" href="#news">Open news library</a>
      </div>
      <div className="archive-list">
        {latestItems.slice(0, 5).map((item) => (
          <NewsListItem item={item} state={itemStates[newsKey(item)]} onViewed={onViewed} onLiked={onLiked} t={t} key={`home-${newsKey(item)}`} />
        ))}
      </div>
    </section>
  );
}

function ToolsPage() {
  return (
    <section className="tools-page">
      <div className="archive-header">
        <div>
          <p className="kicker">DIY repair tools</p>
          <h1>Recommended kits for retail repair customers</h1>
          <p>Position parts and tools as complete jobs customers can understand: battery replacement, screen repair, small-parts work, and basic diagnostics.</p>
        </div>
      </div>
      <div className="tool-grid">
        {toolRecommendations.map((tool) => (
          <article className="tool-card" key={tool.title}>
            <span>Kit</span>
            <h2>{tool.title}</h2>
            <p>{tool.audience}</p>
            <strong>{tool.items}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutPage({ profile, projects, t }) {
  return (
    <section className="about-page">
      <div className="about-intro">
        <p className="kicker">{profile.location}</p>
        <h1>About {profile.name}</h1>
        <p>{profile.bio}</p>
        <div className="about-points">
          <span>UK-focused repair intelligence</span>
          <span>DIY parts and tool-kit positioning</span>
          <span>Peer and competitor market monitoring</span>
        </div>
      </div>
      <WorkSection projects={projects} t={t} />
    </section>
  );
}

function NewsArchive({ items, currentItems, itemStates, page, onPage, onViewed, onLiked, t }) {
  const archiveItems = items.length ? items : currentItems.map((item) => ({ ...item, firstFetchedAt: '', lastFetchedAt: '' }));
  const [topic, setTopic] = useState(() => new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('topic') ?? 'all');
  const filteredItems = topic === 'all' ? archiveItems : archiveItems.filter((item) => getNewsTopicIds(item).includes(topic));
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleItems = filteredItems.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const handleTopic = (topicId) => {
    setTopic(topicId);
    onPage(0);
    window.history.replaceState(null, '', topicId === 'all' ? '#news' : `#news?topic=${topicId}`);
  };

  return (
    <section className="archive-page">
      <div className="archive-header">
        <div>
          <p className="kicker">{t.savedIntelligence}</p>
          <h1>{t.allFetchedNews}</h1>
          {t.archiveDescription ? <p>{t.archiveDescription}</p> : null}
        </div>
      </div>

      <div className="topic-filter" aria-label="News topic filters">
        {newsTopics.map((filter) => (
          <button className={topic === filter.id ? 'active' : ''} onClick={() => handleTopic(filter.id)} key={filter.id}>
            <span>{filter.label}</span>
            <small>{filter.id === 'all' ? archiveItems.length : archiveItems.filter((item) => getNewsTopicIds(item).includes(filter.id)).length}</small>
          </button>
        ))}
      </div>

      <div className="archive-list">
        {visibleItems.length ? visibleItems.map((item) => (
          <NewsListItem item={item} state={itemStates[newsKey(item)]} onViewed={onViewed} onLiked={onLiked} t={t} key={newsKey(item)} />
        )) : <p className="empty-note">No collected news in this topic yet.</p>}
      </div>

      {totalPages > 1 ? (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button className={safePage === index ? 'active' : ''} onClick={() => onPage(index)} key={index}>
              {index + 1}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function NewsListItem({ item, state = {}, onViewed, onLiked, t, compact = false }) {
  return (
    <article className={compact ? 'news-item compact' : 'news-item'}>
      <div className="news-item-main">
        <div className="archive-meta">
          <span>{item.source}</span>
          <span>{item.region}</span>
        </div>
        <h3>
          <a className="news-title-link" href={item.link} target="_blank" rel="noreferrer" onClick={() => onViewed(item)}>
            {item.title}
            <ExternalLink size={14} />
          </a>
        </h3>
        <p>{item.summary}</p>
      </div>
      <aside className="news-state-box">
        <div>
          <small>{t.collectedAt}</small>
          <strong>{formatDateTime(item.lastFetchedAt ?? item.generatedAt ?? item.publishedAt)}</strong>
        </div>
        <button className={state.viewed ? 'state-button active' : 'state-button'} onClick={() => onViewed(item)}>
          {state.viewed ? t.viewed : t.unread}
        </button>
        <button className={state.liked ? 'state-button liked' : 'state-button'} onClick={() => onLiked(item)}>
          {state.liked ? t.liked : t.notLiked}
        </button>
      </aside>
    </article>
  );
}

function ProfileHero({ profile, t }) {
  const heroImage = profile.heroImage || defaultProfile.heroImage;

  return (
    <header className="hero profile-hero">
      <div className="hero-copy">
        <p className="kicker">{profile.location}</p>
        <h1>{profile.name}</h1>
        <h3>{profile.title}</h3>
        <p>{profile.bio}</p>
        <div className="hero-actions">
          <a href={`mailto:${profile.email}`}>{t.emailAction}</a>
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            <Github size={17} />
            GitHub
          </a>
        </div>
      </div>
      <div className="portrait-wrap">
        {heroImage ? <img className="hero-photo" src={heroImage} alt="" /> : <div className="photo-placeholder" />}
      </div>
    </header>
  );
}

function CompetitorProductBoard({ board, t }) {
  const products = board.products?.length ? board.products : fallbackCompetitorProducts;
  const brands = [...new Set(products.map((product) => product.brand))];

  return (
    <section className="competitor-section">
      <div className="competitor-heading">
        <div>
          <p className="kicker">{t.competitorKicker}</p>
          <h2>{t.competitorTitle}</h2>
          <p>{t.competitorDescription}</p>
        </div>
        <div className="board-status">
          <span className={board.status === 'fresh' ? 'status-dot fresh' : 'status-dot'} />
          {board.status === 'fresh' ? `${t.fetched} ${formatDateTime(board.fetchedAt)}` : t.usingFallbackCompetitors}
        </div>
      </div>

      <div className="brand-tabs" aria-label="Tracked competitor brands">
        {brands.map((brand) => (
          <a href={`#brand-${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={brand}>
            {brand}
          </a>
        ))}
      </div>

      <div className="product-table-wrap">
        <table className="product-table">
          <thead>
            <tr>
              <th>{t.brand}</th>
              <th>{t.competitor}</th>
              <th>{t.product}</th>
              <th>{t.price}</th>
              <th>{t.status}</th>
              <th>{t.fetched}</th>
              <th>{t.link}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr id={`brand-${product.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={product.id}>
                <td>{product.brand}</td>
                <td>{product.competitor}</td>
                <td>
                  <strong>{product.productName}</strong>
                  {product.note ? <small>{product.note}</small> : null}
                </td>
                <td>{product.price || '-'}</td>
                <td>
                  <span className={`table-pill ${product.status === 'ok' ? 'ok' : ''}`}>{product.availability || product.status}</span>
                </td>
                <td>{formatDateTime(product.fetchedAt)}</td>
                <td>
                  <a href={product.url || product.sourceUrl} target="_blank" rel="noreferrer">
                    {t.open}
                    <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function WorkSection({ projects, t }) {
  return (
    <section className="work-section">
      <div className="work-heading">
        <p className="kicker">{t.repairCapability}</p>
        <h2>{t.servicesAndCases}</h2>
      </div>
      <div className="work-grid">
        {projects.map((project, index) => (
          <article className="work-card" key={`${project.title}-${index}`}>
            {project.image ? <img src={project.image} alt="" /> : <div className="project-placeholder" />}
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function mergeNewsHistory(current, items, fetchedAt) {
  const byKey = new Map(current.map((item) => [newsKey(item), item]));

  for (const item of items) {
    const key = newsKey(item);
    const existing = byKey.get(key);
    byKey.set(key, {
      ...existing,
      ...item,
      firstFetchedAt: existing?.firstFetchedAt ?? fetchedAt,
      lastFetchedAt: fetchedAt,
    });
  }

  return sortNewsHistory([...byKey.values()]).slice(0, 250);
}

function mergeExistingNewsItems(current, items) {
  const byKey = new Map(current.map((item) => [newsKey(item), item]));

  for (const item of items) {
    const existing = byKey.get(newsKey(item));
    byKey.set(newsKey(item), {
      ...existing,
      ...item,
      firstFetchedAt: existing?.firstFetchedAt ?? item.firstFetchedAt ?? item.lastFetchedAt,
      lastFetchedAt: item.lastFetchedAt ?? existing?.lastFetchedAt,
    });
  }

  return [...byKey.values()];
}

function newsKey(item) {
  return item.link || `${item.source}-${item.title}`;
}

function getNewsTopicIds(item) {
  const text = `${item.title ?? ''} ${item.summary ?? ''} ${item.source ?? ''}`.toLowerCase();
  const topics = new Set();

  if (text.includes('iphone') || text.includes('apple') || text.includes('ios')) topics.add('iphone');
  if (text.includes('samsung') || text.includes('galaxy')) topics.add('samsung');
  if (text.includes('pixel') || text.includes('google')) topics.add('pixel');
  if (text.includes('tool') || text.includes('kit') || text.includes('diy') || text.includes('battery') || text.includes('screen')) topics.add('tools');
  if (
    text.includes('replacebase') ||
    text.includes('rewa') ||
    text.includes('idoctor') ||
    text.includes('phone repair guru') ||
    text.includes('diyphonefix') ||
    text.includes('repair')
  ) {
    topics.add('peer');
  }

  return topics.size ? [...topics] : ['peer'];
}

function sortNewsHistory(items) {
  return [...items].sort((a, b) => new Date(b.lastFetchedAt || 0) - new Date(a.lastFetchedAt || 0));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Latest';
  return new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'not saved yet';
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildStaticPage(profile, newsItems = fallbackNews, newsHistory = []) {
  const text = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  const url = (value) => text(value || '#');
  const latestItems = newsItems.length ? newsItems : fallbackNews;
  const archiveItems = newsHistory.length ? newsHistory : latestItems;
  const heroImage = profile.heroImage || defaultProfile.heroImage;

  const projects = profile.projects
    .map(
      (project) => `
        <article class="work-card">
          ${project.image ? `<img src="${url(project.image)}" alt="">` : '<div class="project-placeholder"></div>'}
          <div>
            <h3>${text(project.title)}</h3>
            <p>${text(project.description)}</p>
          </div>
        </article>`,
    )
    .join('');

  const latestMarkup = latestItems
    .slice(0, 5)
    .map((item, index) =>
      index === 0
        ? `<article class="headline-card"><div><span class="source-pill">${text(item.region)} - ${text(item.source)}</span><h3><a href="${url(item.link)}" target="_blank" rel="noreferrer">${text(item.title)}</a></h3><p>${text(item.summary)}</p></div></article>`
        : `<a class="news-row" href="${url(item.link)}" target="_blank" rel="noreferrer"><span>${text(item.source)}</span><strong>${text(item.title)}</strong><small>${text(formatDate(item.lastFetchedAt ?? item.publishedAt))}</small></a>`,
    )
    .join('');

  const archiveMarkup = archiveItems
    .map(
      (item) => `
        <article class="archive-item">
          <div class="archive-meta"><span>${text(item.source)}</span><span>${text(item.region)}</span><span>Fetched ${text(formatDateTime(item.lastFetchedAt))}</span></div>
          <h2><a href="${url(item.link)}" target="_blank" rel="noreferrer">${text(item.title)}</a></h2>
          <p>${text(item.summary)}</p>
          <div class="archive-actions"><small>Published ${text(formatDate(item.publishedAt))}</small></div>
        </article>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${text(profile.name)}</title>
    <style>${staticCss()}</style>
  </head>
  <body>
    <main class="site-preview">
      <nav class="site-nav">
        <a class="brand-link" href="#home">${text(profile.name)}</a>
      </nav>
      <section class="industry-news">
        <div class="news-lead">
          <p class="kicker">DIY parts market radar</p>
          <h2>Peer repair and retail parts intelligence</h2>
          <p>Auto-curated from peer repair videos, repair blogs, phone hardware news, and demand signals for iPhone, Samsung, Pixel, Huawei, Xiaomi parts, tools, and DIY repair kits.</p>
          <div class="news-status"><span class="status-dot fresh"></span>Exported with ${archiveItems.length} archived items.</div>
          <a class="archive-link" href="#news">View all saved intelligence</a>
        </div>
        ${latestMarkup}
      </section>
      <header class="hero">
        <div class="hero-copy">
          <p class="kicker">${text(profile.location)}</p>
          <h1>${text(profile.name)}</h1>
          <h2>${text(profile.title)}</h2>
          <p>${text(profile.bio)}</p>
          <div class="hero-actions">
            <a href="mailto:${url(profile.email)}">Email</a>
            <a href="${url(profile.links.github)}" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <div class="portrait-wrap">
          ${heroImage ? `<img class="hero-photo" src="${url(heroImage)}" alt="">` : '<div class="photo-placeholder"></div>'}
        </div>
      </header>
      <section class="work-section">
        <div class="work-heading"><p class="kicker">Repair capability</p><h2>Services and cases</h2></div>
        <div class="work-grid">${projects}</div>
      </section>
      <section id="news" class="archive-page">
        <div class="archive-header"><div><p class="kicker">News list</p><h1>Latest phone repair news</h1></div></div>
        <div class="archive-list">${archiveMarkup}</div>
      </section>
    </main>
  </body>
</html>`;
}

function staticCss() {
  return `
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--paper); }
    a { color: inherit; text-decoration: none; }
    .site-preview { min-height: 100vh; }
  `;
}

createRoot(document.getElementById('root')).render(<App />);
