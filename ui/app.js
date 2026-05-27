const stateUrl = '/api/state';

const elements = {
  trackedCount: document.querySelector('#trackedCount'),
  pendingCount: document.querySelector('#pendingCount'),
  highFitCount: document.querySelector('#highFitCount'),
  pipelineTable: document.querySelector('#pipelineTable'),
  applicationsTable: document.querySelector('#applicationsTable'),
  openBrainCopy: document.querySelector('#openBrainCopy'),
  refreshButton: document.querySelector('#refreshButton'),
  discoveryForm: document.querySelector('#discoveryForm'),
  discoveryStatus: document.querySelector('#discoveryStatus'),
  scanBrief: document.querySelector('#scanBrief'),
  form: document.querySelector('#pipelineForm'),
  formStatus: document.querySelector('#formStatus'),
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderApplications(applications) {
  if (!applications.length) {
    elements.applicationsTable.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">No roles have been evaluated yet. Send /career-ops pipeline in this chat to score and rank the waiting jobs.</td>
      </tr>
    `;
    return;
  }

  elements.applicationsTable.innerHTML = applications
    .map((app) => `
      <tr>
        <td>${escapeHtml(app.company)}</td>
        <td>${escapeHtml(app.role)}</td>
        <td>${escapeHtml(app.score)}</td>
        <td>${escapeHtml(app.status)}</td>
      </tr>
    `)
    .join('');
}

function renderPipeline(pipeline) {
  if (!pipeline.length) {
    elements.pipelineTable.innerHTML = `
      <tr>
        <td class="empty-row" colspan="4">No discovered jobs yet. Run /career-ops scan to find roles.</td>
      </tr>
    `;
    return;
  }

  elements.pipelineTable.innerHTML = pipeline
    .map((item) => `
      <tr>
        <td>${escapeHtml(item.company)}</td>
        <td>${escapeHtml(item.role)}</td>
        <td>${escapeHtml(item.notes)}</td>
        <td><a href="${escapeHtml(item.source)}" target="_blank" rel="noreferrer">Open</a></td>
      </tr>
    `)
    .join('');
}

async function loadState() {
  const response = await fetch(stateUrl);
  const state = await response.json();
  elements.trackedCount.textContent = state.metrics.tracked;
  elements.pendingCount.textContent = state.metrics.pending;
  elements.highFitCount.textContent = state.metrics.highFit;
  elements.openBrainCopy.textContent = `${state.openBrain.connection} ${state.openBrain.recallRule}`;
  renderPipeline(state.pipeline);
  renderApplications(state.applications);
}

elements.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  elements.formStatus.textContent = 'Adding role...';

  const formData = new FormData(elements.form);
  const payload = Object.fromEntries(formData.entries());
  const response = await fetch('/api/pipeline', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    elements.formStatus.textContent = result.error || 'Could not add the role.';
    return;
  }

  elements.form.reset();
  elements.formStatus.textContent = `Saved to the evaluation inbox as ${result.pipelineSource}. Run /career-ops pipeline when you are ready to score it.`;
  await loadState();
});

elements.refreshButton.addEventListener('click', loadState);

elements.discoveryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(elements.discoveryForm);
  const lane = formData.get('roleLane');
  const location = formData.get('location');
  const mustHave = formData.get('mustHave');
  elements.discoveryStatus.textContent = `Discovery scan ready for ${lane} roles in ${location}.`;
  elements.scanBrief.hidden = false;
  await navigator.clipboard.writeText(`/career-ops scan\n\nFind ${lane} roles for Lana. Prioritize: ${mustHave}. Location: ${location}.`);
});

await loadState();
