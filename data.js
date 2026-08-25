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
      date:     "2025-10",
      summary:  "Nine years of messy sales data for a fictional furniture retailer, cleaned into a Power BI dashboard and read back to management as three places the margin was leaking.",
      long:     "Acting as the data function of AEKI, a fictional US furniture retailer, a four-person team consolidated nine years of raw sales extracts into a single trustworthy dataset, modelled it in Power BI around a fact table and three dimensions, and built an interactive dashboard on top. Six analytical axes — temporal, geographic, customer, product, discount and logistics — turned into a management report with costed recommendations.",
      highlights: [
        "Consolidated CSV and text extracts into one clean dataset, fixing a date format that changed mid-series and two order-of-magnitude outliers.",
        "Modelled a fact table with date, product and shipping dimensions, and wrote the DAX behind every KPI.",
        "Built a dynamic Top/Bottom-N product visual driven by RANKX, a disconnected table and a numeric parameter.",
        "Traced a −8% margin back to a single product sold at a 50% discount, and wrote the pricing rule that would have stopped it.",
      ],
      tags:     ["Excel", "PowerBI", "DAX", "Canva"],
      role:     "Team",
      cover:    "/assets/images/business-dashboard.jpg",
      github:   "https://arthuros.notion.site/Business-Data-Cleaning-and-Dashboard-Analysis-2a82a3f21be480b7b378f89e750e333a",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "Nine years of sales, six analytical axes, and three places the margin was quietly leaking",
      context:  "Data Analytics course · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "4 people",
      links:    [
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "$4.59M", label: "of sales analysed, 2014 to 2022" },
        { value: "12.5%",  label: "profit margin, stable across both cycles" },
        { value: "−8%",    label: "margin hiding inside a best-selling product" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The brief", body: [
            "A four-person team acting as the data function of AEKI, a fictional US furniture retailer: take the raw operational extracts covering 2014 to 2022, make them trustworthy, and hand management something they can decide on without asking an analyst first.",
            "Four deliverables came out of it — a consolidated dataset, an interactive Power BI dashboard, a written management report, and a presentation of the findings. Six analytical axes structured the work: temporal, geographic, customer, product, discount and logistics.",
        ]},
        { title: "Getting the data trustworthy", body: [
            "Most of the work happened before any chart existed. The source was a set of CSV and text files that first had to be consolidated into a single Excel workbook, and consolidating them exposed the defects.",
            { list: [
              "The date format changed mid-series — records before and after 2018 were encoded differently, which silently broke any chronological sort. Text-to-Columns re-parsed the whole column onto one standard.",
              "Two values were wrong by orders of magnitude: 3311000 should have been 33.11, and 14796 should have been 1.4796. Both were corrected against the surrounding data rather than deleted.",
              "Empty cells in profit, sales and discount were set to 0, so aggregations stopped silently skipping rows.",
              "Redundant fragments in the product and customer IDs were stripped — after confirming with the data manager that they carried no meaning.",
            ]},
            "One gap could not be fixed: 2018 is simply absent from the source. Rather than interpolate it, the year-on-year comparisons for that period were measured from 2017 to 2019 and the discontinuity was stated in the report.",
        ]},
        { title: "The model behind the dashboard", body: [
            "The clean data went into Power BI as a fact table (fact_sales) with dimensions for products and shipping, plus a dedicated dim_date table built specifically to make time navigation work properly rather than relying on the raw date column.",
            "The KPIs are card visuals over that model, with profit margin as its own measure — DIVIDE(SUM(Profit), SUM(Sales)) × 100 — so it recalculates correctly under every filter combination instead of being averaged.",
            { h: "The visual that took the actual work" },
            "The product comparison lets the reader choose Top or Bottom and how many items to show. That needed four pieces: a RANKX measure ranking products by sales, a disconnected table holding \"Top\" and \"Bottom\" feeding a slicer, a SELECTEDVALUE measure to read that slicer and flip the ranking direction, and a numeric range parameter for N. The sales and cost measures then return BLANK() for anything outside the selected range, so the chart filters itself.",
            "The shipping visual pairs sales and costs as clustered columns with average delivery time on a secondary axis, computed as AVERAGEX over DATEDIFF between order date and ship date.",
        ]},
        { title: "What nine years of sales say", body: [
            "Two growth cycles, 2014–2017 and 2020–2022, separated by a slowdown in 2018–2019. 2016 is the record year: +30% sales, +32% profit, +23% units. By 2022 the business is back to roughly its 2017 level.",
            "Through all of it the profit margin barely moves, oscillating between 10% and 13% and averaging around 12.5% — including through the slowdown. Growth came from volume, not from pricing, and the model held.",
            { h: "A seasonality you could schedule around" },
            "February is reliably the worst month of the year; September, November and December are the best. The pattern holds across customer types — Consumer at 50% of turnover, Corporate at 31%, Home Office at 19% — which makes it a genuine seasonal effect rather than one segment's habit.",
        ]},
        { title: "Where the margin leaks", body: [
            "Geography splits the country three ways. California (15K units, 13.2% margin) and New York (8,352 units, 20.8%) are the commercial backbone, together over a third of national sales. The Central Plains do the opposite — small volumes at margins above 16%, with South Dakota at 29.2% on just 114 units. And a handful of states lose money outright, North Carolina at −3.77% alongside Arkansas, while North Dakota, Montana, Wyoming and Idaho register no activity at all.",
            { h: "Discounts that don't buy anything" },
            "Plotting each customer's average discount against their total revenue, Power BI's clustering splits them into three groups. The third is the problem: customers receiving 20% to 40%+ discounts while generating low to moderate revenue, frequently at negative profit. The customers who actually spend cluster around moderate discounts — a big discount does not produce a big order.",
            { h: "One product, traced all the way down" },
            "The Canon imageCLASS 2200 is the cash cow: 40 units, over $123k in revenue, a 40% margin. The Cisco TelePresence EX90 is its mirror image. Twelve units sold across March 2014 and March 2019 at a 50% discount, running an 8% negative margin — sold below cost of goods, and a high sales figure the whole way down.",
            { quote: "It is also the Home Office segment's best-selling product. The one segment whose top seller loses money on every unit." },
        ]},
        { title: "The logistics nobody was watching", body: [
            "Across regions the ordering is consistent: Standard Class is slowest and carries the most volume, then Second, First, and Same Day fastest and marginal. Home Office customers are the exception, favouring First Class — they value speed over cost.",
            "Then the anomalies. In Maryland, First and Second Class take nearly the same time despite the price gap. In New Hampshire, Second Class is on average faster than First. Oregon shows Second Class slower than Standard, and Utah has First Class slower than Second. Customers in those states are paying for a service tier that does not exist.",
            "The likely causes are structural — distance from distribution centres, carriers without dedicated express capacity in the region, and stock shipped from distant warehouses when local inventory runs short.",
        ]},
        { title: "What we told management", body: [
            "Three pillars, each attached to a number rather than an intuition:",
            { list: [
              "Pricing governance — a hard floor on discounts for high-cost items, so nothing can be sold below COGS the way the EX90 was, plus separate pricing for the Home Office segment.",
              "Regional profitability audit — unit economics in Arkansas and North Carolina first, then the low-margin high-volume states like Florida and Colorado; consolidate the coastal hubs and develop the Central Plains without giving up their margins.",
              "Operational flow — shipping defaults matched to what each region actually delivers, marketing concentrated on the September-to-December peak with a stimulus campaign to lift February, and stock planned against that seasonality.",
            ]},
            "The underlying finding is the one worth keeping: AEKI's model is sound, and every problem found was a leak rather than a structural fault. High sales volume never guaranteed profitability, and it took six different angles on the same dataset before that showed up clearly.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/dash/.
      gallery: [
        { src: "/assets/images/projects/dash/dashboard.png", caption: "The dashboard: four KPIs, monthly trend, quantity by state, and the discount, product and shipping visuals underneath." },
        { src: "/assets/images/projects/dash/filters.png", caption: "The filter pane — period, customer, product and location, plus the Top/Bottom selector and the N parameter driving the product chart." },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Management report", url: "/assets/files/dash/report.pdf",
          note:  "16 pages, including the cleaning log and the DAX behind each visual" },
        { label: "Slide deck",        url: "/assets/files/dash/slides.pdf",
          note:  "Presentation of the findings, 15 slides" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "Excel / data cleaning", note: "Consolidated CSV and text extracts, re-parsed a date format that changed mid-series, and fixed order-of-magnitude outliers." },
        { name: "Power BI",              note: "Fact and dimension model with a dedicated date table, and an interactive report built for readers who don't write queries." },
        { name: "DAX",                   note: "RANKX, SELECTEDVALUE and a numeric parameter behind a self-filtering Top/Bottom-N visual; AVERAGEX over DATEDIFF for delivery times." },
        { name: "Business analysis",     note: "Six analytical axes over the same dataset, converging on three costed recommendations." },
        { name: "Reporting",             note: "Writing findings so a manager can act on them — the discount rule, not \"optimise the discount policy\"." },
      ],
    },
    {
      id:       "netflix",
      title:    "Web Mining: Cinema Reviews Analysis",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-01-06",
      summary:  "900 professional film reviews scraped from RogerEbert.com, then read three ways — as text, as sentiment, and as a network of semantically linked films.",
      long:     "A breadth-first crawl of RogerEbert.com collected 900 long-form film reviews. An NLTK + TF-IDF/SVD pipeline turned them into a 34,000-term vector space, K-Means recovered twelve themes without supervision, and a semantic similarity graph of 892 films exposed which works hold the corpus together.",
      highlights: [
        "Crawled 900 long-form reviews with a depth-limited BFS over the site's own internal citations.",
        "Cut 840k raw tokens to 307k across a 34,297-term vocabulary, then compressed to 150 SVD components.",
        "Found twelve unsupervised themes, and a war cluster rated 3.40/4 while scoring negative on sentiment.",
        "Built a small-world graph — 892 nodes, 6.90 hops on average — and ranked it by PageRank, betweenness and information centrality.",
      ],
      tags:     ["Python", "NLTK", "scikit-learn", "NetworkX", "Gephi"],
      role:     "Team",
      cover:    "/assets/images/cinema-reviews.jpeg",
      github:   "https://github.com/ArthurOttevaere/WebMining-Cinema-Reviews",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "What film critics actually say, and which films hold the map together",
      context:  "Web Mining course · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "3 people",
      links:    [                   // extra links, on top of `github`
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "900",  label: "reviews scraped by breadth-first crawl" },
        { value: "12",   label: "themes recovered without supervision" },
        { value: "6.90", label: "hops between any two films, on average" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The question", body: [
            "Film ratings are a summary of an argument, and summaries lose things. The project set out to test how much: do the words of a review actually line up with the stars awarded, and what themes emerge between reviews when nobody labels them in advance?",
            "The corpus is RogerEbert.com, and only RogerEbert.com. Unlike IMDb, it publishes long essays by professional critics — an average of 933 words per review — with a consistent editorial structure and a rich evaluative vocabulary. That narrow choice is also the main bias: one site means one house style, and stylistic homogeneity is exactly the kind of thing a semantic model will happily mistake for meaning.",
        ]},
        { title: "Crawling a blog on purpose", body: [
            "The collection is a breadth-first search rather than a bulk download. Seeds come from the site's AJAX feed of recent reviews; each visited page is then parsed for hyperlinks to other reviews, which join a queue. Only URLs on the domain and matching /reviews/ survive the filter, and a depth constraint (< 2) keeps the crawl on direct citations instead of letting it diverge.",
            "That matters for what comes later: reviews are not sampled at random but through the editorial links critics themselves draw between films, so communities emerge from the site's own structure.",
            { h: "What each page yields" },
            { list: [
              "Title from the <h1>, used as the unique node identifier in the graph.",
              "Score, read off the CSS classes of the star widget.",
              "Full text from the paragraphs of the main container — the input to every text analysis.",
              "Metadata: year, director, cast, runtime, genre, author, publication date.",
              "Parent URL, which is what reconstructs the edges of the citation graph.",
            ]},
            "Everything lands in a frozen reviews_final_900.csv, so the text mining and the link analysis run on the exact same corpus.",
        ]},
        { title: "From 840,000 tokens to a vocabulary", body: [
            "HTML cleaning is not linguistic cleaning. An NLTK pipeline normalises case and strips non-alphabetic characters, tokenises, then POS-tags — the tagging is the pivot of the whole pipeline, because it decides what gets lemmatised how and which named entities get dropped.",
            "Lemmatisation is conditional rather than blunt: wordnet.VERB is applied strictly to verbs, so actions normalise to the infinitive while adjectives keep their default treatment. Stemming would have flattened the comparatives, and the comparatives are where a critic's intensity lives.",
            "Two statistical filters then cut the noise — min_df = 2 removes hapax and typos, max_df = 0.5 removes terms present in over half the corpus, \"film\" included. The corpus falls from 839,744 to 307,367 tokens (−63%) over a final dictionary of 34,297 unique terms.",
            { h: "Vectors that can be explained" },
            "TF-IDF over unigrams and bigrams was chosen over BERT or Doc2Vec deliberately: this is an exploratory analysis, and being able to name the terms that make two reviews similar was worth more than capturing subtler semantics inside a black box. Truncated SVD compresses to 150 components, followed by L2 normalisation — on a unit sphere, minimising euclidean distance is maximising cosine similarity, so review length stops distorting proximity.",
            "The sanity check held up. A Bug's Life and Antz score 0.945 — different films, same ants, same release window, near-identical lexical field. Queen of the Damned and Nosferatu sit at 0.858 across decades on vampirism alone. And Dog Day Afternoon shows up three times over, a lexical hub of suspense and drama.",
        ]},
        { title: "What the ratings hide", body: [
            "The score distribution is lopsided: 73.1% of reviews sit above 3 stars, under 7% are harsh. That is editorial positivity bias — a site that reviews what deserves to be seen. Higher-rated films also get longer reviews, with the 4/4 category carrying both the longest texts and the widest spread.",
            "Lexical richness runs slightly the other way. Type-Token Ratio clusters between 0.75 and 0.90, but drifts from about 0.85 on the harshest reviews down to 0.80 on the best-rated ones — a hint that panning a film takes more argumentative work, tempered by the fact that TTR is itself sensitive to length.",
            "VADER's compound score does correlate positively with the rating, and so does the positive/negative word ratio. But for any single score the compound value spans nearly the whole range, and some 2.5-star reviews are more lexically positive than 4-star ones.",
            { quote: "A favourable review can be full of reservations, and a negative one can still praise. The star rating is a summary, not the argument." },
            { h: "Where the judgement actually lands" },
            "Splitting each review into five narrative segments and scoring them separately shows the discriminating moment is the ending, not the opening. Outstanding films (3–4) open at 0.29, dip to 0.22 as reservations get aired, and close at 0.55. Disappointing films (0–2) open near-neutral at 0.11, bottom out at 0.00, rise at the climax — even a bad review finds something to like — and then settle back to 0.14.",
        ]},
        { title: "Twelve themes, and one paradox", body: [
            "Rather than trusting declared genres, K-Means was run on the SVD space for K from 2 to 12, scored by silhouette on cosine distance. K = 12 won at 0.032 — a low value, and an honest one: thematic boundaries in text are diffuse, and no partition of a review corpus is going to be clean.",
            "The clusters are readable anyway. Musical carries the highest average sentiment of the corpus (+0.890), Crime/Thriller the lowest (−0.454), Horror close behind (−0.353). A 16-document cluster isolates films about race with real precision.",
            "The interesting one is War. It holds the highest average rating in the corpus, 3.40/4, on a compound sentiment of −0.247. VADER is not wrong — war, soldier, bomb, fight is a negative lexical field — it is measuring the subject matter while the rating measures the film. Seeing the two come apart is the point of running both.",
        ]},
        { title: "The corpus as a network", body: [
            "The last phase rebuilds the corpus as an undirected graph: nodes are reviews, edges are semantic similarity. A stricter stopword list strips generic cinema jargon first, so two reviews cannot be joined by shared industry tics alone.",
            "Edges follow a two-threshold rule rather than one global cut — each film links to its 4 nearest neighbours inside its own theme (similarity > 0.30), and may open a bridge to a different theme only at a much stricter > 0.50. Cohesion inside, selectivity across.",
            { h: "A small world with islands" },
            "892 nodes, a diameter of 15 and an average shortest path of 6.90: any two films are about seven semantic steps apart. But the radius is 1, which is not a sign of tightness — it exposes small disconnected components, niche documentaries and codified horror that never join the giant component. Not every film blends into the mainstream.",
            "The spectral partition on the Fiedler vector splits the graph almost evenly, 463 against 429, and the split is not thematic — the major genres appear on both sides. Whatever separates the two halves is stylistic, not topical.",
            { h: "Which films matter, and in which sense" },
            { list: [
              "Degree and PageRank agree strongly (rs = 0.93) and both crown Star Wars (Ep. IV) — the lexical reference point of the sci-fi cluster.",
              "Betweenness picks out something else entirely: Is This Thing On? tops it as the sole shortest-path bridge between otherwise disjoint communities.",
              "Information centrality, computed from the pseudo-inverse of the Laplacian (L+) so that all paths count rather than only the shortest, saturates at 1.0 for nine films including Misery. Its correlation with degree is −0.17: these are not blockbusters with generic vocabulary, they are the load-bearing members of specific groups.",
              "Closeness is the cautionary one — a perfect 1.0 for La Femme Nikita measures a tiny isolated island, while Star Wars scores 0.17 because real centrality still has to cross a lot of graph.",
            ]},
            "Averaging Floyd-Warshall distances between clusters finally draws the map: crime, action and family sit close together on shared vocabulary, while Musical is a genuine semantic outlier — 11.8 hops from the action cluster, the largest distance in the matrix.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/netflix/.
      gallery: [
        { src:     "/assets/images/projects/netflix/network-graph.png",
          caption: "The similarity graph laid out in Gephi, coloured by the twelve K-Means themes — dense cores, thin bridges, and a few islands off the main component." },
        { src:     "/assets/images/projects/netflix/score-distribution.png",
          caption: "Score distribution across the 900 reviews: 73.1% above 3 stars, and almost nothing below 1.5 — the positivity bias that shapes every later result." },
        { src:     "/assets/images/projects/netflix/sentiment-trajectory.png",
          caption: "Sentiment across the five narrative segments. Both groups rise at the climax; only the conclusion really separates them." },
        { src:     "/assets/images/projects/netflix/wordcloud.png",
          caption: "The most frequent terms after filtering — narrative words (woman, world, show) sitting next to evaluative ones (love, best)." },
        { src:     "/assets/images/projects/netflix/cluster-distances.png",
          caption: "Average shortest-path distance between clusters. Crime, action and family are neighbours; Musical is the outlier at 11.8 hops from action." },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Final report", url: "/assets/files/netflix/report.pdf",
          note:  "Full write-up in French, 24 pages including the 16 annexes" },
        { label: "Slide deck",   url: "/assets/files/netflix/slides.pdf",
          note:  "Defence presentation, 29 slides" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "Web scraping",       note: "Depth-limited BFS over a site's own citations, filtered to /reviews/ and parsed with BeautifulSoup into a frozen CSV." },
        { name: "NLP preprocessing",  note: "NLTK tokenisation, POS tagging and conditional lemmatisation that keeps comparatives — and the critic's intensity — intact." },
        { name: "TF-IDF & SVD",       note: "150 latent components, L2-normalised so euclidean distance and cosine similarity coincide." },
        { name: "K-Means clustering", note: "Silhouette-selected K on text with genuinely diffuse boundaries, and the honesty to report a 0.032 score." },
        { name: "VADER sentiment",    note: "Compound scores, positive/negative ratios, and a five-segment narrative trajectory per review." },
        { name: "Graph analysis",     note: "PageRank, betweenness and information centrality via the Laplacian pseudo-inverse, laid out in Gephi." },
      ],
    },
    {
      id:       "layoffs",
      title:    "HR Predictive Analytics",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-01-15",
      summary:  "A full SEMMA data-mining pass over 3,025 employee surveys: satisfaction turned out to be predictable, stress refused to be, and saying so was the result.",
      long:     "A complete data-mining study of workplace well-being on a 3,025-employee survey, run end to end through the SEMMA methodology. Four supervised models predict satisfaction and stress, two clustering methods segment the workforce into five profiles, and the honest finding is that one of the two targets cannot be explained by the data at all.",
      highlights: [
        "Ran the full SEMMA cycle — Sample, Explore, Modify, Model, Assess — on 3,025 observations and 23 variables.",
        "Binarising the targets lifted satisfaction accuracy from 49% to 74%, and exposed that stress had no signal at all.",
        "Hierarchical clustering split the workforce into five interpretable profiles at a silhouette of 0.5614.",
        "Chose logistic regression over better-scoring black boxes, because the question was which levers to pull.",
      ],
      tags:     ["R", "Python", "Orange Data Mining"],
      role:     "Team",
      cover:    "/assets/images/hr-analytics.png",
      github:   "https://github.com/ArthurOttevaere/HR-Predictive-Analytics",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "One target you can model, one you can't, and the discipline to report both",
      context:  "Data Mining course · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "2 people",
      links:    [
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "3,025", label: "employee surveys, 23 variables" },
        { value: "74%",   label: "accuracy on satisfaction, up from 49%" },
        { value: "−0.030", label: "MCC on stress — worse than guessing" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The brief", body: [
            "HR departments increasingly want quantitative answers about well-being at work: what drives satisfaction, what drives stress, and which employees resemble which. This project takes a 3,025-row \"Employee Survey\" dataset from Kaggle — 23 variables spanning personal, professional and organisational attributes — and runs it end to end through SEMMA: Sample, Explore, Modify, Model, Assess.",
            "Three questions were set in advance, each with a hypothesis attached, so that the modelling would have something to be right or wrong about:",
            { list: [
              "Stress — do workload, sleep, physical activity and work–life balance explain and predict it?",
              "Satisfaction — do a good work environment, more training and a senior position explain and predict it?",
              "Segmentation — can employees be grouped into homogeneous profiles usable by an HR team?",
            ]},
            "The data is clean in a way real HR data rarely is: zero missing values, and outliers that stay plausible for a working population, so none were removed. 80% went to training (2,420 rows), 20% held out for the final assessment (605).",
        ]},
        { title: "What exploration already gave away", body: [
            "The average respondent is 35.7, has 9.1 years of experience, sleeps 7 hours, works in a team of 16, and receives 37 hours of training a year. Self-declared stress is low (1.74/5) and satisfaction moderate (3.39/5).",
            "The correlation matrices split the variables into two worlds. One is a tight career block — age, experience, number of previous employers, team size, direct reports and annual training hours all move together, up to 0.84 between age and training hours. The other is everything to do with personal habits, which floats free of all of it.",
            { h: "Satisfaction has a structure; stress does not" },
            "Satisfaction correlates, modestly but consistently, with work environment (0.250) and work–life balance (0.249), and negatively with workload (−0.248). Stress correlates with essentially nothing — every coefficient in its row sits within a whisker of zero.",
            "The contingency tables say the same thing more bluntly. Cross stress against workload and the distribution is flat: employees reporting the heaviest workload are no more likely to report high stress than anyone else. Same for work–life balance. Same for overtime, where more than six employees in ten do none regardless of their stress level.",
        ]},
        { title: "When multi-class prediction fails", body: [
            "The first modelling pass tried to predict the exact 1–5 score for both targets, using a decision tree (depth 10, minimum 20 instances per leaf), a random forest (500 trees) and a logistic regression.",
            "It didn't work. The best model on satisfaction reached 49.8% accuracy — wrong every other employee — with an F1 around 0.40 and most errors falling between adjacent classes. The boundary between \"3\" and \"4\" on a subjective survey scale is simply too noisy to learn, and the over-representation of scores 3 to 5 pushed the models toward the majority classes.",
            "So the targets were binarised: satisfaction becomes 1 at ≥ 4, stress becomes 1 at ≥ 3, with the thresholds read off the observed distributions. It trades precision of output for reliability of output, which is the right trade for the actual managerial question — not what score an employee would give, but whether they sit in the at-risk group or the satisfied one.",
        ]},
        { title: "One target improves, the other exposes itself", body: [
            "On satisfaction, binarisation worked. Logistic regression reaches 74.0% accuracy, an AUC of 0.779 and an F1 of 0.737, with gradient boosting and the random forest within a point of it. The MCC doubled, from 0.294 to 0.464.",
            "On stress, the same transformation produced the trap worth the whole project. Accuracy jumps to 78.5% — better, on paper, than the satisfaction model. But the MCC collapses to 0.057 for logistic regression and to −0.030 for the random forest, which is fractionally worse than guessing.",
            { quote: "The accuracy is real and completely meaningless: with 1.74/5 average stress, always predicting \"not stressed\" is already right most of the time." },
            "Exploration and modelling converge on the same verdict, so the first hypothesis is refuted outright. Stress is not badly modelled here — it is absent from this data. Whatever drives it (management quality, psychological pressure, events outside work) was never collected, and no model recovers a variable that isn't there.",
        ]},
        { title: "Which levers actually move satisfaction", body: [
            "Four models finished within a point of each other on satisfaction, so the choice fell to logistic regression on the strength of being a white box — the coefficients name the levers, which is what an HR department was asking for in the first place.",
            "A depth-3 decision tree, built purely to be read, confirms the same hierarchy without human intervention: it splits first on workload, then on work environment, then on work–life balance. That an unsupervised split-finder lands on exactly the three variables the correlation analysis flagged is the strongest validation in the report.",
            "The second hypothesis is therefore only half right. The work environment matters, but job level and training hours do not — satisfaction is spread evenly across hierarchy levels, and training volume tracks a career trajectory rather than how anyone feels about their job.",
        ]},
        { title: "Five profiles, built from careers not feelings", body: [
            "Segmentation used hierarchical clustering (Ward linkage on euclidean distance, categorical variables one-hot encoded and numerics scaled to 0–1) against K-means as a check. Training hours were deliberately left unscaled — the spread between a leader and an intern is a structural fact, and normalising it would have erased the signal.",
            "K-means peaked at K = 2 (silhouette 0.546), which is statistically tidy and analytically useless; its best interpretable partition was K = 5 at 0.512. Hierarchical clustering reached 0.5614 on the same five groups, and the dendrogram justifies the cut visually rather than by an a priori K, so it won.",
            { h: "The five groups" },
            { list: [
              "C1 — Experienced leaders (10.1%): senior and lead roles, large teams, many reports, 54–64 h of training.",
              "C2 — Heterogeneous (39.6%): the largest and least defined group, with a silhouette of only 0.379 and no clear signature beyond high training volume.",
              "C3 — Consolidating professionals (23.7%): mid-level, intermediate experience, no direct reports, 30–40 h of training.",
              "C4 — Interns and beginners (6.7%): the cleanest cluster at 0.684 — young, no experience, no reports, ~10 h of training.",
              "C5 — Developing juniors (19.9%): young with limited experience, small teams, 20–23 h of training.",
            ]},
            "The third hypothesis is fully validated, and its shape is the interesting part: the clusters are drawn entirely by demographic and career variables — age, experience, hierarchy, training, responsibilities. Stress and satisfaction contribute nothing to the segmentation. Well-being cuts across employee profiles instead of defining them, which is precisely why an HR policy cannot target it by segment alone.",
        ]},
        { title: "What we told HR", body: [
            "Three recommendations, each tied to a result rather than to intuition:",
            { list: [
              "Act on the levers that measure: work environment, workload and flexibility policies are where satisfaction actually responds — job titles and training budgets are not.",
              "Stop trying to quantify stress with this instrument. It needs qualitative tools — internal interviews, feedback mechanisms — because the survey demonstrably does not capture it.",
              "Use the five profiles for targeted policy, knowing they describe career stages and not states of mind.",
            ]},
            "The wider lesson is the one the accuracy figure on stress nearly hid: not every intuitively relevant variable is predictive, and a metric chosen to flatter an imbalanced dataset will happily say so.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/layoffs/.
      gallery: [
        { src:     "/assets/images/projects/layoffs/correlation-matrix.png",
          caption: "Spearman correlations. The career block glows in the top-left; the Stress row is flat across the board." },
        { src:     "/assets/images/projects/layoffs/target-distributions.png",
          caption: "The two targets: satisfaction skewed toward 4, stress piled almost entirely on 1 — the imbalance that made accuracy misleading." },
        { src:     "/assets/images/projects/layoffs/decision-tree.png",
          caption: "A depth-3 tree on binary satisfaction, kept readable on purpose. It splits on workload, then work environment, then work–life balance." },
        { src:     "/assets/images/projects/layoffs/dendrogram.png",
          caption: "The dendrogram, cut just below a height of 200 — five clusters, before the fusion heights jump and inertia is lost." },
        { src:     "/assets/images/projects/layoffs/summary-poster.jpg",
          caption: "The one-page summary poster: the whole SEMMA pipeline, from research questions to HR recommendations." },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Final report",     url: "/assets/files/layoffs/report.pdf",
          note:  "Full write-up in French, 48 pages" },
        { label: "Technical annex",  url: "/assets/files/layoffs/technical-annex.pdf",
          note:  "The R and Python scripts behind every figure, 14 pages" },
        { label: "Summary poster",   url: "/assets/files/layoffs/summary-poster.pdf",
          note:  "The whole study on one page", type: "Poster" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "SEMMA",              note: "A full cycle — Sample, Explore, Modify, Model, Assess — where each phase actually constrained the next." },
        { name: "Orange Data Mining", note: "Built and compared four supervised models and two clustering methods, letting the algorithms find their own cut points." },
        { name: "R & Python",         note: "RStudio, pandas, seaborn and matplotlib for the exploratory statistics and every figure in the report." },
        { name: "Metric literacy",    note: "Reading MCC against accuracy on an imbalanced target, and catching a 78.5% model with no discriminative power." },
        { name: "Clustering",         note: "Ward hierarchical clustering against K-means, chosen on silhouette and on whether the cut could be justified." },
        { name: "Model selection",    note: "Picking logistic regression over marginally better black boxes because the deliverable was a list of levers." },
        { name: "Reporting negatives", note: "Writing up a refuted hypothesis as a finding instead of quietly dropping the target." },
      ],
    },
    {
      id:       "coding_project",
      title:    "Student Registration Management System",
      cat:      "Academic",
      year:     "2024",
      date:     "2024-12",
      summary:  "A command-line registry for 1,005 students and 61 courses, written in Python on top of an Excel workbook — ten menu actions covering everything from adding a student to exporting course statistics.",
      long:     "A university registry has to be editable by people who do not write code, which in practice means it lives in an Excel file. This project keeps the workbook as the database and puts a Python command-line application in front of it: guided data entry with validation on every field, generated student IDs, search, sorting, filtering, and statistics per course or per student — with any view exportable to a new spreadsheet.",
      highlights: [
        "Ten menu actions over a 1,005-row, 73-column workbook covering personal details and grades for 61 courses from BA1 to MA2.",
        "Automatic student IDs built from consonants and birth year, regenerated until unique against the whole registry.",
        "Validation on every field at entry — leap years, phone format, grades bounded to 0–20, enumerated campuses and curricula.",
        "Two sentinel values separate \"not enrolled\" from \"enrolled, no grade yet\", so no statistic is polluted by a missing mark.",
      ],
      tags:     ["Python", "pandas", "openpyxl", "Excel"],
      role:     "Team",
      cover:    "/assets/images/student-registration.jpeg",
      github:   "https://github.com/ArthurOttevaere/Student-Registration-Management-System",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "Ten menu actions, 1,005 students, and an Excel file that stays the source of truth",
      context:  "MINFO1302 Coding Project · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "2 people",
      links:    [
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "1,005", label: "student records in the registry" },
        { value: "61",    label: "courses tracked, BA1 to MA2" },
        { value: "10",    label: "actions in the main menu" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The brief", body: [
            "Build something in Python that manages a real university registry: add students, find them, change them, and answer questions about their results. The interesting constraint was not the code — it was that a registry belongs to an administrative office, and an administrative office works in Excel.",
            "So the workbook stays the database. The script reads it, writes back to it, and every view it produces can be exported as a new spreadsheet. Nobody has to learn a new tool to keep using the data after the program has closed.",
            "The dataset it ships with covers 1,005 students across four campuses and two curricula, with their personal details and their grades in 61 courses spread over the five years from BA1 to MA2.",
        ]},
        { title: "An Excel file as the database", body: [
            "pandas reads `Sheet1` into a DataFrame, the operation happens in memory, and the sheet is written back in place. That is the whole storage layer — no database, no schema migration, no server.",
            "It buys two things and costs one. It buys a file anyone can open, and it buys a format the rest of the faculty already exchanges. It costs atomicity: adding one student rewrites the entire workbook, so the program tells you plainly to keep a backup before experimenting.",
            "The path to the workbook is resolved from the script's own location rather than from the working directory, so the pair of files can be moved anywhere together and still find each other. Startup checks for both the missing file and the missing sheet, and exits with a readable message instead of a traceback.",
        ]},
        { title: "Giving every student an ID", body: [
            "New students need an identifier that is short, human-readable, and guaranteed not to collide with any of the thousand already in the file.",
            "The scheme takes the first three consonants of the first name, the first two and the last consonant of the surname, the birth year, and one random digit — `mrtlry20010` for a Martin Laurey born in 2001. The random digit is what makes it survive twins and namesakes: the generated ID is checked against the set of existing IDs and rerolled until it is unique.",
            { quote: "The readable part is a hint, not a key. The digit at the end is what actually does the work." },
        ]},
        { title: "Validating at the point of entry", body: [
            "Every field in the add-a-student flow sits inside its own loop that refuses to move on until the input is valid, because a registry only stays trustworthy if bad data never reaches it in the first place:",
            { list: [
              "Dates of birth are checked month by month, including the 30-day months and February — with the leap-year rule applied to the year actually typed.",
              "Phone numbers must be ten digits starting with 04; grades must be integers between 0 and 20.",
              "Academic year, curriculum and campus are checked against closed lists, so no free-text variant of \"Louvain-la-Neuve\" ever enters the file.",
              "The year of birth is bounded by the current year, computed at runtime rather than hard-coded.",
            ]},
            "The rejection messages are printed in red and the prompt simply comes back. It is the least clever part of the project and the part that does the most for the data.",
        ]},
        { title: "Two kinds of missing", body: [
            "A blank grade cell is ambiguous: it can mean the student is not enrolled in that course, or that they are enrolled and the exam has not been marked yet. Averaging over either one silently produces a wrong number.",
            "So the registry distinguishes them. A course a student never takes is stored as -2; a course they are enrolled in without a result yet is -1. When a student is added, their year determines which courses get grades entered and which get which sentinel — a BA3 student is asked for two years of marks and has their third year opened as enrolled-but-unmarked.",
            "Every statistic then excludes both values before computing anything, and the failure filter reports three separate groups rather than one: students who failed, students still waiting for a mark, and students who were never enrolled. Three states, three answers.",
        ]},
        { title: "Ten actions behind one menu", body: [
            "The menu is a dictionary mapping each key to a label and the function that implements it, so the loop that prints the options and the loop that dispatches them are the same loop — adding an action means adding one line.",
            { list: [
              "Add, search (five different criteria), modify any field, delete with confirmation.",
              "Sort the registry by name, surname, ID, date of birth or academic year, ascending or descending.",
              "Filter by who passed or failed a given course, or by bachelor versus master.",
              "Statistics across all courses, and statistics for a single student — min, max, mean, median, standard deviation.",
              "All grades for one course, or all courses for one student.",
            ]},
            "Results are printed through `tabulate` in a boxed grid rather than as raw DataFrame output, and `colorama` separates prompts from errors from confirmations. After each view the program asks whether to save it, names the file for you if you forget the extension, and returns to the menu.",
        ]},
        { title: "What the code taught me", body: [
            "Reading it back a year later, the lessons are not in the features. The startup carefully builds an absolute path to the workbook — and then three of the later functions open it by bare filename anyway, which works only as long as you launch the script from its own directory. The same information was established once and then quietly re-derived, worse, in four different places.",
            "The statistics functions select grade columns by position instead of by name, which is exactly the kind of assumption that breaks the day someone inserts a column. Naming the columns would have cost nothing and stayed correct.",
            "And every write rewrites the whole file. At a thousand rows that is invisible; it is also the reason the README tells you to keep a backup. Those three habits — resolve a path once, address data by name, and know what your write actually touches — are what I took from this project, and they came from the code being long enough to start disagreeing with itself.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/coding_project/.
      gallery: [
        // { src: "/assets/images/projects/coding_project/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        // { label: "Final report", url: "/assets/files/coding_project/report.pdf", note: "24 pages" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "pandas",            note: "An Excel workbook as the whole persistence layer — read, filter, concatenate, sort, write back." },
        { name: "Input validation",  note: "A loop per field, including a leap-year-aware date check, so bad data never reaches the file." },
        { name: "Data modelling",    note: "Sentinel values that let a missing grade say why it is missing, and statistics that respect them." },
        { name: "CLI design",        note: "A dispatch dictionary, boxed tables and coloured output — a terminal program a non-programmer can use." },
        { name: "Pair work",         note: "Splitting a thousand lines between two people and keeping one menu coherent across both halves." },
      ],
    },
    {
      id:       "vat_verification",
      title:    "VAT Number Verification System",
      cat:      "Personal",
      year:     "2025",
      date:     "2025-02",
      summary:  "A small Python tool that checks a whole list of VAT numbers against the public Peppol Directory and writes back a sortable report — one afternoon of scripting instead of a week of manual lookups.",
      long:     "Before sending an electronic invoice to a business partner in Europe, you need to know whether that partner is reachable on the Peppol network. The Peppol Directory answers that question one VAT number at a time, through a web form. This script asks it for an entire list at once, using a strict identifier lookup with a free-text fallback, and writes the answers to a CSV report.",
      highlights: [
        "Batches VAT numbers through the public Peppol Directory search API — no key, no account.",
        "Two lookup strategies per number: an exact identifier match first, a free-text search as fallback.",
        "Reports the company name, country and which method produced the match, so results can be audited.",
        "Ships with placeholder data and a .gitignore that keeps the real client database out of git.",
      ],
      tags:     ["Python", "pandas", "requests", "Peppol"],
      role:     "Solo",
      cover:    "/assets/images/vat-verification.jpg",
      github:   "https://github.com/ArthurOttevaere/vat_number_check",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "Batch-checking e-invoicing readiness against a public directory that only answers one question at a time",
      context:  "Internal tool",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "",                 // rail + a chip, e.g. "4 people"
      links:    [
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "2",    label: "lookup strategies per VAT number" },
        { value: "0",    label: "API keys or accounts needed" },
        { value: "0.5s", label: "between calls, to stay polite to a public API" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The problem", body: [
            "Peppol is the network European businesses use to exchange electronic invoices. Before you can send one to a partner, you need to know whether they are actually registered and reachable on it — otherwise the invoice goes nowhere.",
            "The Peppol Directory answers that question, but through a web form, one number at a time. With a contact database of any real size that turns into an afternoon of copy-pasting, and the kind of task where a mistake is invisible until an invoice silently fails.",
            "The tool exists to make the check a batch operation: hand it a list, get back a report you can sort and filter.",
        ]},
        { title: "How the lookup works", body: [
            "The script reads a CSV with a `vat` column and queries the Peppol Directory search API for each entry. That API is public and unauthenticated, so there is nothing to configure — no key, no account, no rate-limit tier to negotiate.",
            "Each number goes through two attempts, in order:",
            { list: [
              "Strict lookup — search the value in Peppol's registered identifiers, and only count it as a match if an identifier matches the VAT number exactly. This is the answer you actually want.",
              "Fallback lookup — if the strict search finds nothing, run a broader free-text query and keep the first result for reference. It might be the same company under a different registration, or a near-miss worth a human glance.",
            ]},
            "Both attempts are recorded, and the report says which one produced the result. A strict match is a fact; a free-text match is a lead, and conflating the two would make the whole report untrustworthy.",
            "Requests are spaced half a second apart. The directory is a free public service, and hammering it for a few hundred numbers would be both rude and a good way to get throttled.",
        ]},
        { title: "What comes out", body: [
            "One row per VAT number, written to a CSV that opens straight in Excel:",
            { list: [
              "found_in_peppol — whether the number is on the network at all.",
              "entity_name — the company registered against it, which doubles as a sanity check that the number belongs to who you think it does.",
              "country — the registered country code.",
              "search_method — identifierValue for a strict match, q for a fallback one.",
            ]},
            "It also prints a live line per number while it runs, so a long list gives some sign of progress rather than sitting silent.",
        ]},
        { title: "Keeping the real data out", body: [
            "The original run was against a company's private supplier and customer database, which is exactly the kind of thing that should never end up in a public repository.",
            "So the repo ships with three obviously fake VAT numbers as sample data, and a .gitignore that covers the generated result files and the local dataset names. The script itself is unchanged — swap the placeholder rows for real ones and it runs identically.",
            { quote: "The interesting part of a small tool like this isn't the fifty lines of code. It's that the fifty lines can be published at all." },
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/vat_verification/.
      gallery: [
        // { src: "/assets/images/projects/vat_verification/result.png", caption: "What it shows" },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        // { label: "Final report", url: "/assets/files/vat_verification/report.pdf", note: "24 pages" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "REST APIs",      note: "Querying a public directory, parsing its nested JSON, and handling the case where it simply has no answer." },
        { name: "pandas",         note: "CSV in, report out — the whole data path of a tool that has to hand its results to someone in Excel." },
        { name: "Defensive code", note: "Timeouts, exception handling and rate limiting, so one bad response doesn't take down a run of several hundred." },
        { name: "Data hygiene",   note: "Publishing a working tool built on a client database, with the client database left behind." },
      ],
    },
    {
      id:       "recommender_system",
      title:    "Movix — Movie Recommender System",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06-06",
      summary:  "A streaming-style web app backed by six recommendation models, benchmarked across four protocols that deliberately disagree with each other.",
      long:     "Movix pairs a real-time recommendation web app with an offline evaluation pipeline, so the same models are both served to users and measured against standard RecSys metrics. Six models — content-based ridge, two user-based neighbourhood variants, iALS, BPR and BPR+Novelty — are scored on rating error, full-catalogue ranking, sampled ranking, and catalogue diversity. No model wins everywhere, and the interface is built around that.",
      highlights: [
        "Six models across three families, all trained on 381,181 MovieLens ratings enriched with TMDB metadata and 1,128 genome dimensions.",
        "Four evaluation protocols run in parallel — the disagreement between them is the finding.",
        "Four carousels, each served by the model that is genuinely best at that job.",
        "FastAPI backend that folds a brand-new user into pre-trained models in closed form, with no retraining.",
      ],
      tags:     ["Python", "FastAPI", "scikit-learn", "Surprise", "JavaScript"],
      role:     "Team",
      cover:    "/assets/images/movix.jpg",
      github:   "https://github.com/ArthurOttevaere/movix-recommender",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "Six recommenders, four protocols, and the honest answer that none of them wins",
      context:  "Recommender Systems course · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "3 people",
      links:    [
        { label: "Video demo", url: "https://www.youtube.com/watch?v=rvToIaW10m4" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "6",    label: "models benchmarked side by side" },
        { value: "381k", label: "ratings, on a 95.64% sparse matrix" },
        { value: "30×",  label: "swing in iALS hit rate between two protocols" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The idea", body: [
            "A streaming-style home page built on MovieLens and enriched with TMDB metadata. A new user rates a handful of films during onboarding, and the page fills with personalised carousels a few seconds later.",
            "The point was never to find the one model that wins. It was to put several models — each answering a different question — next to each other, where a user can feel the difference between the rows and where an evaluation pipeline can say, with numbers, why they disagree.",
        ]},
        { title: "The data underneath", body: [
            "381,181 explicit ratings from 1,000 users across 8,737 films, on a 0.5–5.0 scale. The interaction matrix is 95.64% empty, which is the constraint that shapes every modelling decision that follows.",
            "The users themselves are unusually active — the floor is around 50 ratings per profile and 76.5% of them have rated more than 200 films, with the heaviest approaching 2,000. Plenty of history per user, almost nothing per cell.",
            { h: "Two biases worth naming before modelling" },
            { list: [
              "Positivity: the global mean rating is 3.45, with mass piled on 4.0 and 5.0.",
              "Popularity: ratings per film follow a hard power law — a small core of blockbusters absorbs a disproportionate share of the volume, and everything else is long tail.",
              "Genre volume does not track genre appreciation. Drama collects over 160,000 ratings; Film-Noir fewer than 5,000 — yet Film-Noir averages 3.89, the highest in the catalogue, while Horror sits at 3.22.",
            ]},
            "To fight the sparsity, the ratings matrix is joined to TMDB metadata and to MovieLens genome scores across 1,128 semantic dimensions, which is what makes a content-based model possible at all.",
        ]},
        { title: "Six models, four carousels", body: [
            "Four models are deployed in the app, one per carousel. Two more exist only in the benchmark, as reference points.",
            { list: [
              "Based On What You Like — a per-user RidgeCV regression over a 4,000+ dimensional content space (genome scores, TF-IDF on tags and synopses, genres, year, TMDB metadata), with α selected automatically. The only model that can recommend a film nobody has rated.",
              "Viewers Like You Also Watched — Surprise KNNBaseline with Pearson-baseline similarity and shrinkage, k = 40, min_k = 2, min_support = 3, plus a popularity re-ranking pass.",
              "Top Picks For You — iALS, weighted matrix factorisation on implicit signal, f = 50 factors, λ = 0.01 and a confidence weight c = 1 + 40·r, so a 5-star rating carries a confidence of 201 against 21 for half a star.",
              "Discover Something New — BPR with a logarithmic popularity penalty at β = 0.2, applied at scoring time so the effect of the penalty can be isolated from training.",
              "Trending — a live TMDB feed, the only row that isn't a learned model.",
            ]},
            "The two benchmark-only models are plain BPR, which isolates what the novelty penalty actually costs, and a user-based variant driven by a Jaccard similarity written from scratch — Surprise doesn't ship one, and the brief required a similarity the library doesn't provide.",
        ]},
        { title: "Four protocols, because one number lies", body: [
            "Each protocol answers a different question, and running them together is what makes the comparison honest:",
            { list: [
              "A 75/25 random split with a fixed seed, for rating-prediction error — RMSE and MAE only.",
              "Full-catalogue Leave-One-Out: hold out each user's last interaction and rank it against every unrated film in the catalogue, scored by HR@K and NDCG@K.",
              "Sampled Leave-One-Out following He et al. (2017): the same held-out item, but ranked against only 99 random negatives — a pool of 100 candidates instead of nearly 9,000.",
              "Full mode on 100% of the interactions, generating top-40 lists for every user, to measure catalogue coverage, intra-list diversity and MIUF novelty.",
            ]},
        ]},
        { title: "The results refuse to name a winner", body: [
            "Content-Based Ridge takes rating accuracy with an RMSE of 0.744, ahead of the Pearson neighbourhood model at 0.805 and its Jaccard twin at 0.835. That ordering is itself informative: Jaccard compares only which films two users rated, ignoring how they rated them, and on an explicit-feedback dataset that is exactly the signal RMSE rewards. The implicit models score 2.3 to 3.5, which measures the offset of an uncalibrated score rather than any predictive failure.",
            "Then the ranking tables invert it. Against the full catalogue, BPR leads clearly (HR@10 = 0.137) because its pairwise objective optimises precisely what HR and NDCG measure — while Content-Based, the RMSE champion, finishes last at 0.024. Predicting a held-out rating accurately and surfacing that film near the top of nine thousand candidates are simply different problems.",
            { h: "And then the protocol itself changes the answer" },
            "Under the sampled protocol iALS jumps from near-last (HR@10 = 0.028) to first (0.857) — a thirty-fold move that no property of the model explains. Sampled metrics are not order-preserving, and the distortion is worst for models whose scores track item popularity: iALS separates one positive from 99 random negatives easily, and drowns that same positive among thousands. A report quoting only the sampled numbers would have crowned iALS the best ranker, which the full-catalogue table flatly contradicts.",
            "Diversity splits the field a third way. BPR+Novelty reaches the widest catalogue coverage (51.17%) and the strongest long-tail exposure of the ranking models (MIUF = 3.627), exactly what its popularity penalty was for. But intra-list diversity barely moves — 0.650 against BPR's 0.655, marginally lower. The penalty buys novelty, not within-list spread, and those are not the same thing.",
            { quote: "The benchmark does not select a winner; it justifies why four models coexist." },
        ]},
        { title: "The trade-off you can see on screen", body: [
            "The user-based models are the sharpest illustration that a metric only means something next to the interface it feeds. They post the highest intra-list diversity of the benchmark (≈0.73) alongside a catastrophic 5–6% catalogue coverage and the lowest novelty by a wide margin — a system recommending a narrow band of popular titles to nearly everyone.",
            "That collapse was a deliberate choice. Before re-ranking, their MIUF sat between 4.3 and 5.3: carousels full of genuinely obscure films, nominally novel, offering no recognisable anchor and therefore no reason to trust the row. The popularity re-ranking pass dropped novelty to ≈1.25 and lifted the Leave-One-Out metrics enough to move them into third place overall.",
            "The resulting carousel reads as less adventurous on paper and works better in practice — familiar titles first to earn the click, niche discoveries further along for anyone who keeps scrolling. A lower diversity figure is not automatically a worse outcome; it is the visible price of a decision about first impressions.",
        ]},
        { title: "Shipping it", body: [
            "A single FastAPI process serves both the REST API and the web UI. A user who signs up today was not in any training set, and retraining four models per registration is not an option, so the backend estimates their latent vector in closed form — a folding-in step that places them in the existing factor space without touching the models. It buys instant recommendations and costs exactness: the served models reproduce the algorithms that were evaluated offline, not their precise offline scores.",
            "Trained artifacts are too large for git, so they ship as a versioned GitHub Release and a launcher script fetches the ~54 MB on first run — clone, one command, working app, no training on anyone's machine.",
            "The frontend is deliberately dependency-free vanilla JavaScript: posters, More Like This, a watchlist, a profile page with taste statistics, and a Gemini-backed search assistant that degrades to a keyword matcher when no API key is present.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/recommender_system/.
      gallery: [
        { src:     "/assets/images/projects/recommender_system/long-tail.png",
          caption: "Ratings per film, sorted by popularity — the power law that every diversity metric in the benchmark is fighting." },
        { src:     "/assets/images/projects/recommender_system/sparsity.png",
          caption: "A 100×100 slice of the interaction matrix. Each dot is a rating; the whitespace is the 95.64% sparsity." },
        { src:     "/assets/images/projects/recommender_system/ratings-per-user.png",
          caption: "Ratings per user — an unusually active base, with 76.5% of profiles above 200 films." },
        { src:     "/assets/images/projects/recommender_system/ratings-by-genre.png",
          caption: "Volume against appreciation by genre: Drama dominates the counts, Film-Noir barely registers yet rates highest at 3.89." },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Final report", url: "/assets/files/recommender_system/report.pdf",
          note:  "Full write-up, 22 pages with the complete result tables" },
        { label: "Slide deck",   url: "/assets/files/recommender_system/slides.pdf",
          note:  "Defence presentation, 10 slides" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "Matrix factorisation", note: "iALS on confidence-weighted implicit signal and BPR on a pairwise ranking loss, with a novelty re-ranking pass on the discovery row." },
        { name: "scikit-surprise",      note: "KNNBaseline with Pearson-baseline shrinkage, plus a Jaccard similarity written from scratch where the library stopped." },
        { name: "Content-based ML",     note: "Per-user RidgeCV over a 4,000-dimensional space of genome tags, TF-IDF text and TMDB metadata." },
        { name: "RecSys evaluation",    note: "RMSE, HR@K, NDCG@K, coverage, MIUF and ILD across four protocols in one reproducible pipeline." },
        { name: "Reading metrics",      note: "Knowing that a sampled protocol can reorder the leaderboard, and reporting both instead of picking the flattering one." },
        { name: "FastAPI",              note: "One process serving the API, the models and the static frontend, with closed-form folding-in for new users." },
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
      date:     "2026-05",
      summary:  "Six methods for recognising 3D hand gestures, benchmarked on 2,000 sequences under two cross-validation protocols and tested for statistical significance rather than declared winners.",
      long:     "A comparative study of six 3D hand-gesture recognition methods — DTW, edit distance, Random Forest, Decision Tree, Logistic Regression and a 3D adaptation of the $1 recognizer — on two gesture domains of 1,000 sequences each. Every method is run under user-independent and user-dependent cross-validation, across three preprocessing pipelines, with paired Wilcoxon tests and Benjamini-Hochberg correction deciding which differences are real.",
      highlights: [
        "Implemented DTW, edit distance and a 3D $1 recognizer from scratch, alongside three feature-based classifiers.",
        "Ran 6 methods × 2 domains × 2 protocols × 3 preprocessing conditions on 2,000 gesture sequences.",
        "Standardisation gained up to +37.9 accuracy points; PCA denoising degraded every single configuration.",
        "Tested all 15 method pairs with Wilcoxon signed-rank and BH correction — on the hard domain, almost nothing was significant.",
      ],
      tags:     ["Python", "scikit-learn", "NumPy", "Dynamic Programming"],
      role:     "Team",
      cover:    "/assets/images/gesture-recognition.jpg",
      github:   "https://github.com/ArthurOttevaere/AI-GestureRecognition-Group6",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "Which recogniser is best depends on the gesture — and half the differences don't survive a significance test",
      context:  "Artificial Intelligence course · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "3 people",
      links:    [
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "0.992",  label: "best user-independent accuracy on numerals" },
        { value: "+37.9",  label: "points gained from standardisation alone" },
        { value: "1/15",   label: "method pairs significant on the 3D domain" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The question", body: [
            "A depth sensor tracks the centre of a palm and hands you a sequence of 3D position vectors. Turning that into a recognised gesture is an old problem with many plausible answers, and the point of this study was to find out which one is actually right — and whether the differences between them hold up.",
            "Six methods, deliberately spanning three families: two dynamic-programming baselines (DTW and edit distance), three feature-based classifiers (Random Forest, Decision Tree, Logistic Regression), and one template-matching algorithm (the $1 recognizer, extended to 3D following Kratz & Rohs).",
            "Four research questions framed the work: what preprocessing actually does, which method wins under each protocol, whether the gaps are statistically significant, and how much a system gains from knowing its user.",
        ]},
        { title: "Two domains, chosen to disagree", body: [
            "The data comes from Huang et al. — two gesture domains of 1,000 sequences each: 10 classes, 10 users, 10 repetitions, recorded on a SoftKinetic DepthSense camera.",
            { list: [
              "Domain 1 — the Arabic numerals 0–9 drawn in the air. Quasi-planar: the first two principal components capture 94.2% of the variance. Sequences run 31 to 240 time steps, averaging 85.",
              "Domain 4 — ten procedural CAD symbols (cuboid, cylinder, sphere, pyramid, toroid…). Genuinely volumetric: the third component still holds 15.7% of the variance. Sequences run 56 to 314 steps, averaging 140.",
            ]},
            "That contrast is what makes the study work. A method tuned for flat shapes and a method built for temporal alignment should behave very differently across the two, and they do.",
            "Sequence lengths vary enormously within a class as well as between them, which is the whole justification for DTW and edit distance: any point-to-point comparison would penalise a gesture simply for being drawn slowly.",
        ]},
        { title: "Six methods, built rather than imported", body: [
            { h: "Dynamic programming" },
            "DTW finds the optimal warping path between two sequences through an accumulation matrix, with the diagonal transition weighted ×2 to balance the alignment types, and normalises the cost by the summed lengths so distances stay comparable. Edit distance needs symbols, not coordinates, so trajectories are vector-quantised with k-means — fitted inside each fold on training points only, so no test data ever touches the centroids. Validation curves put k at 20 for Domain 1 and 15 for Domain 4.",
            { h: "The $1 recognizer in 3D" },
            "Four normalisation steps: resample to 150 equidistant points along arc length, rotate to an indicative reference frame via Rodrigues' formula, translate the centroid to the origin, then scale uniformly so the largest dimension is 1. Matching uses Golden Section Search over the three rotation axes to minimise point-to-point MSE, 11 iterations per axis, with templates preprocessed once and cached.",
            { h: "Feature-based classifiers" },
            "44 features per gesture — per-axis statistics, velocity, acceleration, arc length, bounding box, curvature, per-third segment dynamics — rising to 47 when the PCA explained-variance ratios are included. Random Forest runs 200 trees on √p features; the single Decision Tree exists specifically to measure what bagging contributes; Logistic Regression is the linear lower bound. All three go through the same per-fold selection pipeline (variance filter, correlation pruning at |r| > 0.99, permutation importance to 95% cumulative) and GridSearchCV on 5 inner folds.",
            "DTW, edit distance and $1 produce distances, not labels, so classification is 1-NN throughout — the canonical parameter-free baseline in the gesture literature. An LSTM was attempted and abandoned: 1,000 sequences per domain is simply not enough data, and it underfitted.",
        ]},
        { title: "Preprocessing decides more than the algorithm", body: [
            "The ablation study ran every method under three conditions — raw, per-gesture standardisation, and standardisation plus PCA denoising — separately for each protocol and domain.",
            "Standardisation is transformative, and the gains are largest exactly where scale variation is worst. On Domain 4 user-independent, DTW goes from 0.486 to 0.865 (+37.9 points) and edit distance from 0.492 to 0.837 (+34.5). On Domain 1, DTW gains +29.4 and edit distance +31.7.",
            "PCA denoising was the hypothesis that failed. Projecting out the third principal component should have removed sensor noise on the quasi-planar numerals — instead it degraded every method in every configuration, dropping DTW from 0.918 to 0.879 on Domain 1 and Random Forest from 0.864 to 0.718 on Domain 4.",
            { quote: "PC3 carries only 5.8% of the variance on the numerals, and removing it still hurts. Low variance is not the same thing as noise." },
            "The $1 recognizer is the exception that proves the rule: it performs better on raw data (0.992) than standardised (0.885), because its own normalisation pipeline already handles scale, and standardising twice destroys the geometry it depends on.",
        ]},
        { title: "Two domains, two different winners", body: [
            "On Domain 1 the $1 recognizer dominates: 0.992 user-independent and 0.999 user-dependent — one error in a thousand sequences. Its normalisation preserves shape exactly, and the Golden Section Search over rotation captures the orientation micro-differences that separate a 6 from a 9. DTW follows at 0.918, Random Forest at 0.912, Decision Tree last at 0.827.",
            "On Domain 4 the ordering inverts. $1 collapses by 17 points to 0.821 — a pipeline built around planar shape matching has little to say about a volumetric trajectory — while DTW takes the lead at 0.865, with Random Forest at 0.864 and Logistic Regression at 0.851 essentially tied with it.",
            "The confusion matrices explain where the difficulty lives. $1 on Domain 1 is almost perfectly diagonal, its handful of errors geometrically defensible (2 → 1 four times, both sharing an initial vertical stroke). DTW on Domain 4 misreads cylinder as cuboid 39 times out of 100 — the two share a rectangular structure that survives temporal alignment — and scatters 30% of the sphere class across every other curved symbol.",
        ]},
        { title: "What the significance tests took away", body: [
            "Accuracy tables invite a ranking. Paired Wilcoxon signed-rank tests over 100 per-(gesture, user) observations, with Benjamini-Hochberg correction across all 15 method pairs, decide whether the ranking is real.",
            "On Domain 1 it mostly is: $1 is significantly superior to all five other methods, DTW beats edit distance and the Decision Tree, and Random Forest beats the Decision Tree and Logistic Regression. Everything else forms an undifferentiated plateau around 0.82–0.92.",
            "On Domain 4, one comparison out of fifteen survives — Random Forest over Decision Tree. DTW's lead over the field is numerical, not statistical: the methods sit within 5.2 points of each other and the fold-to-fold standard deviations run 0.07–0.10. Reporting DTW as the winner there without the caveat would have been the wrong conclusion.",
        ]},
        { title: "Knowing the user is worth more than the model", body: [
            "The user-dependent protocol restricts the nearest-neighbour search to the test user's own gestures, and it improves everything — but not evenly, and the unevenness is the finding.",
            "On Domain 1 the gains are modest (+0.7 to +10.3 points) because the numerals are already well separated. On Domain 4 they are enormous: DTW +12.2, edit distance +14.7, $1 +15.2, carrying the whole field to 0.97–0.99.",
            "Which means inter-user variability, not geometric complexity, is the real bottleneck for volumetric gestures. The same algorithms that struggle to generalise across people are near-perfect once they only have to recognise one. For a real deployment, a short personalisation phase would buy more than any change of method.",
            { h: "One more thing the accuracy column hides" },
            "Train-test gaps show the Decision Tree overfitting hardest everywhere (+0.106 to +0.135) despite GridSearchCV, Random Forest cutting that roughly in half through bagging, and Logistic Regression the most stable of the three (~0.03–0.09) at the cost of raw performance. Accuracy alone was never going to settle this.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/ai_gesture_recognition/.
      gallery: [
        { src:     "/assets/images/projects/ai_gesture_recognition/gestures-domain1.png",
          caption: "Domain 1 — the Arabic numerals drawn in the air, projected onto the XY plane. Green marks the start of the trajectory, red the end." },
        { src:     "/assets/images/projects/ai_gesture_recognition/gestures-domain4.png",
          caption: "Domain 4 — ten procedural CAD symbols. Flattened to 2D they already look ambiguous; in 3D they are what breaks the $1 recognizer." },
        { src:     "/assets/images/projects/ai_gesture_recognition/confusion-dollar1-d1.png",
          caption: "$1 on Domain 1, user-independent: a near-perfect diagonal, with the few errors falling between digits that share an opening stroke." },
        { src:     "/assets/images/projects/ai_gesture_recognition/confusion-dtw-d4.png",
          caption: "DTW on Domain 4, user-independent. Cylinder is read as cuboid 39 times out of 100 — the shared rectangular structure survives temporal alignment." },
        { src:     "/assets/images/projects/ai_gesture_recognition/pca-evr-domain4.png",
          caption: "Explained variance per principal component on Domain 4: PC3 still holds 15.7%, which is why projecting it away costs accuracy." },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Final report", url: "/assets/files/ai_gesture_recognition/report.pdf",
          note:  "IEEE-format write-up, 12 pages with the full result tables" },
        { label: "Slide deck",   url: "/assets/files/ai_gesture_recognition/slides.pdf",
          note:  "Defence presentation, 25 slides including the derivations" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "Dynamic programming", note: "DTW and Levenshtein implemented from the recurrence up, with normalisation that keeps distances comparable." },
        { name: "Template matching",   note: "The $1 recognizer ported to 3D — resampling, Rodrigues rotation, and Golden Section Search over three axes." },
        { name: "Feature engineering", note: "44 descriptors of a trajectory, from curvature to per-third segment dynamics, selected fresh at every fold." },
        { name: "Experimental design", note: "Shared fold indices across all methods, k-means fitted inside the fold, and no preprocessing choice made on test data." },
        { name: "Statistical testing",  note: "Paired Wilcoxon over 15 method pairs with Benjamini-Hochberg control, and the discipline to report what wasn't significant." },
        { name: "Model diagnostics",    note: "Train-test gaps and confusion matrices to explain results that the accuracy column left unexplained." },
      ],
    },
    {
      id:       "chwapi",
      title:    "Surgical Scheduling Optimization",
      cat:      "Academic",
      year:     "2026",
      date:     "2026-06-09",
      summary:  "A MIP that rebuilds a hospital's weekly operating schedule for 57 surgeons, and answers the question management actually asks: how much change is worth it?",
      long:     "As CHwapi consolidates three sites onto one, its weekly operating grid has to schedule 57 surgeons across 10 disciplines, 17 operating rooms and a 54-bed day hospital. This mixed-integer model smooths four dimensions of hospital activity at once while controlling how far the proposed grid may drift from the current one — then stress-tests the result against surgeon recruitment and room failures.",
      highlights: [
        "Schedules 57 surgeons across 10 disciplines, 17 operating rooms and a 54-bed day hospital.",
        "Found the equilibrium at 10 schedule changes: 10% better than 4, while 15 to 20 adds only 0.7%.",
        "Removed a structural 2.4-bed overload on Tuesdays without reducing weekly activity.",
        "Restored feasibility for 9 of 10 disciplines after a room failure, via an intra-association transfer mechanism.",
      ],
      tags:     ["Xpress Mosel", "Excel", "Python", "Optimization"],
      role:     "Team",
      cover:    "/assets/images/surgical-scheduling.jpeg",
      github:   "https://github.com/ArthurOttevaere/surgical-scheduling-optimization",
      featured: false,

      /* ── The project page ──────────────────────────────────────────── */
      subtitle: "How much change is enough? The model says ten, and can prove it",
      context:  "Quantitative Project · UCLouvain",
      duration: "",                 // rail + a chip, e.g. "6 weeks"
      team:     "3 people",
      links:    [
        // { label: "Report", url: "https://…" },
      ],

      // Big numbers band, right after the first section.
      metrics: [
        { value: "10",   label: "schedule changes capture most of the gain" },
        { value: "2.4",  label: "beds of Tuesday overload, eliminated" },
        { value: "9/10", label: "disciplines still running after a room fails" },
      ],

      // The page body — sections are numbered automatically (01, 02, 03…).
      sections: [
        { title: "The brief", body: [
            "CHwapi is consolidating three hospital sites — 2,700 staff, 24,500 admissions a year — onto a single UNION campus. Every operational decision gains weight in that move, and the weekly operating grid is the one that propagates furthest: it drives the operating theatre, the day hospital, the inpatient units and the equipment pools all at once.",
            "The grid has to place 57 surgeons across 10 surgical disciplines, 17 operating rooms and a day hospital capped at 54 beds. Solving that by hand is not realistic, which is the case for a mathematical model — not to produce a theoretically perfect timetable, but one CHwapi could actually adopt on a Monday morning.",
        ]},
        { title: "The model", body: [
            "Binary decision variables assign each surgeon to day-and-slot operating slots. The objective is multi-criteria, and every term is a smoothing factor measuring the gap between the week's peak and its average — a value of 1.0 would be a perfectly flat week.",
            { list: [
              "fLisDis — the spread of each discipline's presence across the week, so a specialty is available every day rather than clustered.",
              "fLisHJ — day hospital bed occupancy, the hard capacity constraint at 54 beds.",
              "fLisUnit — pressure on the inpatient units downstream of surgery.",
              "fLisOrtho — orthopaedic interventions on the same limb, which compete for the same equipment.",
            ]},
            "Hard constraints guarantee operational feasibility — surgeon assignments, block capacity, the hospital's own organisational rules. Softer preferences (limiting how many days a surgeon is present, keeping morning and afternoon activity coherent) enter as penalised constraints.",
            "The parameter that makes the whole study useful is MaxGDif: a cap on how many slots may differ from the grid CHwapi runs today. It turns an abstract optimum into a dial between performance and organisational acceptability.",
        ]},
        { title: "How much change is enough", body: [
            "Sweeping MaxGDif from 4 to 20 traces a textbook curve of diminishing returns. Moving from a conservative 4 changes to 10 improves the global objective by about 10%. Moving from 15 to 20 buys 0.67%.",
            "Ten is the equilibrium point, and the indicators behind it are what justify it as the reference grid: the day hospital peak sits 1.85% above its weekly average, orthopaedic pressure falls from 70.4% above average to 38.0%, no discipline's presence peaks more than 11.4% above its own mean, and inpatient-unit load stays within 28.1%.",
            { quote: "Past ten changes, the organisational disruption is no longer paid for by the gains." },
        ]},
        { title: "The day hospital is the bottleneck", body: [
            "The current grid puts the day hospital 2.39 beds over its 54-bed ceiling on Tuesdays, while Fridays sit at 49.96 — a 6.43-bed swing across the week. The optimised grid closes that to 1.91 beds, with every day at or under capacity, and the weekly average unchanged at 53.02. The activity is not reduced, only redistributed.",
            { h: "How hard to push it" },
            "Weighting the day hospital objective (PHJ) against the other three shows exactly where to stop. At PHJ = 0 the worst day runs 10.3% above average; at 1, 1.8%; at 5, only 0.5%. Beyond that the gains vanish, while the cost becomes visible elsewhere — discipline smoothing degrades by 5.38 percentage points between PHJ = 0 and PHJ = 20, and it is the objective most sensitive to the trade.",
            "Flexibility is what unlocks it. With only 4 changes allowed, even PHJ = 5 leaves the peak 3.4% above average: the rigidity constraint becomes binding before the weighting can do its work.",
            { h: "What margin is left" },
            "Quantifying how much unplanned activity each day could still absorb gives the hospital a resilience budget, and it is thin. Thursday takes +5.8% of surgical activity (about 1.9 beds), Wednesday 1.6 and Tuesday 1.2. Monday offers a symbolic 0.24 bed. Friday is saturated at exactly zero — any unplanned flow that day breaches capacity immediately.",
        ]},
        { title: "Unlocking capacity that was already there", body: [
            "Coronary angiography and interventional radiology had been treated as fixed, even though both feed the same 54 beds. Making their weekly placement a decision variable — with volume conservation and a fixed number of open days per activity — costs nothing and pays.",
            "The global objective improves 0.68%, day hospital smoothing goes from 1.0185 to 1.0142, and inpatient-unit smoothing gains 2.01%, while discipline smoothing stays exactly where it was. Nothing is traded away.",
            "The mechanism is concrete: the solver concentrates coronary angiography onto Tuesday (4.61 beds, a full 8-hour day) and spreads interventional radiology across the middle of the week. Pulling both off Friday frees 3.47 beds on the week's most constrained day, part of which is then reallocated to surgery — Friday drops from 54.00 to 52.93 beds, and no day exceeds 53.77.",
            "Twelve combinations of open-day counts were tested, and several reach the same optimum. The solution is not unique, which leaves CHwapi room to pick whichever configuration its service leads can actually live with.",
        ]},
        { title: "Where a new surgeon could go", body: [
            "No grid is permanent. Adding a fictional surgeon to each discipline in turn — profiled on the average of that discipline's existing surgeons — and re-solving at MaxGDif = 10 measures who has genuine room.",
            { list: [
              "Real headroom: neurosurgery, urology and stomatology degrade the grid least and keep saturation contained. Stomatology adds a surgeon without a single extra saturated slot.",
              "Structurally full: vascular and thoracic surgery is the worst case (+7.8% on the objective, +14.2% on discipline smoothing), with orthopaedics behind it (+6.5%, saturated slots going from 5 to 9). Neither can absorb anyone without opening capacity.",
              "A false positive: plastic surgery shows a 40% occupancy rate that looks like room to spare. It only operates Monday and Tuesday — the free slots are inactivity, not availability, and its 2.78 smoothing score is the worst of any discipline.",
            ]},
            "Downstream, the fragility is concentrated in one place: paediatrics absorbs almost all of the inpatient-unit degradation across the simulations, while every other unit moves by less than 0.1 point.",
        ]},
        { title: "What happens when a room fails", body: [
            "Making the room allocation itself a decision variable produced the study's most useful negative result: at MaxGDif = 4 and 7, the model reproduces CHwapi's current allocation exactly. The existing layout is not historical accident, it is already coherent with the constraints.",
            "At 10 changes the model does move two rooms — one from abdominal, one from vascular/thoracic, both to plastic surgery — but every indicator stays identical. Shrinking the total allocation from 21 down to 19 confirms why: those two rooms are structural surplus, removable without degrading anything. And the extra rooms do nothing for plastic surgery, whose smoothing score is bound by its own weekly volume, not by capacity.",
            { h: "The stress test" },
            "Simulating the loss of one room per discipline is brutal without help: only abdominal and vascular/thoracic remain solvable. The other eight cannot place their weekly surgical volume at all.",
            "Introducing an intra-association transfer mechanism — disciplines within the same grouping lending each other a room for a half-day, with borrowing penalised so it stays a last resort — restores feasibility for nine of ten. Abdominal and vascular/thoracic need no help at all; gynaecology borrows 8 slots a week and orthopaedics 5; ophthalmology, belonging to no association, has no safety net by design.",
            "The lending patterns matter operationally. Association 1 is perfectly reciprocal (ENT and stomatology, 4 slots each way). Association 2 is lopsided — abdominal and urology lend, gynaecology borrows 8 and returns 1. In association 3, neurosurgery lends 7 slots of 10 and is the single pivot: any new pressure on it mechanically weakens orthopaedics and plastic surgery.",
            { quote: "The surplus in abdominal and vascular surgery is not a design flaw. It is the block's first line of defence." },
        ]},
        { title: "The final proposal", body: [
            "The recommended grid combines three things: 10 authorised changes, equal weights across the four smoothing objectives, and flexible coronary/radiology scheduling — with the intra-association transfer mechanism held in reserve as a contingency rule rather than used in normal operation.",
            "Against the base grid, the global objective goes from 1.1985 to 1.1903, day hospital smoothing from 1.0185 to 1.0142, inpatient-unit smoothing from 1.2808 to 1.2551, and discipline smoothing does not move at all — confirming the gains do not destabilise weekly specialty coverage.",
            "The limits are stated rather than hidden. Day hospital margins remain thin on Monday, Tuesday and Thursday, at roughly a quarter of a bed. Whether a new surgeon fits depends entirely on their discipline. And the Coro/RI reorganisation needs sign-off from the service leads before it means anything — a model can show a schedule is feasible, not that people will accept it.",
        ]},
      ],

      // Screenshots — drop the files in /assets/images/projects/chwapi/.
      gallery: [
        { src:     "/assets/images/projects/chwapi/pareto-front.png",
          caption: "Every smoothing indicator against the number of authorised changes. The elbow at 10 is the whole recommendation in one chart." },
        { src:     "/assets/images/projects/chwapi/day-hospital-occupancy.png",
          caption: "Day hospital occupancy, optimised versus current. Tuesday's 56.39 beds breach the 54-bed ceiling; the optimised week never does." },
        { src:     "/assets/images/projects/chwapi/discipline-saturation.png",
          caption: "Occupancy rate against saturated slots per discipline — the diagnostic behind which specialties can take a new surgeon." },
        { src:     "/assets/images/projects/chwapi/borrowed-slots.png",
          caption: "Cost of losing one room, per discipline: slots that must be borrowed to stay feasible. Ophthalmology, isolated, cannot recover." },
        { src:     "/assets/images/projects/chwapi/room-transfers.png",
          caption: "Who lends to whom across the three associations. Neurosurgery lends 7 of 10 slots — the pivot the whole grouping depends on." },
      ],
      galleryTitle: "",             // heading — defaults to "Results"

      attachments: [
        { label: "Final report",       url: "/assets/files/chwapi/report.pdf",
          note:  "Full write-up in French, 32 pages with the five analyses and annexes" },
        { label: "Model formulation",  url: "/assets/files/chwapi/model.pdf",
          note:  "The complete MIP — sets, parameters, variables and constraints, 8 pages" },
        { label: "Slide deck",         url: "/assets/files/chwapi/slides.pdf",
          note:  "Defence presentation, 24 slides with the backup material" },
      ],
      attachmentsTitle: "",         // heading — defaults to "Attachments"

      // The "What I took away" block at the bottom.
      skills: [
        { name: "MIP modelling",       note: "A multi-objective scheduling model with hard feasibility constraints, penalised preferences, and a dial controlling deviation from the current grid." },
        { name: "Xpress Mosel",        note: "Built and solved every scenario of the study, exporting results to Excel for the analysis." },
        { name: "Scenario analysis",   note: "Change budgets, objective weightings, flexible flows, simulated recruitment and room failures — each isolated so its effect could be read." },
        { name: "Sensitivity analysis", note: "Making the room allocation endogenous and shrinking the total to prove which capacity was genuinely surplus." },
        { name: "Resilience design",   note: "Turning a structural surplus into a transfer mechanism that restores feasibility for nine disciplines out of ten." },
        { name: "Decision framing",    note: "Reporting a trade-off curve and an equilibrium point instead of an optimum management would never have adopted." },
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
  homeDeck: ["f1","recommender_system", "chwapi", "quantitative_decision_making", "ai_gesture_recognition", "dash"],
};