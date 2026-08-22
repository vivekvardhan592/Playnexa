import React, { useState, useEffect } from 'react';
import { getCommunityPosts } from '../../services/api';
import { Flame, Trophy, Heart, MessageSquare, Send, CheckCircle2, Plus } from 'lucide-react';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');

  useEffect(() => {
    async function loadPosts() {
      const data = await getCommunityPosts();
      setPosts(data);
    }
    loadPosts();
  }, []);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPostObj = {
      id: Date.now(),
      author: { name: 'Vivek Kumar', avatar: '/athlete_rahul.jpg' },
      time: 'Just now',
      type: 'Achievement 🏆',
      content: newPostText.trim(),
      reactions: { fire: 1, trophy: 1, heart: 1 },
      commentsCount: 0,
      comments: [],
    };

    setPosts([newPostObj, ...posts]);
    setNewPostText('');
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
          Active Sports <span className="text-gradient-emerald">Community Feed</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Share tournament wins, 10K running milestones, and game updates with nearby athletes.
        </p>
      </div>

      {/* Share Update Input Box */}
      <form onSubmit={handleCreatePost} className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          rows={2}
          placeholder="Share your latest match victory, running PB, or open match spot..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:border-emerald-400 focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Tag:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
              Achievement 🏆
            </span>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
            <span>Post Update</span>
          </button>
        </div>
      </form>

      {/* 3-Column Side-by-Side Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author?.avatar || '/athlete_rahul.jpg'}
                    alt={post.author?.name || post.author}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white">{post.author?.name || post.author}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{post.time}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-400 text-[10px] font-mono border border-slate-800">
                  {post.type}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed my-2">
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
                  <span>{post.reactions?.fire || 0}</span>
                </button>

                <button
                  onClick={() => handleReaction(post.id, 'trophy')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-yellow-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{post.reactions?.trophy || 0}</span>
                </button>

                <button
                  onClick={() => handleReaction(post.id, 'heart')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-pink-400 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{post.reactions?.heart || 0}</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-slate-400" />
                {post.commentsCount || 0} Comments
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
