'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useThemeSwitcher } from '@lumen/design-system/styles/themes';
import {
  Badge,
  Button,
  Chip,
  ChipGroup,
  DataTable,
  TabBar,
  Textarea,
} from '@lumen/design-system/components';
import type { DataTableColumn, TabItem } from '@lumen/design-system/components';
import styles from './page.module.css';

type ViewId = 'find' | 'applications';
type Status = 'New' | 'Review' | 'Evaluating' | 'Applied' | 'Interview' | 'Declined' | 'Rejected' | 'Archived';

type Job = {
  id: string;
  company: string;
  role: string;
  score: number;
  status: Status;
  source: string;
  lane: string;
  comp: string;
  signals: string[];
  reason: string;
  risk: string;
};

type DiscoveryCandidate = Job & {
  discoveryTerms: string[];
};

const savedApplicationJobs: Job[] = [
  {
    id: 'launchdarkly-director-ux',
    company: 'LaunchDarkly',
    role: 'Director, UX',
    score: 4.6,
    status: 'Review',
    source: 'Redpoint careers index',
    lane: 'UX leadership',
    comp: '$256k-$415k + equity',
    signals: ['developer tools', 'platform UX', 'remote US'],
    reason: 'Strong fit for design leadership in a complex product surface with high leverage across platform workflows.',
    risk: 'Needs employer-page confirmation before application.',
  },
  {
    id: 'sentinelone-director-ux-architecture',
    company: 'SentinelOne',
    role: 'Director, Product Design & UX Architecture',
    score: 4.4,
    status: 'Evaluating',
    source: 'DCVC jobs',
    lane: 'Enterprise UX architecture',
    comp: '$241k-$249k + equity',
    signals: ['AI cybersecurity', 'UX architecture', 'design org leadership'],
    reason: 'Maps well to regulated complexity, systems thinking, and senior cross-functional design influence.',
    risk: 'Cybersecurity domain fit should be stress-tested before tailoring.',
  },
  {
    id: 'webflow-principal-product-designer',
    company: 'Webflow',
    role: 'Principal Product Designer',
    score: 4.3,
    status: 'Review',
    source: 'Greenhouse',
    lane: 'AI design systems',
    comp: '$206k-$344k',
    signals: ['agentic experiences', 'component systems', 'accessibility'],
    reason: 'Clear overlap with AI-augmented design operations, component-based product UX, and accessibility quality.',
    risk: 'Role may skew hands-on IC rather than design-practice leadership.',
  },
  {
    id: 'butterflymx-principal-product-designer-pm',
    company: 'ButterflyMX',
    role: 'Principal Product Designer & Product Manager',
    score: 3.9,
    status: 'New',
    source: 'Ashby indexed posting',
    lane: 'AI product ownership',
    comp: 'Not confirmed',
    signals: ['AI-forward', 'product ownership', 'design standards'],
    reason: 'Interesting hybrid product/design ownership role with room to shape standards and AI workflows.',
    risk: 'Hybrid PM scope could dilute senior UX leadership lane.',
  },
];

