/* Campus Connections · mini-jeu autonome ETIC, sans framework ni dépendance runtime. */

const GAME_ID = 'game-10';
const MAX_SELECTION = 6;
const MAX_ERRORS = 6;
const ASSET_ROOT = '../../etic-ui-kit/etic-ui/assets';
const LOGO_URL = `${ASSET_ROOT}/logos/etic-color.svg`;
const RIBBON_URL = `${ASSET_ROOT}/ribbons/warm/ribbon-warm-oversized.webp`;

/* La banque complète est volontairement conservée ici : chaque partie utilise tout l'objet. */
const CATEGORIES = [
  {
    id: 'studies',
    name: 'Les études',
    words: ['TD', 'TP', 'Cours', 'Contrôle', 'Interro', 'Projet'],
  },
  {
    id: 'struggles',
    name: 'Les galères',
    words: ['Rattrapage', 'Note éliminatoire', 'Dette', 'Rachat', 'Crédit', 'Non-admis'],
  },
  {
    id: 'digital',
    name: 'Outils numériques',
    words: ['Moodle', 'Classroom', 'Drive', 'Gmail', 'Meet', 'Forms'],
  },
  {
    id: 'clubs',
    name: 'Les clubs',
    words: ['Membre', 'Événement', 'Réunion', 'Coordination', 'Hackathon', 'Local'],
  },
  {
    id: 'residence',
    name: 'La cité',
    words: ['Chambre', 'Pavillon', 'Restau', 'Foyer', 'Lit', 'Couloir'],
  },
  {
    id: 'campus',
    name: 'Campus',
    words: ['Amphi', 'Bibliothèque', 'Distributeurs', 'Administration', 'Laboratoire', 'Auditorium'],
  },
];

/* Ces teintes sont attribuées aléatoirement aux catégories à chaque nouvelle partie. */
const DIFFICULTY_COLORS = [
  { id: 'yellow', hex: '#ffca00', emoji: '🟨' },
  { id: 'orange', hex: '#ec9e00', emoji: '🟧' },
  { id: 'red', hex: '#c1333f', emoji: '🟥' },
  { id: 'teal', hex: '#02a9a2', emoji: '🟦' },
  { id: 'green', hex: '#1aaf5d', emoji: '🟩' },
  { id: 'pink', hex: '#f6415c', emoji: '🩷' },
];

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Le conteneur #app est introuvable.');
}

let state = createGameState();
let shakeTimer = null;

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function createGameState() {
  const colors = shuffle(DIFFICULTY_COLORS);
  const categories = CATEGORIES.map((category, index) => ({
    ...category,
    color: colors[index],
  }));
  const entries = categories.flatMap((category) =>
    category.words.map((word, index) => ({
      id: `${category.id}-${index}`,
      word,
      categoryId: category.id,
    })),
  );

  return {
    screen: 'welcome',
    categories,
    entries,
    remaining: shuffle(entries.map((entry) => entry.id)),
    selected: [],
    solved: [],
    errors: 0,
    attempts: [],
    notice: '',
    noticeType: '',
    shakeIds: [],
    justSolved: null,
    startTime: 0,
    score: 0,
    reported: false,
  };
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character]);
}

function entryById(id) {
  return state.entries.find((entry) => entry.id === id);
}

function categoryById(id) {
  return state.categories.find((category) => category.id === id);
}

function logoMarkup() {
  return `<span class="brand-logo-wrap"><img class="brand-logo" src="${LOGO_URL}" alt="ETIC" data-local-asset /></span>`;
}

function handleLocalAssetErrors() {
  document.querySelectorAll('img[data-local-asset]').forEach((image) => {
    image.addEventListener('error', () => {
      image.remove();
    }, { once: true });
  });
}

