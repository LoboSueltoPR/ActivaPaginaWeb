// ============================================
//  CONFIGURACIÓN DE FIREBASE — Ensayos Activá
// ============================================
// Usa el proyecto compartido "mapeors". Los ensayos se guardan
// en la colección "ensayos".

const firebaseConfig = {
    apiKey: "AIzaSyC2w8XLMkqgIsZ5UBaSUdSpty9MPfvmqkg",
  authDomain: "https://activajuventudesymilitancia.com.ar/",
  projectId: "activapage",
  storageBucket: "activapage.firebasestorage.app",
  messagingSenderId: "1051911459899",
  appId: "1:1051911459899:web:c183886df6ed493460f81e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Nombre de la colección donde viven los ensayos
const ENSAYOS_COL = 'ensayos';

// ============================================
//  USUARIOS DEL PANEL (sin Firebase Auth)
// ============================================
// Cada usuario sólo puede editar/borrar SUS propios ensayos.
// Las contraseñas no se guardan en texto: se guarda el hash SHA-256.
//
// ⚠️ CONTRASEÑAS POR DEFECTO (cambialas):
//   activa   →  activa2026
//   antonia  →  antonia2026
//   prensa   →  prensa2026
//
// Para agregar/cambiar un usuario, generá el hash de la contraseña
// pegando esto en la consola del navegador (F12) y reemplazá el valor:
//
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('TU_CONTRASEÑA'))
//     .then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('')))

const USERS = [
    {
        displayName: "Activá",
        username: "activa",
        passwordHash: "a0f3fcaf454c71244e9b8a876f3873e14b2cf9dcf902f62c64271cdc76e01521"
    },
    {
        displayName: "Antonia",
        username: "antonia",
        passwordHash: "94da9df2799a07a4edbd8ce6677ddb17bc2ea972d9a48576cdfc20745a8b300b"
    },
    {
        displayName: "Prensa",
        username: "prensa",
        passwordHash: "edf76d5cca906630ecb4506de165c81b6850b0181e68a865df0e55195739ffc8"
    }
];