const discoveryCatalog: DiscoveryCandidate[] = [
  {
    id: 'launchdarkly-director-ux',
    company: 'LaunchDarkly',
    role: 'Director, UX',
    score: 4.6,
    status: 'New',
    source: 'Simulated employer-page discovery',
    lane: 'UX leadership',
    comp: '$256k-$415k + equity',
    signals: ['developer tools', 'platform UX', 'remote US'],
    discoveryTerms: ['design', 'systems', 'leadership', 'platform', 'enterprise', 'developer'],
    reason: 'Strong fit for design leadership in a complex product surface with high leverage across platform workflows.',
    risk: 'Needs employer-page confirmation before application.',
  },
  {
    id: 'sentinelone-director-ux-architecture',
    company: 'SentinelOne',
    role: 'Director, Product Design & UX Architecture',
    score: 4.4,
    status: 'New',
    source: 'Simulated VC portfolio board',
    lane: 'Enterprise UX architecture',
    comp: '$241k-$249k + equity',
    signals: ['AI cybersecurity', 'UX architecture', 'design org leadership'],
    discoveryTerms: ['enterprise', 'architecture', 'ai', 'leadership', 'systems', 'security'],
    reason: 'Maps well to regulated complexity, systems thinking, and senior cross-functional design influence.',
    risk: 'Cybersecurity domain fit should be stress-tested before tailoring.',
  },
  {
    id: 'webflow-principal-product-designer',
    company: 'Webflow',
    role: 'Principal Product Designer',
    score: 4.3,
    status: 'New',
    source: 'Simulated Greenhouse discovery',
    lane: 'AI design systems',
    comp: '$206k-$344k',
    signals: ['agentic experiences', 'component systems', 'accessibility'],
    discoveryTerms: ['ai', 'agentic', 'design', 'systems', 'accessibility', 'components'],
    reason: 'Clear overlap with AI-augmented design operations, component-based product UX, and accessibility quality.',
    risk: 'Role may skew hands-on IC rather than design-practice leadership.',
  },
  {
    id: 'butterflymx-principal-product-designer-pm',
    company: 'ButterflyMX',
    role: 'Principal Product Designer & Product Manager',
    score: 3.9,
    status: 'New',
    source: 'Simulated Ashby discovery',
    lane: 'AI product ownership',
    comp: 'Not confirmed',
    signals: ['AI-forward', 'product ownership', 'design standards'],
    discoveryTerms: ['ai', 'product', 'ownership', 'standards', 'proptech', 'design'],
    reason: 'Interesting hybrid product/design ownership role with room to shape standards and AI workflows.',
    risk: 'Hybrid PM scope could dilute senior UX leadership lane.',
  },
  {
    id: 'servicenow-senior-manager-design-systems',
    company: 'ServiceNow',
    role: 'Senior Manager, Design Systems',
    score: 4.5,
    status: 'New',
    source: 'Simulated enterprise careers scan',
    lane: 'Design systems leadership',
    comp: '$210k-$305k',
    signals: ['workflow platform', 'governance', 'component adoption'],
    discoveryTerms: ['design', 'systems', 'governance', 'enterprise', 'workflow', 'manager'],
    reason: 'High overlap with scaling component governance, design practice maturity, and enterprise workflow quality.',
    risk: 'Confirm whether the role owns product-quality outcomes or mainly design operations throughput.',
  },
  {
    id: 'addepar-staff-product-designer-platform',
    company: 'Addepar',
    role: 'Staff Product Designer, Platform',
    score: 4.2,
    status: 'New',
    source: 'Simulated fintech ATS scan',
    lane: 'Complex platform UX',
    comp: '$185k-$260k',
    signals: ['regulated financial workflows', 'data-heavy UX', 'platform systems'],
    discoveryTerms: ['regulated', 'enterprise', 'platform', 'data', 'workflow', 'systems'],
    reason: 'Complex, regulated decision-support workflows make a credible bridge from compliance product design.',
    risk: 'Financial-services domain proof should be positioned without overclaiming prior scope.',
  },
  {
    id: '18f-product-design-lead',
    company: '18F',
    role: 'Product Design Lead',
    score: 4.1,
    status: 'New',
    source: 'Simulated GovTech board scan',
    lane: 'GovTech service design',
    comp: 'Public-sector band varies',
    signals: ['public services', 'accessibility', 'policy complexity'],
    discoveryTerms: ['govtech', 'government', 'public', 'accessibility', 'policy', 'service'],
    reason: 'Strong mission and accessibility fit with design leadership in public-sector complexity.',
    risk: 'Compensation and federal hiring constraints need early verification.',
  },
  {
    id: 'workiva-principal-product-designer-compliance',
    company: 'Workiva',
    role: 'Principal Product Designer, Compliance Platform',
    score: 4.4,
    status: 'New',
    source: 'Simulated compliance SaaS scan',
    lane: 'RegTech product design',
    comp: '$170k-$250k',
    signals: ['compliance workflows', 'audit trails', 'enterprise SaaS'],
    discoveryTerms: ['regtech', 'compliance', 'regulated', 'enterprise', 'audit', 'workflow'],
    reason: 'Excellent semantic match for compliance-centered product quality and cross-functional workflow design.',
    risk: 'Need to verify authority level and whether design systems work is central or adjacent.',
  },
];

const searchStarters = [
  'Design systems leadership',
  'Accessibility compliance',
  'AI design operations',
  'GovTech / RegTech UX',
  'Enterprise UX architecture',
];

