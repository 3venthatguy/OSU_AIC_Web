# Content & data

## Start here: `src/data.ts`

**Almost every editable string, date, link, and list on the site is a named export of
[`src/data.ts`](../src/data.ts).** If someone asks you to change site content, look there first. The
shapes are defined in [`src/types.ts`](../src/types.ts).

### Contact & links

| Export | Value / purpose | Rendered by |
| --- | --- | --- |
| `CLUB_EMAIL` | Officer contact address | `Footer.tsx`, `Projects.tsx` |
| `CLUB_DISCORD_URL` | Discord invite | `Footer.tsx` |
| `CLUB_INSTAGRAM_URL` | Instagram profile | `Footer.tsx` |
| `CLUB_LINKEDIN_URL` | Club LinkedIn page | `Footer.tsx` |
| `NEWSLETTER_URL` | Newsletter signup (`go.osu.edu/aiclub`) | `Footer.tsx` |
| `PROJECT_APPLICATION_URL` | Google Form for project-team signups | `Projects.tsx`, default `applyUrl` for every project |
| `HACKAI_REGISTRATION_URL` | HackAI registration — currently aliased to the same Google Form | `HackAI.tsx` |

### Meeting time & place

`MEETING_LOCATION`, `MEETING_DAY`, `MEETING_TIME`, and the derived `MEETING_SCHEDULE`. Referenced on
Home, Events, Projects, and inside `HACKAI_FAQS`. **Change these four in one place and the whole site
follows** — never hardcode a room or time in a component.

### HackAI event details

`HACKAI_NAME`, `HACKAI_DATE_BADGE`, `HACKAI_DATE_FULL`, `HACKAI_DATE_SHORT`, `HACKAI_LOCATION_BADGE`,
`HACKAI_LOCATION_FULL`, and the derived `HACKAI_BANNER_BADGE`. The `_BADGE` variants are uppercase for
pill/eyebrow styling; the `_FULL` variants are title case for body copy. Bumping the year means
editing these constants — the string "HackAI 2027" should not appear literally anywhere else.

### The three collections

| Export | Type | Rendered by |
| --- | --- | --- |
| `OFFICERS` | `Officer[]` | About page — flip cards |
| `EVENTS` | `ClubEvent[]` | Events page — split by the `isPast` flag |
| `PROJECTS` | `ProjectItem[]` | Projects page — search/filter grid |
| `FAQS` | `{q, a}[]` | `FAQ.tsx`, on the About page |
| `HACKAI_FAQS` | `{q, a}[]` | HackAI page accordion |

## How to make common changes

### Add or update an officer

Append to `OFFICERS` in `src/data.ts`:

```ts
{
  id: 'first-last',            // kebab-case, must be unique — used as the React key
  name: 'First Last',
  role: 'Marketing Officer',
  major: 'Computer Science & Engineering',
  minor: 'Optional — omit the key entirely if none',
  year: '3rd Year',
  initials: 'FL',              // UPPERCASE — shown when there is no photo
  bio: 'One or two sentences.',
  photo: firstLastPhoto,       // optional; see "Officer headshots" below
  socials: { linkedin: '…', github: '…' },  // every key optional; `{}` is fine
}
```

The About page renders three cards per row on desktop, so multiples of three look tidiest.

> **Do not invent biography details.** Bios must be copy the officer actually wrote. The current bios
> are neutral role descriptions precisely because the originals were placeholder text attributing
> fake internships and research to real named people.

### Add an event

Append to `EVENTS`. `day` and `month` are **separate display strings** for the date badge and are not
derived from `dateString` — set all three consistently (`'Oct 6, 2026'` / `'06'` / `'OCT'`). Set
`isPast: true` to move an event into the "Past Events Highlights" strip, which shows `recapUrl`
instead of an RSVP button. `category` must be one of `'Workshop' | 'Speaker' | 'HackAI' | 'Social'`;
these drive the filter pills and the colored bar on each card. If you add a category, also update
`filters` **and** `filterLabels` in `src/pages/Events.tsx`.

### Add a project

Append to `PROJECTS`. `tags` populate the "Core Technology" filter pills automatically; `category`
populates "Domain Category". `stats` is a free-form headline metric string. `image` is currently a
remote Unsplash URL for every project — see [known-issues.md](known-issues.md).

Per-project roadmap milestones are **not** in `data.ts`: they live in `getProjectMilestones()` in
`src/pages/Projects.tsx`, keyed by project `id`, with a generic fallback.

## Images and assets

`assets/` is **not** a static `public/` folder. Nothing in it is copied verbatim. Every image is
imported from TypeScript, hashed, and emitted into `dist/assets/` by Vite:

```ts
import evanMengesPhoto from '../assets/profiles/evan-menges.png';
```

`src/vite-env.d.ts` is what makes those imports typecheck. An image that nothing imports is not
shipped at all.

| Directory | Contents | Imported by |
| --- | --- | --- |
| `assets/images/` | `AI_Logo_Final.png` | `main.tsx` (favicon), `Navbar.tsx`, `Footer.tsx` |
| `assets/profiles/` | Officer headshots | `data.ts` |
| `assets/sponsors/` | Sponsor logos | `SponsorsBar.tsx` |

### Officer headshots

1. Crop to a **square** — the cards use `object-cover`, so a non-square source gets its edges cut off
   unpredictably. On macOS: `sips -c 271 271 input.png --out assets/profiles/first-last.png`
   (`-c` takes *height* then *width* and crops from the center).
2. Aim for roughly **400×400 px**; the largest display slot is 300×280. Bigger just bloats the bundle.
3. Name it kebab-case matching the officer `id`, lowercase `.png`.
4. Import it at the top of `src/data.ts` and set `photo:` on that officer.

Officers with no `photo` render an initials tile instead — that fallback is intentional and styled,
so leaving `photo` off is a valid state, not a bug.

**Never point `photo` at a LinkedIn or other CDN URL.** Those URLs carry signed expiry parameters
(`?e=…`) and silently break after a few months; that is exactly why the field is a bundled asset now.

### Sponsor logos

Drop the file in `assets/sponsors/`, then import it and add an entry to the `sponsors` array in
`src/components/SponsorsBar.tsx`. The array is duplicated 6× to fill the marquee — leave that alone.

## Content that is *not* in `data.ts`

Some copy is still inline in components. If you can't find a string in `data.ts`, grep for it:

- **Homepage stat counters** (`120+ Active Members`, `$12K HackAI Prize Pool`) — `statsList` in
  `src/components/StatsBar.tsx`
- **Mission statement** — `src/components/MissionStatement.tsx`
- **"Who We Are" blurb and category tiles** — `src/components/AboutSection.tsx`
- **HackAI prize table and weekend schedule** — `prizes` and `schedule` arrays in `src/pages/HackAI.tsx`
- **Projects page hero stat strip** (`4 Active`, `28 Total`, …) — inline JSX in `src/pages/Projects.tsx`
- **Hero headline and subheading** — inline JSX in `src/pages/Home.tsx`
- **Footer legal/contact copy** — `src/components/Footer.tsx`

Moving any of these into `data.ts` is a welcome cleanup.
