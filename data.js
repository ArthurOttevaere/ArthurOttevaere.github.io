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
     year:     "2025",               // Year as a string (fallback / coarse label)
     date:     "2025-06-15",         // OPTIONAL precise completion date.
     //                                 "YYYY-MM-DD" → "15 Jun 2025", "YYYY-MM" → "Jun 2025".
     //                                 Drives sorting too; omit it to fall back to `year`.
     summary:  "One-line summary.",  // Short text shown on the grid card
     long:     "Detailed paragraph.", // Shown in the project detail popup
     highlights: [                   // 2–4 bullet points shown in the popup
       "First key point.",
       "Second key point.",
     ],
     tags:     ["Python", "SQL"],    // Tech stack — 3 to 5 items
     cover:    "Generic",
     // DATA/ANALYTICS: "Dashboard" "Scatter" "TimeSeries" "Heatmap" "Clustering" "Regression"
     // TOOLS/TECH:     "Python" "SQL" "API" "Excel" "PowerBI" "ML"
     // DOMAIN:         "Finance" "HR" "Marketing" "Network" "Supply" "Climate"
     // MISC:           "F1" "Netflix" "Layoffs" "Report" "Survey" "Startup" "Map" "Academia" "Generic"
     // IMAGE URL:      "https://…"  or  "/assets/cover.jpg"  (any image path also works)
     github:   "#",
     featured: false,                // true for exactly ONE project to pin at top
   },

   ================================================================= */

