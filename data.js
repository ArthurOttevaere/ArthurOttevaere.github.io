/* =================================================================
   data.js — Your portfolio content. This is the ONLY file you need
   to edit to add projects, update your bio, or change links.
   =================================================================

   HOW TO ADD A PROJECT
   --------------------
   Copy the template below, paste it at the END of the `projects`
   array (before the closing `]`), and fill in your values.

   PROJECT TEMPLATE:
   -----------------
   {
     id:       "my-project",          // Unique ID — no spaces, no special chars
     title:    "My Project Name",     // Displayed title
     cat:      "Academic",            // Category: "Academic" | "Personal"
     year:     "2025",               // Year as a string
     summary:  "One-line summary.",  // Short text for the project list
     long:     "Detailed paragraph.", // Shown on the featured card
     tags:     ["Python", "SQL"],    // Tech stack — 3 to 5 items
     cover:    "Generic",
     // DATA/ANALYTICS: "Dashboard" "Scatter" "TimeSeries" "Heatmap" "Clustering" "Regression"
     // TOOLS/TECH:     "Python" "SQL" "API" "Excel" "PowerBI" "ML"
     // DOMAIN:         "Finance" "HR" "Marketing" "Network" "Supply" "Climate"
     // MISC:           "F1" "Netflix" "Layoffs" "Report" "Survey" "Startup" "Map" "Academia" "Generic"
     // IMAGE URL:      "https://…"  or  "/assets/cover.jpg"  (any image path also works)
     github:   "#",                  // 🔗 GitHub repo URL — leave "#" if not public yet
     featured: false,                // true for exactly ONE project to pin at top
   },

   ================================================================= */

