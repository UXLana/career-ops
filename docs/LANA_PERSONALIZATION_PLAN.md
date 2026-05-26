# Lana Career-Ops Personalization Plan

## Goal

Turn career-ops into a local career operating system for Lana Holston: a structured, evidence-based system for evaluating roles, tailoring materials, selecting proof points, and tracking applications without losing context across tools.

This is not an auto-apply machine. It is a judgment system. It should help Lana apply to fewer, better roles with sharper narratives.

## Source Of Truth

OpenBrain is the canonical memory layer for career positioning, proof points, role decisions, and application outcomes.

Local files in this repo are working views:

| Local file | Purpose | Relationship to OpenBrain |
| --- | --- | --- |
| `config/profile.yml` | Current candidate profile and targets | Working config; update from OpenBrain decisions |
| `cv.md` | Canonical resume content for generation | Should reflect stable facts already remembered or approved |
| `article-digest.md` | Proof point and case study bank | Pull from remembered projects, audits, design system work, and portfolio notes |
| `interview-prep/story-bank.md` | STAR+Reflection stories | Promote strong stories back into OpenBrain |
| `data/applications.md` | Application tracker | Summaries and outcomes should be remembered after meaningful changes |
| `reports/` | Per-role evaluations | Decisions, scoring changes, and notable signals should be remembered |

## Role Archetypes

Use these archetypes instead of the upstream AI-engineering defaults:

| Archetype | What They Buy | Primary Proof |
| --- | --- | --- |
| UX Leadership | A design leader who can build practice, process, and product quality in ambiguous environments | Metrc UX practice, UKG enterprise experience |
| Design Systems Leadership | A systems thinker who can connect tokens, components, docs, governance, and adoption | MTR Design System, component documentation, token work |
| Accessibility and Compliance Design | A product designer who treats WCAG, Section 508, ADA Title II, and VPAT work as core product quality | VPAT remediation, accessibility audits, regulated cannabis platform context |
| AI-Augmented Design Operations | A design lead building practical AI workflows for research, audit, documentation, and delivery | Council of Agents, OpenBrain, custom skill architecture |
| GovTech / RegTech Product Design | A UX leader who understands regulated workflows, state variation, auditability, and enterprise constraints | Metrc, cannabis compliance, multi-state platform work |

## Scoring Rubric

Replace generic match scoring with a UX leadership rubric:

| Dimension | Weight | What Good Looks Like |
| --- | ---: | --- |
| Strategic Fit | 20% | Role values practice-building, design leadership, systems thinking, and influence |
| Domain Fit | 15% | Regulated, enterprise, govtech, compliance, health, fintech, civic, or complex workflow domain |
| Design Systems Leverage | 15% | Clear need for scalable components, tokens, documentation, governance, or adoption |
| Accessibility Leverage | 15% | Accessibility is explicit, funded, and treated as product quality rather than cleanup |
| AI Workflow Leverage | 10% | Organization is open to pragmatic AI operations, automation, or design tooling |
| Leadership Scope | 10% | Enough authority to shape practice, standards, rituals, hiring, or product direction |
| Portfolio Story Strength | 10% | Lana has strong, truthful proof points that map cleanly to the role |
| Risk / Red Flags | 5% | Watch for vague design maturity, low authority, performative accessibility, or delivery-only UX |

Recommended decision thresholds:

| Score | Recommendation |
| --- | --- |
| 4.5-5.0 | Priority application; tailor deeply |
| 4.0-4.4 | Apply if comp and operating model are viable |
| 3.5-3.9 | Consider only if the company, manager, or mission is unusually strong |
| Below 3.5 | Skip unless there is a strategic reason |

## Materials To Build

1. `cv.md`
   Create a master resume in markdown with stable, truthful content. Keep it broad enough to support UX leadership, design systems, accessibility, and AI workflow variants.

2. `article-digest.md`
   Build a proof bank with sanitized, portfolio-safe proof points:
   - Metrc UX practice building
   - MTR Design System
   - Accessibility / VPAT remediation
   - Council of Agents and OpenBrain
   - UKG enterprise UX work
   - Any measurable impact, adoption signal, quality improvement, or operating model change

3. `interview-prep/story-bank.md`
   Rewrite the default story bank around 8-10 reusable leadership stories:
   - Building from ambiguity
   - Driving accessibility as a non-negotiable
   - Establishing design system governance
   - Influencing without authority
   - Navigating regulated constraints
   - Using AI responsibly in design work
   - Recovering from a messy project
   - Coaching or raising team quality

4. `portals.yml`
   Seed with companies and search terms for:
   - GovTech / civic tech
   - RegTech / compliance software
   - Enterprise SaaS
   - Health, fintech, insurance, HR, and workforce platforms
   - Design systems teams
   - Accessibility-forward product organizations

5. Evaluation modes
   Update `modes/_shared.md`, `modes/oferta.md`, `modes/pdf.md`, `modes/apply.md`, and `batch/batch-prompt.md` so every output uses Lana's rubric, voice, and proof-point rules.

## OpenBrain Protocol

Before non-trivial career work:

1. Search OpenBrain for the role, company, domain, and relevant proof-point area.
2. Surface any relevant memory before creating new positioning.
3. Use local files only as the working context. If OpenBrain and local files disagree, flag the conflict.

After meaningful career work:

1. Remember final decisions, not scratch work.
2. Store compact payloads with tags like `career-ops`, `career-positioning`, `proof-point`, `application`, `interview-story`.
3. Include the local file path or report path when useful.

## Suggested First Sprint

1. Fill the missing fields in `config/profile.yml`.
2. Create `cv.md` from Lana's current resume or LinkedIn.
3. Create `article-digest.md` from OpenBrain memories and known work.
4. Rewrite `modes/_shared.md` with the Lana rubric.
5. Add a first curated `portals.yml`.
6. Run one test evaluation against a known dream-role posting.
7. Calibrate the scoring rubric from that result.
8. Commit the calibrated system as the first usable baseline.

## Suggested Guardrails

- Never invent metrics, titles, outcomes, or scope.
- Never reveal confidential Metrc or government-contracted details.
- Prefer sanitized case-study language for public-facing materials.
- Keep accessibility and compliance framed as product quality, not a side specialty.
- Do not optimize for ATS keywords at the expense of executive clarity.
- Require Lana review before any application is submitted.
