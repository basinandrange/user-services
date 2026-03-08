const DEFAULT_API_BASE_URL = 'http://localhost:3001';
const DEFAULT_API_KEY_HEADER = 'local-dev';

let API_BASE_URL = (localStorage.getItem('userApiBaseUrl') || DEFAULT_API_BASE_URL).replace(/\/$/, '');
let API_KEY_HEADER = localStorage.getItem('userApiKeyHeader') || DEFAULT_API_KEY_HEADER;

const state = {
  users: [],
  filteredUsers: [],
  selectedUserId: null,
  createdUserId: null,
  lastAction: 'None'
};

const loadingOverlay = document.getElementById('loading-overlay');
const loginView = document.getElementById('login-view');

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  initializeSettings();
  updateDashboardCards();
});

function setupEventListeners() {
  document.getElementById('connect-form').addEventListener('submit', handleConnect);
  document.getElementById('logout-btn').addEventListener('click', handleDisconnect);

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', handleNavigation);
  });

  document.getElementById('go-to-users-btn').addEventListener('click', () => {
    updateNavigation('users');
    switchView('users');
  });

  document.getElementById('refresh-dashboard-btn').addEventListener('click', async () => {
    await refreshUsers('Dashboard refreshed.', 'dashboard');
  });

  document.getElementById('refresh-users-btn').addEventListener('click', async () => {
    await refreshUsers('User list refreshed.', 'users');
  });

  document.getElementById('user-search').addEventListener('input', () => {
    applyUserFilter();
  });

  document.getElementById('update-user-form').addEventListener('submit', handleUpdateUser);
  document.getElementById('copy-user-btn').addEventListener('click', handleCopyUser);
  document.getElementById('delete-user-btn').addEventListener('click', handleDeleteUser);

  document.getElementById('create-user-form').addEventListener('submit', handleCreateUser);
  document.getElementById('use-created-user-btn').addEventListener('click', handleUseCreatedUser);
  document.getElementById('create-another-user-btn').addEventListener('click', handleCreateAnotherUser);

  document.getElementById('settings-form').addEventListener('submit', handleSettingsSave);
  document.getElementById('test-connection-btn').addEventListener('click', testApiConnection);
  document.getElementById('reset-settings-btn').addEventListener('click', resetSettingsToDefault);

  document.querySelectorAll('.preset-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('api-base-url').value = button.dataset.url;
    });
  });
}

function handleNavigation(event) {
  event.preventDefault();
  const targetView = event.currentTarget.dataset.view;

  if (loginView.classList.contains('active') && targetView !== 'settings') {
    showSettingsMessage('Connect to the API first.', 'info');
    switchView('login');
    return;
  }

  updateNavigation(targetView);
  switchView(targetView);

  if (targetView === 'dashboard') {
    renderRecentUsers();
  }

  if (targetView === 'users') {
    renderUsersTable();
  }

  if (targetView === 'settings') {
    updateSettingsDisplay();
  }
}

function updateNavigation(view) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === view);
  });
}

function switchView(viewName) {
  document.querySelectorAll('.view-container').forEach((container) => {
    container.classList.remove('active');
  });

  const target = document.getElementById(`${viewName}-view`);
  if (target) {
    target.classList.add('active');
  }
}

async function handleConnect(event) {
  event.preventDefault();

  const baseInput = document.getElementById('connect-base-url').value.trim();
  const keyInput = document.getElementById('connect-api-key').value.trim();

  const cleanUrl = normalizeBaseUrl(baseInput || DEFAULT_API_BASE_URL);
  if (!isValidUrl(cleanUrl)) {
    showConnectMessage('Please enter a valid API base URL.', 'error');
    return;
  }

  API_BASE_URL = cleanUrl;
  API_KEY_HEADER = keyInput || DEFAULT_API_KEY_HEADER;

  localStorage.setItem('userApiBaseUrl', API_BASE_URL);
  localStorage.setItem('userApiKeyHeader', API_KEY_HEADER);

  initializeSettings();

  try {
    await refreshUsers('Connected successfully.', 'users');
    switchView('dashboard');
    updateNavigation('dashboard');
    document.getElementById('api-status-card').textContent = 'Connected';
    showConnectMessage('Connected successfully.', 'success');
  } catch (error) {
    document.getElementById('api-status-card').textContent = 'Connection failed';
    showConnectMessage(error.message, 'error');
    switchView('login');
  }
}

