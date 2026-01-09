import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const SOURCE_DIR = 'public/img-original';
const TARGET_DIR = 'public/img';

async function convertImages() {
    try {
        // Ensure dirs exist
        await fs.mkdir(TARGET_DIR, { recursive: true });

        // Read source directory
        const files = await fs.readdir(SOURCE_DIR);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

        console.log(`Found ${imageFiles.length} images to process in ${SOURCE_DIR}...`);

        for (const file of imageFiles) {
            const ext = path.extname(file);
            const name = path.basename(file, ext);
            const targetPath = path.join(TARGET_DIR, `${name}.webp`);
            const sourcePath = path.join(SOURCE_DIR, file);

            console.log(`Converting: ${file} -> ${name}.webp`);

            await sharp(sourcePath)
                .webp({ quality: 85, effort: 6 }) // High quality conversion
                .toFile(targetPath);
        }

        console.log('✅ Conversion complete!');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`❌ Error: Source directory '${SOURCE_DIR}' not found.`);
            console.error('Please create it and add your images there.');
        } else {
            console.error('Error converting images:', error);
        }
    }
}

convertImages();