function renderWelcome() {
  app.innerHTML = `
    <div class="app-shell">
      <section class="screen welcome-screen" aria-labelledby="welcome-title">
        <header class="welcome-header">
          <div class="brand">${logoMarkup()}<span class="brand-name">ETIC<small>Jeu étudiant</small></span></div>
          <span class="edition">Une édition campus · jeu de mots</span>
        </header>
        <main class="welcome-inner">
          <div class="welcome-copy">
            <p class="eyebrow">Le défi des associations</p>
            <h1 id="welcome-title">Campus<br />Connections</h1>
            <span class="welcome-title-accent">Six groupes. Trente-six mots. Une vie étudiante à décoder.</span>
            <p>
              Sélectionne six mots qui partagent un champ lexical. Les groupes les plus évidents
              ne sont pas toujours ceux qui t’attendent au bout du campus.
            </p>
            <button class="welcome-action" id="start-button" type="button">Commencer la partie <span aria-hidden="true">↗</span></button>
            <p class="welcome-footnote">6 groupes à trouver · 6 erreurs autorisées · une nouvelle grille à chaque partie</p>
          </div>
          <div class="welcome-art" aria-hidden="true">
            <img class="welcome-ribbon" src="${RIBBON_URL}" alt="" data-local-asset />
            <div class="welcome-art-card">
              <strong>La grille du jour</strong>
              <div class="mini-grid">${Array.from({ length: 36 }, () => '<i></i>').join('')}</div>
            </div>
          </div>
        </main>
      </section>
    </div>`;

  document.querySelector('#start-button').addEventListener('click', startGame);
  handleLocalAssetErrors();
}

function renderGame() {
  const justSolved = state.justSolved;
  state.justSolved = null;
  const selectedCount = state.selected.length;
  const remainingCount = state.remaining.length;
  const notice = state.notice || (selectedCount === MAX_SELECTION
    ? 'Ta sélection est prête : valide le groupe.'
    : 'Trouve six mots qui vont ensemble.');
  const noticeClass = state.noticeType ? `is-${state.noticeType}` : '';
  const selectedLabel = selectedCount === 0
    ? 'Aucun mot sélectionné'
    : `${selectedCount} / ${MAX_SELECTION} mots sélectionnés`;

  app.innerHTML = `
    <div class="app-shell">
      <section class="screen game-screen" aria-labelledby="game-title">
        <header class="game-header">
          <div class="brand">${logoMarkup()}<span class="brand-name">Campus Connections<small>par ETIC</small></span></div>
          <span class="header-mark">Vie étudiante · grille 06×06</span>
        </header>
        <main class="game-main">
          <div class="game-art" aria-hidden="true"><img class="game-ribbon" src="${RIBBON_URL}" alt="" data-local-asset /></div>
          <div class="game-intro">
            <div>
              <p class="eyebrow" id="game-title">Campus Connections · la partie</p>
              <h1>Relie<br />les points.</h1>
              <p class="intro-copy">Les mots sont mélangés. Les six champs lexicaux restent secrets jusqu’à ce que tu les trouves.</p>
            </div>
            <div class="game-stats" aria-label="Progression de la partie">
              <div class="stat-line"><span>Groupes trouvés</span><strong>${state.solved.length} / 6</strong></div>
              <div class="stat-line"><span>Erreurs</span><span class="mistakes" aria-label="${state.errors} erreur${state.errors > 1 ? 's' : ''} sur ${MAX_ERRORS}">${Array.from({ length: MAX_ERRORS }, (_, index) => `<i class="mistake-dot ${index < state.errors ? 'used' : ''}"></i>`).join('')}</span></div>
            </div>
          </div>
          <div class="solved-groups" aria-live="polite">${state.solved.map((categoryId) => renderSolvedGroup(categoryById(categoryId), categoryId === justSolved)).join('')}</div>
          <section class="board-card" aria-label="Grille des mots">
            <div class="board-help">
              <span class="${noticeClass}">${escapeHTML(notice)}</span>
              <span class="selection-count">${selectedLabel}</span>
            </div>
            <div class="word-grid" role="group" aria-label="Mots encore à regrouper">${state.remaining.map(renderTile).join('')}</div>
            <div class="game-actions">
              <button class="action-button primary" type="button" data-action="validate" ${selectedCount !== MAX_SELECTION ? 'disabled' : ''}>Valider</button>
              <button class="action-button" type="button" data-action="shuffle">Mélanger</button>
              <button class="action-button" type="button" data-action="clear" ${selectedCount === 0 ? 'disabled' : ''}>Désélectionner</button>
            </div>
            <p class="game-note" aria-live="polite">${remainingCount} mots restants · ${6 - state.solved.length} groupes à découvrir</p>
          </section>
          <div class="game-footer"><span>Astuce : les catégories peuvent se croiser dans ta tête.</span><span>La partie se termine à 6 erreurs.</span></div>
        </main>
      </section>
    </div>`;

  document.querySelectorAll('[data-word-id]').forEach((tile) => {
    tile.addEventListener('click', () => toggleSelection(tile.dataset.wordId));
  });
  document.querySelector('[data-action="validate"]').addEventListener('click', submitSelection);
  document.querySelector('[data-action="shuffle"]').addEventListener('click', shuffleRemaining);
  document.querySelector('[data-action="clear"]').addEventListener('click', clearSelection);
  handleLocalAssetErrors();
}

