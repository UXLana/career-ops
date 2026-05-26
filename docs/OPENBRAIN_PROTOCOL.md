# OpenBrain Protocol For Career-Ops

OpenBrain is the source of truth. Career-ops is the local execution layer.

## Recall First

Before evaluating a role, tailoring a resume, drafting a cover letter, selecting interview stories, or updating positioning, search OpenBrain for:

- the company
- the role title
- the domain
- relevant proof areas: design systems, accessibility, Metrc, UKG, AI workflows, Council of Agents, OpenBrain, VPAT, WCAG, regulated software

If relevant memories exist, cite them in the working notes before generating new materials.

If nothing relevant exists, say that clearly and continue from local files.

## Conflict Handling

If OpenBrain, `config/profile.yml`, `cv.md`, or `article-digest.md` disagree:

1. Do not silently choose one.
2. Flag the mismatch.
3. Prefer OpenBrain for remembered decisions and local files for approved resume wording.
4. Ask Lana before changing factual career claims.

## Remember After

Remember compact outputs when they change future work:

- final role scoring decisions
- new or revised proof points
- application outcomes
- interview feedback
- calibrated rubric changes
- durable positioning language
- compensation boundaries
- company-specific signals

Do not remember temporary drafts, raw command output, or routine file edits.

## Suggested Memory Shape

```yaml
type: career-ops
topic: "short durable topic"
summary: "what future Lana/Codex should know"
source:
  repo: "/Users/lanaholston/code/jobs/career-ops-lana"
  file: "relative/path/when/useful"
tags:
  - career-ops
  - career-positioning
  - proof-point
```

## Privacy

Career materials may include sensitive personal, employment, compensation, and regulated-domain context. Keep OpenBrain entries compact and avoid storing private contact details unless Lana explicitly asks.
