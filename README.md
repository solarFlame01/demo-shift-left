# 🎭 Demo Shift-Left Testing

Un progetto dimostrativo che implementa **test automation con approccio Shift-Left** utilizzando **Playwright** e **CI/CD con GitHub Actions**.

## 📋 Indice
- [Obiettivo del Progetto](#obiettivo-del-progetto)
- [Architettura](#architettura)
- [Setup Iniziale](#setup-iniziale)
- [Eseguire l'Applicazione](#eseguire-lapplicazione)
- [Eseguire i Test](#eseguire-i-test)
- [Struttura del Progetto](#struttura-del-progetto)
- [GitHub Actions Workflow](#github-actions-workflow)

---

## 🎯 Obiettivo del Progetto

Questo progetto dimostra il concetto di **"Shift-Left Testing"** - spostare i test il più a sinistra possibile nel ciclo di sviluppo, riducendo i bug in produzione.

### Cosa è lo Shift-Left Testing?
- ✅ **Testa presto**: integrare test nella fase di sviluppo
- ✅ **Testa spesso**: eseguire test su ogni change
- ✅ **Testa automaticamente**: CI/CD automati su push/PR
- ✅ **Riduce bug**: catch problemi prima della produzione

### Differenza di Approccio
| Aspetto | Playwright (Shift-Left) | Tosca (Tradizionale) |
|---------|----------|----------|
| **Posizione test** | Co-locati nel repo | Repository separato |
| **Tempistica** | Durante sviluppo | Dopo rilascio |
| **Collocazione** | `/tests` nella source | Progetto esterno |
| **Automazione** | CI/CD integrato | Setup esterno |

---

## 🏗️ Architettura

```
demo-shift-left/
├── src/                          # Codice React applicazione
│   ├── App.js                   # Componente principale
│   ├── App.test.js             # Unit test con Jest
│   └── ...
├── tests/                        # Test Playwright E2E
│   └── example.spec.js         # Test end-to-end
├── playwright.config.js          # Config Playwright
├── .github/workflows/
│   └── playwright.yml           # CI/CD GitHub Actions
└── package.json                 # Dipendenze
```

### Tecnologie Stack
- **Frontend**: React 19.2.4
- **Test E2E**: Playwright 1.58.2
- **Unit Test**: Jest + React Testing Library
- **CI/CD**: GitHub Actions
- **Browsers**: Chrome, Firefox, Safari

---

## 🚀 Setup Iniziale

### Prerequisiti
- Node.js LTS
- npm
- Git

### Installazione
```bash
# Clona il repository
git clone <repository-url>
cd demo-shift-left

# Installa dipendenze
npm ci

# Installa browser Playwright
npx playwright install --with-deps
```

---

## 🎮 Eseguire l'Applicazione

Avvia il server di sviluppo React:
```bash
npm start
```

L'applicazione si apre automaticamente su `http://localhost:3000`

### Build per produzione
```bash
npm run build
```

---

## ✅ Eseguire i Test

### Test E2E con Playwright

```bash
# Esegui tutti i test
npx playwright test

# Esegui con UI (modalità debug)
npx playwright test --ui

# Esegui un file specifico
npx playwright test tests/example.spec.js

# Esegui con headed browser (vedi il browser che si muove)
npx playwright test --headed

# Visualizza il report HTML
npx playwright show-report
```

### Unit Test con Jest
```bash
# Esegui test unitari
npm test

# Modalità watch
npm test -- --watch
```

---

## 📁 Struttura del Progetto

```
demo-shift-left/
│
├── 📂 src/
│   ├── App.js                  # Componente React principale
│   ├── App.css                 # Stili applicazione
│   ├── App.test.js            # Unit test Jest
│   ├── index.js               # Entry point React
│   └── setupTests.js          # Setup Jest
│
├── 📂 tests/
│   └── example.spec.js        # Test Playwright E2E
│
├── 📂 public/
│   ├── index.html             # HTML template
│   └── manifest.json          # PWA manifest
│
├── 📂 .github/workflows/
│   └── playwright.yml         # GitHub Actions workflow
│
├── playwright.config.js       # Configurazione Playwright
├── package.json               # Dipendenze e script
└── README.md                  # Questo file

```

### File Chiave

#### `playwright.config.js`
Configurazione dei test Playwright:
- **Test directory**: `./tests`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Trace**: Enabled on-first-retry (debug)
- **Retry**: 2 volte su CI
- **Workers**: 1 su CI (sequenziale)

#### `tests/example.spec.js`
Esempio di test E2E che:
1. Visita l'applicazione
2. Interagisce con i componenti
3. Verifica il comportamento

---

## ⚙️ Playwright Configuration (playwright.config.js)

### Panoramica
Il file `playwright.config.js` è il cuore della configurazione di Playwright. Controlla come e dove vengono eseguiti i test, quali browser vengono utilizzati e come vengono generati i report.

### Configurazione Dettagliata

#### 1️⃣ **Test Discovery**
```javascript
testDir: './tests',
```
- **Cosa fa**: Indica dove trovar i file di test
- **Valore**: `./tests` - tutti i file `.spec.js` in questa cartella
- **Pattern**: Per default cerca file come `*.spec.js`, `*.test.js`

#### 2️⃣ **Esecuzione Parallela**
```javascript
fullyParallel: true,
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

| Impostazione | Valore Locale | Valore CI | Descrizione |
|---|---|---|---|
| **fullyParallel** | `true` | `true` | Esegui test paralleli per velocità |
| **forbidOnly** | `false` | `true` | Su CI, proibisci `test.only()` per evitare esecuzione parziale |
| **retries** | `0` | `2` | Riprova fallimenti 2 volte su CI |
| **workers** | Auto (N CPU) | `1` | Su CI: esecuzione sequenziale per stabilità |

**Esempio Pratico:**
```javascript
test.only('test specifico', async () => {
  // ❌ Su CI: ERRORE! Impedisce fallimento accidentale
  // ✅ In locale: OK, utile per debugging
});
```

#### 3️⃣ **Reporter Configuration**
```javascript
reporter: [
  ['html'],           // Report HTML interattivo
  ['list'],          // List report in terminal
  ['github']         // GitHub Checks annotations
],
```

**Report Generati:**
- 📊 **HTML**: `playwright-report/index.html` - Visualizzazione completa con video e screenshot
- 📋 **List**: Output a terminale con risultati immediati
- 🔍 **GitHub**: Annotazioni nei GitHub Checks (visibili in PR)

**Visualizzazione:**
```bash
npx playwright show-report  # Apre il report HTML
```

#### 4️⃣ **Global Test Options (use)**
```javascript
use: {
  trace: 'on-first-retry',        // Salva trace solo su retry falliti
  baseURL: 'http://localhost:3000', // URL base per goto('')
},
```

**Cosa fa `trace`:**
- `'on-first-retry'`: Registra azioni su primo fallimento
- Genera file `.zip` con azioni, screenshot, video
- Visualizzabile con: `npx playwright show-trace trace.zip`

#### 5️⃣ **Web Server (Auto-Start)**
```javascript
webServer: {
  command: 'npm start',           // Comando per avviare app
  url: 'http://localhost:3000',   // URL da controllare
  reuseExistingServer: !process.env.CI,  // Riusa server esistente
  timeout: 120000,                 // Timeout 2 minuti
},
```

**Flusso Automatico:**
1. Playwright avvia il server con `npm start`
2. Aspetta che `http://localhost:3000` sia disponibile
3. Esegue i test
4. In CI: uccide il server; in locale: lo mantiene vivo per continue esecuzioni

#### 6️⃣ **Project Configuration (Browser)**
```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },  // Desktop Chrome
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },  // Desktop Firefox
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },   // Desktop Safari/WebKit
  },
  // Scommentare per mobile testing:
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },      // Pixel 5 emulato
  // },
],
```

**Cosa significa:**
- Ogni "project" è una combinazione browser + viewport
- Playwright esegue **tutti** i test in **tutti** i project
- I browser vengono emulati dal Playwright (niente install di browser veri)

**Esempio Esecuzione:**
```bash
# Esegui test per tutti i 3 browser (sequenziale)
npx playwright test

# Output:
# ✓ chromium (3 test)
# ✓ firefox (3 test)
# ✓ webkit (3 test)
```

---

## 🔄 GitHub Actions Workflow (playwright.yml)

### Panoramica
Il file `.github/workflows/playwright.yml` è un workflow di automazione che:
- Esegue test su ogni push/PR
- Genera report HTML
- Memorizza i risultati per 30 giorni

### Workflow Step-by-Step

#### 1️⃣ **Trigger Events**
```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
```
**Quando si attiva:**
- Ogni push a `main` o `master`
- Ogni PR verso `main` o `master`

#### 2️⃣ **Job Configuration**
```yaml
test:
  timeout-minutes: 60
  runs-on: ubuntu-latest
```
- **timeout**: Interrompe il job dopo 60 minuti
- **ubuntu-latest**: Esegue su last Ubuntu LTS

#### 3️⃣ **Checkout Repository**
```yaml
- uses: actions/checkout@v4
```
**Cosa fa:** Scarica il codice nella macchina GitHub

#### 4️⃣ **Setup Node.js**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: lts/*
```
**Cosa fa:** Installa l'ultima versione LTS di Node.js

#### 5️⃣ **Cache npm (Performance Optimization)**
```yaml
- name: Cache npm
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**Come funziona il cache:**
1. Hash il contenuto di `package-lock.json`
2. Se cache esiste per questo hash → riusa (50% faster!)
3. Se nuovo hash → scarica dipendenze fresche

**Risultato:**
- ⚡ Prima esecuzione: ~30 secondi
- ⚡ Cache hit: ~5 secondi

#### 6️⃣ **Install Dependencies**
```yaml
- name: Install dependencies
  run: npm ci
```
**Perché `npm ci` e non `npm install`?**
- `npm ci` (clean install): Installa versioni exact dal lock file
- **Più affidabile in CI** (non modifica versioni)
- **Più veloce con cache**

#### 7️⃣ **Cache Playwright Browsers (Critical!)**
```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ env.PLAYWRIGHT_VERSION }}
```

**Perché è importante:**
- Browser Playwright sono ~200MB
- Senza cache: 2+ minuti di download per ogni run
- Con cache: 10 secondi (riusa)

**Nota:** `PLAYWRIGHT_VERSION` deve essere settato (v1.58.2 nel tuo caso)

#### 8️⃣ **Install Playwright Browsers**
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
```
**Cosa fa:**
- Scarica browser emulati (Chrome, Firefox, Safari)
- Installa dipendenze di sistema (non avrà effetto se cache hit)
- `--with-deps`: Include dipendenze di OS necessarie

#### 9️⃣ **Run Playwright Tests**
```yaml
- name: Run Playwright tests
  run: PLAYWRIGHT_HTML_REPORT=playwright-report npx playwright test
```

**Cosa fa:**
- Setta variabile env `PLAYWRIGHT_HTML_REPORT`
- Esegue tutti i test
- Genera report in cartella `playwright-report/`

**Ricorda:** 
- Configurazione CI è auto-rilevata da Playwright
- Workers = 1 (sequenziale)
- Retries = 2 (da config.js)

#### 🔟 **Upload Report Artifact**
```yaml
- uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

**Cosa fa:**
- Carica cartella `playwright-report/` come artefatto
- Visibile in GitHub Actions per 30 giorni
- Scaricabile per debugging

**Condizione:** `if: !cancelled()` = Esegui sempre, anche se test falliscono

### Workflow Timing

```
┌─────────────┐
│   Trigger   │ (push/PR)
└──────┬──────┘
       ↓
┌──────────────────┐
│  Checkout Code   │ ~2s
└──────┬───────────┘
       ↓
┌──────────────────┐
│   Setup Node     │ ~5s
└──────┬───────────┘
       ↓
┌──────────────────┐
│   Cache npm      │ ~5s (hit) / ~30s (miss)
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Install deps     │ ~2s (hit) / ~15s (miss)
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Cache Playwright │ ~10s (hit) / ~120s (miss)
└──────┬───────────┘
       ↓
┌──────────────────┐
│    Run Tests     │ ~30s
└──────┬───────────┘
       ↓
┌──────────────────┐
│ Upload Report    │ ~5s
└──────┬───────────┘
       ↓
   ✅ DONE! 
   Total: ~60s (con cache) / ~3m (senza cache)
```

### Output esperato

Quando il workflow completa:

```
✅ Checkout code
✅ Setup Node.js 18.x
✅ Cache npm
✅ Install dependencies
✅ Cache Playwright browsers
✅ Install Playwright Browsers
✅ Run Playwright tests
  • 3 passed (13.8s)
✅ Upload artifacts
```

Con report in: `playwright-report/index.html`

### Troubleshooting

**Problema:** Test fallisce in CI ma passa in locale
```
→ Possibile: Timing issues, screen resolution, env variables
→ Soluzione: Controlla trace/video nel report
```

**Problema:** Cache miss su ogni run
```
→ Possibile: package-lock.json cambia
→ Soluzione: Assicura che è il lock corretto
```

**Problema:** Timeout su install browser
```
→ Possibile: Rete lenta, timeout piccolo
→ Soluzione: Aumenta timeout in webServer o installa localmente

---

## 📊 Report e Debugging

### Report HTML Playwright
Dopo aver eseguito i test:
```bash
npx playwright show-report
```

Il report mostra:
- ✅ Test passati/falliti
- 🎬 Video replay di ogni test
- 📸 Screenshot su errori
- ⏱️ Tempi di esecuzione
- 📋 Log dettagliati

### Trace Viewer (Debug avanzato)
I trace vengono salvati su retry falliti:
```bash
npx playwright show-trace trace.zip
```

---

## 🎓 Concetti di Shift-Left Implementati

### 1. **Testa Early**
- Test scritti durante lo sviluppo
- Feedback immediato su errori

### 2. **Testa Often**
- Test automatici su ogni commit
- Git hooks possono eseguire test locali

### 3. **Testa Right**
- Unit test (App.test.js) per logica isolata
- E2E test (example.spec.js) per flussi utente

### 4. **Testa Everywhere**
- CI/CD con GitHub Actions
- Multi-browser testing (Chrome, Firefox, Safari)
- Desktop + Mobile viewports (se abilitati)

---

## 💡 Prossimi Passi

Per estendere il progetto:

1. **Aggiungi più test E2E**
   ```javascript
   // tests/login.spec.js
   test('user can login', async ({ page }) => {
     // ...
   });
   ```

2. **Abilita test Mobile**
   - Decommentare Mobile Chrome/Safari in `playwright.config.js`

3. **Aggiungi Visual Regression**
   ```javascript
   await expect(page).toHaveScreenshot('home.png');
   ```

4. **Integra con Slack/Email notifications**
   - Aggiungi step nel workflow per notifiche

5. **Performance Testing**
   ```javascript
   expect(await page.metrics()).toBeLessThan(3000);
   ```

---

## 📚 Risorse Utili

- [Playwright Documentation](https://playwright.dev)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [React Testing Library](https://testing-library.com/react)
- [Shift-Left Testing Strategy](https://smartbear.com/blog/shift-left-testing)

---

## 📝 Licenza

Progetto dimostrativo open source.

---

**🌟 Shift-Left in azione: testa presto, testa spesso, rilascia con confidenza!**