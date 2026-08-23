/* =================================================================
   data.js — Your portfolio content. This is the ONLY file you need
   to edit to add projects, update your bio, or change links.
   =================================================================

   HOW TO ADD A PROJECT
   --------------------
   Copy the template below, paste it at the END of the `projects`
   array (before the closing `]`), and fill in your values.

   Every project automatically gets its own page at #/work/<id> — the grid
   card links straight to it. The fields under "for the project page" are all
   OPTIONAL: fill in what a project deserves, leave out the rest, and the page
   simply skips the blocks you didn't write. A project with only the required
   fields still gets a complete page.

   PROJECT TEMPLATE:
   -----------------
   {
     id:       "my-project",          // Unique ID — no spaces, no special chars.
     //                                  Also the page URL: #/work/my-project
     title:    "My Project Name",     // Displayed title
     cat:      "Academic",            // Category: "Academic" | "Personal"
     year:     "2025",               // Year as a string (fallback / coarse label)
     date:     "2025-06-15",         // OPTIONAL precise completion date.
     //                                 "YYYY-MM-DD" → "15 Jun 2025", "YYYY-MM" → "Jun 2025".
     //                                 Drives sorting too; omit it to fall back to `year`.
     summary:  "One-line summary.",  // Grid card + the lead line on the project page
     long:     "Detailed paragraph.", // Used as the page body when there's no `sections`
     highlights: [                   // Bullet points — same fallback role as `long`
       "First key point.",
       "Second key point.",
     ],
     tags:     ["Python", "SQL"],    // Tech stack — also the "Built with" list in the
     //                                 page rail, with logos pulled from `toolGroups`
     role:     "Solo",              // "Solo" or "Team" — a chip under the title
     cover:    "Generic",
     // DATA/ANALYTICS: "Dashboard" "Scatter" "TimeSeries" "Heatmap" "Clustering" "Regression"
     // TOOLS/TECH:     "Python" "SQL" "API" "Excel" "PowerBI" "ML"
     // DOMAIN:         "Finance" "HR" "Marketing" "Network" "Supply" "Climate"
     // MISC:           "F1" "Netflix" "Layoffs" "Report" "Survey" "Startup" "Map" "Academia" "Generic"
     // IMAGE URL:      "https://…"  or  "/assets/cover.jpg"  (any image path also works)
     github:   "#",
     featured: false,                // true for exactly ONE project to pin at top

     // ── Optional — for the project page ───────────────────────────────

     subtitle: "A second line under the title",
     context:  "Data Analytics course · UCLouvain",  // rail — defaults to `cat`
     duration: "6 weeks",                            // rail + a chip
     team:     "4 people",                           // rail + a chip
     links: [                        // extra links, on top of `github`
       { label: "Report", url: "https://…" },
     ],

     // Big numbers band, right after the first section. Skipped if absent.
     metrics: [
       { value: "900+", label: "reviews scraped" },
       { value: "6",    label: "models compared" },
     ],

     // The page body. Sections are numbered automatically (01, 02, 03 …).
     // A `body` entry is a plain string (a paragraph) or one of:
     //     { h: "Sub-heading" }     { list: ["…","…"] }     { quote: "…" }
     // which is how you get real structure without writing any HTML here.
     sections: [
       { title: "The context", body: [
           "A first paragraph.",
           "A second paragraph.",
       ]},
       { title: "The approach", body: [
           "What you did and why.",
           { h: "How it works" },
           { list: ["A step.", "Another step."] },
           { quote: "A line worth pulling out." },
       ]},
     ],

     // Results gallery. LEAVE IT OUT (or empty) AND NO CAROUSEL IS SHOWN.
     // One image → a plain figure; several → the scroll-snap film strip.
     // Drop the files in /assets/images/projects/<id>/. Any aspect ratio
     // works — images are shown whole, never cropped, on a soft plate.
     gallery: [
       { src:     "/assets/images/projects/my-project/result.png",
         caption: "What this screenshot shows" },
     ],
     galleryTitle: "Results",        // section heading — defaults to "Results"

     // Attachments — the files that come with the project: report, slide deck,
     // dataset, notebook, poster… EMPTY ARRAY → NO BLOCK ON THE PAGE.
     // Drop the files in /assets/files/<id>/, or point at any URL (Drive,
     // Notion, a PDF hosted elsewhere). The small kind label and the icon are
     // read off the file extension — pdf, pptx, xlsx, csv, zip, ipynb, py…
     //   label — what to call it. Omitted → the file name.
     //   note  — optional one-liner under the name.
     //   type  — optional override when the extension says nothing useful:
     //           "Report" "Slides" "Sheet" "Data" "Code" "Notebook"
     //           "Archive" "Poster" "Video" "Link"
     attachments: [
       { label: "Final report", url: "/assets/files/my-project/report.pdf",
         note:  "Full write-up, 24 pages" },
       { label: "Slide deck",   url: "https://…", type: "Slides" },
     ],
     attachmentsTitle: "Attachments", // section heading — defaults to "Attachments"

     // The "What I took away" block at the bottom. A skill with a concrete
     // note reads far better than a wall of badges. Plain strings work too.
     skills: [
       { name: "XGBoost", note: "Ensemble trained on eight seasons." },
     ],
   },

   ================================================================= */

