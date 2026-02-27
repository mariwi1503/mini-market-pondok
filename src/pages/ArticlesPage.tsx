import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User as UserIcon } from 'lucide-react';
import { articles } from '@/data/articles';

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const articleCategories = ['Semua', ...new Set(articles.map(a => a.category))];

  const filtered = activeCategory === 'Semua'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Artikel</h1>
        <p className="text-sm text-gray-500 mb-4">Bacaan bermanfaat untuk kehidupan sehari-hari</p>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {articleCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeCategory === cat ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {filtered.length > 0 && (
          <Link
            to={`/article/${filtered[0].slug}`}
            className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-6 group"
          >
            <div className="aspect-video md:aspect-[21/9] overflow-hidden">
              <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-semibold text-[#1B4332] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">{filtered[0].category}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {filtered[0].readTime}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-[#1B4332] transition mb-2">{filtered[0].title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{filtered[0].excerpt}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-[#1B4332] flex items-center justify-center">
                  <UserIcon size={12} className="text-white" />
                </div>
                <span className="text-xs text-gray-500">{filtered[0].author}</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">{new Date(filtered[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.slice(1).map(article => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <img src={article.image} alt={article.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-[#1B4332] bg-[#E8F5E9] px-2 py-0.5 rounded-full">{article.category}</span>
                  <span className="text-[10px] text-gray-400">{article.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#1B4332] transition">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
