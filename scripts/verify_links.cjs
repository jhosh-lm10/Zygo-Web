const fs = require('fs');
const path = require('path');

// Recursive function to find all files in a directory
function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

// Main verification logic
async function verifyLinks() {
    const srcDir = path.join(__dirname, '../src');
    const publicDir = path.join(__dirname, '../public');

    const files = getFiles(srcDir).filter(f => f.endsWith('.astro') || f.endsWith('.md') || f.endsWith('.ts') || f.endsWith('.tsx'));

    const imgRegex = /["'](\/img\/[^"']+)["']/g;
    const brokenLinks = [];
    const validLinks = new Set();
    const checkedLinks = new Set();

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            const link = match[1];
            if (checkedLinks.has(link)) continue;
            checkedLinks.add(link);

            // Construct local path. /img/foo.webp -> public/img/foo.webp
            // links starting with /img/ map to public/img/
            const linkPath = link.startsWith('/') ? link.substring(1) : link; // img/foo.webp
            const fullPath = path.join(publicDir, linkPath.replace(/^img\//, 'img/')); // ensure mapping to public/img

            // Simple check: does public/link exist?
            // Actually, standard mapping is public/img/... if link is /img/...
            const fsPath = path.join(path.dirname(publicDir), link.startsWith('/') ? 'public' + link : 'public/' + link);

            if (!fs.existsSync(fsPath)) {
                // Try decoding URI component (for spaces, etc but we want to catch if code doesn't match file)
                // If code has %20 and file has space, existence check might fail or succeed depending.
                // let's check exact match first.

                brokenLinks.push({
                    file: path.relative(process.cwd(), file),
                    link: link,
                    expectedPath: path.relative(process.cwd(), fsPath)
                });
            } else {
                validLinks.add(link);
            }
        }
    }

    if (brokenLinks.length > 0) {
        console.log('❌ BROKEN LINKS FOUND:');
        brokenLinks.forEach(b => {
            console.log(`File: ${b.file}`);
            console.log(`  Link: ${b.link}`);
            console.log(`  Expected: ${b.expectedPath}`);
            console.log('---');
        });
    } else {
        console.log('✅ All image links verified successfully.');
    }

    console.log(`Checked ${checkedLinks.size} unique links.`);
}

verifyLinks();
