# Générateur de QR Code WhatsApp

Ce dossier contient les outils pour générer des QR codes WhatsApp pour l'École IGA.

## Utilisation

```bash
cd qr-generator
node simple-qr.js
```

## Modification du numéro

Pour changer le numéro WhatsApp, modifiez la variable `phoneNumber` dans le fichier `simple-qr.js` :

```javascript
const phoneNumber = "212625354089"; // Remplacez par votre numéro
```

## Fichiers générés

Les QR codes sont sauvegardés dans le dossier `output/` :

- `qr-contact.png` - Contact direct
- `qr-inscription.png` - Message d'inscription
- `qr-information.png` - Demande d'informations

## Format du numéro

Le numéro doit être au format international sans le signe '+' :

- ✅ `212625354089` (Maroc)
- ❌ `+212625354089`
- ❌ `0625354089`