window.PORTFOLIO_DATA = {

  /* ── Personal info ──────────────────────────────────────────── */
  profile: {
    name:           "Arthur Ottevaere",
    location:       "Tournai, BE",
    age:            "21",
    available:      true,
    availableText:  "Going in Erasmus in Rotterdam · Fall '26",

    /* Bio paragraphs — each string becomes a <p> in the About page */
    bio: [
      "I'm a 21-year-old Business Engineering student in Tournai, finishing my Master's in Business Analytics. I love turning real datasets into things people can actually use — dashboards, short reports, an occasional model.",
      "What draws me to analytics is the full arc from raw, unstructured data to a clear recommendation someone can act on. The interesting work isn't the model — it's deciding what question to ask, what to drop, and how to frame the output so a decision-maker instantly sees the point.",
      "On the side I build small data projects for fun — usually around Formula 1 and daily issues I want to solve. Some of them live on the projects page.",
      "I'm going in a semester abroad in Rottedam in Fall '26, excited to meet new people and get a fresh perspective on things!",
    ],

    /* Short description shown under your name on the home page */
    tagline:  "Master's student in Business Engineering. I turn messy data into things you can act on — dashboards, models, the occasional weekend project about Formula 1.",

    photo:    null,    // Set to an image URL, e.g. "/assets/photo.jpg", or null for initials avatar
    cv:       "https://drive.google.com/file/d/1xCqm6u082XO01JhhAJr_xfb5VM61vLXj/view?usp=sharing",     // Link to your CV PDF
    linkedin: "https://www.linkedin.com/in/arthur-ottevaere/",     // e.g. "https://linkedin.com/in/arthur-ottevaere"
    github:   "https://github.com/ArthurOttevaere",     // e.g. "https://github.com/arthurottevaere"
    email:    "arthurottevaere7@gmail.com",

    /* Landing page — three info cells */
    status: [
      { key: "Currently", value: "Master in Business Engineering",  sub: "Business Analytics · Y1" },
      { key: "Based in",  value: "Tournai, BE",             sub: "Studying in Mons, Belgium" },
      { key: "Toolkit",   value: "Python · SQL · R · Office Suite",         sub: "+ PowerBI, Notion, Canva & Git" },
    ],

    /* About — education timeline */
    education: [
      { period: "2025 — Present", degree: "M. Business Engineering",  school: "Business Analytics track · (UCL-LSM)" },
      { period: "2022 — 2025", degree: "B. Business Engineering",  school: "UCLouvain FUCaM Mons (LSM)" },
    ],

    /* About — skill tags */
    tools: ["Python", "R", "SQL", "PowerBI", "Excel", "Canva", "Notion", "Git"],

    /* About — spoken languages */
    languages: [
      ["French",  "Native"],
      ["English", "C1 — fluent"],
      ["Dutch",   "B2 — working"],
    ],

    /* About — "By the numbers" KPI cards */
    stats: {
      sqlQueries:      1247,
      sqlQueryDelta:   "▲ +18% vs 2025",
      projectsPerYear: 7,
      projectsBars:    [40, 65, 50, 80, 60, 90, 75, 100],   // 8 values for 8 quarters
      coffeesPerWeek:  14,
      coffeeDelta:     "▼ −2 vs January",
      f1Watched:       22,
      f1Total:         24,
    },
  },

  /* ── Projects ───────────────────────────────────────────────── */
  projects: [
    {
      id:       "f1",
      title:    "F1 Championship Tracker",
      cat:      "Personal",
      year:     "2025-2026",
      summary:  "Pulls every Grand Prix result, computes the maximum points each driver can still score, and surfaces who is mathematically alive in the championship after each round.",
      long:     "Pulls every Grand Prix result, computes the maximum points each driver can still score, and surfaces who is mathematically alive in the championship after each round.",
      tags:     ["Python", "API", "Pandas"],
      cover:    "https://media.formula1.com/image/upload/t_16by9South/c_lfill,w_3392/q_auto/v1740000001/trackside-images/2023/F1_Grand_Prix_of_Abu_Dhabi/1814820481.webp",
      github:   "https://arthuros.notion.site/F1-Championship-Tracker-26b2a3f21be4801e92fdce907d898b00",     // 🔗 https://arthuros.notion.site/F1-Championship-Tracker-26b2a3f21be4801e92fdce907d898b00 
      featured: true,
    },
    {
      id:       "dash",
      title:    "Business Data Cleaning & Dashboard",
      cat:      "Academic",
      year:     "2025-2026",
      summary:  "Cleaned a raw fictitious company dataset and built a dashboard surfacing actionable business insights for the analytics course.",
      long:     "As part of a data analytics course, this collaborative project involved processing a raw, fictitious company dataset to generate actionable business insights through a dashboard interface.",
      tags:     ["Excel", "PowerBI", "Canva"],
      cover:    "https://assets.everspringpartners.com/ca/3b/d9e41e954f32a1a103cfbdd7efee/business-analytics.jpg",
      github:   "https://arthuros.notion.site/Business-Data-Cleaning-and-Dashboard-Analysis-2a82a3f21be480b7b378f89e750e333a",     // 🔗 https://github.com/arthurottevaere/...
      featured: false,
    },
    {
      id:       "netflix",
      title:    "Web Mining: Cinema Reviews Analysis",
      cat:      "Academic",
      year:     "2025-2026",
      summary:  "A collaborative project mapping the 'DNA' of cinema by scraping 900+ professional reviews.",
      long:     "A collaborative project mapping the 'DNA' of cinema by scraping 900+ professional reviews. Using NLP (TF-IDF, SVD) and Network Science, we transformed raw text into a graph to identify influential hubs and semantic bridges between genres.aded the public catalogue into Postgres, wrote ~30 queries across genre mix, release cadence and country footprint, and wired the results into a Jupyter walkthrough.",
      tags:     ["SQL", "Python", "Pandas"],
      cover:    "https://www.numerama.com/content/uploads/2017/05/netflix.jpeg",
      github:   "https://github.com/ArthurOttevaere/WebMining-Cinema-Reviews",     // 🔗 https://github.com/arthurottevaere/...
      featured: false,
    },
    {
      id:       "layoffs",
      title:    "HR Predictive Analytics",
      cat:      "Personal",
      year:     "2025-2026",
      summary:  "Applying Machine Learning to identify the core drivers of employee turnover, transforming complex HR variables into actionable business recommendations.",
      long:     "Applying Machine Learning to identify the core drivers of employee turnover, transforming complex HR variables into actionable business recommendations.",
      tags:     ["R", "Python", "Orange Data Mining"],
      cover:    "https://future-code.dev/wp-content/uploads/2023/08/Employee-Turnover-1.png",
      github:   "https://arthuros.notion.site/HR-Predictive-Analytics-Optimizing-Talent-Retention-Employee-Insights-31f2a3f21be480f8a583d8042ec9fd95",     // 🔗 https://github.com/arthurottevaere/...
      featured: false,
    },
    {
      id:       "coding_project",
      title:    "Student Registration Management System",
      cat:      "Personal",
      year:     "2024-2025",
      summary:  "A Python-based system for managing student registrations with Excel integration. Collaboratively developed to handle 1,000+ student records, including ID generation, data analytics, and a user-friendly interface.",
      long:     "A Python-based system for managing student registrations with Excel integration. Collaboratively developed to handle 1,000+ student records, including ID generation, data analytics, and a user-friendly interface.",
      tags:     ["Python", "Pandas", "Excel"],
      cover:    "https://leseng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2025/10/25/node_707101/32922101/public/2025/10/25/52593243.jpeg?itok=-DeTC7yM1761374705",
      github:   "https://arthuros.notion.site/HR-Predictive-Analytics-Optimizing-Talent-Retention-Employee-Insights-31f2a3f21be480f8a583d8042ec9fd95",     // 🔗 https://github.com/arthurottevaere/...
      featured: false,
    },
    {
      id:       "vat_verification",
      title:    "VAT Number Verification System",
      cat:      "Personal",
      year:     "2025",
      summary:  "A Python-based system for verifying VAT numbers using the Peppol API. Compares VAT numbers from an Excel file with Peppol's database and returns a validation report including company names and status.",
      long:     "A Python-based system for verifying VAT numbers using the Peppol API. Compares VAT numbers from an Excel file with Peppol's database and returns a validation report including company names and status.",
      tags:     ["Python", "API", "Peppol"],
      cover:    "https://comptaperspectives.be/wp-content/uploads/2025/06/e-invoice-Wallonie-scaled.jpg",
      github:   "https://arthuros.notion.site/Automated-VAT-Validation-using-the-Peppol-API-2a62a3f21be48037af2bf93345e05339",     // 🔗 https://github.com/arthurottevaere/...
      featured: false,
    },
  ],
};