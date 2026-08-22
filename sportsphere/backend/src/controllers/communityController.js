// Community Controller — Handles Social Feed, Achievements & Reactions
let samplePosts = [
  {
    id: 1,
    author: 'Rahul Sharma',
    avatar: '/athlete_rahul.jpg',
    badge: 'Badminton',
    time: '2 hours ago',
    type: 'Tournament Victory 🏆',
    content: 'Won the Gachibowli Open Badminton Doubles Silver Medal! 🥈 Shoutout to Arjun for pairing up through SportSphere!',
    reactions: { fire: 24, trophy: 18, heart: 32 },
    commentsCount: 2,
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
    commentsCount: 1,
    comments: [{ name: 'Vivek K.', text: 'Pace was on point! Next stop: Hyderabad Half Marathon!' }],
  },
];

export const getCommunityPosts = async (req, res) => {
  res.json({ success: true, count: samplePosts.length, posts: samplePosts });
};

export const createPost = async (req, res) => {
  try {
    const { content, sportBadge, postType } = req.body;
    const newPost = {
      id: Date.now(),
      author: 'Vivek Kumar',
      avatar: '/athlete_rahul.jpg',
      badge: sportBadge || 'General',
      time: 'Just now',
      type: postType || 'Update ⚡',
      content,
      reactions: { fire: 0, trophy: 0, heart: 0 },
      commentsCount: 0,
      comments: [],
    };

    samplePosts.unshift(newPost);
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePostReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type } = req.body; // 'fire', 'trophy', 'heart'

    const post = samplePosts.find((p) => p.id === Number(postId));
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.reactions[type] !== undefined) {
      post.reactions[type] += 1;
    }

    res.json({ success: true, reactions: post.reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, authorName } = req.body;

    const post = samplePosts.find((p) => p.id === Number(postId));
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const newComment = { name: authorName || 'Vivek K.', text };
    post.comments.push(newComment);
    post.commentsCount += 1;

    res.status(201).json({ success: true, comment: newComment, commentsCount: post.commentsCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
