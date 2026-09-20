# The faces and crests on /outside/

One file per entry in `profile.outside.supports`. A portrait for a person, a
crest for a club. Square-ish originals work best — the slot is a circle.

    max-verstappen.jpg
    anderlecht.png        (or .svg — a crest with a transparent background)

Then:

    npm run images        # skips SVG, which needs no copies

and set the path on the matching entry in `data.js`:

    image: "/assets/images/supports/max-verstappen.jpg", fit: "cover"
    image: "/assets/images/supports/anderlecht.png",     fit: "contain"

`fit: "cover"` fills the circle and crops — use it for a face.
`fit: "contain"` sits the mark whole inside the circle — use it for a crest.

Leave `image: ""` and the row falls back to its icon, which is a finished
state, not a broken one.

A club crest and a photograph of a driver are somebody else's property. Fine
for a personal page in most places, but they are not yours — don't treat them
as site assets.
