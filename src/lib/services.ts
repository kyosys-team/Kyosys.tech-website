/**
 * Service catalogue — single source of truth for /services and /services/[slug].
 * Copy is professional placeholder; the team finalises it in US-050.
 */
export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  /** Lucide icon name key used by ServiceIcon */
  icon: "globe" | "smartphone" | "share2" | "search" | "clapperboard";
  overview: string[];
  deliverables: string[];
  process: { title: string; description: string }[];
  tech: string[];
  faqs: ServiceFaq[];
}

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web Development",
    shortName: "Websites",
    tagline: "Fast, modern websites that turn visitors into customers.",
    icon: "globe",
    overview: [
      "Your website is often the first impression a customer gets of your business. We build websites that load fast, look professional on every device, and are designed around one goal: getting you enquiries.",
      "From simple business websites to full web applications and online stores, we handle everything — design, development, content setup, and launch. You get a site you can proudly share, and your customers get an experience that makes buying easy.",
    ],
    deliverables: [
      "Custom-designed, mobile-responsive website",
      "Lightning-fast loading (90+ PageSpeed scores)",
      "Contact forms with email notifications",
      "WhatsApp chat integration",
      "Google Maps + business info setup",
      "Basic SEO (titles, sitemap, Google indexing)",
      "Admin-friendly content editing",
      "Launch checklist + 30 days of free support",
    ],
    process: [
      {
        title: "Discover",
        description:
          "A free 30-minute call to understand your business, customers, and goals.",
      },
      {
        title: "Design",
        description:
          "We design page layouts for approval before writing a single line of code.",
      },
      {
        title: "Build",
        description:
          "Development with weekly progress updates you can click through.",
      },
      {
        title: "Grow",
        description:
          "Launch, Google setup, and 30 days of support while you start getting leads.",
      },
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "WordPress", "Shopify"],
    faqs: [
      {
        question: "How long does a website take?",
        answer:
          "A standard business website takes 2–4 weeks from our discovery call to launch, while larger web applications take 6–10 weeks. We share a clear written timeline before work begins and send weekly progress updates, so you always know exactly where your project stands. If anything slips, you'll hear it from us first — not at the deadline.",
      },
      {
        question: "Will I be able to update the site myself?",
        answer:
          "Yes. Every website we build includes easy content editing, so you can update text, images, and pages yourself without touching code. During handover, we walk you through it in a short training session and leave you with simple instructions. For bigger changes, we're one message away.",
      },
      {
        question: "Do you write the content for the website?",
        answer:
          "We do — together with you. You know your business best, so we interview you and turn your inputs into clear, customer-friendly copy, then structure and polish every page. You approve the final wording before anything goes live, so the site always sounds like you.",
      },
      {
        question: "What does a website cost?",
        answer:
          "Business websites usually range from ₹30,000 to ₹80,000, depending on the number of pages and features you need. The final price is fixed in a written quote before we start — no surprises later. For an instant rough estimate, try our quote estimator; you don't even need to share your email.",
      },
    ],
  },
  {
    slug: "app-development",
    name: "Mobile App Development",
    shortName: "Mobile Apps",
    tagline: "iOS & Android apps your customers will actually love to use.",
    icon: "smartphone",
    overview: [
      "Have an app idea? We turn it into a real product on both iPhone and Android — with one codebase, so you don't pay twice. From MVPs that validate your idea fast to full-featured apps with payments, notifications, and user accounts.",
      "We think like product partners, not just coders: we'll challenge your idea, simplify the first version, and get you to launch quickly so real users — not opinions — guide what comes next.",
    ],
    deliverables: [
      "iOS + Android app from a single codebase",
      "User login & profiles",
      "Push notifications",
      "Payment integration (UPI, cards)",
      "Admin dashboard to manage app data",
      "App Store + Play Store publishing",
      "Analytics setup to track usage",
      "30 days of post-launch bug fixes free",
    ],
    process: [
      {
        title: "Discover",
        description:
          "We map your idea into features and cut it down to a sharp MVP scope.",
      },
      {
        title: "Design",
        description:
          "App screens designed and prototyped — you tap through it before we build.",
      },
      {
        title: "Build",
        description:
          "Development in weekly releases you can install and test on your phone.",
      },
      {
        title: "Grow",
        description:
          "Store launch, analytics, and iteration based on real user feedback.",
      },
    ],
    tech: ["React Native", "Flutter", "TypeScript", "Firebase", "Node.js"],
    faqs: [
      {
        question: "Do I need separate apps for iPhone and Android?",
        answer:
          "No. We build with cross-platform frameworks like React Native and Flutter, so a single codebase runs on both iPhone and Android. That saves roughly 40% compared to building two separate native apps, and future updates ship to both platforms at once.",
      },
      {
        question: "How much does an MVP app cost?",
        answer:
          "A typical MVP app costs between ₹1,00,000 and ₹2,50,000, depending on features like logins, payments, and notifications. We scope the smallest version that can validate your idea, fix the price in writing before we start, and you can check a rough range anytime with our quote estimator.",
      },
      {
        question: "Will you publish the app to the stores for us?",
        answer:
          "Yes. App Store and Play Store submission is fully included: we prepare screenshots, write descriptions, configure listings, and handle review feedback until your app is approved and live. You keep full ownership of both developer accounts throughout, so you're never locked in to us.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do — 100%. At launch we hand over the full source code, store accounts, and documentation, with no lock-in and no strings attached. It's your product and your asset; we're happy to keep maintaining it, but you can take it to any developer.",
      },
    ],
  },
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    shortName: "Social Media",
    tagline: "Content and campaigns that grow your audience — and sales.",
    icon: "share2",
    overview: [
      "Posting randomly doesn't grow a business. We run your social media like a system: a monthly content calendar, professionally designed posts and reels, and campaigns aimed at one thing — enquiries and sales.",
      "We handle Instagram, Facebook, LinkedIn, and YouTube depending on where your customers actually are. You approve everything; we do all the work.",
    ],
    deliverables: [
      "Monthly content calendar for approval",
      "12–20 designed posts + reels per month",
      "Caption writing with hashtags",
      "Profile optimization (bio, highlights, links)",
      "Ad campaign setup & management",
      "Monthly growth & leads report",
      "Community management (comments/DMs)",
      "Festival & offer campaign creatives",
    ],
    process: [
      {
        title: "Discover",
        description:
          "We study your business, competitors, and customers to find your angle.",
      },
      {
        title: "Design",
        description:
          "Content pillars and a visual style fixed before the first post.",
      },
      {
        title: "Build",
        description:
          "Consistent posting + engagement, with you approving everything.",
      },
      {
        title: "Grow",
        description:
          "Monthly reports show what's working; we double down on it.",
      },
    ],
    tech: ["Instagram", "Facebook", "LinkedIn", "YouTube", "Meta Ads"],
    faqs: [
      {
        question: "Which platforms should my business be on?",
        answer:
          "Wherever your customers already spend time. For most local businesses that's Instagram and Facebook; for B2B it's LinkedIn, sometimes with YouTube for longer content. We study your market and competitors before recommending anything — you only pay for platforms that make sense for your business.",
      },
      {
        question: "Do I need to give you my passwords?",
        answer:
          "No. We work through official business tools like Meta Business Suite, where you grant us managed access without ever sharing passwords. You stay in full control and can revoke our access anytime with one click. Your accounts stay 100% yours — we simply can't lock you out.",
      },
      {
        question: "How soon will I see results?",
        answer:
          "Expect visible growth in 2–3 months of consistent posting and engagement. Paid campaigns can start generating leads from week one. Be wary of anyone promising overnight virality — real audience growth compounds steadily, and we'd rather be honest than sell you dreams.",
      },
    ],
  },
  {
    slug: "seo",
    name: "Search Engine Optimization",
    shortName: "SEO",
    tagline: "Get found on Google when customers search for what you sell.",
    icon: "search",
    overview: [
      "When someone searches 'best bakery near me' or 'web developer in Surat', does your business show up? SEO is the work of making sure it does — and unlike ads, the traffic keeps coming without paying per click.",
      "We fix your site's technical foundation, create content that answers what your customers search for, and build your local presence so nearby customers find you first.",
    ],
    deliverables: [
      "Full SEO audit of your website",
      "Keyword research for your market",
      "On-page optimization (titles, headings, speed)",
      "Google Business Profile setup & optimization",
      "Local citations & directory listings",
      "2 SEO blog articles per month",
      "Monthly ranking & traffic report",
      "Competitor tracking",
    ],
    process: [
      {
        title: "Discover",
        description:
          "Audit + keyword research: we find what your customers actually search.",
      },
      {
        title: "Design",
        description:
          "A 6-month roadmap prioritized by impact, not vanity metrics.",
      },
      {
        title: "Build",
        description:
          "Technical fixes, content, and local SEO executed month by month.",
      },
      {
        title: "Grow",
        description:
          "Rankings compound — monthly reports show traffic turning into leads.",
      },
    ],
    tech: ["Google Search Console", "Ahrefs", "Screaming Frog", "Schema.org"],
    faqs: [
      {
        question: "How long does SEO take to show results?",
        answer:
          "Typically 3–6 months for meaningful movement in rankings and traffic. SEO compounds over time — unlike ads, you don't pay for every visitor, and results keep building month after month. We send monthly reports so you can watch the progress yourself.",
      },
      {
        question: "Can you guarantee #1 ranking on Google?",
        answer:
          "No — and no honest agency can. Google's rankings depend on hundreds of factors no one controls, so anyone guaranteeing #1 is lying. What we do guarantee is the work itself: every task in your monthly plan gets completed, documented, and reported to you.",
      },
      {
        question: "I already run Google Ads. Do I still need SEO?",
        answer:
          "Ads stop bringing customers the day you stop paying; SEO builds an asset that keeps working for you. They do different jobs — ads buy immediate visibility, SEO earns lasting visibility. Most businesses get the best return running both together.",
      },
    ],
  },
  {
    slug: "video-production",
    name: "Video Production",
    shortName: "Video",
    tagline: "Shoot & edit — reels, ads, and brand films that get watched.",
    icon: "clapperboard",
    overview: [
      "Video gets more reach than any other content format — but only if it's well shot and sharply edited. We handle both: on-location or studio shoots plus professional editing for reels, ads, product videos, and brand stories.",
      "You get scroll-stopping content ready to post, in the exact formats each platform wants.",
    ],
    deliverables: [
      "Concept & script for your video",
      "On-location or studio shoot (half/full day)",
      "Professional editing: cuts, captions, music",
      "Reels + vertical cuts for Instagram/YouTube Shorts",
      "Product demo & testimonial videos",
      "Ad creatives for Meta/Google campaigns",
      "Thumbnail design",
      "2 revision rounds included",
    ],
    process: [
      {
        title: "Discover",
        description:
          "We understand your message, audience, and where the video will run.",
      },
      {
        title: "Design",
        description:
          "Script + shot list approved by you before shoot day.",
      },
      {
        title: "Build",
        description: "Shoot day, then editing with captions, music, and pacing.",
      },
      {
        title: "Grow",
        description:
          "Final files in every format you need — post-ready on day one.",
      },
    ],
    tech: ["Premiere Pro", "After Effects", "DaVinci Resolve", "4K Cameras", "Drones"],
    faqs: [
      {
        question: "Do you shoot at our location?",
        answer:
          "Yes. We shoot on location at your shop, office, or event, and can also set up studio-style shoots for product or interview videos. Travel within the city is included in the quote, so there are no hidden charges for shoot day.",
      },
      {
        question: "How long does a video project take?",
        answer:
          "A reel or short ad takes 3–5 days from brief to final delivery. A full brand film takes 2–3 weeks, including the shoot day and revision rounds. We confirm your exact timeline in writing before shoot day so you can plan your launch.",
      },
      {
        question: "Can you just edit footage we already shot?",
        answer:
          "Absolutely. Send us your raw footage and we'll turn it into polished, captioned videos ready to post — with clean cuts, music, and platform-perfect formatting. It's one of the most cost-effective ways to get professional content from material you already have.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string, count = 3): Service[] {
  const others = services.filter((s) => s.slug !== slug);
  return others.slice(0, count);
}

export const serviceSlugs = services.map((s) => s.slug);
