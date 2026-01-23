const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = ['nuevo1.jpg', 'nuevo2.jpg', 'nuevo3.jpg'];
const dir = 'public/img';

(async () => {
    for (const file of files) {
        const input = path.join(dir, file);
        const output = path.join(dir, file.replace('.jpg', '.webp'));

        if (fs.existsSync(input)) {
            try {
                await sharp(input).webp().toFile(output);
                console.log(`Converted ${file} to WebP`);
            } catch (e) {
                console.error(`Error converting ${file}:`, e);
            }
        } else {
            console.log(`File not found: ${input}`);
        }
    }

    // og-image in public root
    const ogInput = 'public/og-image.jpg';
    const ogOutput = 'public/og-image.webp';
    if (fs.existsSync(ogInput)) {
        try {
            await sharp(ogInput).webp().toFile(ogOutput);
            console.log(`Converted og-image.jpg to WebP`);
        } catch (e) {
            console.error(`Error converting og-image.jpg:`, e);
        }
    } else {
        console.log(`File not found: ${ogInput}`);
    }
})();
