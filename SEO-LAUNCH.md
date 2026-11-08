# Search launch checklist

## Included

- Complete article text delivered as static English HTML, without requiring JavaScript to read it.
- Unique titles and descriptions; one main heading per page; section anchors and internal article links.
- Canonical production URLs rooted at `https://sumlif.github.io/fixbook/`.
- Blog / WebPage / BlogPosting JSON-LD with visible author, dates and tested scope.
- RSS and XML sitemap; noindex for the 404 template.
- Open Graph sharing metadata; responsive layout and keyboard navigation.
- Honest test evidence: Turkish confirmed, other locales explicitly not tested.
- Official references and exact undo steps.

## After GitHub Pages is live

1. Verify HTTPS pages load at the expected URL and return the right status codes.
2. Add the URL-prefix property `https://sumlif.github.io/fixbook/` to Google Search Console. Complete the owner-provided HTML verification file or meta tag. Never invent verification codes.
3. Submit `https://sumlif.github.io/fixbook/sitemap.xml`, then inspect the home page and both posts.
4. Optionally verify the same site in Bing Webmaster Tools. Indexing and inclusion in AI answers are not guaranteed.
5. Check the origin-level `https://sumlif.github.io/robots.txt`. The file under `/fixbook/robots.txt` does NOT control origin-level crawl policy. To manage robots rules for this GitHub Pages origin, the owner must publish the root file via `sumlif.github.io`. Do not claim the project-level file enables a crawler.
6. Keep OAI-SearchBot access in mind for ChatGPT search. Search bot access and model-training crawler access are separate choices.
7. Connect GoatCounter for aggregate per-article traffic; Search Console measures search exposure separately. Do not claim analytics are enabled until the endpoint is configured and a visit is observed.
8. Install Utterances on this repository only before setting comments=true; test a real comment after setup.

## Maintenance

Update dates only for actual edits. Record newly tested versions and languages. Do not publish invented traffic numbers, outcomes or testimonials. There is no special AI schema that guarantees discovery.

References:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.openai.com/api/docs/bots