const searchStopWords = new Set(['and', 'for', 'or', 'the', 'to', 'ux', 'job', 'jobs', 'role', 'roles']);

function getSearchTokens(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !searchStopWords.has(token));
}

function getInitialDiscoveryJobs() {
  return discoveryCatalog.slice(0, 4).map(({ discoveryTerms: _terms, ...job }) => job);
}

function getSimulatedDiscoveryResults(query: string, criteria: string) {
  const tokens = getSearchTokens(`${query} ${criteria}`);

  return discoveryCatalog
    .map((candidate, index) => {
      const semanticHits = candidate.discoveryTerms.filter((term) =>
        tokens.some((token) => term.includes(token) || token.includes(term)),
      ).length;
      const score = Math.min(4.9, candidate.score + semanticHits * 0.05);
      const source = `${candidate.source} - internet discovery simulation`;
      const { discoveryTerms: _terms, ...job } = candidate;

      return {
        job: {
          ...job,
          score,
          source,
        },
        rank: semanticHits * 10 + candidate.score - index * 0.01,
      };
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 4)
    .map(({ job }) => job);
}

function Icon({ name }: { name: 'search' | 'briefcase' | 'letter' | 'archive' | 'spark' | 'sun' | 'moon' }) {
  const paths = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="M15 15l4 4" />
      </>
    ),
    briefcase: (
      <>
        <path d="M7 8V6.5A2.5 2.5 0 0 1 9.5 4h5A2.5 2.5 0 0 1 17 6.5V8" />
        <path d="M4 8h16v10H4z" />
        <path d="M9 12h6" />
      </>
    ),
    letter: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M4 7l8 6 8-6" />
      </>
    ),
    archive: (
      <>
        <rect x="3.5" y="4.5" width="17" height="4.5" rx="1.3" />
        <path d="M5.5 9v9.5a1.8 1.8 0 0 0 1.8 1.8h9.4a1.8 1.8 0 0 0 1.8-1.8V9" />
        <path d="M9.5 13h5" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
        <path d="M5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7z" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2" />
        <path d="M12 19.5v2" />
        <path d="M4.6 4.6 6 6" />
        <path d="m18 18 1.4 1.4" />
        <path d="M2.5 12h2" />
        <path d="M19.5 12h2" />
        <path d="M4.6 19.4 6 18" />
        <path d="m18 6 1.4-1.4" />
      </>
    ),
    moon: (
      <path d="M20.5 14.2A7.2 7.2 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z" />
    ),
  };

  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={styles.statusBadge}>{status}</span>;
}

function ScoreBadge({ score, showLabel = false }: { score: number; showLabel?: boolean }) {
  return <span className={styles.scoreBadge}>{score.toFixed(1)}{showLabel ? ' fit' : ''}</span>;
}

function ThemeToggle() {
  const { setThemeName } = useThemeSwitcher();
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setThemeName('pampas');
  }, [setThemeName]);

  const applyTheme = (theme: 'light' | 'dark') => {
    setActiveTheme(theme);
    setThemeName(theme === 'light' ? 'pampas' : 'lumen-dark');
  };

  const nextTheme = activeTheme === 'light' ? 'dark' : 'light';

  return (
    <Button
      emphasis="low"
      iconOnly
      leftIcon={<Icon name={activeTheme === 'light' ? 'moon' : 'sun'} />}
      aria-label={activeTheme === 'light' ? 'Use dark theme' : 'Use Claude light theme'}
      title={activeTheme === 'light' ? 'Dark theme' : 'Claude light theme'}
      onClick={() => applyTheme(nextTheme)}
    />
  );
}

function SemanticCriteriaButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <Button
      emphasis="low"
      iconOnly
      leftIcon={<Icon name="spark" />}
      aria-label="Semantic criteria"
      aria-expanded={expanded}
      aria-haspopup="dialog"
      aria-controls="semantic-criteria-dialog"
      title="Semantic criteria"
      onClick={onClick}
    />
  );
}

