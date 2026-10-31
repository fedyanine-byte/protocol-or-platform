export const QUESTIONS = [
  {
    id: 1,
    item: "Email (SMTP / IMAP)",
    hint: "The thing that connects Gmail, Outlook, and your university mailbox",
    answer: "P", // Protocol
    explanation: "SMTP and IMAP are open standards. Any email server can talk to any other. Gmail can send to Outlook can send to a university server — no permission needed, no central gatekeeper.",
    discussionAngle: "But then why did email get so broken (spam, phishing)? Open protocols without governance have their own problems."
  },
  {
    id: 2,
    item: "WhatsApp",
    hint: "2 billion users, owned by Meta",
    answer: "PL", // Platform
    explanation: "WhatsApp uses its own proprietary protocol. You cannot message a WhatsApp user from Telegram or Signal. Meta controls who can build on it, and they can change the rules — or sell your metadata to advertisers.",
    discussionAngle: "WhatsApp uses the Signal protocol under the hood for encryption — so a Platform can be built on a Protocol. Does that make it more open?"
  },
  {
    id: 3,
    item: "RSS",
    hint: "The little orange wave icon on news websites",
    answer: "P",
    explanation: "RSS is an open XML standard. Any app can read any RSS feed. No company owns it. Google killed Google Reader in 2013 — but RSS itself survived, because no one can kill a protocol.",
    discussionAngle: "RSS is technically alive but practically dead for most users. What does that tell us about protocols vs platforms and convenience?"
  },
  {
    id: 4,
    item: "Instagram",
    hint: "Photos, Reels, Stories — all inside one app",
    answer: "PL",
    explanation: "Instagram is a fully closed platform. You cannot post to Instagram from a third-party app (they blocked the API in 2018). Meta decides what you see, who can build on it, and what the algorithm amplifies.",
    discussionAngle: "Instagram's algorithm is a private decision about what 2 billion people see every day. Should that be regulated like a public utility?"
  },
  {
    id: 5,
    item: "HTTP / HTTPS",
    hint: "The first four letters of every website address",
    answer: "P",
    explanation: "HTTP is the open protocol that lets any browser talk to any web server. Tim Berners-Lee invented it at CERN and gave it away. No one owns HTTP. That's why there are billions of websites instead of one company's content catalogue.",
    discussionAngle: "CERN could have patented HTTP. Should foundational internet infrastructure be patentable?"
  },
  {
    id: 6,
    item: "Spotify",
    hint: "80 million songs, 600 million users",
    answer: "PL",
    explanation: "Spotify is a closed platform. Artists need a deal with a distributor to appear on it. Spotify's algorithm decides what gets promoted. The royalty model is set by Spotify. You cannot export your playlists to Apple Music without a third-party tool.",
    discussionAngle: "Spotify negotiated special rates with major labels that independent artists can't access. Is that the music industry's version of a walled garden?"
  },
  {
    id: 7,
    item: "Mastodon / ActivityPub",
    hint: "The decentralised alternative to Twitter/X",
    answer: "P",
    explanation: "ActivityPub is an open W3C protocol. Any server running it can talk to any other. Your Mastodon account can follow someone on Pixelfed (photos) or PeerTube (video). No company controls the protocol.",
    discussionAngle: "Mastodon has ~10 million users. X has ~250 million daily users. If open protocols are better, why don't they win on adoption?"
  },
  {
    id: 8,
    item: "Telegram",
    hint: "Used by 900 million people. Pavel Durov was arrested in France in 2024.",
    answer: "?", // Deliberately ambiguous
    explanation: "This one is genuinely grey. Telegram has an open API — thousands of bots and third-party clients are built on it. But the core protocol is proprietary, the servers are centralised, and Durov controls the company. It sits between protocol and platform.",
    discussionAngle: "Open API ≠ open protocol. Telegram can revoke API access tomorrow. Does 'open enough' count?"
  },
  {
    id: 9,
    item: "SEPA Credit Transfer",
    hint: "How money moves between European bank accounts",
    answer: "P",
    explanation: "SEPA is an open payment protocol maintained by the European Payments Council. Any bank in the SEPA zone must implement it. You can send money from Swedbank Latvia to a Deutsche Bank account in Germany with no special agreement between those two banks.",
    discussionAngle: "SEPA is a protocol but it took EU regulation to force banks to adopt it. Does that make it a protocol or a regulation? Can a protocol exist without a mandate?"
  },
  {
    id: 10,
    item: "App Store (Apple)",
    hint: "The only way to install apps on an iPhone",
    answer: "PL",
    explanation: "The App Store is a closed platform with a single gatekeeper. Apple decides what apps exist on iOS, takes 15–30% of all revenue, and can remove apps without appeal. The EU's DMA now requires Apple to allow alternative app stores in Europe — so regulation is forcing a platform to behave more like a protocol.",
    discussionAngle: "Apple argues its closed platform makes iPhones more secure and private. Is that a valid tradeoff? Who should decide — users, markets, or regulators?"
  }
]

export const TOTAL_QUESTIONS = QUESTIONS.length
