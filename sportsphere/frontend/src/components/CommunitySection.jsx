import React, { useState } from 'react';
import { Users, Flame, Trophy, Heart, MessageSquare, Share2, Send, CheckCircle2, Sparkles } from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Rahul Sharma',
    avatar: '/athlete_rahul.jpg',
    badge: 'Badminton',
    time: '2 hours ago',
    type: 'Tournament Victory 🏆',
    content: 'Won the Gachibowli Open Badminton Doubles Silver Medal! 🥈 Shoutout to Arjun for pairing up through SportSphere!',
    reactions: { fire: 24, trophy: 18, heart: 32 },
    commentsCount: 6,
    userReacted: { fire: false, trophy: false, heart: false },
    comments: [
      { name: 'Priya M.', text: 'Super match! That 3rd set comeback was insane! 🔥' },
      { name: 'Arjun K.', text: 'Great team synergy bro, let’s defend the title next month!' },
    ],
  },
  {
    id: 2,
    author: 'Priya M.',
    avatar: '/athlete_priya.jpg',
    badge: 'Running',
    time: '4 hours ago',
    type: 'Achievement 🏃‍♀️',
    content: 'Completed my first 10K run around KBR Park in 48:15! Thanks to the morning running pod for setting the pace! 🏃‍♀️💨',
    reactions: { fire: 42, trophy: 12, heart: 55 },
    commentsCount: 9,
    userReacted: { fire: false, trophy: false, heart: false },
    comments: [
      { name: 'Vivek K.', text: 'Pace was on point! Next stop: Hyderabad Half Marathon!' },
    ],
  },
  {
    id: 3,
    author: 'Hyderabad FC',
    avatar: '/athlete_arjun.jpg',
    badge: 'Football ⚽',
    time: '6 hours ago',
    type: 'Open Match Spot',
    content: 'Weekend 7v7 Turf Football — Need 2 midfielders! Tomorrow 7:00 AM @ AstroTurf Hitec. Intermediate level.',
    isMatchSpot: true,
    spotsLeft: 2,
    reactions: { fire: 19, trophy: 5, heart: 28 },
    commentsCount: 4,
    userReacted: { fire: false, trophy: false, heart: false },
    comments: [
      { name: 'Rahul S.', text: 'I can join as winger if spot is free!' },
    ],
  },
];

export default function CommunitySection({ onOpenChatModal }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [commentInputs, setCommentInputs] = useState({});

  const handleToggleReaction = (postId, type) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const currentStatus = post.userReacted[type];
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [type]: currentStatus ? post.reactions[type] - 1 : post.reactions[type] + 1,
          },
          userReacted: {
            ...post.userReacted,
            [type]: !currentStatus,
          },
        };
      })
    );
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || text.trim() === '') return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, { name: 'You (Vivek)', text: text.trim() }],
        };
      })
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <section id="community" className="py-10 relative bg-gradient-to-b from-[#080a0f] via-[#0c101a] to-[#080a0f] overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Sports Feed</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            More than finding a game.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            <span className="text-gradient-emerald font-semibold">Come for the game. Stay for the community.</span> Celebrate tournament wins, share run logs, and coordinate weekend matches.
          </p>
        </div>

        {/* Social Feed Container — Side-by-Side Grid Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-panel-interactive rounded-3xl p-6 border border-slate-800 flex flex-col justify-between h-full transition-all duration-300"
            >
              <div>
                {/* Post Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-heading font-extrabold text-base text-white">
                          {post.author}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400">
                          {post.badge}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{post.time}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800 shrink-0">
                    {post.type}
                  </span>
                </div>

                {/* Post Content */}
                <p className="text-slate-200 text-sm leading-relaxed my-3">
                  {post.content}
                </p>

                {/* Match Spot Callout Button */}
                {post.isMatchSpot && (
                  <div className="my-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-200">
                      <span className="font-bold text-emerald-400">Match Status: </span>
                      <span>{post.spotsLeft} midfielder spots left</span>
                    </div>
                    <button
                      onClick={() => onOpenChatModal({ name: post.author, sport: 'Football' })}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shrink-0 cursor-pointer"
                    >
                      Join Match
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Reaction & Comment Counters */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => handleToggleReaction(post.id, 'fire')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      post.userReacted.fire
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 scale-105'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>{post.reactions.fire}</span>
                  </button>

                  <button
                    onClick={() => handleToggleReaction(post.id, 'trophy')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      post.userReacted.trophy
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 scale-105'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>{post.reactions.trophy}</span>
                  </button>

                  <button
                    onClick={() => handleToggleReaction(post.id, 'heart')}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      post.userReacted.heart
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 scale-105'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>{post.reactions.heart}</span>
                  </button>
                </div>

                <div className="text-slate-400 font-mono flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2">
                {post.comments.map((comment, cIdx) => (
                  <div key={cIdx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-white mr-2">{comment.name}:</span>
                    <span>{comment.text}</span>
                  </div>
                ))}

                {/* Comment Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a comment or congratulate..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
