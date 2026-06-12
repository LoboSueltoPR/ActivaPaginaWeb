// === Panel de administración de Ensayos — Activá ===
// Login por usuario/contraseña (sin Firebase Auth). Cada usuario sólo
// ve, edita y borra sus propios ensayos. Editor enriquecido (Quill).

const loginScreen   = document.getElementById('login-screen');
const adminPanel    = document.getElementById('admin-panel');
const loginForm     = document.getElementById('login-form');
const loginError    = document.getElementById('login-error');
const noteForm      = document.getElementById('note-form');
const imageInput    = document.getElementById('note-image');
const imagePreview  = document.getElementById('image-preview');
const userDisplay   = document.getElementById('user-display');
const formTitle     = document.getElementById('form-title');
const submitBtn     = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-btn-wrap');
const imageHint     = document.getElementById('image-hint');

let currentUser     = null;
let imageBase64     = null;
let editingNoteId   = null;
let quill           = null;

// === Editor Quill ===
function initQuill() {
    if (quill) return;
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Escribí el ensayo acá...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['blockquote'],
                [{ 'align': [] }],
                ['link'],
                ['clean']
            ]
        }
    });
}

// === Sesión existente ===
const savedUser = sessionStorage.getItem('activa_user');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showAdminPanel();
}

// === Login ===
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username-input').value.trim().toLowerCase();
    const password = document.getElementById('password-input').value;
    const hash = await hashPassword(password);

    const user = USERS.find(u => u.username === username && u.passwordHash === hash);

    if (user) {
        currentUser = user;
        sessionStorage.setItem('activa_user', JSON.stringify(user));
        loginError.style.display = 'none';
        showAdminPanel();
    } else {
        loginError.style.display = 'block';
    }
});

function showAdminPanel() {
    loginScreen.style.display = 'none';
    adminPanel.style.display  = 'block';
    userDisplay.style.display = 'inline-block';
    userDisplay.textContent   = currentUser.displayName;
    initQuill();
    loadAdminNotes();
}

function logout() {
    sessionStorage.removeItem('activa_user');
    currentUser = null;
    loginScreen.style.display = 'block';
    adminPanel.style.display  = 'none';
    userDisplay.style.display = 'none';
    document.getElementById('username-input').value = '';
    document.getElementById('password-input').value = '';
    cancelEdit();
}

// === Preview + compresión de imagen ===
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB.');
        imageInput.value = '';
        return;
    }
    compressAndPreview(file);
});

function compressAndPreview(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200, MAX_HEIGHT = 800;
            let width = img.width, height = img.height;

            if (width > MAX_WIDTH)  { height = (height * MAX_WIDTH) / width;  width = MAX_WIDTH; }
            if (height > MAX_HEIGHT) { width = (width * MAX_HEIGHT) / height; height = MAX_HEIGHT; }

            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);

            imageBase64 = canvas.toDataURL('image/jpeg', 0.7);
            imagePreview.innerHTML = `<img src="${imageBase64}" alt="Vista previa">`;

            const sizeKB = Math.round((imageBase64.length * 3) / 4 / 1024);
            if (sizeKB > 900) imageBase64 = canvas.toDataURL('image/jpeg', 0.4);
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

// === Publicar / editar ensayo ===
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('note-title').value.trim();
    const htmlContent = quill.root.innerHTML.trim();

    if (!htmlContent || htmlContent === '<p><br></p>') {
        alert('Completá el contenido del ensayo');
        return;
    }
    if (!editingNoteId && !imageBase64) {
        alert('Elegí una imagen de portada');
        return;
    }

    const progressDiv  = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    submitBtn.disabled = true;
    progressDiv.style.display = 'block';
    progressFill.style.width = '50%';
    progressText.textContent = editingNoteId ? 'Actualizando ensayo...' : 'Guardando ensayo...';

    try {
        const noteData = {
            title:      title,
            text:       htmlContent,
            author:     currentUser.username,
            authorName: currentUser.displayName,
            updatedAt:  firebase.firestore.FieldValue.serverTimestamp()
        };
        if (imageBase64) noteData.imageUrl = imageBase64;

        if (editingNoteId) {
            await db.collection(ENSAYOS_COL).doc(editingNoteId).update(noteData);
            progressText.textContent = '¡Actualizado!';
        } else {
            noteData.imageUrl  = imageBase64;
            noteData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection(ENSAYOS_COL).add(noteData);
            progressText.textContent = '¡Publicado!';
        }

        progressFill.style.width = '100%';
        setTimeout(() => {
            resetForm();
            progressDiv.style.display = 'none';
            progressFill.style.width = '0%';
            submitBtn.disabled = false;
        }, 1000);

        cancelEdit();
        loadAdminNotes();
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
        submitBtn.disabled = false;
        progressDiv.style.display = 'none';
    }
});

