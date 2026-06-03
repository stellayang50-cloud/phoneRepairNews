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
const languageStorageKey = 'site-language';

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
    savedIntelligence: 'Saved intelligence',
    allFetchedNews: 'All fetched repair news',
    archiveDescription: 'Sorted by the time each item was most recently fetched by this site.',
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
  heroImage: '',
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

function currentPageFromHash() {
  return window.location.hash === '#news' ? 'news' : 'home';
}

function App() {
  const [profile, setProfile] = useState(readStoredProfile);
  const [language, setLanguage] = useState(() => localStorage.getItem(languageStorageKey) || 'en');
  const [page, setPage] = useState(currentPageFromHash);
  const [newsHistory, setNewsHistory] = useState(readStoredNewsHistory);
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
    const handleHashChange = () => setPage(currentPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let isCurrent = true;

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
      <section className="editor-pane" aria-label="Website editor">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Live editor</p>
            <h1>{translations[language].editorTitle}</h1>
          </div>
          <div className="editor-actions">
            <button className="language-button" onClick={toggleLanguage}>
              {translations[language].switchLanguage}
            </button>
            <button className="icon-button" onClick={resetProfile} aria-label="Reset">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="field-grid">
          <TextInput label={translations[language].name} value={profile.name} onChange={(value) => updateField('name', value)} />
          <TextInput label={translations[language].positioning} value={profile.title} onChange={(value) => updateField('title', value)} />
          <TextInput label={translations[language].location} value={profile.location} onChange={(value) => updateField('location', value)} />
          <TextInput label={translations[language].email} value={profile.email} onChange={(value) => updateField('email', value)} />
        </div>

        <label className="field full">
          <span>{translations[language].intro}</span>
          <textarea value={profile.bio} onChange={(event) => updateField('bio', event.target.value)} rows={5} />
        </label>

        <div className="upload-row">
          <ImageUpload icon={<Camera size={18} />} label={translations[language].avatar} image={profile.avatar} onImage={(value) => updateField('avatar', value)} />
          <ImageUpload
            icon={<ImagePlus size={18} />}
            label={translations[language].heroImage}
            image={profile.heroImage}
            onImage={(value) => updateField('heroImage', value)}
          />
        </div>

        <section className="control-section">
          <div className="section-title">
            <Palette size={18} />
            <h2>{translations[language].visualStyle}</h2>
          </div>
          <div className="color-grid">
            <ColorInput label={translations[language].accent} value={profile.accent} onChange={(value) => updateField('accent', value)} />
            <ColorInput label={translations[language].background} value={profile.background} onChange={(value) => updateField('background', value)} />
            <ColorInput label={translations[language].text} value={profile.text} onChange={(value) => updateField('text', value)} />
          </div>
        </section>

        <section className="control-section">
          <div className="section-title">
            <LinkIcon size={18} />
            <h2>{translations[language].links}</h2>
          </div>
          <TextInput label="GitHub" value={profile.links.github} onChange={(value) => updateLink('github', value)} />
          <TextInput label={translations[language].website} value={profile.links.website} onChange={(value) => updateLink('website', value)} />
        </section>

        <section className="control-section">
          <div className="section-title split">
            <div>
              <Sparkles size={18} />
              <h2>{translations[language].services}</h2>
            </div>
            <button className="small-button" onClick={addProject}>
              <Plus size={16} />
              {translations[language].add}
            </button>
          </div>
          <div className="project-editor-list">
            {profile.projects.map((project, index) => (
              <ProjectEditor
                key={`${project.title}-${index}`}
                project={project}
                index={index}
                onChange={updateProject}
                onRemove={removeProject}
                t={translations[language]}
              />
            ))}
          </div>
        </section>

        <button className="export-button" onClick={exportHtml}>
          <Download size={18} />
          {translations[language].exportStaticPage}
        </button>
      </section>

      <section className="preview-pane" aria-label="Live preview">
        <Portfolio profile={profile} news={news} newsHistory={newsHistory} competitorBoard={competitorBoard} page={page} language={language} onLanguageToggle={toggleLanguage} />
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

function Portfolio({ profile, news, newsHistory, competitorBoard, page, language, onLanguageToggle }) {
  const t = translations[language];

  return (
    <div className="site-preview">
      <DigitalClock />
      <nav className="site-nav">
        <a className="brand-link" href="#home">{profile.name}</a>
        <div>
          <button className="nav-language-button" onClick={onLanguageToggle}>{t.switchLanguage}</button>
          <a href="#news">{t.newsArchive}</a>
          <a href={`mailto:${profile.email}`}>
            <Mail size={16} />
            {t.contact}
          </a>
          <a href={profile.links.website} target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            {t.website}
          </a>
        </div>
      </nav>

      {page === 'news' ? (
        <NewsArchive items={newsHistory} currentItems={news.items} t={t} />
      ) : (
        <>
          <IndustryNews news={news} historyCount={newsHistory.length} t={t} />
          <ProfileHero profile={profile} t={t} />
          <CompetitorProductBoard board={competitorBoard} t={t} />
          <WorkSection projects={profile.projects} t={t} />
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

function IndustryNews({ news, historyCount, t }) {
  const latestItems = news.items?.length ? news.items : fallbackNews;
  const mainItem = latestItems[0];
  const sideItems = latestItems.slice(1, 5);

  return (
    <section className="industry-news">
      <div className="news-lead">
        <p className="kicker">{t.marketKicker}</p>
        <h2>{t.marketTitle}</h2>
        <p>{t.marketDescription}</p>
        <div className="news-status">
          <span className={news.status === 'fresh' ? 'status-dot fresh' : 'status-dot'} />
          {news.status === 'fresh'
            ? `${t.latestFetchSaved} ${historyCount} ${t.archivedItems}`
            : news.status === 'loading'
              ? t.syncingSources
              : t.fallbackStories}
        </div>
        <a className="archive-link" href="#news">{t.viewAllIntelligence}</a>
      </div>

      <article className="headline-card">
        <div>
          <span className="source-pill">{mainItem.region} - {mainItem.source}</span>
          <h3>{mainItem.title}</h3>
          <p>{mainItem.summary}</p>
        </div>
        <a href={mainItem.link} target="_blank" rel="noreferrer">
          {t.readSource}
          <ExternalLink size={16} />
        </a>
      </article>

      <div className="news-list">
        {sideItems.map((item) => (
          <a className="news-row" href={item.link} target="_blank" rel="noreferrer" key={`${item.source}-${item.title}`}>
            <span>{item.source}</span>
            <strong>{item.title}</strong>
            <small>
              <CalendarDays size={14} />
              {formatDate(item.lastFetchedAt ?? item.publishedAt)}
            </small>
          </a>
        ))}
      </div>
    </section>
  );
}

function NewsArchive({ items, currentItems, t }) {
  const archiveItems = items.length ? items : currentItems.map((item) => ({ ...item, firstFetchedAt: '', lastFetchedAt: '' }));

  return (
    <section className="archive-page">
      <div className="archive-header">
        <div>
          <p className="kicker">{t.savedIntelligence}</p>
          <h1>{t.allFetchedNews}</h1>
          <p>{t.archiveDescription}</p>
        </div>
        <a className="small-button archive-home" href="#home">{t.backToSite}</a>
      </div>

      <div className="archive-list">
        {archiveItems.map((item) => (
          <article className="archive-item" key={`${item.source}-${item.link}`}>
            <div className="archive-meta">
              <span>{item.source}</span>
              <span>{item.region}</span>
              <span>{t.fetched} {formatDateTime(item.lastFetchedAt)}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
            <div className="archive-actions">
              <small>{t.published} {formatDate(item.publishedAt)} - {t.firstSaved} {formatDateTime(item.firstFetchedAt)}</small>
              <a href={item.link} target="_blank" rel="noreferrer">
                {t.readSource}
                <ExternalLink size={16} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileHero({ profile, t }) {
  return (
    <header className="hero profile-hero">
      <div className="hero-copy">
        <p className="kicker">{profile.location}</p>
        <h2>{profile.name}</h2>
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
        {profile.heroImage ? <img className="hero-photo" src={profile.heroImage} alt="" /> : <div className="photo-placeholder" />}
        <div className="avatar">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <span>{profile.name.slice(0, 1)}</span>}
        </div>
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

function newsKey(item) {
  return item.link || `${item.source}-${item.title}`;
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
        ? `<article class="headline-card"><div><span class="source-pill">${text(item.region)} - ${text(item.source)}</span><h3>${text(item.title)}</h3><p>${text(item.summary)}</p></div><a href="${url(item.link)}" target="_blank" rel="noreferrer">Read source</a></article>`
        : `<a class="news-row" href="${url(item.link)}" target="_blank" rel="noreferrer"><span>${text(item.source)}</span><strong>${text(item.title)}</strong><small>${text(formatDate(item.lastFetchedAt ?? item.publishedAt))}</small></a>`,
    )
    .join('');

  const archiveMarkup = archiveItems
    .map(
      (item) => `
        <article class="archive-item">
          <div class="archive-meta"><span>${text(item.source)}</span><span>${text(item.region)}</span><span>Fetched ${text(formatDateTime(item.lastFetchedAt))}</span></div>
          <h2>${text(item.title)}</h2>
          <p>${text(item.summary)}</p>
          <div class="archive-actions"><small>Published ${text(formatDate(item.publishedAt))}</small><a href="${url(item.link)}" target="_blank" rel="noreferrer">Read source</a></div>
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
        <div>
          <a href="#news">News Archive</a>
          <a href="mailto:${url(profile.email)}">Contact</a>
          <a href="${url(profile.links.website)}" target="_blank" rel="noreferrer">Website</a>
        </div>
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
          ${profile.heroImage ? `<img class="hero-photo" src="${url(profile.heroImage)}" alt="">` : '<div class="photo-placeholder"></div>'}
          <div class="avatar">${profile.avatar ? `<img src="${url(profile.avatar)}" alt="${text(profile.name)}">` : `<span>${text(profile.name.slice(0, 1))}</span>`}</div>
        </div>
      </header>
      <section class="work-section">
        <div class="work-heading"><p class="kicker">Repair capability</p><h2>Services and cases</h2></div>
        <div class="work-grid">${projects}</div>
      </section>
      <section id="news" class="archive-page">
        <div class="archive-header"><div><p class="kicker">Saved intelligence</p><h1>All fetched repair news</h1><p>Sorted by latest fetch time.</p></div></div>
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
