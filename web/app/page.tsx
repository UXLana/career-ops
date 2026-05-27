'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useThemeSwitcher } from '@lumen/design-system/styles/themes';
import {
  Badge,
  Button,
  DataTable,
  StatsCard,
  StatsCardGroup,
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

const views: TabItem[] = [
  { id: 'find', label: 'Find Jobs', badge: 4 },
  { id: 'applications', label: 'Applications', badge: 4 },
];

const jobs: Job[] = [
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

const statusColor: Record<Status, 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'error'> = {
  New: 'neutral',
  Review: 'brand',
  Evaluating: 'info',
  Applied: 'success',
  Interview: 'warning',
  Declined: 'neutral',
  Rejected: 'error',
  Archived: 'neutral',
};

function Icon({ name }: { name: 'search' | 'briefcase' | 'letter' | 'spark' | 'sun' | 'moon' }) {
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
  return (
    <Badge color={statusColor[status]} variant="subtle" size="sm">
      {status}
    </Badge>
  );
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
    <button
      type="button"
      aria-label={activeTheme === 'light' ? 'Use dark theme' : 'Use Claude light theme'}
      title={activeTheme === 'light' ? 'Dark theme' : 'Claude light theme'}
      className={styles.themeIconButton}
      onClick={() => applyTheme(nextTheme)}
    >
      <Icon name={activeTheme === 'light' ? 'moon' : 'sun'} />
    </button>
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
}: {
  job: Job;
  mode: 'match' | 'application';
  showCoverLetter: boolean;
  onToggleCoverLetter: () => void;
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
      <div className={styles.actionRow}>
        <Button emphasis="mid">{mode === 'application' ? 'Update status' : 'Move to evaluation'}</Button>
        <Button emphasis="mid" onClick={onToggleCoverLetter}>
          {showCoverLetter ? 'Hide letter' : 'Draft letter'}
        </Button>
        <Button emphasis="low">Archive</Button>
      </div>

      {showCoverLetter && <CoverLetterDraft job={job} />}
    </aside>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>('find');
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const [showSearchSpec, setShowSearchSpec] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Design systems / accessibility / AI leadership');
  const [criteria, setCriteria] = useState(
    'UX leadership, design systems governance, accessibility as product quality, AI-augmented design operations, GovTech/RegTech or complex enterprise workflows',
  );

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? jobs[0];
  const evaluatingCount = jobs.filter((job) => job.status === 'Review' || job.status === 'Evaluating').length;
  const priorityCount = jobs.filter((job) => job.score >= 4.5).length;

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
          <Button emphasis="low" onClick={() => setSelectedJobId(job.id)}>
            {job.id === selectedJobId ? 'Viewing' : 'Open'}
          </Button>
        ),
      },
    ],
    [selectedJobId],
  );

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1>Career-Ops</h1>
          <p>Semantic job discovery for fewer, better applications.</p>
        </div>
        <div className={styles.headerActions}>
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
            placeholder="Search by role, lane, company, or signals"
          />
          <Button emphasis="high" leftIcon={<Icon name="search" />}>
            Search
          </Button>
        </div>
        <button
          type="button"
          className={styles.criteriaDisclosure}
          aria-expanded={showSearchSpec}
          aria-haspopup="dialog"
          aria-controls="semantic-criteria-dialog"
          onClick={() => setShowSearchSpec((value) => !value)}
        >
          <span>Semantic criteria</span>
          <small>Open</small>
        </button>
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

      <section className={styles.statsGrid} aria-label="Pipeline summary">
        <StatsCardGroup>
          <StatsCard label="Pending matches" value={jobs.length} icon={<Icon name="search" />} />
          <StatsCard label="In review" value={evaluatingCount} icon={<Icon name="briefcase" />} />
          <StatsCard label="Priority fit" value={priorityCount} icon={<Icon name="spark" />} />
          <StatsCard label="Drafts started" value="1" icon={<Icon name="letter" />} />
        </StatsCardGroup>
      </section>

      <section className={styles.navBand} aria-label="Career-Ops workflows">
        <div className={styles.workflowNav}>
          <TabBar
            tabs={views}
            activeTab={activeView}
            onTabChange={(id: string) => setActiveView(id as ViewId)}
            align="left"
            hasDivider={false}
          />
        </div>
      </section>

      {activeView === 'find' && (
        <>
          <section className={styles.findGrid}>
            <div className={styles.resultsColumn}>
              <div className={styles.resultsHeader}>
                <h2>Semantic matches</h2>
                <Button emphasis="mid" onClick={() => setActiveView('applications')}>
                  Evaluate selected
                </Button>
              </div>
              <div className={styles.matchList}>
                {jobs.map((job) => (
                  <MatchCard
                    key={job.id}
                    job={job}
                    selected={job.id === selectedJobId}
                    onSelect={() => setSelectedJobId(job.id)}
                  />
                ))}
              </div>
            </div>

            <JobDetailPanel
              job={selectedJob}
              mode="match"
              showCoverLetter={showCoverLetter}
              onToggleCoverLetter={() => setShowCoverLetter((value) => !value)}
            />
          </section>
        </>
      )}

      {activeView === 'applications' && (
        <section className={styles.applicationsView}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Applied jobs</h2>
              <p>Select a job to review its fit, source, risks, and next step in context.</p>
            </div>
            <Button emphasis="mid">Add role</Button>
          </div>
          <div className={styles.applicationsLayout}>
            <div className={styles.applicationTablePanel}>
              <DataTable
                columns={applicationColumns}
                data={jobs}
                rowKey={(job: Job) => job.id}
                display="auto"
                density="comfortable"
                hoverable
                caption="Applied jobs"
              />
            </div>
            <JobDetailPanel
              job={selectedJob}
              mode="application"
              showCoverLetter={showCoverLetter}
              onToggleCoverLetter={() => setShowCoverLetter((value) => !value)}
            />
          </div>
        </section>
      )}

    </main>
  );
}
