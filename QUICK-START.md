# 🚀 Guide Démarrage Rapide - Bot WhatsApp IGA

## ⚡ Installation Express (5 minutes)

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE-USERNAME/iga-whatsapp-bot.git
cd iga-whatsapp-bot
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Google Sheets (OBLIGATOIRE)

#### A. Créer le projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Google Sheets

#### B. Créer les credentials

1. Créer un Service Account
2. Télécharger le fichier JSON
3. Renommer en `credentials.json` et placer dans le dossier racine

#### C. Préparer le Google Sheet

1. Créer un nouveau Google Sheets
2. Ajouter les en-têtes : `Nom | Prénom | Email | Téléphone | Programme | Date | Ville | Niveau | Commentaires`
3. Partager avec l'email du service account
4. Copier l'ID du spreadsheet et l'ajouter dans `config.json`

### 4. Configurer le bot

Modifier `config.json` :

```json
{
  "googleSheets": {
    "spreadsheetId": "VOTRE_SPREADSHEET_ID",
    "range": "A:I"
  },
  "bot": {
    "welcomeMessage": "👋 Bienvenue chez l'École IGA !",
    "adminPhone": "VOTRE_NUMERO_ADMIN"
  }
}
```

### 5. Lancer le bot

```bash
node index.js
```

### 6. Connecter WhatsApp

1. Scanner le QR Code qui s'affiche
2. Le bot est maintenant actif !

## 🔧 Générer un QR Code d'accès

```bash
cd qr-generator
node simple-qr.js
```

Le QR Code sera généré dans `qr-generator/output/`

## 📱 Utilisation

Les utilisateurs peuvent :

1. Scanner le QR Code ou envoyer un message au bot
2. Suivre le menu interactif
3. S'inscrire en remplissant le formulaire
4. Leurs informations sont automatiquement sauvées dans Google Sheets

## 🆘 Problèmes courants

**QR Code ne s'affiche pas :**

```bash
rm -rf auth_info_baileys
node index.js
```

**Erreur Google Sheets :**

- Vérifier l'ID du spreadsheet
- Confirmer que le service account a les permissions

**Dépendances manquantes :**

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📖 Documentation complète

Consulter le [README.md](README.md) principal pour une documentation détaillée.

---

_🎓 École IGA - Solution automatisée d'inscription via WhatsApp_
