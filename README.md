# Bot WhatsApp École IGA

## Description du Projet

Ce projet est une **solution complète de bot WhatsApp** développée pour l'École IGA. Il permet de collecter automatiquement les informations des étudiants via WhatsApp et de les enregistrer dans Google Sheets. Le système inclut également un générateur de QR Code pour faciliter l'accès au bot.

### Objectifs du Projet
- Automatiser la collecte d'informations d'inscription des étudiants
- Intégrer WhatsApp comme interface utilisateur principale
- Stocker les données dans Google Sheets en temps réel
- Fournir une interface simple et intuitive en français
- Permettre la génération de QR Codes pour un accès rapide

## Technologies Utilisées

- **Node.js** - Runtime JavaScript
- **@whiskeysockets/baileys** - Librairie WhatsApp Web API
- **Google Sheets API** - Pour le stockage des données
- **QRCode** - Génération de codes QR
- **Pino** - Système de logging

## Structure du Projet

```
Bot/
├── 📄 index.js                    # Fichier principal du bot WhatsApp
├── 📄 package.json                # Configuration des dépendances Node.js
├── 📄 config.json                 # Configuration Google Sheets et bot
├── 📄 credentials.json            # Clés d'API Google (repository privé)
├── 📄 credentials.example.json    # Exemple de structure credentials
├── 📄 disabled_users.json         # Liste des utilisateurs désactivés
├── 📄 messages-responsable.json   # Messages stockés pour le responsable
├── 📄 README.md                   # Documentation principale
├── 📄 QUICK-START.md              # Guide de démarrage rapide
├── 📄 SUPPORT.md                  # Guide de support complet
├── 📄 GITHUB-SETUP.md             # Guide de publication GitHub
├── 📄 .gitignore                  # Protection des fichiers sensibles
├── 📁 auth_info_baileys/          # Données d'authentification WhatsApp
└── 📁 qr-generator/               # Module de génération de QR Codes
    ├── 📄 simple-qr.js            # Script générateur
    ├── 📄 README.md               # Documentation du générateur
    └── 📁 output/                 # QR Codes générés
        └── 🖼️ qr-principal.png    # QR Code principal
```

## Installation et Configuration

### Étape 1: Prérequis
Assurez-vous d'avoir installé :
- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)

```powershell
# Vérifier l'installation
node --version
npm --version
```

### Étape 2: Installation des Dépendances

```powershell
# Dans le répertoire du projet
npm install
```

### Étape 3: Configuration Google Sheets

#### 3.1 Créer un Projet Google Cloud
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet nommé "IGA-WhatsApp-Bot"
3. Activer l'API Google Sheets

#### 3.2 Créer un Compte de Service
1. Dans "APIs & Services" > "Credentials"
2. Cliquer sur "Create Credentials" > "Service Account"
3. Télécharger le fichier JSON des clés
4. Renommer le fichier en `credentials.json`

#### 3.3 Configurer Google Sheets
1. Créer un nouveau Google Sheets
2. Partager avec l'email du service account
3. Copier l'ID du spreadsheet et l'ajouter dans `config.json`

### Étape 4: Démarrage du Bot

```powershell
# Démarrer le bot
node index.js
```

## Utilisation du Système

### Fonctionnalités du Bot
- Menu principal interactif
- Processus d'inscription étape par étape
- Validation automatique des données
- Sauvegarde dans Google Sheets
- Générateur de QR Codes

### Commandes Spéciales
- `*` : Retour au menu principal
- `0` : Quitter la conversation

## 🛠️ Générateur de QR Codes

```powershell
# Aller dans le dossier qr-generator
cd qr-generator

# Générer un QR Code
node simple-qr.js
```

## 🔒 Sécurité et Bonnes Pratiques

### Fichiers Sensibles
⚠️ **Repository Privé** - Configuration sécurisée :
- ✅ `credentials.json` (inclus - repository privé)
- ⚠️ `auth_info_baileys/` (session WhatsApp temporaire)
- ⚠️ `messages-responsable.json` (données utilisateurs)

## Dépannage

### Problèmes Courants

#### QR Code ne s'affiche pas
```powershell
Remove-Item -Recurse -Force auth_info_baileys
node index.js
```

#### Erreur Google Sheets
- Vérifier que l'API est activée
- Confirmer que le service account a accès au sheet
- Vérifier l'ID du spreadsheet dans `config.json`

## Support et Contribution

Pour toute question sur ce projet :
1. Consulter cette documentation
2. Voir `SUPPORT.md` pour aide détaillée
3. Voir `QUICK-START.md` pour guide rapide

---

**Auteur** : AHDI Aya  
**Version** : 1.0.0  
**Licence** : MIT  
**Dernière mise à jour** : Août 2025

---

*Ce bot a été développé spécifiquement pour l'École IGA dans le but d'automatiser et simplifier le processus d'inscription des étudiants via WhatsApp.*