window.PORTFOLIO_DATA = {

  /* ── Personal info ──────────────────────────────────────────── */
  profile: {
    name:           "Arthur Ottevaere",
    location:       "Tournai, BE",
    age:            "22",

    /* About — small status line under your name/location. Leave "" to hide
       it entirely; only fill it in while it's actually true, e.g.
       "Looking for a Fall 2026 internship" or "Open to freelance work". */
    status: "Currently studying in Rotterdam",

    /* Bio paragraphs — each string becomes a <p> in the About page */
    bio: [
      "I'm a 22-year-old Business Engineering student in Tournai, finishing my Master's in Business Analytics. I love turning real datasets into things people can actually use like dashboards, short reports, or occasional model.",
      "What I love most is building side projects end to end, just to test an idea or solve a daily issue.",
      "On the side I build small data projects for fun, usually around passions like Formula 1 and daily issues I want to solve. Some of them live on the projects page.",
      "I'm going on a semester abroad in Rotterdam in Fall '26, excited to meet new people and get a fresh perspective on things!",
    ],

    /* Short description shown under your name on the home page */
    tagline:  "Master's student in Business Engineering. I love turning messy data into things you can act on like dashboards, models, the occasional weekend project about Formula 1.",

    photo:    "/assets/images/avatar.png",    // Set to an image URL, or null for initials avatar
    cv:       "https://drive.google.com/file/d/1xCqm6u082XO01JhhAJr_xfb5VM61vLXj/view?usp=sharing",     // Link to your CV PDF
    linkedin: "https://www.linkedin.com/in/arthur-ottevaere/",     // e.g. "https://linkedin.com/in/arthur-ottevaere"
    github:   "https://github.com/ArthurOttevaere",
    email:    "arthurottevaere7@gmail.com",

    /* Contact form — paste your Formspree endpoint here to receive messages.
       Create a form at https://formspree.io → it gives you a URL like
       "https://formspree.io/f/abcdwxyz". Leave "" to keep the form in demo mode. */
    formspree: "https://formspree.io/f/mdarnynw",

    /* About — timeline (studies, internships, jobs — anything that belongs
       on your path). `period` sides can be plain text ("Present", "Fall
       2026") or dates: "2025" stays "2025", "2025-06" → "Jun 2025",
       "2025-06-15" → "15 Jun 2025". Separate a range with " — ",
       e.g. "2022-09 — 2025-06".
       `title` = degree name / internship or job title.
       `place` = school, university, or company.
       `type`  = small label shown above the title (e.g. "Education",
                 "Internship", "Job") — optional, omit to show nothing. */
    timeline: [
      { period: "2025-09 — Present", title: "Master in Business Engineering - Business Analytics track",  place: "UCLouvain FUCaM Mons · Louvain School of Management", type: "Education"},
      {period: "2026-09 — 2026-12", title: "Erasmus Semester", place: "Erasmus Universiteit Rotterdam · Rotterdam School of Management", type: "Education"},
      { period: "2022-09 — 2025-06", title: "Bachelor in Business Engineering",  place: "UCLouvain FUCaM Mons · Louvain School of Management", type: "Education" },
      {period: "2025-01 — 2025-02", title: "Business Internship", place: "Global Net Belgium", type: "Internship"},
      {period: "2027-02 —2027-05", title: "Data Consultant Internship", place: "EASI", type: "UPCOMING Internship"},
    ],

    /* About — skill tags (flat list, kept for the command palette etc.) */
    tools: ["Python", "R", "SQL", "PowerBI", "Excel", "Canva", "Notion", "Git"],

    /* About — skills grouped by category for the "workbench" act.
       Each item: [name, monogram, logo?].
         • monogram = 1–3 char badge shown when no logo is set.
         • logo (optional) = image path, e.g. "/assets/logos/python.svg".
           When present, the logo is shown instead of the monogram.
       Edit freely; falls back to `tools` if removed. */
    toolGroups: [
      { label: "Code",        items: [["Python","Py","/assets/logos/python.png"], ["R","R","/assets/logos/r.png"], ["SQL","SQL","/assets/logos/sql.png"]] },
      { label: "Data & Viz",  items: [["Excel","XL","/assets/logos/excel.png"], ["PowerBI","BI","/assets/logos/powerbi.svg"]] },
      { label: "Workflow",    items: [["Git","Git"], ["Notion","N"], ["Canva","Ca","/assets/logos/canva.png"]] },
    ],


    /* About — spoken languages */
    languages: [
      ["French",  "Native"],
      ["English", "C1 — fluent"],
      ["Dutch",   "B2 — working"],
    ],

    /* About — "What I'm into" looping marquee.
       icon = a key from src/icons.jsx (Music, Football, Stock, Chip,
       Flag, Apple, Planet …). label = the text shown next to it. */
    interests: [
      { icon: "Chip",     label: "Tech" },
      { icon: "F1",       label: "Formula 1" },
      { icon: "Apple",    label: "Apple" },
      { icon: "Planet",   label: "Astronomy" },
      { icon: "Music",    label: "Music" },
      { icon: "Football", label: "Football" },
      { icon: "Stock",    label: "Stock Market" },
      { icon: "Plane",    label: "Travel" },
    ],
  },

  /* ── Projects ───────────────────────────────────────────────── */
  projects: [
    {
      id:       "f1",
      title:    "F1 Championship Tracker",
      cat:      "Personal",
      year:     "2025",
      date:     "2025-11",
      summary:  "Pulls every Grand Prix result, computes the maximum points each driver can still score, and surfaces who is mathematically alive in the championship after each round.",
      long:     "Pulls every Grand Prix result, computes the maximum points each driver can still score, and surfaces who is mathematically alive in the championship after each round.",
      highlights: [
        "Pulls every Grand Prix result automatically through an F1 API.",
        "Computes the maximum points each driver can still score.",
        "Flags who is mathematically still in title contention after each round.",
      ],
      tags:     ["Python", "API", "Pandas"],
      cover:    "https://media.formula1.com/image/upload/t_16by9South/c_lfill,w_3392/q_auto/v1740000001/trackside-images/2023/F1_Grand_Prix_of_Abu_Dhabi/1814820481.webp",
      github:   "https://arthuros.notion.site/F1-Championship-Tracker-26b2a3f21be4801e92fdce907d898b00",
      featured: false,
    },
    {
      id:       "dash",
      title:    "Business Data Cleaning & Dashboard",
      cat:      "Academic",
      year:     "2025",
      date:     "2025-11",
      summary:  "Cleaned a raw fictitious company dataset and built a dashboard surfacing actionable business insights for the analytics course.",
      long:     "As part of a data analytics course, this collaborative project involved processing a raw, fictitious company dataset to generate actionable business insights through a dashboard interface.",
      highlights: [
        "Cleaned and structured a raw, fictitious company dataset.",
        "Built an interactive dashboard surfacing actionable business insights.",
        "Collaborative project delivered for a data analytics course.",
      ],
      tags:     ["Excel", "PowerBI", "Canva"],
      cover:    "https://assets.everspringpartners.com/ca/3b/d9e41e954f32a1a103cfbdd7efee/business-analytics.jpg",
      github:   "https://arthuros.notion.site/Business-Data-Cleaning-and-Dashboard-Analysis-2a82a3f21be480b7b378f89e750e333a",
      featured: false,
    },
    {
      id:       "netflix",
      title:    "Web Mining: Cinema Reviews Analysis",
      cat:      "Academic",
      year:     "2025",
      date:     "2025-12",
      summary:  "A collaborative project mapping the 'DNA' of cinema by scraping 900+ professional reviews.",
      long:     "A collaborative project mapping the 'DNA' of cinema by scraping 900+ professional reviews. Using NLP (TF-IDF, SVD) and Network Science, we transformed raw text into a graph to identify influential hubs and semantic bridges between genres.",
      highlights: [
        "Scraped 900+ professional cinema reviews.",
        "Applied NLP (TF-IDF, SVD) to turn raw text into structured features.",
        "Built a network graph to find influential hubs and bridges between genres.",
      ],
      tags:     ["SQL", "Python", "Pandas"],
      cover:    "https://www.numerama.com/content/uploads/2017/05/netflix.jpeg",
      github:   "https://github.com/ArthurOttevaere/WebMining-Cinema-Reviews",
      featured: false,
    },
    {
      id:       "layoffs",
      title:    "HR Predictive Analytics",
      cat:      "Academic",
      year:     "2025",
      date:     "2025-12",
      summary:  "Applying Machine Learning to identify the core drivers of employee turnover, transforming complex HR variables into actionable business recommendations.",
      long:     "Applying Machine Learning to identify the core drivers of employee turnover, transforming complex HR variables into actionable business recommendations.",
      highlights: [
        "Modelled the core drivers of employee turnover with machine learning.",
        "Turned complex HR variables into actionable business recommendations.",
        "Explored the data in both R and Orange Data Mining.",
      ],
      tags:     ["R", "Python", "Orange Data Mining"],
      cover:    "https://future-code.dev/wp-content/uploads/2023/08/Employee-Turnover-1.png",
      github:   "https://arthuros.notion.site/HR-Predictive-Analytics-Optimizing-Talent-Retention-Employee-Insights-31f2a3f21be480f8a583d8042ec9fd95",
      featured: false,
    },
    {
      id:       "coding_project",
      title:    "Student Registration Management System",
      cat:      "Academic",
      year:     "2024",
      date:     "2024-12",
      summary:  "A Python-based system for managing student registrations with Excel integration. Collaboratively developed to handle 1,000+ student records, including ID generation, data analytics, and a user-friendly interface.",
      long:     "A Python-based system for managing student registrations with Excel integration. Collaboratively developed to handle 1,000+ student records, including ID generation, data analytics, and a user-friendly interface.",
      highlights: [
        "Handles 1,000+ student records with Excel integration.",
        "Automatic student ID generation and built-in data analytics.",
        "User-friendly interface, developed collaboratively.",
      ],
      tags:     ["Python", "Pandas", "Excel"],
      cover:    "https://leseng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2025/10/25/node_707101/32922101/public/2025/10/25/52593243.jpeg?itok=-DeTC7yM1761374705",
      github:   "https://arthuros.notion.site/Student-Registration-Management-System-26c2a3f21be48010922dc56b9c351f81?source=copy_link",
      featured: false,
    },
    {
      id:       "vat_verification",
      title:    "VAT Number Verification System",
      cat:      "Personal",
      year:     "2025",
      date:     "2025-02",
      summary:  "A Python-based system for verifying VAT numbers using the Peppol API. Compares VAT numbers from an Excel file with Peppol's database and returns a validation report including company names and status.",
      long:     "A Python-based system for verifying VAT numbers using the Peppol API. Compares VAT numbers from an Excel file with Peppol's database and returns a validation report including company names and status.",
      highlights: [
        "Reads VAT numbers straight from an Excel file.",
        "Checks each one against the Peppol database via its API.",
        "Returns a validation report with company names and status.",
      ],
      tags:     ["Python", "API", "Peppol"],
      cover:    "https://comptaperspectives.be/wp-content/uploads/2025/06/e-invoice-Wallonie-scaled.jpg",
      github:   "https://github.com/ArthurOttevaere/vat_number_check",
      featured: false,
    },
    {
      id:       "recommender_system",
      title:    "Recommender System",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06",   // ⚠️ example precise date — set the real finalisation day

      summary:  "Netflix-style recommendation system comparing 6 models (content-based, KNN, iALS, BPR) with diversity metrics, full frontend-backend integration, and explainable recommendations.",
      long:     "Netflix-style recommendation system comparing 6 models (content-based, KNN, iALS, BPR) with diversity metrics, full frontend-backend integration, and explainable recommendations.",
      highlights: [
        "Compares 6 recommendation models (content-based, KNN, iALS, BPR).",
        "Adds diversity metrics and explainable recommendations.",
        "Full frontend-backend integration on the MovieLens dataset.",
      ],
      tags:     ["Python", "API", "MovieLens", "scikit-learn", "Surprise"],
      cover:    "/assets/images/movix.jpg",
      github:   "https://github.com/ArthurOttevaere/Recommender_System_Assignments",
      featured: true,
    },
    {
      id:       "quantitative_decision_making",
      title:    "Multi-commodity Logistics Network",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06",
      summary:  "Designed and optimized a resilient multi-commodity logistics network using Mixed-Integer Programming, analyzing network robustness under geopolitical disruptions across three products.",
      long:     "Designed and optimized a resilient multi-commodity logistics network using Mixed-Integer Programming, analyzing network robustness under geopolitical disruptions across three products.",
      highlights: [
        "Optimised a multi-commodity network with Mixed-Integer Programming.",
        "Analysed network robustness under geopolitical disruptions.",
        "Modelled flows across three distinct products.",
      ],
      tags:     ["Python", "Optimization", "HTML Dashboard"],
      cover:    "https://c0.wallpaperflare.com/preview/631/640/43/boat-sea-ocean-tanker.jpg",
      github:   "https://github.com/ArthurOttevaere/QDM_GlobalFlow",
      featured: false,
    },
    {
      id:       "ai_gesture_recognition",
      title:    "AI Gesture Recognition",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06",
      summary:  "Comparative analysis of sequence modeling techniques for 3D gesture recognition, implementing DTW and Edit Distance algorithms from scratch and evaluating against machine learning baselines.",
      long:     "Comparative analysis of sequence modeling techniques for 3D gesture recognition, implementing DTW and Edit Distance algorithms from scratch and evaluating against machine learning baselines.",
      highlights: [
        "Implemented DTW and Edit Distance algorithms from scratch.",
        "Recognises 3D gestures using sequence modelling techniques.",
        "Benchmarked against machine learning baselines.",
      ],
      tags:     ["Python", "Gesture Recognition", "Machine Learning"],
      cover:    "https://bluewhaleapps.com/wp-content/uploads/2019/08/Guesture-recognition-technology-blog-feature-image.jpg",
      github:   "https://github.com/ArthurOttevaere/AI-GestureRecognition-Group6",
      featured: false,
    },
    {
      id:       "chwapi",
      title:    "Surgical Scheduling Optimization",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06",
      summary:  "A mathematical optimization model that rebuilds a hospital's surgical scheduling grid from scratch, taking into account patient flows and various operational constraints.",
      long:     "A mathematical optimization model that rebuilds a hospital's surgical scheduling grid from scratch, taking into account patient flows and various operational constraints.",
      highlights: [
        "Schedules 57 surgeons across 17 operating rooms.",
        "Optimises patient flow smoothing across a 54-bed day hospital.",
        "Stress-tests the grid against room failures and new surgeon arrivals.",
      ],
      tags:     ["XPress Mosel", "Python", "Optimization"],
      cover:    "https://www.umass.edu/sites/default/files/2026-06/NEWS-Operating%20Room%20Surgery%20viaAdobeStock.jpeg",
      github:   "https://github.com/ArthurOttevaere/surgical-scheduling-optimization",
      featured: false,
    }
  ],

  /* ── Home page "fanning deck" ───────────────────────────────────
     Pick exactly which project cards appear in the fanned deck on the
     home page, and in what order, by listing their `id`s below.
     The FIRST id lands centred/on top of the fan; the rest fan out
     alternating right, left, right, left... around it.
     Leave the array empty ([]) to fall back to the automatic pick
     (featured project first, then the first few others). */
  homeDeck: ["recommender_system", "chwapi", "f1", "quantitative_decision_making", "ai_gesture_recognition", "dash"],
};