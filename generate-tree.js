const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'contents');
const outputFile = path.join(__dirname, 'tree.json');

// Sadece .md ve .html dosyalarını recursive olarak toplayan fonksiyon
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            // Sadece .md ve .html uzantılarını kabul et
            if (file.endsWith('.md') || file.endsWith('.html')) {
                // GitHub Pages'in beklediği bağıntılı yolu (relative path) hesapla
                const relativePath = path.relative(__dirname, fullPath).replace(/\\/g, '/');
                results.push({
                    name: file,
                    path: relativePath
                });
            }
        }
    });
    return results;
}

try {
    if (fs.existsSync(targetDir)) {
        const files = walk(targetDir);
        fs.writeFileSync(outputFile, JSON.stringify(files, null, 2), 'utf-8');
        console.log(`✅ tree.json başarıyla oluşturuldu! Toplam dosya: ${files.length}`);
    } else {
        console.error('❌ "contents" klasörü bulunamadı!');
        process.exit(1);
    }
} catch (err) {
    console.error('❌ Hata oluştu:', err);
    process.exit(1);
}