function handleDisconnect() {
  state.selectedUserId = null;
  state.createdUserId = null;
  state.lastAction = 'Disconnected';

  document.getElementById('connect-base-url').value = API_BASE_URL;
  document.getElementById('connect-api-key').value = API_KEY_HEADER;

  updateNavigation('dashboard');
  switchView('login');
  clearMessages();
  updateDashboardCards();
}

function getRequestHeaders(includeJson = true) {
  const headers = { Accept: 'application/json' };

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (API_KEY_HEADER) {
    headers.key = API_KEY_HEADER;
  }

  return headers;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...getRequestHeaders(options.body !== undefined)
    }
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      payload = text;
    }
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && payload.error
        ? payload.error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

async function fetchUsers() {
  const payload = await apiRequest('/get?all=true', {
    method: 'GET',
    headers: getRequestHeaders(false)
  });

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter((item) => item && typeof item === 'object' && item.id);
}

async function refreshUsers(successMessage = '', messageTarget = 'users') {
  showLoading();
  clearMessages();

  try {
    state.users = await fetchUsers();

    if (state.selectedUserId && !state.users.find((user) => user.id === state.selectedUserId)) {
      state.selectedUserId = null;
    }

    applyUserFilter();
    syncSelectedUserUI();
    renderRecentUsers();
    updateDashboardCards();

    if (successMessage) {
      if (messageTarget === 'users') {
        showUsersMessage(successMessage, 'success');
      } else if (messageTarget === 'create') {
        showCreateUserMessage(successMessage, 'success');
      }
    }

    showLoading(false);
  } catch (error) {
    showLoading(false);
    throw error;
  }
}

function applyUserFilter() {
  const term = document.getElementById('user-search').value.trim().toLowerCase();

  if (!term) {
    state.filteredUsers = [...state.users];
  } else {
    state.filteredUsers = state.users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      return fullName.includes(term) || user.id.toLowerCase().includes(term);
    });
  }

  renderUsersTable();
}

