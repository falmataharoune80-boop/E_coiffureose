// ===== ADMIN LOGIN =====
function ouvrirAdmin() {
    document.getElementById('adminOverlay').classList.add('active');
}

function fermerAdmin() {
    document.getElementById('adminOverlay').classList.remove('active');
    document.getElementById('adminMsg').innerHTML = '';
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
}

function connecterAdmin() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();

    // Identifiants admin
    const ADMIN_USER = 'falmata';
    const ADMIN_PASS = 'ahlam.33';

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        document.getElementById('adminMsg').innerHTML =
            '<div class="alert alert-success">✅ Connexion réussie ! Bienvenue Falmata.</div>';
        setTimeout(() => {
            fermerAdmin();
            // Afficher le panneau admin
            afficherPanneauAdmin();
        }, 1500);
    } else {
        document.getElementById('adminMsg').innerHTML =
            '<div class="alert alert-error">❌ Identifiants incorrects.</div>';
    }
}

function afficherPanneauAdmin() {
    // Créer panneau admin en bas de page
    const existant = document.getElementById('panneauAdmin');
    if (existant) {
        existant.remove();
        return;
    }

    const panneau = document.createElement('div');
    panneau.id = 'panneauAdmin';
    panneau.style.cssText = `
        position: fixed; bottom: 0; left: 0; right: 0;
        background: #1a1a2e; color: #fff;
        padding: 15px 30px;
        display: flex; gap: 15px; align-items: center;
        z-index: 998; flex-wrap: wrap;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
    `;

    panneau.innerHTML = `
        <span style="color:#e91e8c; font-weight:700;">🔐 Mode Admin — Falmata</span>
        <button onclick="voirRdv()" style="background:#e91e8c;color:#fff;border:none;padding:8px 18px;border-radius:20px;cursor:pointer;">📅 Rendez-vous</button>
        <button onclick="voirServices()" style="background:#0f3460;color:#fff;border:none;padding:8px 18px;border-radius:20px;cursor:pointer;">✂ Services</button>
        <button onclick="voirGalerie()" style="background:#0f3460;color:#fff;border:none;padding:8px 18px;border-radius:20px;cursor:pointer;">🖼 Galerie</button>
        <button onclick="document.getElementById('panneauAdmin').remove()" style="background:#666;color:#fff;border:none;padding:8px 18px;border-radius:20px;cursor:pointer; margin-left:auto;">🚪 Déconnexion</button>
    `;
    document.body.appendChild(panneau);
}

// ===== DONNÉES ADMIN (stockées en JavaScript) =====
let rendezVous = JSON.parse(localStorage.getItem('rdv')) || [];
let services = JSON.parse(localStorage.getItem('services')) || [
    { id: 1, nom: 'Coupe simple',   prix: 3000,  duree: 45  },
    { id: 2, nom: 'Tressage',       prix: 8000,  duree: 120 },
    { id: 3, nom: 'Défrisage',      prix: 10000, duree: 90  },
    { id: 4, nom: 'Coloration',     prix: 12000, duree: 120 },
    { id: 5, nom: 'Soin capillaire',prix: 5000,  duree: 60  }
];

function sauvegarder() {
    localStorage.setItem('rdv', JSON.stringify(rendezVous));
    localStorage.setItem('services', JSON.stringify(services));
}