// === Edición ===
function startEdit(id, note) {
    editingNoteId = id;
    formTitle.textContent = 'Editando ensayo';
    submitBtn.textContent = 'Guardar cambios';
    cancelEditBtn.classList.add('visible');
    imageHint.style.display = 'block';

    document.getElementById('note-title').value = note.title;
    quill.root.innerHTML = note.text;
    imagePreview.innerHTML = `<img src="${note.imageUrl}" alt="Portada actual">`;
    imageBase64 = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    editingNoteId = null;
    formTitle.textContent = 'Publicar nuevo ensayo';
    submitBtn.textContent = 'Publicar ensayo';
    cancelEditBtn.classList.remove('visible');
    imageHint.style.display = 'none';
    resetForm();
}

function resetForm() {
    noteForm.reset();
    imagePreview.innerHTML = '';
    imageBase64 = null;
    if (quill) quill.root.innerHTML = '';
}

// === Mis ensayos ===
async function loadAdminNotes() {
    const list = document.getElementById('admin-notes-list');
    list.innerHTML = '<p class="adm-muted">Cargando...</p>';

    try {
        const snapshot = await db.collection(ENSAYOS_COL)
            .where('author', '==', currentUser.username)
            .orderBy('createdAt', 'desc')
            .get();

        list.innerHTML = '';
        if (snapshot.empty) {
            list.innerHTML = '<p class="adm-muted">Todavía no publicaste ensayos.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const note = doc.data();
            const item = document.createElement('div');
            item.className = 'admin-note-item';
            const date = note.createdAt ? formatDate(note.createdAt.toDate()) : 'Sin fecha';
            item.innerHTML = `
                <img src="${note.imageUrl}" alt="${escapeHtml(note.title)}">
                <div class="admin-note-info">
                    <h4>${escapeHtml(note.title)}</h4>
                    <span>${date}</span>
                </div>
                <div class="admin-note-actions">
                    <button class="btn-edit">Editar</button>
                    <button class="btn-danger">Eliminar</button>
                </div>`;
            item.querySelector('.btn-edit').addEventListener('click', () => startEdit(doc.id, note));
            item.querySelector('.btn-danger').addEventListener('click', () => deleteNote(doc.id));
            list.appendChild(item);
        });
    } catch (error) {
        // Sin índice compuesto: caer a una consulta sin orderBy
        if (error.code === 'failed-precondition') {
            const link = error.message.match(/(https:\/\/[^\s]+)/)?.[1];
            list.innerHTML = link
                ? `<p class="adm-err">Falta crear un índice en Firestore. <a href="${link}" target="_blank">Crealo acá</a> y recargá.</p>`
                : '<p class="adm-err">Falta crear un índice en Firestore.</p>';
        } else {
            list.innerHTML = '<p class="adm-err">Error al cargar tus ensayos.</p>';
            console.error('Error:', error);
        }
    }
}

// === Eliminar ===
async function deleteNote(id) {
    if (!confirm('¿Seguro que querés eliminar este ensayo? No se puede deshacer.')) return;
    try {
        await db.collection(ENSAYOS_COL).doc(id).delete();
        loadAdminNotes();
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

// === Utilidades ===
async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function formatDate(date) {
    return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}
