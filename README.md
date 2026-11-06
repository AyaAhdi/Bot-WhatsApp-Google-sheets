# 🤖 Bot WhatsApp École IGA : Automatisation & Inscription des Étudiants

[![Node.js](https://img.shields.io/badge/Node.js-16+-6DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Baileys-25D366.svg?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![Google Sheets API](https://img.shields.io/badge/Google%20Sheets-API-34A853.svg?style=for-the-badge&logo=google-sheets&logoColor=white)](https://developers.google.com/sheets/api)

Bienvenue sur la documentation officielle du **Bot WhatsApp École IGA**, une solution complète d'automatisation développée pour collecter de manière fluide les informations des étudiants via WhatsApp et les synchroniser en temps réel dans Google Sheets. Le projet intègre également un générateur automatique de QR Codes pour faciliter l'accès à la conversation.

---

## 🎯 Objectifs du Projet

- **Automatiser la collecte** d'informations d'inscription des étudiants.
- **Intégrer WhatsApp** comme interface utilisateur principale.
- **Stocker les données** dans Google Sheets en temps réel.
- **Fournir une interface** simple et intuitive en français.
- **Permettre la génération** de QR Codes pour un accès rapide.

---

## 🛠️ Technologies Utilisées

- **Node.js** — Runtime JavaScript côté serveur.
- **@whiskeysockets/baileys** — Librairie WhatsApp Web API pour la gestion des sessions et messages.
- **Google Sheets API** — API cloud pour la persistance et le stockage des données.
- **QRCode** — Module de génération dynamique de codes QR d'accès.
- **Pino** — Système de logging haute performance pour le suivi des événements.

---

## 🌟 Fonctionnalités Principales

- **Processus d'Inscription Interactif** : Menu étape par étape pour guider l'étudiant avec validation automatique des données saisies.
- **Stockage Google Sheets en Temps Réel** : Synchronisation directe des informations collectées dans une feuille de calcul sécurisée.
- **Générateur de QR Codes Intégré** : Création automatique de visuels QR Code pour un accès rapide au bot.
- **Commandes Utiles** :
  - `*` : Retour rapide au menu principal.
  - `0` : Quitter la conversation à tout moment.

---

## 🛠️ Installation & Démarrage Rapide

### 1. Prérequis
Assurez-vous d'avoir installé **Node.js** (v16 ou supérieure) et **npm** :

```powershell
node --version
npm --version
```

### 2. Installation des Dépendances
Dans le répertoire racine du projet :

```powershell
npm install
```

### 3. Configuration Google Cloud & Sheets API
1. Rendez-vous sur la [Google Cloud Console](https://console.cloud.google.com/).
2. Créez un projet nommé `"IGA-WhatsApp-Bot"` et activez l'**API Google Sheets**.
3. Dans **APIs & Services > Credentials**, créez un **Compte de Service (Service Account)** et téléchargez la clé au format JSON.
4. Renommez le fichier téléchargé en `credentials.json` à la racine.
5. Partagez votre Google Sheet avec l'adresse e-mail du Compte de Service et collez l'ID de la feuille dans `config.json`.

### 4. Lancement du Bot

```powershell
node index.js
```

---

## 📲 Générateur de QR Codes

Pour générer un nouveau QR Code d'accès rapide au bot :

```powershell
cd qr-generator
node simple-qr.js
```

*Le visuel généré sera enregistré dans `qr-generator/output/qr-principal.png`.*

---

## 📁 Structure du Projet

```text
Bot/
├── auth_info_baileys/             # Données de session temporaires WhatsApp
├── qr-generator/                  # Module autonome de génération de QR Code
│   ├── output/
│   │   └── qr-principal.png       # QR Code principal généré
│   ├── README.md                  # Documentation du générateur QR
│   └── simple-qr.js               # Script de génération QR
├── .gitignore                     # Protection des fichiers sensibles et jetons
├── config.json                    # Configuration du bot & ID Google Sheets
├── credentials.example.json       # Structure d'exemple pour les identifiants
├── credentials.json               # Clés privées Google API (compte de service)
├── disabled_users.json            # Liste des utilisateurs désactivés
├── index.js                       # Point d'entrée principal de l'application
├── messages-responsable.json      # Messages stockés pour la gestion administrative
├── package.json                   # Gestionnaire des dépendances Node.js
├── GITHUB-SETUP.md                # Guide de publication GitHub
├── QUICK-START.md                 # Guide de prise en main rapide
├── README.md                      # Présentation principale du projet
└── SUPPORT.md                     # Documentation de support et dépannage
```

---

## 🔒 Sécurité & Dépannage

### Gestion des Fichiers Sensibles
- ⚠️ **Attention** : N'envoyez jamais vos fichiers `credentials.json`, `auth_info_baileys/` et `messages-responsable.json` sur un dépôt public.
- Assurez-vous qu'ils soient correctement listés dans votre fichier `.gitignore`.

### Réinitialisation de la Session WhatsApp
Si le QR Code de connexion ne s'affiche pas dans le terminal :

```powershell
Remove-Item -Recurse -Force auth_info_baileys
node index.js
```

---

## 👩‍💻 Auteur & Version

- **Auteur** : **AHDI Aya**
- **Établissement** : École IGA (Institut Supérieur du Génie Appliqué)
- **Version** : 1.0.0 (Août 2025)

---

*Ce bot a été développé spécifiquement pour l'École IGA dans le but d'automatiser et simplifier le processus d'inscription des étudiants via WhatsApp.*
