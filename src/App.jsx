import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  TrendingUp, 
  Star, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Languages,
  Heart,
  X,
  Sparkles,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

// Utility for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

// Custom Github Icon for 2026 aesthetics
const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const RepoItem = ({ repo, index, isFavorite, onToggleFavorite, onShowReadme }) => {
  const [translatedDesc, setTranslatedDesc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (!repo.description) return;
      setLoading(true);
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(repo.description)}`);
        const data = await res.json();
        setTranslatedDesc(data[0].map(x => x[0]).join(''));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    translate();
  }, [repo.description]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group glass-panel rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent p-6 hover:border-brand-primary/40 hover:bg-white/[0.04] transition-all flex flex-col h-full relative"
    >
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img 
            src={repo.owner.avatar_url} 
            alt={repo.owner.login}
            className="w-12 h-12 rounded-2xl border border-white/10 group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-white truncate group-hover:text-brand-primary transition-colors">
              {repo.name}
            </h3>
            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 truncate">
              {repo.owner.login} <span className="w-1 h-1 rounded-full bg-green-500 shrink-0" />
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(repo); }}
          className={cn(
            "p-2.5 rounded-xl border transition-all active:scale-90 shrink-0",
            isFavorite 
              ? "bg-red-500/10 border-red-500/30 text-red-500" 
              : "bg-white/5 border-white/5 text-gray-600 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500")} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {repo.language && (
          <span className="px-2.5 py-1 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-black text-brand-primary uppercase">
            {repo.language}
          </span>
        )}
        {(repo.topics || []).slice(0, 2).map(topic => (
          <span key={topic} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-gray-400">
            {topic}
          </span>
        ))}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
        {loading ? (
          <span className="inline-block w-full h-4 bg-white/5 animate-pulse rounded" />
        ) : (
          translatedDesc || repo.description || "설명이 없습니다."
        )}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-black text-white">{(repo.stargazers_count / 1000).toFixed(1)}k</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">별점</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-black text-white">{(repo.forks_count / 1000).toFixed(1)}k</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">포크</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onShowReadme(repo)}
            className="p-2.5 glass-panel border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
            title="README 보기"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-brand-primary/20 border border-brand-primary/30 rounded-xl text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
            title="저장소 방문"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const RepoDetailsModal = ({ repo, onClose }) => {
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    const fetchReadme = async () => {
      try {
        const res = await fetch(`/api/github?path=repos/${repo.full_name}/readme`);
        const data = await res.json();
        if (data.content) {
          try {
            const decoded = atob(data.content.replace(/\s/g, ''));
            setReadme(decoded);
          } catch (decodeErr) {
            console.error('Decoding error:', decodeErr);
            setReadme("README 데이터를 해독하는 중 오류가 발생했습니다.");
          }
        } else {
          setReadme("README 파일을 찾을 수 없습니다.");
        }
      } catch (err) {
        setReadme("README를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (repo) fetchReadme();
  }, [repo]);

  const generateSummary = async () => {
    if (summary) {
      setSummary(null);
      return;
    }
    setSummarizing(true);
    try {
      // 전략 2: 스마트 파싱 (노이즈 제거 강화)
      let cleanText = readme
        .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
        .replace(/<[^>]*>/g, '')        // HTML 태그 제거
        .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 제거
        .replace(/\[!\[.*?\]\(.*?\)\].*?\)/g, '') // 배지 제거
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')      // 링크 텍스트만 남김
        .replace(/[*#_~`]/g, '')        // 마크다운 기호 제거
        .trim()
        .slice(0, 1500); // 넉넉하게 추출하여 요약 품질 향상
      
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(cleanText)}`);
      const data = await res.json();
      setSummary(data[0].map(x => x[0]).join(''));
    } catch (err) {
      setSummary("요약을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-4xl max-h-[85vh] glass-panel rounded-3xl border border-white/10 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <GithubIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">{repo.name}</h2>
              <p className="text-xs text-gray-500 mt-1">{repo.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateSummary}
              disabled={summarizing || loading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                summary 
                  ? "bg-brand-primary text-white" 
                  : "glass-panel border-white/10 text-gray-400 hover:text-white"
              )}
            >
              <Sparkles className={cn("w-4 h-4", summarizing && "animate-spin")} />
              <span>{summary ? "Show Full README" : "Smart AI Summary"}</span>
            </button>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 glass-panel border border-white/10 rounded-xl text-gray-400 hover:text-brand-primary hover:border-brand-primary/50 transition-all"
              title="GitHub 저장소 방문"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
            </div>
          ) : summary ? (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                <div className="flex items-center gap-2 text-brand-primary mb-4">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">AI Smart Summary (Korean)</span>
                </div>
                <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 italic">위 요약은 README의 상단 섹션을 기반으로 자동 생성되었습니다.</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-brand max-w-none prose-img:rounded-xl prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const StatsSection = ({ repos }) => {
  if (!repos.length) return null;

  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 p-6 glass-panel rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-primary/20 rounded-lg text-brand-primary">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Tech Stack Insights</h3>
      </div>
      <div className="flex flex-wrap gap-6">
        {sortedLangs.map(([lang, count]) => {
          const percentage = Math.round((count / repos.length) * 100);
          return (
            <div key={lang} className="flex-1 min-w-[120px] space-y-2">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                <span>{lang}</span>
                <span className="text-brand-primary">{percentage}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const RisingRepoCard = ({ repo, onShowReadme, index }) => {
  const [translatedDesc, setTranslatedDesc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (!repo.description) return;
      setLoading(true);
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(repo.description)}`);
        const data = await res.json();
        setTranslatedDesc(data[0].map(x => x[0]).join(''));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    translate();
  }, [repo.description]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onShowReadme(repo)}
      className="min-w-[300px] p-5 glass-panel rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-orange-500/30 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-12 h-12 text-orange-500" />
      </div>
      <div className="space-y-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <h4 className="text-sm font-bold text-white truncate pr-8">{repo.name}</h4>
        </div>
        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed h-8">
          {loading ? (
            <span className="inline-block w-full h-2 bg-white/5 animate-pulse rounded" />
          ) : (
            translatedDesc || repo.description || "No description provided."
          )}
        </p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
            <span className="text-xs font-black text-white">{repo.stargazers_count}</span>
          </div>
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{repo.language || 'Misc'}</span>
        </div>
      </div>
    </motion.div>
  );
};

