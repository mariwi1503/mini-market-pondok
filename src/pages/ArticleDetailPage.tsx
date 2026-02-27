import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, User as UserIcon, Share2, Bookmark } from 'lucide-react';
import { getArticleBySlug, articles } from '@/data/articles';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = slug ? getArticleBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Artikel tidak ditemukan</p>
          <Link to="/articles" className="text-[#1B4332] font-semibold">Kembali ke Artikel</Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back bar */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 hover:text-[#1B4332] transition">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <Bookmark size={18} />
            </button>
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero image */}
        <div className="aspect-video md:aspect-[21/9] overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="px-4 py-6">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-[#1B4332] bg-[#E8F5E9] px-3 py-1 rounded-full">{article.category}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} /> {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">{article.title}</h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#1B4332] flex items-center justify-center">
              <UserIcon size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{article.author}</p>
              <p className="text-xs text-gray-400">{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {article.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={i} className="text-lg font-bold text-gray-800 mt-6 mb-2">{paragraph.replace(/\*\*/g, '')}</h3>;
              }
              if (paragraph.includes('**')) {
                const parts = paragraph.split('**');
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">
                    {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-800">{part}</strong> : part)}
                  </p>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-1 mb-4 text-gray-600">
                    {paragraph.split('\n').map((line, j) => (
                      <li key={j}>{line.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          {/* Related */}
          {relatedArticles.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Artikel Terkait</h2>
              <div className="space-y-3">
                {relatedArticles.map(a => (
                  <Link
                    key={a.id}
                    to={`/article/${a.slug}`}
                    className="flex gap-4 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition group"
                  >
                    <img src={a.image} alt={a.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-semibold text-[#1B4332] bg-[#E8F5E9] px-2 py-0.5 rounded-full">{a.category}</span>
                      <h3 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2 group-hover:text-[#1B4332] transition">{a.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
