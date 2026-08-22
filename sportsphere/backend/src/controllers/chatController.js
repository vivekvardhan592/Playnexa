// Chat Controller — Handles Real-Time Direct Athlete Messaging
let sampleMessages = [
  {
    id: 1,
    senderName: 'Rahul S.',
    receiverName: 'Vivek Kumar',
    sport: 'Badminton',
    text: 'Hey Vivek! Saw your match radar ping for Badminton. Are you free for a session today around 6 PM?',
    time: '10:14 AM',
  },
  {
    id: 2,
    senderName: 'Rahul S.',
    receiverName: 'Vivek Kumar',
    sport: 'Badminton',
    text: 'We have court reserved at Madhapur Sports Complex. Let me know if you want to join! 🏸',
    time: '10:15 AM',
  },
];

export const getMessageThread = async (req, res) => {
  try {
    const { athleteName } = req.query;
    res.json({
      success: true,
      athlete: athleteName || 'Rahul S.',
      messages: sampleMessages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, receiverName, sport } = req.body;

    const userMsg = {
      id: Date.now(),
      senderName: 'Vivek Kumar',
      receiverName: receiverName || 'Rahul S.',
      sport: sport || 'Badminton',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    sampleMessages.push(userMsg);

    // Auto reply simulation
    const autoReply = {
      id: Date.now() + 1,
      senderName: receiverName || 'Rahul S.',
      receiverName: 'Vivek Kumar',
      sport: sport || 'Badminton',
      text: "Awesome! Confirmed for 6 PM. I'll bring extra equipment. See you on court! 🔥",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTimeout(() => {
      sampleMessages.push(autoReply);
    }, 1000);

    res.status(201).json({
      success: true,
      message: userMsg,
      autoReply,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