function renderSolvedGroup(category, animate) {
  return `<div class="solved-group${animate ? ' just-found' : ''}" style="--group-color: ${category.color.hex}">
    <span class="solved-name">${escapeHTML(category.name)}</span>
    <span class="solved-words">${category.words.map((word) => `<span class="solved-word">${escapeHTML(word)}</span>`).join('')}</span>
  </div>`;
}

function renderTile(id) {
  const entry = entryById(id);
  const selected = state.selected.includes(id);
  const shaking = state.shakeIds.includes(id);
  return `<button class="word-tile${selected ? ' selected' : ''}${shaking ? ' shake' : ''}" type="button" data-word-id="${entry.id}" aria-pressed="${selected}">${escapeHTML(entry.word)}</button>`;
}

function renderResult() {
  const won = state.solved.length === CATEGORIES.length;
  const rows = state.attempts.length
    ? state.attempts.map((attempt) => `<div class="emoji-row" aria-label="Tentative ${attempt.type === 'correct' ? 'correcte' : 'incorrecte'}">${attempt.cells.map((emoji) => `<span>${emoji}</span>`).join('')}</div>`).join('')
    : '<div class="emoji-row"><span>⬜</span></div>';
  const title = won ? 'Mission<br />accomplie.' : 'Presque<br />au bout.';
  const summary = won
    ? `Tu as trouvé les six champs lexicaux en <strong>${state.attempts.length} tentative${state.attempts.length > 1 ? 's' : ''}</strong>, avec ${state.errors} erreur${state.errors > 1 ? 's' : ''}.`
    : `La grille a résisté après ${MAX_ERRORS} erreurs. Tu avais trouvé <strong>${state.solved.length} groupe${state.solved.length > 1 ? 's' : ''}</strong> sur 6.`;

  app.innerHTML = `
    <div class="app-shell">
      <section class="screen result-screen" aria-labelledby="result-title">
        <header class="game-header">
          <div class="brand">${logoMarkup()}<span class="brand-name">Campus Connections<small>résultat de partie</small></span></div>
          <span class="header-mark">ETIC · vie étudiante</span>
        </header>
        <main class="result-main">
          <article class="result-card">
            <p class="eyebrow">${won ? 'Bravo, campus explorer' : 'La prochaine sera la bonne'}</p>
            <h1 id="result-title">${title}</h1>
            <p class="result-summary">${summary} Score de partie : <strong>${state.score} points</strong>.</p>
            <hr class="result-divider" />
            <p class="result-label">Ton résumé Connections</p>
            <div class="emoji-grid">${rows}</div>
            <div class="result-actions">
              <button class="action-button primary" type="button" data-action="copy-result">Copier le résultat</button>
              <button class="action-button" type="button" data-action="new-game">Nouvelle partie</button>
            </div>
            <p class="copy-status" id="copy-status" aria-live="polite"></p>
            <p class="result-footer">Aucun mot n’apparaît dans ce résumé : partage seulement tes couleurs.</p>
          </article>
        </main>
      </section>
    </div>`;

  document.querySelector('[data-action="copy-result"]').addEventListener('click', copyResult);
  document.querySelector('[data-action="new-game"]').addEventListener('click', startGame);
  handleLocalAssetErrors();
}

function render() {
  if (state.screen === 'welcome') {
    renderWelcome();
  } else if (state.screen === 'game') {
    renderGame();
  } else {
    renderResult();
  }
}

function startGame() {
  state = createGameState();
  state.screen = 'game';
  state.startTime = Date.now();
  render();
}

function toggleSelection(id) {
  if (state.screen !== 'game') return;
  if (state.noticeType === 'good') {
    state.notice = '';
    state.noticeType = '';
  }
  const index = state.selected.indexOf(id);
  if (index >= 0) {
    state.selected.splice(index, 1);
  } else if (state.selected.length < MAX_SELECTION) {
    state.selected.push(id);
  } else {
    state.notice = 'Six mots maximum : valide ou désélectionne avant de continuer.';
    state.noticeType = 'hint';
  }
  if (state.selected.length < MAX_SELECTION && state.noticeType === 'hint') {
    state.notice = '';
    state.noticeType = '';
  }
  render();
}

function clearSelection() {
  state.selected = [];
  state.notice = '';
  state.noticeType = '';
  state.shakeIds = [];
  render();
}

