// === Ensayos Activá — carga pública + modal de lectura ===

document.addEventListener('DOMContentLoaded', loadEnsayos);

async function loadEnsayos() {
    const loading = document.getElementById('ensayos-loading');
    const empty   = document.getElementById('ensayos-empty');
    const grid    = document.getElementById('ensayos-grid');
    if (!grid) return;

    try {
        const snapshot = await db.collection(ENSAYOS_COL)
            .orderBy('createdAt', 'desc')
            .get();

        if (loading) loading.style.display = 'none';

        if (snapshot.empty) {
            if (empty) empty.style.display = 'block';
            return;
        }

        snapshot.forEach(doc => grid.appendChild(createEnsayoCard(doc.data())));
    } catch (error) {
        if (loading) loading.textContent = 'No se pudieron cargar los ensayos.';
        console.error('Error cargando ensayos:', error);
    }
}

function createEnsayoCard(note) {
    const card = document.createElement('article');
    card.className = 'ensayo-card';
    card.addEventListener('click', () => openEnsayo(note));

    const date = note.createdAt ? formatDate(note.createdAt.toDate()) : '';

    const tmp = document.createElement('div');
    tmp.innerHTML = note.text || '';
    const plain = (tmp.textContent || '').trim();
    const preview = plain.length > 140 ? plain.substring(0, 140) + '…' : plain;

    card.innerHTML = `
        <div class="ensayo-card__img">
            <img src="${note.imageUrl}" alt="${escapeHtml(note.title)}" loading="lazy">
        </div>
        <div class="ensayo-card__body">
            <div class="ensayo-card__meta">
                <span class="ensayo-card__author">${escapeHtml(note.authorName || 'Activá')}</span>
                ${date ? `<span class="ensayo-card__date">${date}</span>` : ''}
            </div>
            <h3>${escapeHtml(note.title)}</h3>
            <p>${escapeHtml(preview)}</p>
        </div>`;
    return card;
}

// === Modal ===
function openEnsayo(note) {
    const modal = document.getElementById('ensayo-modal');
    if (!modal) return;
    document.getElementById('ensayo-modal-img').src        = note.imageUrl || '';
    document.getElementById('ensayo-modal-title').textContent  = note.title || '';
    document.getElementById('ensayo-modal-author').textContent = note.authorName || 'Activá';
    document.getElementById('ensayo-modal-date').textContent   = note.createdAt ? formatDate(note.createdAt.toDate()) : '';
    document.getElementById('ensayo-modal-text').innerHTML     = note.text || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEnsayo() {
    document.getElementById('ensayo-modal')?.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEnsayo(); });
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('ensayo-modal');
    modal?.addEventListener('click', e => { if (e.target === modal) closeEnsayo(); });
    document.getElementById('ensayo-modal-close')?.addEventListener('click', closeEnsayo);
});

// === Utils ===
function formatDate(date) {
    return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}
function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text ?? '';
    return d.innerHTML;
}
