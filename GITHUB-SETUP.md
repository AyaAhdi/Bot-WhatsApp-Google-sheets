# 📋 Guide de Publication sur GitHub

## 🔧 Préparation avant publication

### 1. Vérifier les fichiers sensibles

Assurez-vous que ces fichiers ne sont PAS inclus :

- ❌ `credentials.json`
- ❌ `auth_info_baileys/`
- ❌ `feedbacks.json`
- ❌ `messages-responsable.json`
- ❌ `node_modules/`

### 2. Nettoyer le projet (optionnel)

```powershell
# Supprimer les données sensibles
Remove-Item -Force credentials.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force auth_info_baileys -ErrorAction SilentlyContinue
Remove-Item -Force feedbacks.json -ErrorAction SilentlyContinue
Remove-Item -Force messages-responsable.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
```

## 🚀 Publication sur GitHub

### 1. Initialiser Git (si pas déjà fait)

```powershell
git init
```

### 2. Ajouter tous les fichiers

```powershell
git add .
```

### 3. Premier commit

```powershell
git commit -m "Initial commit: Bot WhatsApp École IGA v1.0.0

✨ Fonctionnalités:
- Bot WhatsApp interactif avec menu
- Intégration Google Sheets automatique
- Générateur QR Code
- Validation des données
- Interface en français
- Documentation complète

🔧 Technologies:
- Node.js
- Baileys (WhatsApp API)
- Google Sheets API
- QRCode generator"
```

### 4. Créer le repository sur GitHub

1. Aller sur https://github.com
2. Cliquer sur "New repository"
3. Nommer : `iga-whatsapp-bot`
4. Ajouter description : "🤖 Bot WhatsApp automatisé pour École IGA avec intégration Google Sheets"
5. Sélectionner "Public" ou "Private"
6. Ne pas initialiser avec README (on a déjà le nôtre)

### 5. Connecter au repository GitHub

```powershell
# Remplacer VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/iga-whatsapp-bot.git
```

### 6. Pousser le code

```powershell
git branch -M main
git push -u origin main
```

## 📝 Mise à jour du repository

Pour les futures mises à jour :

```powershell
# Ajouter les modifications
git add .

# Commit avec message descriptif
git commit -m "🔧 Fix: Amélioration de la validation des emails"

# Pousser
git push
```

## 🏷️ Gestion des versions

Pour créer des releases :

```powershell
# Créer un tag
git tag -a v1.0.0 -m "Version 1.0.0 - Release initiale"

# Pousser le tag
git push origin v1.0.0
```

## 🔒 Sécurité GitHub

### Variables d'environnement (pour déploiement)

Dans les paramètres du repository GitHub :

1. Aller dans "Settings" > "Secrets and variables" > "Actions"
2. Ajouter ces secrets :
   - `GOOGLE_CREDENTIALS` (contenu de credentials.json)
   - `SPREADSHEET_ID`
   - `ADMIN_PHONE`

### Branch protection (optionnel)

1. "Settings" > "Branches"
2. "Add rule" pour la branche `main`
3. Cocher "Require pull request reviews"

## 📄 Personnalisation du README GitHub

Le README.md créé est parfait pour GitHub. Il inclut :

- ✅ Description claire du projet
- ✅ Instructions d'installation détaillées
- ✅ Guide de configuration
- ✅ Section dépannage
- ✅ Structure du projet
- ✅ Informations techniques

## 🎯 Bonnes pratiques Git

### Messages de commit recommandés

```
✨ feat: Nouvelle fonctionnalité
🐛 fix: Correction de bug
📚 docs: Mise à jour documentation
🔧 refactor: Refactorisation du code
🎨 style: Améliorations styling
🚀 perf: Amélioration performance
🧪 test: Ajout de tests
```

### Branches recommandées

- `main` : Version stable
- `develop` : Développement en cours
- `feature/nom-feature` : Nouvelles fonctionnalités
- `hotfix/nom-fix` : Corrections urgentes

---

🎓 **École IGA** - Votre bot WhatsApp est maintenant prêt pour GitHub !
