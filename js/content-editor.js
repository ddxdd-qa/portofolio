(() => {
  const STORAGE_KEY = 'dedy_portfolio_content_v1';
  let isEditMode = false;

  // Elements to mark editable automatically if not explicitly tagged
  const EDITABLE_SELECTORS = [
    { id: 'hero-eyebrow', selector: '.hero-copy .eyebrow' },
    { id: 'hero-title', selector: '.hero h1 span' },
    { id: 'hero-statement', selector: '.hero-statement' },
    { id: 'hero-text', selector: '.hero-text' },
    { id: 'quick-number', selector: '.quick-number' },
    { id: 'quick-label', selector: '.quick-label' },
    { id: 'about-heading', selector: '#about h2' },
    { id: 'about-lead', selector: '#about .lead' },
    { id: 'about-text', selector: '#about .about-text' },
    { id: 'signature-quote', selector: '.signature p' }
  ];

  // Initialize data-editable tags
  EDITABLE_SELECTORS.forEach(({ id, selector }) => {
    const el = document.querySelector(selector);
    if (el && !el.hasAttribute('data-editable')) {
      el.setAttribute('data-editable', id);
    }
  });

  // Also make experience descriptions and cards editable
  document.querySelectorAll('.timeline-item h3, .timeline-item .timeline-role, .timeline-item p, .expertise-card p, .personal-project-card p').forEach((el, idx) => {
    if (!el.hasAttribute('data-editable')) {
      el.setAttribute('data-editable', `auto-item-${idx}`);
    }
  });

  // Load saved content from localStorage on startup
  function loadSavedContent() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);

      document.querySelectorAll('[data-editable]').forEach(el => {
        const id = el.getAttribute('data-editable');
        if (id && data[id] !== undefined) {
          el.innerHTML = data[id];
        }
      });
    } catch (e) {
      console.warn('Could not load saved portfolio content', e);
    }
  }

  // Save current content to localStorage
  function saveCurrentContent() {
    const data = {};
    document.querySelectorAll('[data-editable]').forEach(el => {
      const id = el.getAttribute('data-editable');
      if (id) {
        data[id] = el.innerHTML;
      }
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      showToast('✓ Perubahan konten berhasil disimpan!');
    } catch (e) {
      alert('Gagal menyimpan ke localStorage: ' + e.message);
    }
  }

  // Export content to JSON file
  function exportContent() {
    const data = {};
    document.querySelectorAll('[data-editable]').forEach(el => {
      const id = el.getAttribute('data-editable');
      if (id) {
        data[id] = el.innerHTML;
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-content-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Backup konten berhasil diunduh!');
  }

  // Reset to original default content
  function resetContent() {
    if (!confirm('Apakah Anda yakin ingin mengembalikan semua konten ke teks awal bawaan?')) return;
    localStorage.removeItem(STORAGE_KEY);
    showToast('🔄 Konten dikembalikan ke default. Memuat ulang...');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  }

  // Show floating toast message
  function showToast(msg) {
    let toast = document.getElementById('editor-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'editor-toast';
      toast.className = 'editor-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Toggle edit mode on / off
  function toggleEditMode() {
    isEditMode = !isEditMode;
    document.body.classList.toggle('is-edit-mode', isEditMode);

    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(el => {
      el.contentEditable = isEditMode ? 'true' : 'false';
    });

    const toggleBtnText = document.getElementById('editor-toggle-text');
    if (toggleBtnText) {
      toggleBtnText.textContent = isEditMode ? 'Selesai Edit' : 'Edit Konten';
    }

    if (isEditMode) {
      showToast('✏️ Mode Edit Aktif. Klik langsung pada teks untuk mengedit.');
    } else {
      saveCurrentContent();
    }
  }

  // Create and inject editor UI
  function renderEditorUI() {
    // 1. Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'editor-toggle-btn';
    toggleBtn.id = 'editor-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle Content Edit Mode');
    toggleBtn.innerHTML = `
      <span class="pulse-dot"></span>
      <span id="editor-toggle-text">Edit Konten</span>
    `;
    toggleBtn.addEventListener('click', toggleEditMode);
    document.body.appendChild(toggleBtn);

    // 2. Action Toolbar (visible in edit mode)
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';
    toolbar.innerHTML = `
      <div class="editor-toolbar-title">Alat Edit Konten</div>
      <button type="button" class="editor-btn editor-btn-save" id="editor-save-btn">
        💾 Simpan Perubahan
      </button>
      <button type="button" class="editor-btn editor-btn-export" id="editor-export-btn">
        📥 Unduh Backup JSON
      </button>
      <button type="button" class="editor-btn editor-btn-reset" id="editor-reset-btn">
        🔄 Reset ke Awal
      </button>
    `;
    document.body.appendChild(toolbar);

    // Toolbar event listeners
    toolbar.querySelector('#editor-save-btn').addEventListener('click', saveCurrentContent);
    toolbar.querySelector('#editor-export-btn').addEventListener('click', exportContent);
    toolbar.querySelector('#editor-reset-btn').addEventListener('click', resetContent);
  }

  // Keyboard shortcut: Alt + E to toggle edit mode
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 'e' || e.key === 'E')) {
      e.preventDefault();
      toggleEditMode();
    }
  });

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadSavedContent();
      renderEditorUI();
    });
  } else {
    loadSavedContent();
    renderEditorUI();
  }
})();
