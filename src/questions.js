export const QUESTIONS = [
  {
    id: 1,
    item: "Email (SMTP / IMAP)",
    hint: "The thing that connects Gmail, Outlook, and your university mailbox",
    answer: "P",
    explanation: "SMTP and IMAP are open standards. Any email server can talk to any other. Gmail can send to Outlook can send to a university server — no permission needed, no central gatekeeper.",
    discussionAngle: "But then why did email get so broken (spam, phishing)? Open protocols without governance have their own problems."
  },
  {
    id: 2,
    item: "WhatsApp",
    hint: "2 billion users, owned by Meta",
    answer: "PL",
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
    hint: "900 million users. Pavel Durov was arrested in France in 2024.",
    answer: "?",
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
    hint: "The only way to install apps on an iPhone — until the EU said otherwise",
    answer: "PL",
    explanation: "The App Store is a closed platform with a single gatekeeper. Apple decides what apps exist on iOS, takes 15–30% of all revenue, and can remove apps without appeal. The EU's DMA now requires Apple to allow alternative app stores in Europe — so regulation is forcing a platform to behave more like a protocol.",
    discussionAngle: "Apple argues its closed platform makes iPhones more secure and private. Is that a valid tradeoff? Who should decide — users, markets, or regulators?"
  },
  {
    id: 11,
    item: "eParaksts (Latvia)",
    hint: "The electronic signature on your latvija.lv documents",
    answer: "?",
    explanation: "eParaksts is built on eIDAS — an open EU-wide standard that any member state must accept. So technically it's a protocol. But the infrastructure is run by the Latvian state enterprise LVRTC, which controls the certificates, the app, and the trust chain. Open standard, centralised implementation.",
    discussionAngle: "Is a government-controlled open standard more like a protocol or a public utility? Who should own identity infrastructure — the state, the market, or a European commons?"
  },
  {
    id: 12,
    item: "SWIFT",
    hint: "How banks in 200 countries wire money to each other",
    answer: "P",
    explanation: "SWIFT is a cooperative owned by its member banks — no single company controls it. It operates as a messaging protocol between financial institutions. When the US and EU sanctioned Russia in 2022 and cut Russian banks from SWIFT, it revealed something important: even 'neutral' protocols have governance structures that can be weaponised.",
    discussionAngle: "Russia and China are now building SWIFT alternatives (SPFS, CIPS). Does the ability to sanction via a protocol mean it's actually a platform? Who controls the 'neutral' infrastructure of global finance?"
  },
  {
    id: 13,
    item: "iMessage (Apple)",
    hint: "Blue bubbles vs green bubbles — why does it matter?",
    answer: "PL",
    explanation: "iMessage is a fully proprietary Apple protocol. It works only between Apple devices. Apple deliberately designed the 'green bubble' experience to be inferior — lower quality video, no reactions — to create social pressure to stay on iPhone. The US DOJ sued Apple in 2024 partly over this.",
    discussionAngle: "Apple calls iMessage a feature, not a lock-in strategy. The EU's DMA may force Apple to open iMessage interoperability. Should messaging be a protocol-level right?"
  },
  {
    id: 14,
    item: "Bitcoin",
    hint: "The first cryptocurrency. Nobody owns it — or do they?",
    answer: "P",
    explanation: "Bitcoin is an open protocol. The rules are enforced by code, not a company. Anyone can run a node, mine, or build on it. Satoshi Nakamoto disappeared — and the protocol kept running. No CEO, no headquarters, no server to shut down.",
    discussionAngle: "Bitcoin mining is now dominated by a handful of large pools. Does concentration of computing power turn a protocol into something more like a platform? Who really governs Bitcoin?"
  },
  {
    id: 15,
    item: "TikTok",
    hint: "1 billion users. The algorithm nobody understands — including regulators.",
    answer: "PL",
    explanation: "TikTok is a closed platform owned by ByteDance. The recommendation algorithm is a proprietary black box. Creators have no insight into why videos get promoted or suppressed. The US tried to ban it outright; the EU requires algorithmic transparency under the DSA.",
    discussionAngle: "TikTok's algorithm shapes what a billion people watch every day. Should a private company be allowed to operate that kind of influence infrastructure? Or is it just a very good TV channel?"
  },
  {
    id: 16,
    item: "Bluetooth",
    hint: "How your headphones connect to your phone",
    answer: "P",
    explanation: "Bluetooth is an open standard maintained by the Bluetooth SIG, a consortium of thousands of companies. Any manufacturer can implement it — which is why Sony headphones connect to a Samsung phone connect to a Windows laptop. No single company owns Bluetooth.",
    discussionAngle: "Bluetooth was named after a 10th-century Danish king Harald Bluetooth, who united Scandinavian tribes. The logo is his initials in runic script. Does it matter who controls the narrative around a protocol — even a neutral one?"
  },
  {
    id: 17,
    item: "Wi-Fi (IEEE 802.11)",
    hint: "The invisible infrastructure of every café, office, and airport",
    answer: "P",
    explanation: "Wi-Fi is an open standard defined by the IEEE. Any chipmaker can implement it — which is why your laptop, phone, smart TV, and fridge all connect to the same router. The Wi-Fi Alliance certifies devices for compatibility, but no single company controls the standard.",
    discussionAngle: "Wi-Fi is free to use but your router is sold by a company, your ISP controls your connection, and your government can order it shut down. At what layer does a protocol become a platform?"
  },
  {
    id: 18,
    item: "Google Maps",
    hint: "The map inside thousands of apps — including your taxi and food delivery",
    answer: "PL",
    explanation: "Google Maps is a closed platform. The API is proprietary, and in 2018 Google raised prices by up to 1400% overnight — thousands of apps broke or became unviable. Businesses that built on Google Maps had no alternative because the switching cost was enormous.",
    discussionAngle: "Google Maps used to be free and open. Then it wasn't. What does that say about building critical infrastructure on top of a platform? What's the protocol-native alternative?"
  },
  {
    id: 19,
    item: "OpenStreetMap",
    hint: "Wikipedia for maps — community-edited since 2004",
    answer: "P",
    explanation: "OpenStreetMap is open data under the Open Database License. Anyone can use it, edit it, build on it, or run their own map server. Apple, Facebook, and Amazon use OSM as a base layer. When Google raised its prices in 2018, many companies migrated to OSM.",
    discussionAngle: "OSM is a volunteer-maintained commons. What happens when a critical piece of global infrastructure depends on unpaid contributors? Is the Ostrom model enough at internet scale?"
  },
  {
    id: 20,
    item: "Uber / Bolt",
    hint: "A taxi without a taxi company — or a taxi company without drivers' rights?",
    answer: "PL",
    explanation: "Uber and Bolt are closed platforms. The algorithm sets prices, assigns rides, and can deactivate drivers without explanation. Drivers have no visibility into the pricing model and no collective bargaining power. The EU's Platform Work Directive (2024) now requires algorithmic transparency and employment status clarity.",
    discussionAngle: "Uber calls itself a 'technology platform', not a transport company — which is how it avoided taxi regulations for years. Is that a legitimate distinction, or regulatory arbitrage?"
  }
]

export const TOTAL_QUESTIONS = QUESTIONS.length
