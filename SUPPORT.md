🎯 Ce que contient ce fichier d'aide :

✅ Déploiement complet sur nouveau PC (étape par étape)
✅ Analyse des coûts (confirmation 100% gratuit)
✅ Résolution de tous les problèmes courants
✅ Maintenance quotidienne/hebdomadaire
✅ Gestion des utilisateurs (bloquer/débloquer)
✅ Personnalisation rapide (numéro, tarifs, messages)
✅ Aide d'urgence pour problèmes critiques
✅ Checklists de vérification
✅ Commandes pratiques prêtes à copier

# 🆘 Guide de Support Complet - Bot WhatsApp École IGA

---

## 📋 Table des Matières

1. [🚀 Déploiement sur Nouveau PC](#-déploiement-sur-nouveau-pc)
2. [💰 Analyse des Coûts](#-analyse-des-coûts)
3. [🔧 Résolution de Problèmes](#-résolution-de-problèmes)
4. [🛠️ Maintenance et Mise à Jour](#️-maintenance-et-mise-à-jour)
5. [📱 Gestion des Utilisateurs](#-gestion-des-utilisateurs)
6. [🎯 Personnalisation Rapide](#-personnalisation-rapide)
7. [📞 Aide d'Urgence](#-aide-durgence)

---

## 🚀 Déploiement sur Nouveau PC

### ⏱️ Temps estimé : 15-30 minutes

### 📋 **Étape 1 : Prérequis du Nouvel Ordinateur**

#### 1.1 Installation Node.js

```bash
# Télécharger Node.js 16+ depuis https://nodejs.org/
# Installer et vérifier :
node --version   # Doit afficher v16.0.0 ou plus
npm --version    # Doit afficher 8.0.0 ou plus
```

#### 1.2 Installation Git (optionnel)

```bash
# Télécharger depuis https://git-scm.com/
git --version
```

### 📁 **Étape 2 : Copie des Fichiers**

#### ✅ Fichiers OBLIGATOIRES à copier :

```
├── 📄 index.js                    ✅ OBLIGATOIRE
├── 📄 config.json                 ✅ OBLIGATOIRE
├── 📄 credentials.json            ✅ OBLIGATOIRE
├── 📄 package.json                ✅ OBLIGATOIRE
├── 📄 package-lock.json           ✅ OBLIGATOIRE
├── 📄 blacklist.json              ✅ Si créé
└── 📁 qr-generator/               🎯 Générateur QR
    ├── 📄 simple-qr.js
    └── 🖼️ qr-whatsapp-iga.png
```

#### ❌ Ne PAS copier :

```
❌ node_modules/          # À réinstaller
❌ auth_info_baileys/     # Session WhatsApp à refaire
```

### 🔧 **Étape 3 : Installation**

```bash
# 1. Créer le dossier
mkdir Bot-whatsApp
cd Bot-whatsApp

# 2. Coller tous les fichiers copiés

# 3. Installer les dépendances
npm install

# 4. Lancer le bot
node index.js
```

### 📱 **Étape 4 : Reconnexion WhatsApp**

1. **QR Code s'affiche** dans le terminal
2. **Ouvrir WhatsApp** → "Appareils connectés"
3. **"Connecter un appareil"**
4. **Scanner le QR code**

**✅ Connexion réussie :**

```
✅ Connexion WhatsApp réussie !
🤖 Bot École IGA opérationnel
```

---

## 💰 Analyse des Coûts

### ✅ **100% GRATUIT - Confirmation**

| Composant                | Coût | Limite Gratuite    |
| ------------------------ | ---- | ------------------ |
| **WhatsApp (Baileys)**   | 0€   | Messages illimités |
| **Google Sheets API**    | 0€   | 1M requêtes/mois   |
| **Node.js + Librairies** | 0€   | Open source        |
| **Stockage Google**      | 0€   | 15GB par compte    |
| **Hébergement local**    | 0€   | Votre PC           |

### 📊 **Capacité Réelle Gratuite :**

- 📱 **10,000+ étudiants/mois**
- 📊 **50,000+ messages/mois**
- 🗃️ **Données illimitées** dans Google Sheets
- ⚡ **Fonctionnement 24/7** (si PC allumé)

### 💸 **Seuls "coûts" optionnels :**

- ⚡ **Électricité** : ~2€/mois (PC allumé)
- ☁️ **VPS Cloud** : 3-5€/mois (optionnel pour 24/7)

**🎯 Budget École IGA : 0€/mois** ✅

---

## 🔧 Résolution de Problèmes

### ❌ **Erreur "Cannot find module"**

```bash
# Solution 1 : Réinstaller
rm -rf node_modules package-lock.json
npm install

# Solution 2 : Vérifier Node.js
node --version  # Doit être 16+
```

### ❌ **Erreur Google Sheets**

```bash
# Vérifications :
1. credentials.json est-il correct ?
2. Spreadsheet partagé avec service account ?
3. ID spreadsheet correct dans config.json ?
4. API Google Sheets activée ?
```

### ❌ **QR Code WhatsApp ne marche pas**

```bash
# Solutions :
1. Supprimer : rm -rf auth_info_baileys
2. Relancer : node index.js
3. Scanner nouveau QR code
4. Vérifier connexion internet
```

### ❌ **Bot ne répond pas**

```bash
# Diagnostic :
1. Vérifier logs dans terminal
2. Tester avec autre numéro
3. Redémarrer : Ctrl+C puis node index.js
4. Vérifier session WhatsApp active
```

### ❌ **Utilisateurs mélangés**

```bash
# Déjà corrigé dans le code !
# Chaque utilisateur a son état séparé
# Vérifier userStates[phoneNumber] dans logs
```

---

## 🛠️ Maintenance et Mise à Jour

### 🔄 **Maintenance Quotidienne**

```bash
# Vérifier que le bot tourne :
ps aux | grep node

# Logs en temps réel :
tail -f bot.log
```

### 📊 **Maintenance Hebdomadaire**

- ✅ Vérifier Google Sheets fonctionne
- ✅ Tester QR code
- ✅ Nettoyer blacklist.json si nécessaire
- ✅ Sauvegarder credentials.json

### 🆕 **Mise à jour du projet**

```bash
# Sauvegarder avant :
cp credentials.json credentials.backup.json
cp config.json config.backup.json

# Mettre à jour :
npm update

# Tester après mise à jour
```

---

## 📱 Gestion des Utilisateurs

### 🚫 **Bloquer un utilisateur définitivement**

#### Option 1 : Via le bot (utilisateur tape "0")

- Utilisateur automatiquement ajouté à blacklist.json
- Ne peut plus utiliser le bot

#### Option 2 : Blocage manuel

```json
// Dans blacklist.json :
["+212123456789", "+212987654321"]
```

### ✅ **Débloquer un utilisateur**

```json
// Supprimer son numéro de blacklist.json :
[
  "+212987654321" // Garder seulement les autres
]
```

### 📊 **Voir les statistiques**

```bash
# Compter inscriptions Google Sheets
# Voir blacklist.json pour bloqués
# Logs pour activité quotidienne
```

---

## 🎯 Personnalisation Rapide

### 📱 **Changer le numéro WhatsApp**

**1. Dans `index.js` (ligne ~12) :**

```javascript
const BOT_PHONE_NUMBER = "+212VOTRE_NOUVEAU_NUMERO";
```

**2. Dans `qr-generator/simple-qr.js` (ligne ~5) :**

```javascript
const BOT_PHONE_NUMBER = "+212VOTRE_NOUVEAU_NUMERO";
```

**3. Regénérer QR code :**

```bash
cd qr-generator
node simple-qr.js
```

### 💰 **Modifier les tarifs**

**Dans `index.js`, chercher "Tarifs" :**

```javascript
'3': `💰 *FRAIS DE SCOLARITÉ*

🔹 *1ère et 2ème année :* 40 800 DHS/an
   • Frais d'inscription : 3 000 DHS/an
   • Frais de scolarité : 37 800 DHS/an

🔹 *3ème, 4ème et 5ème année :* 44 400 DHS/an
   • Frais d'inscription : 3 000 DHS/an
   • Frais de scolarité : 41 400 DHS/an
```

### 📝 **Modifier les messages**

**Message d'accueil :**

```javascript
// Dans index.js, section messages :
welcome: `Bonjour 👋 Bienvenue chez l'École IGA !
Je suis votre assistant IA...`;
```

### 📊 **Changer Google Sheets**

**1. Créer nouveau spreadsheet**
**2. Partager avec service account email**  
**3. Copier nouvel ID dans `config.json` :**

```json
{
  "googleSheets": {
    "spreadsheetId": "NOUVEL_ID_ICI",
    "range": "A:G"
  }
}
```

---

## 📞 Aide d'Urgence

### 🆘 **Bot planté - Redémarrage rapide**

```bash
# 1. Arrêter bot :
Ctrl + C

# 2. Relancer :
node index.js

# 3. Si erreur :
rm -rf auth_info_baileys
node index.js
# Scanner nouveau QR code
```

### 🚨 **Google Sheets ne marche plus**

```bash
# Vérifications urgentes :
1. Internet fonctionne ?
2. credentials.json existe ?
3. Spreadsheet pas supprimé ?
4. Service account pas désactivé ?

# Solution rapide :
# Recréer credentials.json depuis Google Cloud
```

### 🔥 **Utilisateurs se plaignent**

```bash
# Diagnostic rapide :
1. Bot répond-il à votre test ?
2. QR code fonctionne ?
3. Erreurs dans terminal ?
4. Session WhatsApp active ?

# Test rapide :
# Envoyer "test" au bot depuis autre numéro
```

### ⚡ **QR Code cassé**

```bash
# Régénération express :
cd qr-generator
node simple-qr.js
# Nouveau QR code créé en 5 secondes
```

---

## 📋 Checklist de Vérification Rapide

### ✅ **Avant de partir en weekend :**

- [ ] Bot répond aux messages test
- [ ] Google Sheets enregistre bien
- [ ] QR code fonctionne
- [ ] Pas d'erreurs dans logs
- [ ] PC ne va pas s'éteindre

### ✅ **Après modification :**

- [ ] Bot redémarré sans erreur
- [ ] Test inscription complète
- [ ] Vérification Google Sheets
- [ ] QR code regénéré si nécessaire
- [ ] Sauvegarde config faite

### ✅ **Installation sur nouveau PC :**

- [ ] Node.js installé
- [ ] Tous fichiers copiés
- [ ] `npm install` réussi
- [ ] WhatsApp connecté
- [ ] Test complet fonctionnel

---

## 🎓 Contacts École IGA

- **📱 WhatsApp Bot :** +212688292266
- **📧 Email :** contact@ecole-iga.ma
- **🌐 Site :** iga.ac.ma
- **📍 Adresse :** Casablanca, Maroc

---

## 🔧 Commandes Pratiques

### **Démarrage rapide :**

```bash
cd Bot-whatsApp
node index.js
```

### **Régénération QR :**

```bash
cd qr-generator
node simple-qr.js
```

### **Réinstallation express :**

```bash
rm -rf node_modules
npm install
node index.js
```

### **Sauvegarde config :**

```bash
cp credentials.json backup/
cp config.json backup/
cp blacklist.json backup/
```

---

**📅 Document créé le 28 juillet 2025**  
**🔄 Dernière mise à jour : Version 1.0**  
**🎯 Support pour : École IGA WhatsApp Bot**

---

**🎉 Avec ce guide, vous pouvez gérer le bot en toute autonomie !**

# 🧹 Guide : Vider les données enregistrées du Bot WhatsApp

## 1️⃣ Vider les feedbacks utilisateurs

- Ouvre le fichier `feedbacks.json`
- Remplace tout le contenu par :

```json
[]
```

---

## 2️⃣ Vider les messages destinés au responsable

- Ouvre le fichier `messages-responsable.json`
- Remplace tout le contenu par :

```json
[]
```

---

## 3️⃣ Réinitialiser la session WhatsApp (QR code)

- Supprime le dossier `auth_info_baileys` :
  - Ouvre PowerShell ou l’Invite de commandes
  - Tape :
    ```powershell
    Remove-Item -Recurse -Force d:\Bot-whatsApp\auth_info_baileys
    ```
  - Confirme la suppression si demandé

---

## 4️⃣ Redémarrer le bot et générer un nouveau QR code

- Dans le terminal :
  ```powershell
  cd d:\Bot-whatsApp
  node index.js
  ```
- Scanne le nouveau QR code avec le téléphone WhatsApp du responsable

---

## ✅ Résultat

- Toutes les données utilisateurs et messages sont vidées
- Le bot est prêt pour une nouvelle session et de nouveaux utilisateurs
