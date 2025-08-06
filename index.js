const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const P = require('pino');

// Configuration
const config = require('./config.json');
let credentials;

// Vérifier si le fichier credentials.json existe
try {
  credentials = require('./credentials.json');
} catch (error) {
  console.error('Fichier credentials.json non trouvé. Veuillez créer ce fichier à partir de credentials.example.json');
  process.exit(1);
}

// Configuration Google Sheets
const SHEET_ID = config.googleSheets.spreadsheetId;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// Fonction pour ajouter des données à Google Sheets
async function appendToSheet(data) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: config.googleSheets.range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data]
      },
    });
    console.log('Données ajoutées à Google Sheets:', data);
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'ajout à Google Sheets:', error.message);
    throw error;
  }
}

// Fonction pour sauvegarder le feedback dans un fichier JSON
async function saveFeedback(name, phone, feedback) {
  try {
    const feedbackData = {
      nom: name,
      telephone: phone,
      retour: feedback,
      date: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' })
    };

    const feedbackFile = path.join(__dirname, 'feedbacks.json');
    let feedbacks = [];

    try {
      const existingData = fs.readFileSync(feedbackFile, 'utf8');
      feedbacks = JSON.parse(existingData);
    } catch (error) {
      // Fichier n'existe pas encore, on commence avec un tableau vide
      console.log('Création du fichier feedbacks.json');
    }

    feedbacks.push(feedbackData);
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));
    console.log('Feedback sauvegardé pour:', name);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du feedback:', error);
  }
}

// Fonction pour sauvegarder les messages reçus après fermeture (pour le responsable)
async function saveMessageAfterClosure(name, phone, message) {
  try {
    const messageData = {
      nom: name,
      telephone: phone,
      message: message,
      date: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
      statut: 'En attente de réponse du responsable'
    };

    const messagesFile = path.join(__dirname, 'messages-responsable.json');
    let messages = [];

    try {
      const existingData = fs.readFileSync(messagesFile, 'utf8');
      messages = JSON.parse(existingData);
    } catch (error) {
      console.log('Création du fichier messages-responsable.json');
    }

    messages.push(messageData);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
    console.log('📩 NOUVEAU MESSAGE POUR LE RESPONSABLE:', name, '-', message);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du message responsable:', error);
  }
}

// Messages et menus du bot
const messages = {
  welcome: `Pour bien démarrer, merci de nous fournir quelques informations afin de mieux vous orienter :

(Tapez * à tout moment pour revenir au menu principal.)`,

  menu: `*MENU PRINCIPAL*

1️⃣ Programmes et formations
2️⃣ Dossier d'inscription 
3️⃣ Tarifs
4️⃣ Logement
5️⃣ Parler à un responsable admission
0️⃣ Quitter

Merci de choisir une option (un chiffre entre 0 et 5) :`,

  dataCollection: {
    lastname: "Veuillez saisir votre *Nom* :",
    firstname: "Veuillez saisir votre *Prénom* :",
    city: "Veuillez saisir votre *Ville* .Si vous êtes à l'étranger, veuillez indiquer votre pays.",
    studyLevel: `Veuillez choisir votre *Niveau d'étude* :\n\n1️⃣ Bac\n2️⃣ Bac+1\n3️⃣ Bac+2\n4️⃣ Bac+3\n5️⃣ Bac+4\n\nRépondez par le chiffre correspondant.`,
    bacType: `Veuillez choisir votre *Type de bac* :\n\n1️⃣ Scientifique\n2️⃣ Economique\n3️⃣ Littéraire\n4️⃣ Technique\n5️⃣ Autre, à préciser\n\nRépondez par le chiffre correspondant.`,
    bacTypeOther: "Vous avez choisi 'Autre'. Veuillez indiquer précisément votre type de bac :",
    filiere: `Veuillez choisir la *filière* qui vous intéresse :\n\n1️⃣ Ingénierie\n2️⃣ Ingénieurie d'État\n3️⃣ Management\n\nRépondez par le chiffre correspondant.`
  }
};