window.PORTFOLIO_DATA = {

  /* ── Personal info ──────────────────────────────────────────── */
  profile: {
    name:           "Arthur Ottevaere",
    location:       "Tournai, BE",
    birth:          "2004-06-24",   // ISO date of birth — age is computed live from this

    /* About — small status line under your name/location. Leave "" to hide
       it entirely; only fill it in while it's actually true, e.g.
       "Looking for a Fall 2026 internship" or "Open to freelance work". */
    status: "Currently studying in Rotterdam",

    /* Bio paragraphs — each string becomes a <p> in the About page */
    bio: [
      "I'm a Business Engineering student in Tournai, finishing my Master's in Business Analytics. I love turning real datasets into things people can actually use like dashboards, short reports, or the occasional model.",
      "What I love most is building side projects end to end, just to test an idea or solve a daily issue.",
      "On the side I build small data projects for fun, usually around passions like Formula 1 and daily issues I want to solve. Some of them live on the projects page.",
      "I'm going on a semester abroad in Rotterdam in Fall '26, excited to meet new people and get a fresh perspective on things!",
    ],

    /* Short description shown under your name on the home page */
    tagline:  "Master's student in Business Engineering. I love turning messy data into things you can act on like dashboards, models, the occasional weekend project about Formula 1.",

    photo:    "/assets/images/avatar.png",    // Set to an image URL, or null for initials avatar

    /* CV — one PDF per language, hosted in /assets/cv. The first available
       entry is the primary one (opened by the nav "CV" button and the command
       palette). A single string still works too (cv: "https://…").

       You can leave all three lines here: the site checks which PDFs are
       really in /assets/cv and only lists those. Drop in just the EN and FR
       files and the language menu shows EN + FR — no NL. With a single PDF
       left there is no menu at all, the CV button downloads it directly. */
    cv: {
      en: "/assets/cv/arthur-ottevaere-cv-en.pdf",   // English (primary)
      fr: "/assets/cv/arthur-ottevaere-cv-fr.pdf",   // Français
      nl: "/assets/cv/arthur-ottevaere-cv-nl.pdf",   // Nederlands
    },
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
      {period: "2027-02 — 2027-05", title: "Data Consultant Internship", place: "EASI", type: "Internship"},
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
      title:    "F1 Duel — Prediction Game & Race Predictor",
      cat:      "Personal",
      year:     "2026",
      date:     "2026-07",
      summary:  "A season-long game where players predict each Grand Prix top 10 against a machine-learning benchmark, with rarity-weighted scoring, leagues and championship picks.",
      long:     "Players face an XGBoost/LightGBM ensemble trained on eight F1 seasons, scored by how rare their correct calls are. The model forecasts full race and qualifying orders, with SHAP key factors and Monte-Carlo probabilities per driver.",
      highlights: [
        "Rarity-weighted scoring: rarer correct calls are worth more.",
        "XGBoost/LightGBM ensemble on 8 seasons, leakage-safe temporal split.",
        "SHAP explanations and Monte-Carlo win/podium probabilities.",
        "Shipped end to end: Flask, Next.js on Vercel, Supabase.",
      ],
      tags:     ["Python", "XGBoost", "LightGBM", "FastF1", "Flask", "Next.js", "Supabase"],
      role:     "Solo — design & product",
      cover:    "/assets/images/f1-tracker.jpeg",
      github:   "https://github.com/ArthurOttevaere/f1_race_predictor",
      featured: true,

      /* ── The project page. This one is filled in as a worked example —
         every field is optional, and a block disappears while its field is
         empty, so the ones left blank here are simply the template. ─────── */
      /* `subtitle` is left empty on purpose — the title already says
         "Prediction Game & Race Predictor", so a second line would only
         repeat it. Use it on projects whose title is short. */
      subtitle: "",
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [
        { label: "Live site", url: "https://f1-duel.com", type: "Link" }
        // { label: "Report", url: "https://…" },
      ],

      metrics: [
        { value: "8",      label: "seasons of race data" },
        { value: "Top 10", label: "predicted per Grand Prix" },
        { value: "2",      label: "models in the ensemble" },
      ],
      sections: [
        { title: "The idea", body: [
            "Players predict the top 10 of every Grand Prix of the season, and are scored against a machine-learning benchmark rather than only against each other.",
            "Scoring is rarity-weighted: the rarer a correct call is across all players, the more it is worth. Calling an unlikely podium beats agreeing with the crowd.",
        ]},
        { title: "The model", body: [
            "An XGBoost/LightGBM ensemble trained on eight F1 seasons, with a leakage-safe temporal split so it is never validated on races it could already have seen.",
            { h: "What it outputs" },
            { list: [
              "Full race and qualifying orders for every Grand Prix.",
              "SHAP explanations surfacing the key factors behind each prediction.",
              "Monte-Carlo win and podium probabilities per driver.",
            ]},
        ]},
        { title: "Shipping it", body: [
            "The whole thing runs end to end: a Flask service for the model, a Next.js front end on Vercel, and Supabase behind the accounts, the leagues and the championship picks.",
        ]},
      ],

      /* Screenshots live in /assets/images/projects/f1/. Empty this array and
         the carousel disappears entirely. */
      gallery: [
        { src:     "/assets/images/projects/f1/landing.png",
          caption: "The pitch — next race countdown and the season-long duel" },
        { src:     "/assets/images/projects/f1/prediction.png",
          caption: "Building a top 10 before predictions lock, against the model's own entry" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/f1/, or point at any URL. The kind label and the icon
      // come from the extension; `type` overrides it, `note` is the one-liner
      // shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/f1/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/f1/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      skills: [
        { name: "XGBoost / LightGBM", note: "Ensemble trained on eight seasons, with a leakage-safe temporal split." },
        { name: "SHAP",               note: "Turned raw model output into readable key factors, prediction by prediction." },
        { name: "Monte-Carlo",        note: "Simulated race outcomes to get win and podium probabilities per driver." },
        { name: "FastF1",             note: "Pulled and cleaned timing and session data across eight seasons." },
        { name: "Next.js / Vercel",   note: "Built and deployed the front end players actually use." },
        { name: "Supabase",           note: "Accounts, leagues and championship picks, persisted end to end." },
      ],
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
      role:     "Team",
      cover:    "/assets/images/business-dashboard.jpg",
      github:   "https://arthuros.notion.site/Business-Data-Cleaning-and-Dashboard-Analysis-2a82a3f21be480b7b378f89e750e333a",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "4 people",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "Hundreds",   label: "rows cleaned in Power Query" },
        { value: "4",   label: "KPIs tracked on the dashboard" },
        { value: "6",      label: "different types of interactive filters" },
        // { value: "900+", label: "reviews scraped" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
      { title: "The brief", body: [
            "A four-person team acting as the data function of a fictional company: take the raw operational extract, make it trustworthy, and hand management something they can decide on without asking an analyst first.",
            "Four deliverables came out of it — a clean dataset, a written management report, an interactive Power BI dashboard, and a presentation of the findings.",
        ]},
        { title: "Getting the data trustworthy", body: [
            "Most of the work happened before any chart existed. Power Query handled the missing and inconsistent values, the date and category columns that had been typed by hand, and the merges between sources that only lined up once the keys were normalised.",
            "TODO — one concrete example here: the specific defect you found in the raw file and the rule you wrote for it. That single sentence is what separates this page from every other submission in the class.",
        ]},
        { title: "What the dashboard shows", body: [
            "Built for readers who don't write queries: the filters do the drilling, so a manager can go from company-level to a single product line without leaving the page.",
            { list: [
              "Sales performance over time, sliceable by segment.",
              "Customer value, to separate the accounts worth defending from the rest.",
              "Product-level results, surfacing the underperformers.",
            ]},
        ]},
        { title: "What we told management", body: [
            "Three recommendations came out of the analysis: tighten the discount policy, address the segments dragging on margin, and concentrate effort on the highest-value customers and products.",
            "TODO — put the number behind at least one of them. \"Discounts above X% stopped paying for themselves\" is an argument; \"optimise the discount policy\" is a bullet point.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/dash/.
      gallery: [
        { src: "/assets/images/projects/dash/dashboard.png", caption: "The dashboard, with filters and KPIs" },
        { src: "/assets/images/projects/dash/filters.png", caption: "The filters" },
        // { src: "/assets/images/projects/dash/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/dash/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/dash/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/dash/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
      { name: "Excel / Power Query", note: "Cleaned, reshaped and merged the raw extract into a dataset the whole team could build on." },
        { name: "Power BI",            note: "Interactive dashboard designed for non-technical readers rather than for analysts." },
        { name: "Business analysis",   note: "Turned the cleaned data into three concrete recommendations for management." },
        /* Add this one only if it's true — DAX measures are a real signal and
           worth naming explicitly:
        { name: "DAX",                 note: "Wrote the measures behind the KPIs and the time comparisons." },
        */
      ],
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
      role:     "Team",
      cover:    "/assets/images/cinema-reviews.jpeg",
      github:   "https://github.com/ArthurOttevaere/WebMining-Cinema-Reviews",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "A recommender that serves five models to real users, and an evaluation pipeline that keeps them honest",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "3 people",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
        { value: "5",  label: "carousels, five different models" },
        { value: "0",  label: "retraining when a new user signs up" },
        { value: "3",  label: "metric families in the evaluation" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
        { title: "The idea", body: [
            "A streaming-style home page built on MovieLens and enriched with TMDB metadata. A new user rates a handful of films during onboarding, and the page fills with personalised carousels a few seconds later.",
            "The point wasn't one model that wins. It was several models, each answering a different question, sitting next to each other where a user can feel the difference between them.",
        ]},
        { title: "Five carousels, five answers", body: [
            "Each row of the home page is a different algorithm, deliberately chosen so that they disagree:",
            { list: [
              "Based On What You Like — per-user RidgeCV regression on genome tags and TMDB content features.",
              "Viewers Like You Also Watched — user-based kNN with Pearson-baseline similarity and popularity re-ranking.",
              "Top Picks For You — implicit ALS, weighted matrix factorisation on the interaction matrix.",
              "Discover Something New — Bayesian Personalized Ranking with a novelty re-ranking pass.",
              "Trending — a live TMDB feed, and the only row that isn't a learned model.",
            ]},
            "A custom Jaccard similarity, implemented from scratch because Surprise doesn't ship one, runs in the offline pipeline alongside the rest.",
        ]},
        { title: "The problem nobody warns you about", body: [
            "A user who signs up today was not in the training set. Retraining four models on every registration isn't an option, so the backend estimates their latent vector in closed form — a folding-in step that places them in the existing factor space without touching the models.",
            "That buys instant recommendations, and it costs exactness: the served models reproduce the algorithms that were evaluated offline, not their precise offline scores. Naming that trade-off was part of the work.",
        ]},
        { title: "Measuring it", body: [
            "A reproducible pipeline scores every model on three families of metric, because no single number decides which recommender is better:",
            { list: [
              "Rating accuracy — RMSE and MAE, meaningful only for the models that actually predict ratings.",
              "Ranking — Hit-Rate@K and NDCG@K, over the full catalogue and under a 1-positive-vs-99-negatives protocol.",
              "Beyond accuracy — catalogue coverage, MIUF novelty and intra-list diversity.",
            ]},
            "TODO — the finding. Which model won which family, and the one result that surprised you. A pipeline that measures is table stakes; the sentence that says what it measured is the project.",
        ]},
        { title: "Shipping it", body: [
            "A single FastAPI process serves both the REST API and the web UI. Trained artifacts are too large for git, so they ship as a versioned GitHub Release and a launcher script fetches them on first run — clone, one command, working app.",
            "The frontend is deliberately dependency-free vanilla JavaScript: posters, watchlist, taste statistics, and an LLM-backed search assistant that degrades to a keyword matcher when no API key is present.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/netflix/.
      gallery: [
        // { src: "/assets/images/projects/netflix/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/netflix/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/netflix/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/netflix/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
        { name: "Matrix factorisation", note: "iALS and BPR on implicit feedback, with novelty re-ranking on the discovery row." },
        { name: "scikit-surprise",      note: "kNN baselines, plus a Jaccard similarity written from scratch where the library stopped." },
        { name: "Content-based ML",     note: "Per-user RidgeCV over genome tags and TMDB features." },
        { name: "RecSys evaluation",    note: "RMSE, NDCG@K, coverage, novelty and diversity in one reproducible pipeline." },
        { name: "FastAPI",              note: "One process serving the API, the models and the static frontend." },
        { name: "Reproducibility",      note: "Artifacts published as a Release and fetched by a launcher — clone and run, no training." },
      ],
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
      role:     "Team",
      cover:    "/assets/images/hr-analytics.png",
      github:   "https://arthuros.notion.site/HR-Predictive-Analytics-Optimizing-Talent-Retention-Employee-Insights-31f2a3f21be480f8a583d8042ec9fd95",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/layoffs/.
      gallery: [
        // { src: "/assets/images/projects/layoffs/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/layoffs/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/layoffs/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/layoffs/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
      ],
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
      role:     "Team",
      cover:    "/assets/images/student-registration.jpeg",
      github:   "https://arthuros.notion.site/Student-Registration-Management-System-26c2a3f21be48010922dc56b9c351f81?source=copy_link",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/coding_project/.
      gallery: [
        // { src: "/assets/images/projects/coding_project/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/coding_project/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/coding_project/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/coding_project/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
      ],
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
      role:     "Solo",
      cover:    "/assets/images/vat-verification.jpg",
      github:   "https://github.com/ArthurOttevaere/vat_number_check",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/vat_verification/.
      gallery: [
        // { src: "/assets/images/projects/vat_verification/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/vat_verification/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/vat_verification/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/vat_verification/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
      ],
    },
    {
      id:       "recommender_system",
      title:    "Recommender System",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06",
      summary:  "Netflix-style recommendation system comparing 6 models (content-based, KNN, iALS, BPR) with diversity metrics, full frontend-backend integration, and explainable recommendations.",
      long:     "Netflix-style recommendation system comparing 6 models (content-based, KNN, iALS, BPR) with diversity metrics, full frontend-backend integration, and explainable recommendations.",
      highlights: [
        "Compares 6 recommendation models (content-based, KNN, iALS, BPR).",
        "Adds diversity metrics and explainable recommendations.",
        "Full frontend-backend integration on the MovieLens dataset.",
      ],
      tags:     ["Python", "API", "MovieLens", "scikit-learn", "Surprise"],
      role:     "Team",
      cover:    "/assets/images/movix.jpg",
      github:   "https://github.com/ArthurOttevaere/Recommender_System_Assignments",
      featured: false,

     /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "A recommender that serves five models to real users, and an evaluation pipeline that keeps them honest",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "3 people",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
        { value: "5",  label: "carousels, five different models" },
        { value: "0",  label: "retraining when a new user signs up" },
        { value: "3",  label: "metric families in the evaluation" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
        { title: "The idea", body: [
            "A streaming-style home page built on MovieLens and enriched with TMDB metadata. A new user rates a handful of films during onboarding, and the page fills with personalised carousels a few seconds later.",
            "The point wasn't one model that wins. It was several models, each answering a different question, sitting next to each other where a user can feel the difference between them.",
        ]},
        { title: "Five carousels, five answers", body: [
            "Each row of the home page is a different algorithm, deliberately chosen so that they disagree:",
            { list: [
              "Based On What You Like — per-user RidgeCV regression on genome tags and TMDB content features.",
              "Viewers Like You Also Watched — user-based kNN with Pearson-baseline similarity and popularity re-ranking.",
              "Top Picks For You — implicit ALS, weighted matrix factorisation on the interaction matrix.",
              "Discover Something New — Bayesian Personalized Ranking with a novelty re-ranking pass.",
              "Trending — a live TMDB feed, and the only row that isn't a learned model.",
            ]},
            "A custom Jaccard similarity, implemented from scratch because Surprise doesn't ship one, runs in the offline pipeline alongside the rest.",
        ]},
        { title: "The problem nobody warns you about", body: [
            "A user who signs up today was not in the training set. Retraining four models on every registration isn't an option, so the backend estimates their latent vector in closed form — a folding-in step that places them in the existing factor space without touching the models.",
            "That buys instant recommendations, and it costs exactness: the served models reproduce the algorithms that were evaluated offline, not their precise offline scores. Naming that trade-off was part of the work.",
        ]},
        { title: "Measuring it", body: [
            "A reproducible pipeline scores every model on three families of metric, because no single number decides which recommender is better:",
            { list: [
              "Rating accuracy — RMSE and MAE, meaningful only for the models that actually predict ratings.",
              "Ranking — Hit-Rate@K and NDCG@K, over the full catalogue and under a 1-positive-vs-99-negatives protocol.",
              "Beyond accuracy — catalogue coverage, MIUF novelty and intra-list diversity.",
            ]},
            "TODO — the finding. Which model won which family, and the one result that surprised you. A pipeline that measures is table stakes; the sentence that says what it measured is the project.",
        ]},
        { title: "Shipping it", body: [
            "A single FastAPI process serves both the REST API and the web UI. Trained artifacts are too large for git, so they ship as a versioned GitHub Release and a launcher script fetches them on first run — clone, one command, working app.",
            "The frontend is deliberately dependency-free vanilla JavaScript: posters, watchlist, taste statistics, and an LLM-backed search assistant that degrades to a keyword matcher when no API key is present.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/netflix/.
      gallery: [
        // { src: "/assets/images/projects/netflix/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/netflix/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/netflix/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/netflix/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
        { name: "Matrix factorisation", note: "iALS and BPR on implicit feedback, with novelty re-ranking on the discovery row." },
        { name: "scikit-surprise",      note: "kNN baselines, plus a Jaccard similarity written from scratch where the library stopped." },
        { name: "Content-based ML",     note: "Per-user RidgeCV over genome tags and TMDB features." },
        { name: "RecSys evaluation",    note: "RMSE, NDCG@K, coverage, novelty and diversity in one reproducible pipeline." },
        { name: "FastAPI",              note: "One process serving the API, the models and the static frontend." },
        { name: "Reproducibility",      note: "Artifacts published as a Release and fetched by a launcher — clone and run, no training." },
      ],
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
      role:     "Team",
      cover:    "/assets/images/logistics-network.jpg",
      github:   "https://github.com/ArthurOttevaere/QDM_GlobalFlow",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "A cost-optimal logistics network, and seven ways to break it",
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "2 people",
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "€4.45M", label: "optimal cost of the baseline network" },
        { value: "+119%",  label: "cost of the worst-case shock" },
        { value: "704×",   label: "return on a €10,000 resilience hedge" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The problem", body: [
            "GlobalFlow is a third-party logistics operator routing three product families — fertilizers, semiconductors and battery components — across a four-tier network: 9 specialised suppliers, 5 intercontinental hubs, 15 candidate regional warehouses and 30 customers whose demand has to be met exactly. 59 nodes, 317 arcs, one shared infrastructure.",
            "Formally it is a Multi-Commodity Capacitated Fixed-Charge Network Design problem: route three commodities, decide which warehouses to open and which fixed-cost arcs to activate, minimise the total bill. We wrote it as a MIP and solved it exactly in Python with FICO Xpress.",
            "The real question was the one behind it. A network optimised for cost is not the same thing as a network that survives a bad year — and we wanted to know what that gap actually costs.",
        ]},
        { title: "Four formulations for the same optimum", body: [
            "The same problem can be written in several equivalent ways. They all return the same integer optimum; what changes is how tight the LP relaxation is, and therefore how hard the solver has to work. We compared four variants along two independent modelling axes:",
            { list: [
              "Axis W — the warehouse linking constraint, disaggregated per incident arc or aggregated into one bound per warehouse. Disaggregating tightens the bound: it stops the solver from saturating an arc while keeping the warehouse only half-open.",
              "Axis A — the fixed-arc capacity, aggregated over products or written per product. Disaggregating here loosens the bound, since summing the per-product constraints allows three times the shared capacity.",
            ]},
            "That predicts an ordering, and the numbers confirmed it: F0 (strong W, tight A) closes the LP–IP gap to 0.5343%, F3 (both axes loose) is worst at 0.7591%. F0 became the model used for everything that followed.",
            { quote: "Both axes have to be optimised jointly — pulling on one in the wrong direction undoes the other." },
        ]},
        { title: "The baseline optimum", body: [
            "Z* = €4,454,801, with 14 of the 15 warehouses open and only 11 of the 47 fixed arcs activated. Sydney stays shut — no Australian demand to justify it.",
            "The cost structure is lopsided in a way that shaped the rest of the project: fixed costs are 0.9% of the total, variable transport 99.1%. Semiconductors carry 44% of the flow but 63.8% of the variable cost, because their corridors are long and sit on the heaviest interzonal tariff surcharges.",
            { h: "Two structural weak points, visible before any shock" },
            { list: [
              "Singapore is the sole entry hub for every semiconductor supplier and part of the battery-component supply, and it feeds six regional warehouses.",
              "A single arc, Osaka → Chicago, is the only viable bridge from the Asian warehouse tier to North American demand — 11.6% of the whole variable cost on its own.",
            ]},
        ]},
        { title: "Breaking it on purpose", body: [
            "Phase 2 put that configuration through seven scenarios — a +40% tariff shock, an energy crisis, a Q4 hub surcharge, the closure of Singapore, a Korea–Europe blockade, a combined shock, and our own free scenario: a Strait of Hormuz escalation cutting Dubai's maritime routes to the Americas.",
            "Each one was solved under three response strategies — reroute on the surviving assets, adapt the configuration and pay the transition penalties, or redesign from scratch — 21 MIPs in total. Full redesign wins every time, as theory says it must, so the interesting number is the premium paid for operational inertia.",
            { list: [
              "S3, the combined Singapore closure plus energy crisis, costs +€5,291,249 (+118.78%) — far more than the sum of its parts, because the energy surcharge lands on a network already forced into its most expensive routing.",
              "S1 and S3 together account for 82% of the cumulative disruption cost. Both are the same single hub failing.",
              "The Korea–Europe blockade costs precisely nothing — not robustness, but a side effect of the same over-centralisation: those corridors were already dominated by the Singapore route.",
            ]},
        ]},
        { title: "What resilience actually costs", body: [
            "The fix is unglamorous. Pre-contract four backup air arcs from the Asian suppliers to Dubai at €2,500 each, and leave them carrying zero flow in normal operations. Total premium: €10,000, or +0.224% of the optimal cost.",
            "Across the seven-scenario portfolio, that hedge cuts the cumulative disruption bill from €9.66M to €2.61M — a 72.9% reduction, an aggregate ROI of 704×, and a break-even disruption probability of 0.14%. It also turns out to be a tariff-arbitrage instrument: under the tariff shock the pre-contracted arcs are cheap enough that the robust network ends up below its own optimum.",
            "The honest reading is that the €10,000 does not buy a better network. It buys the option not to improvise at 4.5× emergency air-freight rates on the day the hub closes.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/quantitative_decision_making/.
      gallery: [
        // { src: "/assets/images/projects/quantitative_decision_making/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Final report", url: "/assets/files/quantitative_decision_making/report.pdf",
          note:  "Full write-up, 10 pages" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "MIP modelling",      note: "A full multi-commodity fixed-charge network design — flow conservation, linking constraints, big-M tightening." },
        { name: "FICO Xpress",        note: "Built and solved 22 models to near-exact optimality from Python." },
        { name: "LP relaxation",      note: "Compared four equivalent formulations and explained the bound ordering before measuring it." },
        { name: "Scenario analysis",  note: "Seven disruptions × three response strategies, with sunk and transition costs made comparable." },
        { name: "Risk economics",     note: "Turned a structural vulnerability into a priced hedge, an ROI and a break-even probability." },
      ],
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
      role:     "Team",
      cover:    "/assets/images/gesture-recognition.jpg",
      github:   "https://github.com/ArthurOttevaere/AI-GestureRecognition-Group6",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/ai_gesture_recognition/.
      gallery: [
        // { src: "/assets/images/projects/ai_gesture_recognition/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/ai_gesture_recognition/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/ai_gesture_recognition/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/ai_gesture_recognition/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
      ],
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
      role:     "Team",
      cover:    "/assets/images/surgical-scheduling.jpeg",
      github:   "https://github.com/ArthurOttevaere/surgical-scheduling-optimization",
      featured: false,

      /* ── The project page ────────────────────────────────────────────
         Every field below is OPTIONAL and every block disappears while its
         field is empty — so this template can just sit here until you have
         something to put in it. Fill in what the project deserves. */
      subtitle: "",                 // a second line under the title
      context:  "",                 // rail line — defaults to the category
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        // { value: "900+", label: "reviews scraped" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      // A `body` entry is a plain string, or { h: "…" } / { list: [] } / { quote: "…" }.
      sections: [
        // { title: "The context", body: [
        //     "A first paragraph.",
        //     { h: "A sub-heading" },
        //     { list: ["A point.", "Another point."] },
        //     { quote: "A line worth pulling out." },
        // ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/chwapi/.
      gallery: [
        // { src: "/assets/images/projects/chwapi/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      // Attachments — report, slide deck, dataset, notebook… Files go in
      // /assets/files/chwapi/, or point at any URL. The kind label and the
      // icon come from the extension; `type` overrides it, `note` is the
      // one-liner shown under the name.
      attachments: [
        // { label: "Final report", url: "/assets/files/chwapi/report.pdf", note: "24 pages" },
        // { label: "Slide deck",   url: "/assets/files/chwapi/slides.pdf" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        // { name: "Python", note: "What you actually did with it." },
      ],
    },
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