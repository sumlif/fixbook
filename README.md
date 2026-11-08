# Sumlif Fixbook

English troubleshooting blog for https://sumlif.github.io/fixbook/.

## Publish

1. Create the public repository `sumlif/fixbook` with a README.
2. Upload the contents of `site/` to its `docs/` directory. Keep `build.py`, `assets/`, and `config.json` at the repository root as authoring sources.
3. GitHub repository Settings → Pages → Deploy from a branch → `main` → `/docs` → Save.
4. The blog will be at `https://sumlif.github.io/fixbook/` after GitHub finishes its build.

## Build and add posts

Run `python build.py`. Generated pages appear in `site/`. Add a new entry to `POSTS` in `build.py`, with a unique slug, tested environment, fix, verification, undo steps and sources. Add the application filter in the home template if a new application is introduced. Rebuild and replace `docs/` with the generated files. Update hardcoded dates/counts and sitemap dates when publishing future changes. No new site or repository is needed.

## Questions and comments

Each article has a GitHub issue question link, scoped to the article. It works once the repository exists and Issues are enabled. Embedded comments are prepared but disabled until the owner installs https://github.com/apps/utterances for **this repository only**. Set `comments` to `true` in `config.json`, rebuild and publish. Public readers can view discussions; posting requires a GitHub account. The site does not claim comments are active before setup.

## Metrics

Analytics are disabled by default. Create a GoatCounter site at https://www.goatcounter.com/ and set its exact `https://YOUR-CODE.goatcounter.com/count` endpoint in `config.json`; rebuild and publish. The dashboard reports per-article paths, page views, visitor estimates and referrers. It can miss blocked scripts and is not an exact count. No fabricated counters, local-only visitor totals, API secrets or analytics credentials are included.

## Verification

`python validate.py` checks generated internal links, JSON-LD, XML feeds, article rollback commands and integration defaults. Browser QA is still needed before public launch. Confirm actual comment posting and analytics collection after their owner-side setup.