function MatchCard({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`${styles.matchCard} ${selected ? styles.matchCardSelected : ''}`} onClick={onSelect}>
      <div className={styles.matchCardHeader}>
        <span className={styles.company}>{job.company}</span>
        <ScoreBadge score={job.score} />
      </div>
      <span className={styles.role}>{job.role}</span>
      <p>{job.reason}</p>
      <div className={styles.signalRow}>
        {job.signals.map((signal) => (
          <Badge key={signal} color="neutral" variant="subtle" size="sm">
            {signal}
          </Badge>
        ))}
      </div>
    </button>
  );
}

function CoverLetterDraft({ job }: { job: Job }) {
  return (
    <div className={styles.jobLetter}>
      <h3>Cover letter</h3>
      <Textarea
        label="Draft"
        fullWidth
        value={`I am interested in ${job.company}'s ${job.role} role because it connects directly to the work I do best: building design quality systems for complex product environments.\n\nThe strongest fit signals are ${job.signals.join(', ')}. I would tailor this letter around MTR Design System leadership, accessibility compliance as product quality, and AI-augmented design operations.`}
        readOnly
        style={{ minHeight: 220 }}
      />
      <div className={styles.actionRow}>
        <Button emphasis="mid">Regenerate</Button>
        <Button emphasis="low">Copy</Button>
      </div>
    </div>
  );
}

