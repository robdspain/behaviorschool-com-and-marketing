'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface SEOPanelProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  onSlugChange: (slug: string) => void;
  onExcerptChange: (excerpt: string) => void;
}

export function SEOPanel({
  title,
  slug,
  excerpt,
  content,
  onSlugChange,
  onExcerptChange,
}: SEOPanelProps) {
  const [readabilityScore, setReadabilityScore] = useState<{
    score: number;
    grade: string;
    issues: string[];
  }>({ score: 0, grade: 'N/A', issues: [] });

  useEffect(() => {
    calculateReadability();
  }, [content, title]);

  const calculateReadability = () => {
    if (!content) {
      setReadabilityScore({ score: 0, grade: 'N/A', issues: [] });
      return;
    }

    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

    const issues: string[] = [];

    // Flesch Reading Ease
    const avgWordsPerSentence = words.length / (sentences.length || 1);
    const avgSyllablesPerWord = syllables / (words.length || 1);
    const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    let grade = 'Excellent';
    if (fleschScore < 30) {
      grade = 'Very Difficult';
      issues.push('Content is very difficult to read. Consider simplifying.');
    } else if (fleschScore < 50) {
      grade = 'Difficult';
      issues.push('Content is somewhat difficult. Try shorter sentences.');
    } else if (fleschScore < 60) {
      grade = 'Fairly Difficult';
    } else if (fleschScore < 70) {
      grade = 'Standard';
    } else if (fleschScore < 80) {
      grade = 'Fairly Easy';
    } else if (fleschScore < 90) {
      grade = 'Easy';
    } else {
      grade = 'Very Easy';
    }

    // Check for common SEO issues
    if (title.length < 30) {
      issues.push('Title is too short (< 30 characters)');
    }
    if (title.length > 60) {
      issues.push('Title is too long (> 60 characters)');
    }
    if (excerpt.length < 120) {
      issues.push('Meta description is too short (< 120 characters)');
    }
    if (excerpt.length > 160) {
      issues.push('Meta description is too long (> 160 characters)');
    }
    if (words.length < 300) {
      issues.push('Content is short (< 300 words). Consider adding more detail.');
    }
    if (avgWordsPerSentence > 25) {
      issues.push('Average sentence length is high. Consider breaking up long sentences.');
    }

    setReadabilityScore({
      score: Math.round(fleschScore),
      grade,
      issues,
    });
  };

  const countSyllables = (word: string): number => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    onSlugChange(newSlug);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* URL Slug */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">URL Slug</label>
          <button
            onClick={generateSlug}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Generate from title
          </button>
        </div>
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          placeholder="url-slug-here"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
        />
        <p className="text-xs text-slate-500 mt-1">
          https://behaviorschool.com/blog/{slug || 'your-post-url'}
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Meta Description</label>
          <span
            className={`text-xs ${
              excerpt.length >= 120 && excerpt.length <= 160
                ? 'text-green-600'
                : 'text-slate-500'
            }`}
          >
            {excerpt.length}/160
          </span>
        </div>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Brief description for search engines and social media..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        />
        <p className="text-xs text-slate-500 mt-1">
          This appears in search results and social media shares.
        </p>
      </div>

      {/* Search Preview */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Search Engine Preview
        </label>
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="text-xs text-slate-600 mb-1">behaviorschool.com › blog › {slug}</div>
          <div className="text-lg text-blue-600 mb-1 font-medium line-clamp-1">{title || 'Post Title'}</div>
          <div className="text-sm text-slate-700 line-clamp-2">
            {excerpt || 'Your meta description will appear here...'}
          </div>
        </div>
      </div>

      {/* Readability Score */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Content Readability
        </label>
        <div
          className={`border-2 rounded-lg p-4 ${getScoreBgColor(readabilityScore.score)}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold">{readabilityScore.score}</div>
              <div className={`text-sm font-medium ${getScoreColor(readabilityScore.score)}`}>
                {readabilityScore.grade}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-600">Flesch Reading Ease</div>
              <div className="text-xs text-slate-500 mt-1">
                {readabilityScore.score >= 70 && '70-100: Easy to read'}
                {readabilityScore.score >= 50 && readabilityScore.score < 70 && '50-69: Fairly difficult'}
                {readabilityScore.score < 50 && '0-49: Difficult'}
              </div>
            </div>
          </div>

          {readabilityScore.issues.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Suggestions
              </div>
              {readabilityScore.issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs text-slate-600"
                >
                  {issue.includes('short') || issue.includes('long') ? (
                    <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Info className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}

          {readabilityScore.issues.length === 0 && readabilityScore.score > 0 && (
            <div className="flex items-center gap-2 text-xs text-green-600">
              <CheckCircle className="w-3 h-3" />
              <span>Your content looks great! No major SEO issues detected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