// ===== RÉSERVATION =====
function soumettreRdv() {
    const nom      = document.getElementById('rdvNom')?.value.trim();
    const prenom   = document.getElementById('rdvPrenom')?.value.trim();
    const email    = document.getElementById('rdvEmail')?.value.trim();
    const tel      = document.getElementById('rdvTel')?.value.trim();
    const service  = document.getElementById('rdvService')?.value;
    const date     = document.getElementById('rdvDate')?.value;
    const heure    = document.getElementById('rdvHeure')?.value;
    const message  = document.getElementById('rdvMessage')?.value.trim();
    const msgDiv   = document.getElementById('rdvMsg');

    if (!nom || !prenom || !email || !service || !date || !heure) {
        msgDiv.innerHTML = '<div class="alert alert-error">❌ Veuillez remplir tous les champs obligatoires.</div>';
        return;
    }

    const rdv = {
        id: Date.now(),
        nom, prenom, email, tel,
        service, date, heure, message,
        statut: 'En attente'
    };

    rendezVous.push(rdv);
    sauvegarder();

    msgDiv.innerHTML = '<div class="alert alert-success">✅ Votre rendez-vous a été enregistré ! Nous vous contacterons pour confirmation.</div>';

    // Vider le formulaire
    ['rdvNom','rdvPrenom','rdvEmail','rdvTel','rdvDate','rdvHeure','rdvMessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

// ===== VOIR RENDEZ-VOUS (admin) =====
function voirRdv() {
    const modal = creerModal('📅 Rendez-vous reçus');

    if (rendezVous.length === 0) {
        modal.querySelector('.modal-body').innerHTML = '<p style="color:#888;text-align:center;padding:20px;">Aucun rendez-vous pour le moment.</p>';
        return;
    }

    let html = '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<tr style="background:#f9f9f9;"><th style="padding:10px;text-align:left;">Client</th><th>Service</th><th>Date</th><th>Heure</th><th>Statut</th><th>Action</th></tr>';

    rendezVous.forEach((r, i) => {
        const couleur = r.statut === 'Confirmé' ? '#d1e7dd' : r.statut === 'Annulé' ? '#f8d7da' : '#fff3cd';
        html += `<tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;">${r.prenom} ${r.nom}<br><small style="color:#888;">${r.email}</small></td>
            <td style="padding:10px;">${r.service}</td>
            <td style="padding:10px;">${r.date}</td>
            <td style="padding:10px;">${r.heure}</td>
            <td style="padding:10px;"><span style="background:${couleur};padding:3px 10px;border-radius:20px;font-size:0.8rem;">${r.statut}</span></td>
            <td style="padding:10px;">
                <button onclick="changerStatut(${i},'Confirmé')" style="background:#0f5132;color:#fff;border:none;padding:4px 10px;border-radius:10px;cursor:pointer;font-size:0.8rem;margin-right:4px;">✅</button>
                <button onclick="changerStatut(${i},'Annulé')" style="background:#842029;color:#fff;border:none;padding:4px 10px;border-radius:10px;cursor:pointer;font-size:0.8rem;">❌</button>
            </td>
        </tr>`;
    });

    html += '</table></div>';
    modal.querySelector('.modal-body').innerHTML = html;
}

function changerStatut(index, statut) {
    rendezVous[index].statut = statut;
    sauvegarder();
    voirRdv();
}

// ===== VOIR SERVICES (admin) =====
function voirServices() {
    const modal = creerModal('✂ Gestion des Services');
    let html = '';

    services.forEach((s, i) => {
        html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #eee;">
            <div><strong>${s.nom}</strong><br><small style="color:#888;">${s.duree} min — <span style="color:#e91e8c;">${s.prix.toLocaleString()} FCFA</span></small></div>
            <button onclick="supprimerService(${i})" style="background:#f8d7da;color:#842029;border:none;padding:5px 12px;border-radius:10px;cursor:pointer;">🗑</button>
        </div>`;
    });

    html += `<div style="margin-top:20px;padding:15px;background:#f9f9f9;border-radius:10px;">
        <strong>➕ Ajouter un service</strong><br><br>
        <input id="sNom" placeholder="Nom du service" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px;">
        <input id="sPrix" type="number" placeholder="Prix (FCFA)" style="width:48%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-right:4%;">
        <input id="sDuree" type="number" placeholder="Durée (min)" style="width:48%;padding:8px;border:1px solid #ddd;border-radius:6px;">
        <br><br>
        <button onclick="ajouterService()" style="background:#e91e8c;color:#fff;border:none;padding:10px 25px;border-radius:20px;cursor:pointer;width:100%;">➕ Ajouter</button>
    </div>`;

    modal.querySelector('.modal-body').innerHTML = html;
}

function ajouterService() {
    const nom   = document.getElementById('sNom').value.trim();
    const prix  = parseInt(document.getElementById('sPrix').value);
    const duree = parseInt(document.getElementById('sDuree').value);

    if (!nom || !prix) return alert('Remplissez le nom et le prix !');

    services.push({ id: Date.now(), nom, prix, duree });
    sauvegarder();
    voirServices();
}

function supprimerService(index) {
    if (confirm('Supprimer ce service ?')) {
        services.splice(index, 1);
        sauvegarder();
        voirServices();
    }
}

// ===== VOIR GALERIE (admin) =====
function voirGalerie() {
    const modal = creerModal('🖼 Gestion de la Galerie');
    modal.querySelector('.modal-body').innerHTML = `
        <p style="color:#888;text-align:center;padding:20px;">
            Pour ajouter des photos, copiez-les dans le dossier <strong>images/</strong> 
            et mettez à jour le fichier <strong>pages/galerie.html</strong>.
        </p>
    `;
}

// ===== CRÉER MODAL =====
function creerModal(titre) {
    const existant = document.getElementById('adminModal');
    if (existant) existant.remove();

    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 1000;
        display: flex; justify-content: center; align-items: center;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="background:#fff;border-radius:15px;width:100%;max-width:750px;max-height:85vh;overflow-y:auto;">
            <div style="background:#1a1a2e;padding:20px 25px;border-radius:15px 15px 0 0;display:flex;justify-content:space-between;align-items:center;">
                <h3 style="color:#fff;margin:0;">${titre}</h3>
                <button onclick="document.getElementById('adminModal').remove()" style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">✕</button>
            </div>
            <div class="modal-body" style="padding:25px;"></div>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

// ===== REMPLIR SELECT SERVICES =====
function remplirServices() {
    const select = document.getElementById('rdvService');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choisir un service --</option>';
    services.forEach(s => {
        select.innerHTML += `<option value="${s.nom}">${s.nom} — ${s.prix.toLocaleString()} FCFA</option>`;
    });
}

// Charger services au démarrage
window.addEventListener('load', remplirServices); 