function JobDetailPanel({
  job,
  mode,
  showCoverLetter,
  onToggleCoverLetter,
  isSaved = false,
  onSaveRole,
}: {
  job: Job;
  mode: 'match' | 'application';
  showCoverLetter: boolean;
  onToggleCoverLetter: () => void;
  isSaved?: boolean;
  onSaveRole?: () => void;
}) {
  return (
    <aside className={styles.detailPanel}>
      <div className={styles.detailTop}>
        <StatusBadge status={job.status} />
        <ScoreBadge score={job.score} showLabel />
      </div>
      <h2>{job.company}</h2>
      <p className={styles.detailRole}>{job.role}</p>
      <dl className={styles.detailList}>
        <div>
          <dt>{mode === 'application' ? 'Current stage' : 'Why it matched'}</dt>
          <dd>{mode === 'application' ? `${job.status} - ${job.reason}` : job.reason}</dd>
        </div>
        <div>
          <dt>Risk to verify</dt>
          <dd>{job.risk}</dd>
        </div>
        <div>
          <dt>Lane</dt>
          <dd>{job.lane}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{job.source}</dd>
        </div>
        <div>
          <dt>Compensation</dt>
          <dd>{job.comp}</dd>
        </div>
      </dl>
      <div className={styles.signalRow}>
        {job.signals.map((signal) => (
          <Badge key={signal} color="neutral" variant="subtle" size="sm">
            {signal}
          </Badge>
        ))}
      </div>
      <div className={`${styles.actionRow} ${styles.detailActions}`}>
        <Button
          emphasis="mid"
          disabled={mode === 'match' && isSaved}
          onClick={mode === 'match' ? onSaveRole : undefined}
        >
          {mode === 'application' ? 'Update status' : isSaved ? 'Saved' : 'Save role'}
        </Button>
        <Button emphasis="low" onClick={onToggleCoverLetter}>
          {showCoverLetter ? 'Hide letter' : 'Draft letter'}
        </Button>
        <Button
          emphasis="low"
          iconOnly
          leftIcon={<Icon name="archive" />}
          aria-label="Archive"
          title="Archive"
          className={styles.archiveAction}
        />
      </div>

      {showCoverLetter && <CoverLetterDraft job={job} />}
    </aside>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>('find');
  const [discoveredJobs, setDiscoveredJobs] = useState<Job[]>(() => getInitialDiscoveryJobs());
  const [savedRoles, setSavedRoles] = useState<Job[]>(savedApplicationJobs);
  const [selectedDiscoveryJobId, setSelectedDiscoveryJobId] = useState(getInitialDiscoveryJobs()[0].id);
  const [selectedApplicationJobId, setSelectedApplicationJobId] = useState(savedApplicationJobs[0].id);
  const [showSearchSpec, setShowSearchSpec] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Design systems / accessibility / AI leadership');
  const [lastDiscoveryQuery, setLastDiscoveryQuery] = useState('Design systems / accessibility / AI leadership');
  const [isSearching, setIsSearching] = useState(false);
  const [criteria, setCriteria] = useState(
    'UX leadership, design systems governance, accessibility as product quality, AI-augmented design operations, GovTech/RegTech or complex enterprise workflows',
  );

  const hasPendingDiscoveryQuery = searchQuery.trim() !== lastDiscoveryQuery.trim();
  const selectedDiscoveryJob =
    discoveredJobs.find((job) => job.id === selectedDiscoveryJobId) ?? discoveredJobs[0];
  const selectedApplicationJob =
    savedRoles.find((job) => job.id === selectedApplicationJobId) ?? savedRoles[0];

  const workflowTabs = useMemo<TabItem[]>(
    () => [
      { id: 'find', label: 'Find Jobs', badge: discoveredJobs.length },
      { id: 'applications', label: 'Applications', badge: savedRoles.length },
    ],
    [discoveredJobs.length, savedRoles.length],
  );

  const runSearch = () => {
    if (isSearching) {
      return;
    }

    const nextQuery = searchQuery.trim() || 'UX leadership design systems accessibility';

    setActiveView('find');
    setSearchQuery(nextQuery);
    setIsSearching(true);
    setShowCoverLetter(false);

    window.setTimeout(() => {
      const nextJobs = getSimulatedDiscoveryResults(nextQuery, criteria);
      setDiscoveredJobs(nextJobs);
      setSelectedDiscoveryJobId(nextJobs[0].id);
      setLastDiscoveryQuery(nextQuery);
      setIsSearching(false);
    }, 850);
  };

  const saveDiscoveredRole = (job: Job) => {
    setSavedRoles((currentRoles) => {
      if (currentRoles.some((role) => role.id === job.id)) {
        return currentRoles;
      }

      return [
        {
          ...job,
          status: 'Review',
          source: `Saved from ${job.source}`,
        },
        ...currentRoles,
      ];
    });
    setSelectedApplicationJobId(job.id);
  };

  useEffect(() => {
    if (discoveredJobs.length === 0 || discoveredJobs.some((job) => job.id === selectedDiscoveryJobId)) {
      return;
    }

    setSelectedDiscoveryJobId(discoveredJobs[0].id);
  }, [discoveredJobs, selectedDiscoveryJobId]);

  useEffect(() => {
    if (savedRoles.length === 0 || savedRoles.some((job) => job.id === selectedApplicationJobId)) {
      return;
    }

    setSelectedApplicationJobId(savedRoles[0].id);
  }, [savedRoles, selectedApplicationJobId]);

  useEffect(() => {
    if (!showSearchSpec) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchSpec(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showSearchSpec]);

  const applicationColumns = useMemo<DataTableColumn<Job>[]>(
    () => [
      {
        key: 'company',
        header: 'Company',
        cardPrimary: true,
        render: (job) => (
          <div className={styles.tablePrimary}>
            <strong>{job.company}</strong>
            <span>{job.role}</span>
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        render: (job) => <StatusBadge status={job.status} />,
      },
      {
        key: 'score',
        header: 'Fit',
        align: 'right',
        render: (job) => <strong>{job.score.toFixed(1)}</strong>,
      },
      {
        key: 'lane',
        header: 'Lane',
      },
      {
        key: 'comp',
        header: 'Comp',
      },
      {
        key: 'detail',
        header: 'Detail',
        align: 'right',
        render: (job) => (
          <Button emphasis="low" onClick={() => setSelectedApplicationJobId(job.id)}>
            {job.id === selectedApplicationJobId ? 'Viewing' : 'Open'}
          </Button>
        ),
      },
    ],
    [selectedApplicationJobId],
  );

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1>Product Design</h1>
          <p>Semantic job discovery for fewer, better applications.</p>
        </div>
        <div className={styles.headerActions}>
          <SemanticCriteriaButton
            expanded={showSearchSpec}
            onClick={() => setShowSearchSpec((value) => !value)}
          />
          <ThemeToggle />
        </div>
      </header>

      <section className={styles.searchCenter} aria-label="Job search">
        <div className={styles.searchBox}>
          <Icon name="search" />
          <label className={styles.srOnly} htmlFor="job-search">
            Search target lane
          </label>
          <input
            id="job-search"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                runSearch();
              }
            }}
            placeholder="Search the open internet by lane, company, or signals"
            aria-describedby="search-run-status"
          />
          <Button emphasis="high" leftIcon={<Icon name="search" />} disabled={isSearching} onClick={runSearch}>
            {isSearching ? 'Searching' : 'Search'}
          </Button>
        </div>
        <p id="search-run-status" className={styles.searchMeta} aria-live="polite">
          {isSearching
            ? 'Searching employer pages, portfolio boards, ATS postings, and job indexes.'
            : hasPendingDiscoveryQuery
              ? 'Query edited. Search will run a new discovery pass.'
              : `Showing simulated discovery results for "${lastDiscoveryQuery}".`}
        </p>
        <ChipGroup className={styles.starterChips} aria-label="Conversation starters">
          {searchStarters.map((starter) => (
            <Chip
              key={starter}
              size="md"
              selected={searchQuery === starter}
              onSelect={() => {
                setSearchQuery(starter);
                setActiveView('find');
              }}
            >
              {starter}
            </Chip>
          ))}
        </ChipGroup>
      </section>

      {showSearchSpec && (
        <div
          className={styles.criteriaOverlay}
          onMouseDown={() => setShowSearchSpec(false)}
        >
          <div
            id="semantic-criteria-dialog"
            className={styles.criteriaModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="semantic-criteria-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2 id="semantic-criteria-title">Semantic criteria</h2>
              </div>
              <Button emphasis="low" onClick={() => setShowSearchSpec(false)}>
                Close
              </Button>
            </div>
            <Textarea
              label="Semantic criteria"
              value={criteria}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setCriteria(event.currentTarget.value)}
              fullWidth
              style={{ minHeight: 112 }}
            />
            <div className={styles.actionRow}>
              <Button emphasis="low">Import JD</Button>
              <Button emphasis="mid" onClick={() => setShowSearchSpec(false)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className={styles.navBand} aria-label="Product Design workflows">
        <div className={styles.workflowNav}>
          <TabBar
            tabs={workflowTabs}
            activeTab={activeView}
            onTabChange={(id: string) => setActiveView(id as ViewId)}
            align="left"
            hasDivider={false}
          />
        </div>
      </section>

      <section className={styles.findGrid} hidden={activeView !== 'find'}>
        <div className={styles.resultsColumn} aria-busy={isSearching}>
          <div
            className={`${styles.loadingState} ${isSearching ? '' : styles.loadingStateHidden}`}
            role="status"
            aria-live="polite"
          >
            <strong>Running discovery</strong>
            <p>Simulating a fresh internet/job-board search from the current query and semantic criteria.</p>
          </div>
          {discoveredJobs.length > 0 ? (
            <div className={styles.matchList}>
              {discoveredJobs.map((job) => (
                <MatchCard
                  key={job.id}
                  job={job}
                  selected={job.id === selectedDiscoveryJobId}
                  onSelect={() => setSelectedDiscoveryJobId(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <strong>No matches yet</strong>
              <p>Try a broader lane, company, role, or signal.</p>
            </div>
          )}
        </div>

        {selectedDiscoveryJob && (
          <JobDetailPanel
            job={selectedDiscoveryJob}
            mode="match"
            showCoverLetter={showCoverLetter}
            onToggleCoverLetter={() => setShowCoverLetter((value) => !value)}
            isSaved={savedRoles.some((role) => role.id === selectedDiscoveryJob.id)}
            onSaveRole={() => saveDiscoveredRole(selectedDiscoveryJob)}
          />
        )}
      </section>

      <section className={styles.applicationsView} hidden={activeView !== 'applications'}>
        <div className={styles.applicationsActions}>
          <Button emphasis="mid">Add role</Button>
        </div>
        <div className={styles.applicationsLayout}>
          <div className={styles.applicationTablePanel}>
            <DataTable
              columns={applicationColumns}
              data={savedRoles}
              rowKey={(job: Job) => job.id}
              display="auto"
              density="comfortable"
              hoverable
              caption="Saved roles"
            />
          </div>
          {selectedApplicationJob && (
            <JobDetailPanel
              job={selectedApplicationJob}
              mode="application"
              showCoverLetter={showCoverLetter}
              onToggleCoverLetter={() => setShowCoverLetter((value) => !value)}
            />
          )}
        </div>
      </section>

    </main>
  );
}
