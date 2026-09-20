# Race photographs

Drop the full-resolution file here — do not resize it first, that is the
pipeline's job. Name it after the race and the year, lowercase, hyphenated:

    rotterdam-2026.jpg
    mons-2025.jpg

Then, from the project root:

    npm run images

That writes the WebP copies into `assets/opt/` and updates the manifest, so a
phone downloads ~30 KB instead of the original. Finally put the path into the
matching race in `data.js`:

    photo: "/assets/images/races/rotterdam-2026.jpg"

A race with no photograph is fine — the card falls back to the time set large.

Only use photographs you have the right to publish. The official race
photographers (Sportograf, Marathon-Photos and the rest) licence their files;
a photo you have not bought is not yours to put online.