function shuffleRemaining() {
  state.remaining = shuffle(state.remaining);
  state.notice = 'La grille est mélangée. Les groupes, eux, ne changent pas.';
  state.noticeType = '';
  render();
}

function selectedCategories() {
  const counts = new Map();
  state.selected.forEach((id) => {
    const entry = entryById(id);
    counts.set(entry.categoryId, (counts.get(entry.categoryId) || 0) + 1);
  });
  return counts;
}

function submitSelection() {
  if (state.selected.length !== MAX_SELECTION || state.screen !== 'game') return;

  const attemptIds = [...state.selected];
  const counts = selectedCategories();
  const attemptCells = attemptIds.map((id) => categoryById(entryById(id).categoryId).color.emoji);
  const exactCategoryId = [...counts.entries()].find(([, count]) => count === MAX_SELECTION)?.[0];

  if (exactCategoryId && !state.solved.includes(exactCategoryId)) {
    const category = categoryById(exactCategoryId);
    state.attempts.push({ type: 'correct', cells: attemptCells });
    state.solved.push(exactCategoryId);
    state.remaining = state.remaining.filter((id) => !attemptIds.includes(id));
    state.selected = [];
    state.notice = `Groupe trouvé : ${category.name}.`;
    state.noticeType = 'good';
    state.justSolved = exactCategoryId;
    if (state.solved.length === CATEGORIES.length) {
      finishGame(true);
    } else {
      render();
    }
    return;
  }

  state.attempts.push({ type: 'wrong', cells: attemptCells });
  state.errors += 1;
  state.shakeIds = attemptIds;
  const almostCategory = [...counts.entries()].find(([, count]) => count === MAX_SELECTION - 1)?.[0];
  state.notice = almostCategory ? 'Un mot en trop !' : 'Pas tout à fait… Essaie une autre combinaison.';
  state.noticeType = 'hint';

  if (state.errors >= MAX_ERRORS) {
    render();
    if (shakeTimer) window.clearTimeout(shakeTimer);
    shakeTimer = window.setTimeout(() => {
      shakeTimer = null;
      if (state.screen === 'game') finishGame(false);
    }, 540);
    return;
  }

  render();
  if (shakeTimer) window.clearTimeout(shakeTimer);
  shakeTimer = window.setTimeout(() => {
    state.shakeIds = [];
    render();
  }, 540);
}

function calculateScore(won) {
  const incorrectAttempts = state.attempts.filter((attempt) => attempt.type !== 'correct').length;
  if (won) return Math.max(25, 100 - state.errors * 8 - incorrectAttempts * 2);
  return Math.max(0, state.solved.length * 12 - state.errors * 2);
}

function finishGame(won) {
  if (shakeTimer) {
    window.clearTimeout(shakeTimer);
    shakeTimer = null;
  }
  state.score = calculateScore(won);
  state.shakeIds = [];
  state.screen = 'result';
  render();
  reportResult(won);
}

async function reportResult(won) {
  if (state.reported) return;
  state.reported = true;
  const result = {
    gameId: GAME_ID,
    score: state.score,
    completed: won,
    durationMs: state.startTime ? Date.now() - state.startTime : undefined,
    metadata: {
      groupsFound: state.solved.length,
      errors: state.errors,
      attempts: state.attempts.length,
    },
  };
  try {
    /* Vite/plateforme : le SDK interne reste l'intégration officielle du monorepo. */
    const { reportGameResult } = await import('@game-platform/game-sdk');
    reportGameResult(result);
  } catch {
    /* Ouverture directe de index.html : aucun import n'est requis pour jouer. */
    const message = { type: 'game:finished', result };
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    } else {
      window.dispatchEvent(new CustomEvent('game:finished', { detail: result }));
    }
  }
}

function summaryText() {
  const outcome = state.solved.length === CATEGORIES.length ? 'Victoire' : 'Défaite';
  return [
    `Campus Connections · ${outcome}`,
    state.attempts.map((attempt) => attempt.cells.join('')).join('\n'),
    `${state.errors}/${MAX_ERRORS} erreurs · ${state.score} points`,
  ].join('\n');
}

async function copyResult() {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(summaryText());
    status.textContent = 'Résultat copié dans le presse-papiers.';
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = summaryText();
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    status.textContent = copied ? 'Résultat copié dans le presse-papiers.' : 'Sélection impossible : copie le texte depuis le résumé.';
  }
}

render();
