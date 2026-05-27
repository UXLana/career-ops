# Job Discovery

Job discovery is the primary purpose of this repo. The tracker, reports, PDFs, and application helpers exist downstream of this workflow.

The core flow is:

```text
find jobs -> filter for fit -> add promising roles to inbox -> evaluate/rank -> apply selectively
```

## Quick Start

1. Review the discovery config:

```bash
open portals.yml
```

2. Run discovery from Codex or Claude Code:

```text
/career-ops scan
```

3. Review the roles added to:

```text
data/pipeline.md
```

4. Evaluate the pending roles:

```text
/career-ops pipeline
```

## What Discovery Looks For

The scanner is configured for Lana's strongest lanes:

- UX leadership
- Design systems leadership
- Accessibility and compliance-centered product design
- AI-augmented design operations
- GovTech / RegTech product design
- Enterprise SaaS and complex workflow product design

It should avoid roles that are mainly:

- junior or intern level
- graphic design
- brand or marketing design
- visual-only execution
- production-only UI work
- freelance or contract-only unless explicitly desired

## The Important Files

| File | Purpose |
| --- | --- |
| `portals.yml` | Job discovery configuration: search queries, tracked companies, title filters |
| `modes/scan.md` | Agent instructions for running discovery |
| `data/scan-history.tsv` | URLs already seen during scans |
| `data/pipeline.md` | Inbox of promising roles waiting for evaluation |
| `data/applications.md` | Roles already evaluated or applied to |

## How Filtering Works

Discovery uses `portals.yml`:

- `title_filter.positive`: terms a role title should match
- `title_filter.negative`: terms that usually mean skip
- `title_filter.seniority_boost`: terms that improve priority
- `search_queries`: broad searches across job boards and the web
- `tracked_companies`: specific company career pages to check directly

Every discovered role is deduped against:

- prior scan history
- pending inbox
- evaluated/applications tracker

## Verification Gate

Do not add a discovered role to `data/pipeline.md` just because it appears in search results.

Before a role enters the pending inbox, verify at least one of:

- the employer or ATS page opens and shows an active apply form
- the page has a current "Apply" link on the job detail page
- the role appears in the company's current careers index

If a result is only available through a search cache or aggregator, mark it in `data/scan-history.tsv` as `verify_before_apply` instead of treating it as fully verified.

Remove or skip roles when:

- the page 404s
- the company careers page says no matching posting exists
- compensation is below Lana's floor
- the role is contract/consulting below Lana's consulting threshold
- the role is too junior or production-only

## How To Tune Discovery

Add a new search query when a role pattern seems promising:

```yaml
search_queries:
  - name: Accessibility Leadership
    query: '("accessibility" OR WCAG OR "Section 508") ("director" OR "principal" OR "lead") ("product design" OR UX) remote'
    enabled: true
```

Add a company when you want it watched directly:

```yaml
tracked_companies:
  - name: Example Company
    careers_url: https://example.com/careers
    scan_method: playwright
    notes: Why this company is worth watching.
    enabled: true
```

Disable noisy sources instead of deleting them:

```yaml
enabled: false
```

## OpenBrain Protocol

Before evaluating any discovered role, search OpenBrain for:

- company
- role title
- domain
- relevant proof areas such as design systems, accessibility, Metrc, UKG, GovTech, RegTech, OpenBrain, Council of Agents, WCAG, Section 508, and ADA Title II

If OpenBrain and local files disagree, flag the mismatch before changing factual career claims.

## What Good Output Should Do

A good discovery run should return:

- how many sources were scanned
- how many roles were found
- how many were skipped and why
- which roles were added to `data/pipeline.md`
- recommended next action for each promising role

The system should optimize for fewer, better roles, not more applications.