// Réponses du menu
const menuResponses = {
  '1': `*Programmes et formations*

🔹 Formations en INGÉNIERIE 
   👉 iga.ac.ma/ingenierie

🔹 Formations en MANAGEMENT 
   👉 iga.ac.ma/management

🔹 Diplômes D'INGÉNIEUR D'ÉTAT 
   👉 iga.ac.ma/ingenierie/diplome-dingenieur-detat

Tapez 0 pour quitter le menu principal.
Tapez * pour revenir au menu principal.`,

  '2': `*Dossier d'inscription*

Afin que votre candidature soit étudiée par la commission pédagogique, veuillez fournir les documents suivants :

- Baccalauréat ou attestation de réussite au baccalauréat
- Relevé de notes du baccalauréat (et post-bac si disponible)
- Carte d'Identité Nationale (CIN) et/ou Passeport

Tapez 0 pour quitter le menu principal.
Tapez * pour revenir au menu principal.`,

  '3': `*Tarifs*

� *FRAIS DE SCOLARITÉ*

🔹 *1ère et 2ème année :* 40 800 DHS/an
   • Frais d'inscription : 3 000 DHS/an
   • Frais de scolarité : 37 800 DHS/an

🔹 *3ème, 4ème et 5ème année :* 44 400 DHS/an
   • Frais d'inscription : 3 000 DHS/an
   • Frais de scolarité : 41 400 DHS/an

*MODALITÉS DE PAIEMENT*

Les frais de scolarité peuvent être payés :
• *Mensuellement* (sur 9 mois)
• *Trimestriellement* (sur 3 trimestres)
• *Annuellement* (réduction de 5% si payé avant le 31 octobre)

Tapez 0 pour quitter le menu principal.
Tapez * pour revenir au menu principal.`,

  '4': `*Logement*

L'École ne propose pas de logement étudiant directement.

Cependant, voici un lien utile pour trouver un logement à Casablanca :

🔹 www.avito.ma
  www.avito.ma/fr/casablanca/appartements-%C3%A0_louer

Tapez 0 pour quitter le menu principal.
Tapez * pour revenir au menu principal.`,

  '5': `*Parler à un responsable admission*

  Un responsable des admissions va vous recevoir dans quelques instants. 
  Merci de patienter...

Tapez 0 pour quitter le menu principal.
Tapez * pour revenir au menu principal.`,

  '0': `Merci de votre visite ! 😊

Nous aimerions connaître votre avis. Pouvez-vous nous faire part de votre retour d'expérience ?`
};

// État des utilisateurs

// Définition des états possibles du bot
const STATES = {
  WELCOME: 'welcome',
  COLLECTING_LASTNAME: 'collecting_lastname',
  COLLECTING_FIRSTNAME: 'collecting_firstname',
  COLLECTING_CITY: 'collecting_city',
  COLLECTING_STUDY_LEVEL: 'collecting_study_level',
  COLLECTING_BAC_TYPE: 'collecting_bac_type',
  COLLECTING_FILIERE: 'collecting_filiere',
  MENU: 'menu',
  COMPLETED: 'completed',
  FEEDBACK: 'feedback',
  CLOSED: 'closed'
};

const userStates = {};

// Fonction pour initialiser un nouvel utilisateur
function initializeUser(from) {
  userStates[from] = {
    state: STATES.WELCOME,
    data: {},
    attempts: 0,
    lastActivity: Date.now()
  };
}

// États possibles
// ...existing code...

// Fonction pour valider l'email
// function isValidEmail(email) {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email.trim());
// }

// Fonction pour nettoyer le numéro de téléphone
function cleanPhoneNumber(from) {
  return from.replace('@s.whatsapp.net', '').replace('@c.us', '');
}

// Fonction pour logger les actions utilisateur
function logUserAction(phoneNumber, action, data = '') {
  const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' });
  console.log(`[${timestamp}] User ${phoneNumber}: ${action} ${data}`);
}