const RisingNowSection = ({ repos, loading, onShowReadme }) => {
  if (!loading && !repos.length) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          Rising Now <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded">HOT</span>
        </h3>
        <p className="text-[10px] text-gray-500 font-bold ml-auto uppercase tracking-wider">Created in the last 7 days</p>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="min-w-[280px] h-32 glass-panel rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          ))
        ) : (
          repos.map((repo, i) => (
            <RisingRepoCard 
              key={repo.id} 
              repo={repo} 
              index={i} 
              onShowReadme={onShowReadme} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [query, setQuery] = useState('');
  // ... (rest of the state)
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rateLimit, setRateLimit] = useState({ limit: 0, remaining: 0, reset: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('gittrend-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to load favorites:', err);
      return [];
    }
  });
  const [risingRepos, setRisingRepos] = useState([]);
  const [loadingRising, setLoadingRising] = useState(false);
  const [selectedRepoForModal, setSelectedRepoForModal] = useState(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem('gittrend-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchRisingRepos = async () => {
    // 1. 캐시 확인 (5분 유효)
    const cachedData = sessionStorage.getItem('gittrend-rising-cache');
    const cachedTime = sessionStorage.getItem('gittrend-rising-time');
    if (cachedData && cachedTime && Date.now() - parseInt(cachedTime) < 5 * 60 * 1000) {
      setRisingRepos(JSON.parse(cachedData));
      return;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];
    
    setLoadingRising(true);
    try {
      const response = await fetch(
        `/api/github?path=search/repositories&q=created:>${dateStr}&sort=stars&order=desc&per_page=5`
      );
      const data = await response.json();
      const items = data.items || [];
      setRisingRepos(items);
      
      // 2. 캐시 저장
      sessionStorage.setItem('gittrend-rising-cache', JSON.stringify(items));
      sessionStorage.setItem('gittrend-rising-time', Date.now().toString());
      
      // 할당량 업데이트 (프록시 데이터 사용)
      if (data.ratelimit) {
        setRateLimit({ 
          limit: parseInt(data.ratelimit.limit), 
          remaining: parseInt(data.ratelimit.remaining), 
          reset: parseInt(data.ratelimit.reset) * 1000 
        });
      }
    } catch (err) {
      console.error('Failed to fetch rising repos:', err);
    } finally {
      setLoadingRising(false);
    }
  };

  useEffect(() => {
    fetchRisingRepos();
  }, []);

  const categories = [
    { name: 'All', query: '' },
    { name: 'AI & LLM', query: 'AI OR LLM OR "Large Language Model"' },
    { name: 'VibeCoding', query: 'VibeCoding OR "Vibe Coding" OR "Agentic AI" OR "Agentic Workflow"' },
    { name: 'Claude & Codex', query: '"Claude Code" OR Codex OR "Claude AI"' },
    { name: '이미지 생성', query: '"Image Generation" OR Diffusion OR Midjourney OR Dall-E' },
    { name: 'AI 모델', query: '"AI Model" OR "Pretrained Model" OR Llama OR Mistral' },
    { name: 'Agents', query: '"AI Agent" OR "Autonomous Agent" OR "Agentic AI"' }
  ];

  const updateRateLimit = (headers) => {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    if (limit && remaining) {
      setRateLimit({
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset) * 1000
      });
    }
  };

  const fetchRepos = async (keyword, pageNum = 1, category = selectedCategory) => {
    if (showFavoritesOnly && !keyword) return;

    const cacheKey = `gittrend-repos-${category}-${keyword || 'default'}-p${pageNum}`;
    const cacheTimeKey = `${cacheKey}-time`;
    const cached = sessionStorage.getItem(cacheKey);
    const time = sessionStorage.getItem(cacheTimeKey);

    if (cached && time && Date.now() - parseInt(time) < 5 * 60 * 1000) {
      const data = JSON.parse(cached);
      setRepos(data.items);
      setTotalCount(data.total_count);
      setPage(pageNum);
      return;
    }
    
    let searchQuery = '';
    const catObj = categories.find(c => c.name === category);
    const categoryQuery = catObj?.query || '';

    if (keyword && categoryQuery) {
      searchQuery = `${keyword} ${categoryQuery}`;
    } else if (keyword) {
      searchQuery = keyword;
    } else if (categoryQuery) {
      searchQuery = categoryQuery;
    } else {
      searchQuery = 'stars:>1000';
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/github?path=search/repositories&q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=12&page=${pageNum}`
      );
      
      const data = await response.json();

      if (response.ok) {
        // 데이터 캐싱
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        sessionStorage.setItem(cacheTimeKey, Date.now().toString());

        // 할당량 업데이트
        if (data.ratelimit) {
          setRateLimit({ 
            limit: parseInt(data.ratelimit.limit), 
            remaining: parseInt(data.ratelimit.remaining), 
            reset: parseInt(data.ratelimit.reset) * 1000 
          });
        }

        if (document.startViewTransition) {
          document.startViewTransition(() => {
            setRepos(data.items);
            setTotalCount(data.total_count);
            setPage(pageNum);
          });
        } else {
          setRepos(data.items);
          setTotalCount(data.total_count);
          setPage(pageNum);
        }
      } else {
        throw new Error(data.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      }
      
      if (keyword) {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showFavoritesOnly) {
      fetchRepos('', 1);
    }
  }, [showFavoritesOnly]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowFavoritesOnly(false);
    setSelectedCategory('All');
    fetchRepos(query, 1, 'All');
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || loading) return;
    fetchRepos(query, newPage, selectedCategory);
  };

  const toggleFavorite = (repo) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === repo.id);
      if (exists) {
        return prev.filter(f => f.id !== repo.id);
      }
      return [...prev, repo];
    });
  };

  const currentRepos = showFavoritesOnly ? favorites : repos;

  return (
    <div className="min-h-screen px-4 py-12 md:px-12 lg:px-24 max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="text-center mb-16 space-y-8">
        <div className="flex flex-wrap justify-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-brand-primary text-xs font-bold tracking-widest uppercase"
          >
            <TrendingUp className="w-4 h-4" />
            <span>GitTrend Insight 2026</span>
          </motion.div>

          {rateLimit.limit > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[10px] font-bold tracking-widest uppercase transition-colors",
                rateLimit.remaining < 5 ? "text-red-400 border-red-500/30" : "text-green-400"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full animate-pulse", rateLimit.remaining < 5 ? "bg-red-400" : "bg-green-400")} />
              <span>Quota: {rateLimit.remaining}/{rateLimit.limit}</span>
              <span className="ml-1 pl-2 border-l border-white/10 text-gray-500 lowercase">
                {rateLimit.reset > Date.now() 
                  ? `resets at ${new Date(rateLimit.reset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'resetting soon...'}
              </span>
            </motion.div>
          )}

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold tracking-widest uppercase transition-all",
              showFavoritesOnly 
                ? "bg-red-500/10 border-red-500/30 text-red-500" 
                : "glass-panel border-white/10 text-gray-400 hover:text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", showFavoritesOnly && "fill-red-500")} />
            <span>Saved: {favorites.length}</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Code</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            GitHub의 방대한 생태계에서 가장 영향력 있는 프로젝트를 한국어로 만나보세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-brand-primary/20 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center p-2 glass-panel rounded-2xl border border-white/10 focus-within:border-brand-primary/50 transition-all shadow-2xl">
            <Search className="w-6 h-6 text-gray-500 ml-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요 (예: AI, React, Blockchain)..."
              className="flex-1 bg-transparent border-none text-white px-4 py-3 outline-none placeholder:text-gray-600 font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-primary hover:bg-brand-primary/80 text-white px-8 py-3 rounded-xl font-black text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "SEARCHING..." : "검색하기"}
            </button>
          </div>
        </form>

        <div className="flex justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setShowFavoritesOnly(false);
                setQuery('');
                setSelectedCategory(cat.name);
                fetchRepos('', 1, cat.name);
              }}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
                !showFavoritesOnly && selectedCategory === cat.name 
                  ? "bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "glass-panel border-white/5 text-gray-500 hover:text-white hover:border-white/10"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Trends & Stats Section */}
      {!showFavoritesOnly && (
        <>
          <RisingNowSection 
            repos={risingRepos} 
            loading={loadingRising} 
            onShowReadme={setSelectedRepoForModal} 
          />
          <StatsSection repos={repos} />
        </>
      )}

      {/* Results Section */}
      <main>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-block p-6 glass-panel rounded-2xl border-red-500/20">
                <p className="text-red-400 font-bold">{error}</p>
              </div>
            </motion.div>
          )}

          {!loading && currentRepos.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-lg font-bold text-white whitespace-nowrap">
                  {showFavoritesOnly 
                    ? `저장된 프로젝트` 
                    : (query ? `'${query}' 검색 결과` : `${selectedCategory} 인기 프로젝트`)} 
                  <span className="text-brand-primary ml-2">{showFavoritesOnly ? favorites.length : totalCount.toLocaleString()}</span>건
                </h2>
                {!showFavoritesOnly && (
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-tighter">
                    Page {page} of {Math.ceil(Math.min(totalCount, 1000) / 10)}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRepos.map((repo, index) => (
                  <RepoItem 
                    key={repo.id} 
                    repo={repo} 
                    index={index} 
                    isFavorite={favorites.some(f => f.id === repo.id)}
                    onToggleFavorite={toggleFavorite}
                    onShowReadme={setSelectedRepoForModal}
                  />
                ))}
              </div>

              {!showFavoritesOnly && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                    className="p-3 glass-panel rounded-xl disabled:opacity-20 hover:text-brand-primary transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {[...Array(Math.min(5, Math.ceil(Math.min(totalCount, 1000) / 10)))].map((_, i) => {
                      const totalPages = Math.ceil(Math.min(totalCount, 1000) / 10);
                      const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      if (pageNum <= 0 || pageNum > totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-bold transition-all",
                            page === pageNum ? "bg-brand-primary text-white" : "glass-panel text-gray-400 hover:text-white"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page * 10 >= Math.min(totalCount, 1000) || loading}
                    className="p-3 glass-panel rounded-xl disabled:opacity-20 hover:text-brand-primary transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : !loading && !error && (
            <div className="text-center py-32">
              <div className="opacity-10 flex flex-col items-center gap-6">
                <GithubIcon className="w-24 h-24" />
                <p className="text-2xl font-black tracking-tight">
                  {showFavoritesOnly ? "저장된 프로젝트가 없습니다." : "결과를 찾을 수 없습니다."}
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-32 pb-12 text-center space-y-4 border-t border-white/5 pt-12">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
          © 2026 GITTREND INSIGHT. POWERED BY GEMINI 3 ULTRA.
        </p>
        <div className="flex justify-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <a href="https://litt.ly/aklabs" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">AKLABS</a>
          <a href="#" className="hover:text-brand-primary transition-colors">DOCUMENTATION</a>
        </div>
      </footer>

      <AnimatePresence>
        {selectedRepoForModal && (
          <RepoDetailsModal 
            repo={selectedRepoForModal} 
            onClose={() => setSelectedRepoForModal(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
