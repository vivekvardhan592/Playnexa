// Server-Side Input Validation & Sanitization Middleware

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(422).json({ success: false, message: 'Validation Error: Name must be at least 2 characters.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(422).json({ success: false, message: 'Validation Error: Invalid email format.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(422).json({ success: false, message: 'Validation Error: Password must be at least 8 characters.' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ success: false, message: 'Validation Error: Email and password are required.' });
  }

  next();
};

export const validateMatchCreation = (req, res, next) => {
  const { title, sport, locationName, maxPlayers } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(422).json({ success: false, message: 'Validation Error: Title must be at least 3 characters.' });
  }

  if (!sport || typeof sport !== 'string') {
    return res.status(422).json({ success: false, message: 'Validation Error: Sport category is required.' });
  }

  if (!locationName || typeof locationName !== 'string') {
    return res.status(422).json({ success: false, message: 'Validation Error: Location name is required.' });
  }

  if (maxPlayers && (typeof maxPlayers !== 'number' || maxPlayers < 2 || maxPlayers > 100)) {
    return res.status(422).json({ success: false, message: 'Validation Error: Player capacity must be between 2 and 100.' });
  }

  next();
};

export const validateMessageSend = (req, res, next) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(422).json({ success: false, message: 'Validation Error: Message text cannot be empty.' });
  }

  if (text.length > 2000) {
    return res.status(422).json({ success: false, message: 'Validation Error: Message length exceeds maximum limit of 2000 characters.' });
  }

  next();
};
