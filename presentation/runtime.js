/* === PRESENTATION CONTROLLER ===
   Kept inline in the generated HTML. No external libraries or network requests. */
class SlidePresentation {
  constructor() {
    this.slides = [...document.querySelectorAll('.slide')];
    this.index = 0;
    this.step = 0;
    this.editing = false;
    this.lastWheel = 0;
    this.storageKey = 'vibe-dapp-presentation-v1-edits';
    this.restoreEdits();
    this.populateIndex();
    this.bindEvents();
    this.fit();
    this.go(this.hashIndex());
  }
  hashIndex() {
    const value = Number(location.hash.slice(1));
    return Number.isInteger(value) && value > 0 ? Math.min(value - 1, this.slides.length - 1) : 0;
  }
  fit() {
    const viewport = document.querySelector('.deck-viewport');
    const scale = Math.min(viewport.clientWidth / 1920, viewport.clientHeight / 1080);
    document.querySelector('.deck-stage').style.transform = `translate(${(viewport.clientWidth - 1920 * scale) / 2}px,${(viewport.clientHeight - 1080 * scale) / 2}px) scale(${scale})`;
  }
  fragments() { return [...this.slides[this.index].querySelectorAll('[data-step]')]; }
  maxStep() { return Math.max(0, ...this.fragments().map(el => Number(el.dataset.step))); }
  paintSteps() {
    this.fragments().forEach(el => {
      const shown = Number(el.dataset.step) <= this.step;
      el.classList.toggle('shown', shown);
      el.setAttribute('aria-hidden', String(!shown));
    });
    document.getElementById('stepLabel').textContent = this.maxStep() ? `Step ${this.step + 1}/${this.maxStep() + 1}` : '';
    document.getElementById('previous').disabled = this.index === 0 && this.step === 0;
    document.getElementById('next').disabled = this.index === this.slides.length - 1 && this.step === this.maxStep();
  }
  go(index, lastStep = false) {
    this.index = Math.max(0, Math.min(index, this.slides.length - 1));
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === this.index);
      slide.setAttribute('aria-hidden', String(i !== this.index));
      slide.inert = i !== this.index;
    });
    this.step = lastStep ? this.maxStep() : 0;
    this.paintSteps();
    document.getElementById('counter').textContent = `${String(this.index + 1).padStart(2, '0')} / ${this.slides.length}`;
    document.getElementById('slideSelect').value = String(this.index);
    document.getElementById('progress').style.width = `${(this.index + 1) / this.slides.length * 100}%`;
    document.getElementById('announcement').textContent = `Slide ${this.index + 1}. ${this.slides[this.index].dataset.title}`;
    document.getElementById('notesContent').replaceChildren(this.slides[this.index].querySelector('template').content.cloneNode(true));
    try { history.replaceState(null, '', `#${this.index + 1}`); } catch { /* Local files may restrict history. */ }
  }
  next() {
    if (this.step < this.maxStep()) { this.step++; this.paintSteps(); }
    else this.go(this.index + 1);
  }
  previous() {
    if (this.step > 0) { this.step--; this.paintSteps(); }
    else this.go(this.index - 1, this.index > 0);
  }
  populateIndex() {
    const select = document.getElementById('slideSelect');
    this.slides.forEach((slide, i) => {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = `${i + 1}. ${slide.dataset.title}`;
      select.append(option);
    });
  }
  toggleNotes() {
    const panel = document.getElementById('notes');
    panel.hidden = !panel.hidden;
    document.getElementById('notesToggle').setAttribute('aria-expanded', String(!panel.hidden));
  }
  async fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { this.status('Use your browser’s fullscreen menu.'); }
  }
  status(message) {
    document.getElementById('status').textContent = message;
    clearTimeout(this.statusTimeout);
    this.statusTimeout = setTimeout(() => { document.getElementById('status').textContent = ''; }, 5000);
  }
  /* === LOCAL TEXT EDITING ===
     Plain text only. Save is best effort; exported HTML contains edits even without storage. */
  toggleEdit() {
    this.editing = !this.editing;
    document.querySelectorAll('[data-edit]').forEach(el => {
      if (this.editing) el.setAttribute('contenteditable', 'plaintext-only');
      else el.removeAttribute('contenteditable');
    });
    document.getElementById('editToggle').classList.toggle('active', this.editing);
    document.getElementById('editToggle').setAttribute('aria-pressed', String(this.editing));
    document.getElementById('save').hidden = !this.editing;
    this.status(this.editing ? 'Edit text on this slide. Changes save in this browser; Export saves a portable copy.' : 'Edit mode off.');
  }
  saveEdits() {
    const edits = {};
    document.querySelectorAll('[data-edit]').forEach(el => { edits[el.dataset.edit] = el.textContent; });
    try { localStorage.setItem(this.storageKey, JSON.stringify(edits)); }
    catch { this.status('Browser storage unavailable. Use Export to keep your edits.'); }
  }
  restoreEdits() {
    try {
      const edits = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      document.querySelectorAll('[data-edit]').forEach(el => {
        if (typeof edits[el.dataset.edit] === 'string') el.textContent = edits[el.dataset.edit];
      });
    } catch { /* Keep the embedded original if storage is unavailable or malformed. */ }
  }
  exportFile() {
    const copy = document.documentElement.cloneNode(true);
    copy.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    copy.querySelector('#notes').hidden = true;
    copy.querySelector('#save').hidden = true;
    copy.querySelector('#editToggle').classList.remove('active', 'show');
    copy.querySelector('#editToggle').setAttribute('aria-pressed', 'false');
    copy.querySelector('#status').textContent = '';
    copy.querySelector('#slideSelect').replaceChildren();
    const blob = new Blob(['<!doctype html>\n', copy.outerHTML], {type: 'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'vibe-code-your-first-dapp.html';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.status('Exported an HTML copy with your current edits.');
  }
  /* === INPUT AND ACCESSIBILITY === */
  bindEvents() {
    addEventListener('resize', () => this.fit());
    addEventListener('hashchange', () => this.go(this.hashIndex()));
    document.getElementById('next').onclick = () => this.next();
    document.getElementById('previous').onclick = () => this.previous();
    document.getElementById('slideSelect').onchange = event => this.go(Number(event.target.value));
    document.getElementById('notesToggle').onclick = () => this.toggleNotes();
    document.getElementById('closeNotes').onclick = () => this.toggleNotes();
    document.getElementById('fullscreen').onclick = () => this.fullscreen();
    document.getElementById('editToggle').onclick = () => this.toggleEdit();
    document.getElementById('save').onclick = () => this.exportFile();
    document.addEventListener('input', event => { if (event.target.closest('[data-edit]')) this.saveEdits(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (this.editing) this.toggleEdit();
        if (!document.getElementById('notes').hidden) this.toggleNotes();
        return;
      }
      if (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.ctrlKey || event.metaKey || event.altKey) return;
      if (/^(BUTTON|A)$/.test(event.target.tagName) && [' ','Enter'].includes(event.key)) return;
      if (['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)) { event.preventDefault(); this.next(); }
      if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) { event.preventDefault(); this.previous(); }
      if (event.key === 'Home') { event.preventDefault(); this.go(0); }
      if (event.key === 'End') { event.preventDefault(); this.go(this.slides.length - 1); }
      if (event.key.toLowerCase() === 'n') this.toggleNotes();
      if (event.key.toLowerCase() === 'f') this.fullscreen();
      if (event.key.toLowerCase() === 'e') this.toggleEdit();
    });
    const viewport = document.querySelector('.deck-viewport');
    viewport.addEventListener('wheel', event => {
      if (this.editing || Math.abs(event.deltaY) < 15) return;
      event.preventDefault();
      if (Date.now() - this.lastWheel < 650) return;
      this.lastWheel = Date.now();
      event.deltaY > 0 ? this.next() : this.previous();
    }, {passive: false});
    viewport.addEventListener('touchstart', event => { this.touchX = event.changedTouches[0].clientX; this.touchY = event.changedTouches[0].clientY; }, {passive: true});
    viewport.addEventListener('touchend', event => {
      if (this.editing) return;
      const dx = event.changedTouches[0].clientX - this.touchX;
      const dy = event.changedTouches[0].clientY - this.touchY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? this.next() : this.previous();
    }, {passive: true});
    const toggle = document.getElementById('editToggle');
    for (const el of [document.querySelector('.edit-hotzone'), toggle]) {
      el.addEventListener('mouseenter', () => { clearTimeout(this.hideEdit); toggle.classList.add('show'); });
      el.addEventListener('mouseleave', () => { this.hideEdit = setTimeout(() => toggle.classList.remove('show'), 400); });
    }
    document.querySelector('.edit-hotzone').onclick = () => this.toggleEdit();
  }
}
window.presentation = new SlidePresentation();