function renderUsersTable() {
  const tbody = document.getElementById('users-body');
  tbody.innerHTML = '';

  if (!state.filteredUsers.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="no-data">No users found</td></tr>';
    return;
  }

  const fragment = document.createDocumentFragment();

  state.filteredUsers.forEach((user) => {
    const tr = document.createElement('tr');
    tr.classList.add('selectable');
    if (state.selectedUserId === user.id) {
      tr.classList.add('selected');
    }

    tr.addEventListener('click', () => {
      state.selectedUserId = user.id;
      syncSelectedUserUI();
      renderUsersTable();
      renderRecentUsers();
      updateDashboardCards();
    });

    tr.appendChild(buildCell(user.firstName || '-'));
    tr.appendChild(buildCell(user.lastName || '-'));
    tr.appendChild(buildCell(user.id));

    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
}

function renderRecentUsers() {
  const tbody = document.getElementById('recent-users-body');
  tbody.innerHTML = '';

  if (!state.users.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="no-data">No users loaded yet</td></tr>';
    return;
  }

  const recent = state.users.slice(-6).reverse();
  const fragment = document.createDocumentFragment();

  recent.forEach((user) => {
    const tr = document.createElement('tr');
    if (state.selectedUserId === user.id) {
      tr.classList.add('selected');
    }

    tr.appendChild(buildCell(user.firstName || '-'));
    tr.appendChild(buildCell(user.lastName || '-'));
    tr.appendChild(buildCell(user.id));
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
}

function buildCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

function getSelectedUser() {
  return state.users.find((user) => user.id === state.selectedUserId) || null;
}

function syncSelectedUserUI() {
  const selected = getSelectedUser();

  const firstNameInput = document.getElementById('update-first-name');
  const lastNameInput = document.getElementById('update-last-name');
  const passwordInput = document.getElementById('update-password');

  if (!selected) {
    firstNameInput.value = '';
    lastNameInput.value = '';
    passwordInput.value = '';
    document.getElementById('selected-user-badge').textContent = 'None';
    document.getElementById('selected-user-card').textContent = 'None';
    return;
  }

  firstNameInput.value = selected.firstName || '';
  lastNameInput.value = selected.lastName || '';
  passwordInput.value = '';

  const label = `${selected.firstName || ''} ${selected.lastName || ''}`.trim() || selected.id;
  document.getElementById('selected-user-badge').textContent = label;
  document.getElementById('selected-user-card').textContent = label;
}

function updateDashboardCards() {
  document.getElementById('total-users-card').textContent = String(state.users.length);
  document.getElementById('last-action-card').textContent = state.lastAction;

  const selected = getSelectedUser();
  if (selected) {
    const label = `${selected.firstName || ''} ${selected.lastName || ''}`.trim() || selected.id;
    document.getElementById('selected-user-card').textContent = label;
  } else {
    document.getElementById('selected-user-card').textContent = 'None';
  }
}

async function handleUpdateUser(event) {
  event.preventDefault();
  clearMessages();

  const selected = getSelectedUser();
  if (!selected) {
    showUsersMessage('Select a user before updating.', 'error');
    return;
  }

  const payload = {
    firstName: document.getElementById('update-first-name').value.trim(),
    lastName: document.getElementById('update-last-name').value.trim()
  };

  const password = document.getElementById('update-password').value;
  if (password.trim()) {
    payload.password = password;
  }

  if (!payload.firstName || !payload.lastName) {
    showUsersMessage('First name and last name are required.', 'error');
    return;
  }

  showLoading();

  try {
    await apiRequest(`/update?id=${encodeURIComponent(selected.id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    state.lastAction = 'Updated user';
    await refreshUsers('User updated successfully.', 'users');
    state.selectedUserId = selected.id;
    syncSelectedUserUI();
    renderUsersTable();
    showLoading(false);
  } catch (error) {
    showLoading(false);
    showUsersMessage(error.message, 'error');
  }
}

async function handleCopyUser() {
  clearMessages();

  const selected = getSelectedUser();
  if (!selected) {
    showUsersMessage('Select a user before copying.', 'error');
    return;
  }

  showLoading();

  try {
    const copied = await apiRequest(`/update?id=${encodeURIComponent(selected.id)}`, {
      method: 'PATCH',
      headers: getRequestHeaders(false)
    });

    state.lastAction = 'Copied user';
    await refreshUsers(`User copied as ${copied.id}.`, 'users');
    state.selectedUserId = copied.id;
    syncSelectedUserUI();
    renderUsersTable();
    showLoading(false);
  } catch (error) {
    showLoading(false);
    showUsersMessage(error.message, 'error');
  }
}

async function handleDeleteUser() {
  clearMessages();

  const selected = getSelectedUser();
  if (!selected) {
    showUsersMessage('Select a user before deleting.', 'error');
    return;
  }

  const confirmDelete = window.confirm(
    `Delete ${selected.firstName || ''} ${selected.lastName || ''}?`
  );

  if (!confirmDelete) {
    return;
  }

  showLoading();

  try {
    await apiRequest(`/delete?id=${encodeURIComponent(selected.id)}`, {
      method: 'DELETE',
      headers: getRequestHeaders(false)
    });

    state.selectedUserId = null;
    state.lastAction = 'Deleted user';
    await refreshUsers('User deleted.', 'users');
    showLoading(false);
  } catch (error) {
    showLoading(false);
    showUsersMessage(error.message, 'error');
  }
}

async function handleCreateUser(event) {
  event.preventDefault();
  clearMessages();

  const payload = {
    firstName: document.getElementById('new-first-name').value.trim(),
    lastName: document.getElementById('new-last-name').value.trim()
  };

  const password = document.getElementById('new-password').value;
  if (password.trim()) {
    payload.password = password;
  }

  if (!payload.firstName || !payload.lastName) {
    showCreateUserMessage('First name and last name are required.', 'error');
    return;
  }

  showLoading();

  try {
    const result = await apiRequest('/create', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.createdUserId = result.id;
    state.lastAction = 'Created user';

    document.getElementById('created-first-name').textContent = result.firstName;
    document.getElementById('created-last-name').textContent = result.lastName;
    document.getElementById('created-user-id').textContent = result.id;
    document.getElementById('user-created-result').style.display = 'block';

    await refreshUsers('User created successfully.', 'create');
    showLoading(false);
  } catch (error) {
    showLoading(false);
    showCreateUserMessage(error.message, 'error');
  }
}

function handleUseCreatedUser() {
  if (!state.createdUserId) {
    return;
  }

  state.selectedUserId = state.createdUserId;
  updateNavigation('users');
  switchView('users');
  syncSelectedUserUI();
  renderUsersTable();
  renderRecentUsers();
  updateDashboardCards();
}

function handleCreateAnotherUser() {
  document.getElementById('create-user-form').reset();
  document.getElementById('user-created-result').style.display = 'none';
  state.createdUserId = null;
  showCreateUserMessage('Form reset. Enter details for another user.', 'info');
}

function initializeSettings() {
  document.getElementById('connect-base-url').value = API_BASE_URL;
  document.getElementById('connect-api-key').value = API_KEY_HEADER;
  updateSettingsDisplay();
}

function updateSettingsDisplay() {
  document.getElementById('api-base-url').value = API_BASE_URL;
  document.getElementById('api-key-header').value = API_KEY_HEADER;
  document.getElementById('current-base-url').textContent = API_BASE_URL;
  document.getElementById('current-key-header').textContent = API_KEY_HEADER || '(none)';
}

function handleSettingsSave(event) {
  event.preventDefault();

  const baseInput = document.getElementById('api-base-url').value.trim();
  const keyInput = document.getElementById('api-key-header').value.trim();

  const cleanUrl = normalizeBaseUrl(baseInput || DEFAULT_API_BASE_URL);

  if (!isValidUrl(cleanUrl)) {
    showSettingsMessage('Please enter a valid URL.', 'error');
    return;
  }

  API_BASE_URL = cleanUrl;
  API_KEY_HEADER = keyInput;

  localStorage.setItem('userApiBaseUrl', API_BASE_URL);
  localStorage.setItem('userApiKeyHeader', API_KEY_HEADER);

  initializeSettings();
  showSettingsMessage('Settings saved. New values apply immediately.', 'success');
}

async function testApiConnection() {
  const testUrl = normalizeBaseUrl(document.getElementById('api-base-url').value.trim());
  const testKey = document.getElementById('api-key-header').value.trim();

  if (!isValidUrl(testUrl)) {
    showSettingsMessage('Please enter a valid URL before testing.', 'error');
    return;
  }

  const statusIndicator = document.querySelector('.status-indicator');
  const statusText = document.getElementById('api-status-text');

  statusIndicator.classList.remove('connected', 'error');
  statusText.textContent = 'Testing...';

  showLoading();

  try {
    const response = await fetch(`${testUrl}/get?all=true`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(testKey ? { key: testKey } : {})
      }
    });

    showLoading(false);

    if (response.ok) {
      statusIndicator.classList.add('connected');
      statusText.textContent = 'Connected';
      document.getElementById('api-status-card').textContent = 'Connected';
      showSettingsMessage('Connection successful.', 'success');
    } else {
      statusIndicator.classList.add('error');
      statusText.textContent = `Error ${response.status}`;
      document.getElementById('api-status-card').textContent = 'Error';
      showSettingsMessage(`Server responded with ${response.status}.`, 'error');
    }
  } catch (error) {
    showLoading(false);
    statusIndicator.classList.add('error');
    statusText.textContent = 'Connection failed';
    document.getElementById('api-status-card').textContent = 'Connection failed';
    showSettingsMessage('Unable to connect. Check the URL and server status.', 'error');
  }
}

function resetSettingsToDefault() {
  document.getElementById('api-base-url').value = DEFAULT_API_BASE_URL;
  document.getElementById('api-key-header').value = DEFAULT_API_KEY_HEADER;
  showSettingsMessage('Defaults restored. Click Save Settings to apply.', 'info');
}

function showUsersMessage(message, type) {
  const container = document.getElementById('users-message');
  container.textContent = message;
  container.className = `update-message ${type}`;
  container.style.display = 'block';
}

function showCreateUserMessage(message, type) {
  const container = document.getElementById('create-user-message');
  container.textContent = message;
  container.className = `update-message ${type}`;
  container.style.display = 'block';
}

function showSettingsMessage(message, type) {
  const container = document.getElementById('settings-message');
  container.textContent = message;
  container.className = `update-message ${type}`;
  container.style.display = 'block';
}

function showConnectMessage(message, type) {
  const container = document.getElementById('connect-message');
  container.textContent = message;
  container.className = `update-message ${type}`;
  container.style.display = 'block';
}

function clearMessages() {
  ['users-message', 'create-user-message', 'settings-message', 'connect-message'].forEach((id) => {
    const container = document.getElementById(id);
    container.style.display = 'none';
    container.textContent = '';
    container.className = 'update-message';
  });
}

function normalizeBaseUrl(value) {
  return (value || '').replace(/\/$/, '');
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function showLoading(active = true) {
  loadingOverlay.classList.toggle('active', active);
}
