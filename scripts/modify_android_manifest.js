#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
    const manifestFile = path.join(platformRoot, 'app/src/main/AndroidManifest.xml');
    const configDir = path.join(platformRoot, 'app/src/main/res/xml');
    const configFile = path.join(configDir, 'network_security_config.xml');

    if (fs.existsSync(manifestFile)) {
        // Modifier le AndroidManifest.xml
        let manifestContent = fs.readFileSync(manifestFile, 'utf8');
        if (!manifestContent.includes('android:networkSecurityConfig="@xml/network_security_config"')) {
            manifestContent = manifestContent.replace(
                '<application',
                '<application android:networkSecurityConfig="@xml/network_security_config"'
            );
            fs.writeFileSync(manifestFile, manifestContent, 'utf8');
            console.log('AndroidManifest.xml modifié.');
        }

        // Créer le dossier xml s'il n'existe pas
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir);
        }

        // Ajouter le fichier network_security_config.xml
        const networkSecurityConfigContent = `<?xml version="1.0" encoding="utf-8"?><network-security-config><domain-config cleartextTrafficPermitted="true"><domain includeSubdomains="true">m.pasturecoachnz.co.nz</domain><domain includeSubdomains="true">pasturecoachnz.co.nz</domain></domain-config></network-security-config>`;
        fs.writeFileSync(configFile, networkSecurityConfigContent, 'utf8');
        console.log('network_security_config.xml ajouté.');
    }
};
