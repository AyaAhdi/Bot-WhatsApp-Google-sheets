// Générateur de QR Code simple pour WhatsApp
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Configuration
const phoneNumber = '212688292266'; // Votre numéro WhatsApp (format international sans +)
const message = 'Bonjour👋 Bienvenue chez l\'École IGA ! Je suis votre assistant dédié pour vous guider dans votre démarche d\'inscription.'; // Message par défaut

// Fonction pour générer un QR code WhatsApp
async function generateWhatsAppQR(phone, text = '', filename = 'qr-whatsapp') {
  try {
    // Créer l'URL WhatsApp
    const whatsappURL = `https://wa.me/${phone}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

    console.log('URL générée:', whatsappURL);

    // Chemin de sortie
    const outputPath = path.join(__dirname, 'output', `${filename}.png`);

    // Générer le QR code
    await qrcode.toFile(outputPath, whatsappURL, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    console.log(`QR Code généré avec succès: ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
  }
}

// Générer un QR code principal
async function generateMainQRCode() {
  console.log('Génération du QR code principal...\n');

  // QR principal avec le message par défaut
  await generateWhatsAppQR(phoneNumber, message, 'qr-principal');

  console.log('\nQR code principal généré dans le dossier output/');
}

// Exécuter si appelé directement
if (require.main === module) {
  generateMainQRCode();
}

module.exports = { generateWhatsAppQR, generateMainQRCode };