// Fonction pour traiter les messages
async function handleMessage(sock, msg) {
  try {
    const from = msg.key.remoteJid;
    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const text = messageText.trim();
    const cleanPhone = cleanPhoneNumber(from);

    // Ignorer les messages vides ou les messages de groupe
    if (!text || from.includes('@g.us')) return;

    // Gestion admin : /stop <numéro> ou /resume <numéro>
    const adminPhone = config.bot.adminPhone;
    if (cleanPhone === adminPhone) {
      if (text.startsWith('/stop ')) {
        const target = text.replace('/stop ', '').trim();
        let disabled = [];
        try {
          disabled = JSON.parse(fs.readFileSync(path.join(__dirname, 'disabled_users.json'), 'utf8'));
        } catch { }
        if (!disabled.includes(target)) disabled.push(target);
        fs.writeFileSync(path.join(__dirname, 'disabled_users.json'), JSON.stringify(disabled, null, 2));
        console.log('>>> COMMANDE STOP exécutée, disabled_users.json =', disabled);
        await sock.sendMessage(from, { text: `Bot désactivé pour ${target}` });
        return;
      }
      if (text.startsWith('/resume ')) {
        const target = text.replace('/resume ', '').trim();
        let disabled = [];
        try {
          disabled = JSON.parse(fs.readFileSync(path.join(__dirname, 'disabled_users.json'), 'utf8'));
        } catch { }
        const idx = disabled.indexOf(target);
        if (idx !== -1) disabled.splice(idx, 1);
        fs.writeFileSync(path.join(__dirname, 'disabled_users.json'), JSON.stringify(disabled, null, 2));
        await sock.sendMessage(from, { text: `Bot réactivé pour ${target}` });
        return;
      }
    }

    // Vérifier si l'utilisateur est désactivé
    let disabled = [];
    try {
      disabled = JSON.parse(fs.readFileSync(path.join(__dirname, 'disabled_users.json'), 'utf8'));
    } catch { }
    console.log('Numéro expéditeur:', cleanPhone, 'Liste disabled:', disabled);
    if (disabled.includes(cleanPhone)) {
      // Le bot ne répond pas à cet utilisateur
      return;
    }

    // Log de l'action utilisateur
    logUserAction(cleanPhone, 'Message reçu:', text);

    // Initialiser l'utilisateur s'il n'existe pas
    if (!userStates[from]) {
      initializeUser(from);
      logUserAction(cleanPhone, 'Nouvel utilisateur initialisé');
    }

    const user = userStates[from];

    // Sécurité : vérifier que l'objet user existe
    if (!user) {
      initializeUser(from);
      logUserAction(cleanPhone, 'Utilisateur réinitialisé (erreur état)');
      return;
    }

    // Vérifier si l'utilisateur a une session fermée (bot terminé)
    if (user.state === STATES.CLOSED) {
      // Sauvegarder le message pour le responsable
      const userNameClosed = user.data?.name || 'Utilisateur anonyme';
      await saveMessageAfterClosure(userNameClosed, cleanPhone, text);

      logUserAction(cleanPhone, 'Message reçu sur session fermée - Sauvegardé pour responsable:', text);
      // Ne pas répondre automatiquement - laisser le responsable gérer manuellement
      return;
    }

    // Mettre à jour l'activité de l'utilisateur
    user.lastActivity = Date.now();

    logUserAction(cleanPhone, `État actuel: ${user.state}`);

    // Commande pour revenir au menu principal (ne fonctionne pas si fermé)
    if (text === '*' && user.state !== STATES.CLOSED) {
      user.state = STATES.MENU;
      await sock.sendMessage(from, { text: messages.menu });
      return;
    }

    // Gestion des états
    switch (user.state) {
      case STATES.WELCOME:
        await sock.sendMessage(from, { text: messages.welcome });
        await sock.sendMessage(from, { text: messages.dataCollection.lastname });
        user.state = STATES.COLLECTING_LASTNAME;
        break;

      case STATES.COLLECTING_LASTNAME:
        // Sauvegarde du nom dès la saisie
        if (text.length >= 2) {
          user.data.lastname = text.trim();
          // Crée la ligne dans Google Sheets avec le nom uniquement, toutes les autres colonnes initialisées à '-'
          try {
            const cleanPhone = cleanPhoneNumber(from);
            const row = [
              user.data.lastname, // Nom
              '-', // Prénom
              cleanPhone, // Téléphone
              '-', // Ville
              '-', // Niveau d'étude
              '-', // Type de bac
              '-', // Filière
              '-', // Date/Heure
              '-', // Option
              '-', // Parler avec responsable
              '-', // Feedback
            ];
            user.data.optionsClicked = [];
            const response = await appendToSheet(row);
            const updatedRange = response.data?.updates?.updatedRange || response.data?.tableRange || '';
            const match = updatedRange.match(/([A-Z]+)(\d+):[A-Z]+(\d+)/);
            let lineIndex = null;
            if (match) {
              lineIndex = parseInt(match[2]);
            }
            user.data.sheetRowIndex = lineIndex;
          } catch (error) {
            console.error('Erreur lors de la sauvegarde du nom dans Google Sheets:', error);
          }
        }
        if (text.length < 2) {
          user.attempts++;
          logUserAction(cleanPhone, `Nom trop court (tentative ${user.attempts}):`, text);
          await sock.sendMessage(from, { text: "Le nom doit contenir au moins 2 caractères.\n\nVeuillez saisir votre nom :" });
          return;
        }
        user.attempts = 0;
        user.data.lastname = text.trim();
        user.state = STATES.COLLECTING_FIRSTNAME;
        logUserAction(cleanPhone, 'Nom enregistré:', user.data.lastname);
        await sock.sendMessage(from, { text: messages.dataCollection.firstname });
        break;

      case STATES.COLLECTING_FIRSTNAME:
        // Mise à jour du prénom
        if (text.length >= 2 && user.data.sheetRowIndex) {
          user.data.firstname = text.trim();
          try {
            const rowIndex = user.data.sheetRowIndex;
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `B${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.firstname || '-']] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour du prénom dans Google Sheets:', error);
          }
        }
        if (text.length < 2) {
          user.attempts++;
          logUserAction(cleanPhone, `Prénom trop court (tentative ${user.attempts}):`, text);
          await sock.sendMessage(from, { text: "Le prénom doit contenir au moins 2 caractères.\n\nVeuillez saisir votre prénom :" });
          return;
        }
        user.attempts = 0;
        user.data.firstname = text.trim();
        user.state = STATES.COLLECTING_CITY;
        logUserAction(cleanPhone, 'Prénom enregistré:', user.data.firstname);
        await sock.sendMessage(from, { text: messages.dataCollection.city });
        break;
      case STATES.COLLECTING_CITY:
        // Mise à jour de la ville
        if (text.length >= 2 && user.data.sheetRowIndex) {
          user.data.city = text.trim();
          try {
            const rowIndex = user.data.sheetRowIndex;
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `D${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.city || '-']] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour de la ville dans Google Sheets:', error);
          }
        }
        if (text.length < 2) {
          await sock.sendMessage(from, { text: "La ville doit contenir au moins 2 caractères. Veuillez réessayer :" });
          return;
        }
        user.data.city = text;
        user.state = STATES.COLLECTING_STUDY_LEVEL;
        await sock.sendMessage(from, { text: messages.dataCollection.studyLevel });
        break;

      case STATES.COLLECTING_STUDY_LEVEL:
        // Déclaration AVANT toute utilisation
        const studyOptions = {
          '1': 'Bac',
          '2': 'Bac+1',
          '3': 'Bac+2',
          '4': 'Bac+3',
          '5': 'Bac+4'
        };
        const studyChoice = text.trim();
        // Mise à jour du niveau d'étude
        if (studyOptions[studyChoice] && user.data.sheetRowIndex) {
          user.data.studyLevel = studyOptions[studyChoice];
          try {
            const rowIndex = user.data.sheetRowIndex;
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `E${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.studyLevel || '-']] }
            });
          } catch (error) {
            console.error("Erreur lors de la mise à jour du niveau d'étude dans Google Sheets:", error);
          }
        }
        if (studyOptions[studyChoice]) {
          user.data.studyLevel = studyOptions[studyChoice];
          user.state = STATES.COLLECTING_BAC_TYPE;
          await sock.sendMessage(from, { text: messages.dataCollection.bacType });
        } else {
          await sock.sendMessage(from, { text: "Option invalide. Veuillez choisir un chiffre entre 1 et 5 pour le niveau d'étude." });
        }
        break;



      case STATES.COLLECTING_BAC_TYPE:
        // Mise à jour du type de bac
        const bacOptions = {
          '1': 'Scientifique',
          '2': 'Economique',
          '3': 'Littéraire',
          '4': 'Technique',
          '5': 'Autre'
        };
        const bacChoice = text.trim();
        // Enregistre la valeur du type de bac dans Google Sheets
        if (bacOptions[bacChoice] && user.data.sheetRowIndex) {
          user.data.bacType = bacOptions[bacChoice];
          try {
            const rowIndex = user.data.sheetRowIndex;
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `F${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.bacType || '-']] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour du type de bac dans Google Sheets:', error);
          }
        }
        if (bacOptions[bacChoice]) {
          if (bacChoice === '5') {
            user.state = 'collecting_bac_type_other';
            await sock.sendMessage(from, { text: messages.dataCollection.bacTypeOther });
          } else {
            user.data.bacType = bacOptions[bacChoice];
            // Enregistre aussi la valeur pour Economique/Littéraire/Autre
            if (user.data.sheetRowIndex) {
              try {
                const rowIndex = user.data.sheetRowIndex;
                const range = `F${rowIndex}`;
                await sheets.spreadsheets.values.update({
                  spreadsheetId: SHEET_ID,
                  range,
                  valueInputOption: 'USER_ENTERED',
                  resource: { values: [[user.data.bacType || '-']] }
                });
              } catch (error) {
                console.error('Erreur lors de la mise à jour du type de bac dans Google Sheets:', error);
              }
            }
            user.data.timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' });
            user.data.phoneNumber = from.replace('@s.whatsapp.net', '');
            user.state = STATES.COLLECTING_FILIERE;
            await sock.sendMessage(from, { text: messages.dataCollection.filiere });
          }
        } else {
          await sock.sendMessage(from, { text: "Option invalide. Veuillez choisir un chiffre entre 1 et 5 pour le type de bac." });
        }
        break;

      case 'collecting_bac_type_other':
        user.data.bacType = text.trim(); // valeur descriptive saisie par l'utilisateur
        // Enregistre la valeur dans Google Sheets
        if (user.data.sheetRowIndex) {
          try {
            const rowIndex = user.data.sheetRowIndex;
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `F${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.bacType || '-']] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour du type de bac (autre) dans Google Sheets:', error);
          }
        }
        user.data.timestamp = new Date().toLocaleString('fr-FR', {
          timeZone: 'Africa/Casablanca'
        });
        user.data.phoneNumber = from.replace('@s.whatsapp.net', '');
        user.state = STATES.COLLECTING_FILIERE;
        await sock.sendMessage(from, { text: messages.dataCollection.filiere });
        break;
      case STATES.COLLECTING_FILIERE:
        // Mise à jour de la filière
        // Déclaration AVANT toute utilisation
        const filiereOptions = {
          '1': 'Ingénierie',
          '2': "Ingénieurie d'État",
          '3': 'Management'
        };
        const filiereChoice = text.trim();
        const studyLevel = user.data.studyLevel;
        const bacType = user.data.bacType;

        if (filiereOptions[filiereChoice] && user.data.sheetRowIndex) {
          user.data.filiere = filiereOptions[filiereChoice];
          try {
            const rowIndex = user.data.sheetRowIndex;
            // Mise à jour de la filière sur la même ligne
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `G${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.filiere || '-']] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour de la filière dans Google Sheets:', error);
          }
        }

        if (filiereOptions[filiereChoice]) {
          const filiere = filiereOptions[filiereChoice];
          // Condition stricte uniquement pour Bac
          if (studyLevel === 'Bac' && bacType !== 'Scientifique' && bacType !== 'Technique' && filiereChoice !== '3') {
            await sock.sendMessage(from, {
              text: `Avec un Bac ${bacType}, seules les filières Management sont accessibles.\n\nVeuillez choisir la filière Management.`
            });
            await sock.sendMessage(from, { text: messages.dataCollection.filiere });
            break;
          }
          // Pour Bac+1, Bac+2, Bac+3, Bac+4 ou Bac avec bon type : aucune restriction
          user.data.filiere = filiere;
          try {
            const rowIndex = user.data.sheetRowIndex;
            // Mise à jour de la filière sur la même ligne
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `G${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.filiere || '-']] }
            });
            // Mise à jour de la date/heure sur la même ligne
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `H${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[user.data.timestamp || new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' })]] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour de la filière ou date/heure dans Google Sheets:', error);
          }
          await sock.sendMessage(from, {
            text: `*Merci ${user.data.firstname || ''} !*\n${messages.menu}`
          });
          user.state = STATES.MENU;
        } else {
          await sock.sendMessage(from, { text: "Option invalide. Veuillez choisir 1, 2 ou 3 pour la filière." });
        }
        break;

      case STATES.MENU:
      case STATES.COMPLETED:

        // Dictionnaire des noms d'options pour Google Sheets
        const optionNames = {
          '1': 'Programmes et formations',
          '2': "Dossier d'inscription",
          '3': 'Tarifs',
          '4': 'Logement',
          '0': 'Quitter/Feedback'
        };

        if (["0", "1", "2", "3", "4", "5"].includes(text) && user.data.sheetRowIndex) {
          const rowIndex = user.data.sheetRowIndex;
          // Ajoute l'option cliquée à la liste sans doublon
          if (!user.data.optionsClicked) user.data.optionsClicked = [];
          if (optionNames[text] && !user.data.optionsClicked.includes(optionNames[text])) {
            user.data.optionsClicked.push(optionNames[text]);
          }
          // Toujours mettre à jour la colonne Option avec toutes les options cliquées
          try {
            const optionsConcat = user.data.optionsClicked.join(' - ');
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `I${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[optionsConcat]] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour Option:', error);
          }
          // Met à jour la colonne Parler avec responsable : reste "Oui" si déjà Oui ou si option 5 choisie
          if (!user.data.parlerResponsable || user.data.parlerResponsable !== 'Oui') {
            if (text === '5') {
              user.data.parlerResponsable = 'Oui';
              try {
                await sheets.spreadsheets.values.update({
                  spreadsheetId: SHEET_ID,
                  range: `J${rowIndex}`,
                  valueInputOption: 'USER_ENTERED',
                  resource: { values: [['Oui']] }
                });
              } catch (error) {
                console.error('Erreur lors de la mise à jour Parler avec responsable (Oui):', error);
              }
            } else if (["1", "2", "3", "4", "0"].includes(text)) {
              user.data.parlerResponsable = 'Non';
              try {
                await sheets.spreadsheets.values.update({
                  spreadsheetId: SHEET_ID,
                  range: `J${rowIndex}`,
                  valueInputOption: 'USER_ENTERED',
                  resource: { values: [['Non']] }
                });
              } catch (error) {
                console.error('Erreur lors de la mise à jour Parler avec responsable (Non):', error);
              }
            }
          }
        }

        if (text === '0') {
          await sock.sendMessage(from, { text: menuResponses[text] });
          await sock.sendMessage(from, { text: "Voulez-vous ajouter un feedback ?\n1️⃣ Oui\n2️⃣ Non" });
          user.state = 'feedback_menu_option';
        } else if (menuResponses[text]) {
          await sock.sendMessage(from, { text: menuResponses[text] });
        } else {
          await sock.sendMessage(from, {
            text: `Option invalide. Veuillez choisir un chiffre entre 0 et 5.\n\n${messages.menu}`
          });
        }
        break;
      case 'feedback_menu_option':
        if (text === '1') {
          await sock.sendMessage(from, { text: "Merci ! Veuillez écrire votre feedback :" });
          user.state = STATES.FEEDBACK;
        } else if (text === '2') {
          await sock.sendMessage(from, { text: `Merci pour votre visite !\n\nAu revoir et à bientôt ! 👋` });
          user.state = STATES.CLOSED;
          logUserAction(cleanPhoneNumber(from), 'Session fermée - Bot terminé, responsable peut répondre');
        } else {
          await sock.sendMessage(from, { text: "Option invalide. Tapez 1 pour ajouter un feedback ou 2 pour terminer." });
        }
        break;

      case STATES.FEEDBACK:
        // Met à jour la colonne Feedback dans la même ligne (colonne K)
        if (text && text.trim().length > 0 && user.data.sheetRowIndex) {
          try {
            const rowIndex = user.data.sheetRowIndex;
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `K${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              resource: { values: [[text]] }
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour du feedback dans Google Sheets:', error);
          }
          await sock.sendMessage(from, {
            text: `🙏 Merci beaucoup pour votre retour !\n\nN'hésitez pas à nous écrire à tout moment si vous avez d'autres questions ou besoins.\n\nAu revoir et à bientôt ! 👋`
          });
        } else {
          await sock.sendMessage(from, {
            text: `Merci pour votre visite !\n\nAu revoir et à bientôt ! 👋`
          });
        }
        user.state = STATES.CLOSED;
        logUserAction(cleanPhoneNumber(from), 'Session fermée - Bot terminé, responsable peut répondre');
        break;

      case STATES.CLOSED:
        // L'utilisateur a terminé sa session avec le bot
        // Sauvegarder le message pour le responsable
        const userNameClosed = user.data?.name || 'Utilisateur anonyme';
        await saveMessageAfterClosure(userNameClosed, cleanPhone, text);

        logUserAction(cleanPhone, 'Message reçu après fermeture - Sauvegardé pour responsable:', text);
        // Ne pas répondre automatiquement - laisser le responsable gérer
        return;

      default:
        user.state = STATES.WELCOME;
        await handleMessage(sock, msg);
        break;
    }

  } catch (error) {
    console.error('Erreur dans handleMessage:', error);
    // Correction : vérifier que 'from' existe avant de l'utiliser
    if (typeof from !== 'undefined') {
      logUserAction(cleanPhoneNumber(from), 'Erreur:', error.message);
      // Réinitialiser l'utilisateur en cas d'erreur grave
      if (userStates[from]) {
        userStates[from].state = STATES.WELCOME;
      }
    } else {
      console.error('Erreur critique : variable "from" non définie dans handleMessage.');
    }
  }
}

