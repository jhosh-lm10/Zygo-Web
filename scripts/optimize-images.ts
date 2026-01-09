/**
 * Script para optimizar imágenes PNG a WebP
 * Ejecutar con: bun run scripts/optimize-images.ts
 */

import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, parse } from 'path';

const INPUT_DIR = './public/img';
const OUTPUT_DIR = './public/img-optimized';
const QUALITY = 80; // Calidad WebP (0-100)
const MAX_WIDTH = 1200; // Ancho máximo en px

async function optimizeImage(inputPath: string, outputPath: string): Promise<{ original: number; optimized: number }> {
    const originalStats = statSync(inputPath);
    const originalSize = originalStats.size;

    await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

    const optimizedStats = statSync(outputPath);
    const optimizedSize = optimizedStats.size;

    return { original: originalSize, optimized: optimizedSize };
}

async function main() {
    console.log('🖼️  Optimizador de Imágenes para Zygo\n');
    console.log(`📁 Input: ${INPUT_DIR}`);
    console.log(`📁 Output: ${OUTPUT_DIR}`);
    console.log(`🎯 Calidad: ${QUALITY}%`);
    console.log(`📐 Ancho máximo: ${MAX_WIDTH}px\n`);

    // Crear directorio de salida si no existe
    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = readdirSync(INPUT_DIR).filter(file =>
        /\.(png|jpg|jpeg)$/i.test(file)
    );

    console.log(`📷 Encontradas ${files.length} imágenes para optimizar\n`);

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const file of files) {
        const inputPath = join(INPUT_DIR, file);
        const { name } = parse(file);
        const outputPath = join(OUTPUT_DIR, `${name}.webp`);

        try {
            const { original, optimized } = await optimizeImage(inputPath, outputPath);
            totalOriginal += original;
            totalOptimized += optimized;

            const savings = ((original - optimized) / original * 100).toFixed(1);
            const originalMB = (original / 1024 / 1024).toFixed(2);
            const optimizedKB = (optimized / 1024).toFixed(0);

            console.log(`✅ ${file}`);
            console.log(`   ${originalMB} MB → ${optimizedKB} KB (${savings}% reducción)\n`);
        } catch (error) {
            console.log(`❌ Error con ${file}: ${error}\n`);
        }
    }

    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
    const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(2);
    const totalOptimizedMB = (totalOptimized / 1024 / 1024).toFixed(2);

    console.log('═'.repeat(50));
    console.log(`📊 RESUMEN:`);
    console.log(`   Original: ${totalOriginalMB} MB`);
    console.log(`   Optimizado: ${totalOptimizedMB} MB`);
    console.log(`   Ahorro total: ${totalSavings}%`);
    console.log('═'.repeat(50));
    console.log(`\n✨ Imágenes optimizadas guardadas en: ${OUTPUT_DIR}`);
    console.log(`\n📝 Próximo paso: Reemplaza las referencias de /img/ por /img-optimized/`);
    console.log(`   y cambia las extensiones de .png/.jpg a .webp en tu código.`);
}

main().catch(console.error);
