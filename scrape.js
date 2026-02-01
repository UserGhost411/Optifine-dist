const https = require('https');
const fs = require('fs');

const url = 'https://optifine.net/downloads';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const pattern = /OptiFine_([0-9\.]+)_HD_U_([A-Z0-9]+)\.jar/g;
        const matches = [...data.matchAll(pattern)];
        const results = matches.map(m => ({
            full_name: m[0],
            mc_version: m[1],
            patch_version: m[2],
            filename: m[0],
            download_url: `https://optifine.net/adloadx?f=${m[0]}` 
        }));
        const unique = [...new Map(results.map(item => [item.filename, item])).values()];
        
        fs.writeFileSync('optifine.json', JSON.stringify(unique, null, 2));
        console.log(`Parsed ${unique.length} versions.`);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