// Fonction principale pour démarrer le bot
async function startBot() {
  try {
    console.log('Démarrage du bot WhatsApp IGA...');

    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

    const sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }), // Logger silencieux
      browser: ['Bot IGA', 'Chrome', '1.0.0'], // Identifiant du navigateur
      generateHighQualityLinkPreview: true,
      syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('Scannez ce QR code avec WhatsApp :');
        qrcode.generate(qr, { small: true });
        console.log('En attente de la connexion...');
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Connexion fermée. Reconnexion:', shouldReconnect);

        if (shouldReconnect) {
          setTimeout(startBot, 3000); // Attendre 3 secondes avant de reconnecter
        } else {
          console.log('Bot déconnecté. Veuillez redémarrer.');
        }
      } else if (connection === 'open') {
        console.log('Bot WhatsApp connecté avec succès !');
        console.log('Le bot est prêt à recevoir des messages...');
      }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;

        try {
          await handleMessage(sock, msg);
        } catch (error) {
          console.error('Erreur lors du traitement du message:', error);
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors du démarrage du bot:', error);
    console.log('Nouvelle tentative dans 5 secondes...');
    setTimeout(startBot, 5000); // Réessayer après 5 secondes
  }
}

// Gestionnaire d'arrêt propre
process.on('SIGINT', () => {
  console.log('\n Arrêt du bot WhatsApp IGA...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n Arrêt du bot WhatsApp IGA...');
  process.exit(0);
});

// Démarrer le bot
console.log('Bot WhatsApp École IGA - Système d\'inscription');
console.log('Démarrage le:', new Date().toLocaleString('fr-FR'));
console.log('─'.repeat(50));

startBot();
