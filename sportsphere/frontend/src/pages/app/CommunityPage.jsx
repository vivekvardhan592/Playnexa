import React, { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Flame, Trophy, Heart, MessageSquare, Send, CheckCircle2, Plus, Sparkles } from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      const data = await getCommunityPosts();
      setPosts(data);
    }
    loadPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const contentText = newPostText.trim();
    setNewPostText('');

    try {
      // Call backend API
      const serverPost = await createCommunityPost(contentText);

      const newPostObj = {
        id: serverPost?.id || Date.now(),
        author: {
          name: user?.name || 'Vivek Kumar',
          avatar: user?.avatar || '/athlete_rahul.jpg',
        },
        time: 'Just now',
        type: 'Achievement 🏆',
        content: contentText,
        reactions: { fire: 1, trophy: 1, heart: 1 },
        commentsCount: 0,
        comments: [],
      };

      setPosts((prev) => [newPostObj, ...prev]);
      setPostedSuccess(true);
      setTimeout(() => setPostedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to post update:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = (postId, type) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [type]: (p.reactions[type] || 0) + 1,
          },
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative z-0">
      
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
          Active Sports <span className="text-gradient-emerald">Community Feed</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Share tournament wins, 10K running milestones, and game updates with nearby athletes.
        </p>
      </div>

      {postedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
          <span>Your update has been published live to the community feed!</span>
        </div>
      )}

      {/* Share Update Input Box */}
      <form onSubmit={handleCreatePost} className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 relative z-10 shadow-xl">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          rows={3}
          placeholder="Share your latest match victory, running PB, or open match spot..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none resize-none transition-colors"
        />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Tag:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
              Achievement 🏆
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newPostText.trim()}
            className={`px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              !newPostText.trim() || isSubmitting
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 shadow-lg shadow-emerald-500/25'
            }`}
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span>{isSubmitting ? 'Publishing...' : 'Post Update'}</span>
          </button>
        </div>
      </form>

      {/* 3-Column Side-by-Side Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author?.avatar || post.author_avatar || '/athlete_rahul.jpg'}
                    alt={post.author?.name || post.author_name || 'Athlete'}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white">{post.author?.name || post.author_name || 'Athlete'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {post.time || (post.created_at ? new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 text-[10px] font-mono border border-slate-800">
                  {post.type || 'Achievement 🏆'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2">
                {post.content}
              </p>
            </div>

            {/* Reaction Counters */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReaction(post.id, 'fire')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{post.reactions?.fire || post.likes_count || 1}</span>
                </button>

                <button
                  onClick={() => handleReaction(post.id, 'trophy')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-yellow-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{post.reactions?.trophy || 1}</span>
                </button>

                <button
                  onClick={() => handleReaction(post.id, 'heart')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-pink-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{post.reactions?.heart || 1}</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-slate-400" />
                {post.commentsCount || post.comments_count || 0} Comments
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
