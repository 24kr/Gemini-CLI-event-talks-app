const fs = require('fs').promises;
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

const schedule = [
    { time: '10:00 AM', type: 'talk' },
    { time: '11:10 AM', type: 'talk' },
    { time: '12:20 PM', type: 'talk' },
    { time: '1:20 PM', type: 'break', title: 'Lunch Break (1 hour)' },
    { time: '2:20 PM', type: 'talk' },
    { time: '3:30 PM', type: 'talk' },
    { time: '4:40 PM', type: 'talk' }
];

async function build() {
    try {
        // Ensure dist directory exists
        await fs.mkdir(distDir, { recursive: true });

        // Read all source files
        const htmlTemplate = await fs.readFile(path.join(srcDir, 'index.html'), 'utf-8');
        const styles = await fs.readFile(path.join(srcDir, 'styles.css'), 'utf-8');
        const appJs = await fs.readFile(path.join(srcDir, 'app.js'), 'utf-8');
        const talksData = await fs.readFile(path.join(srcDir, 'data.json'), 'utf-8');

        // 1. Inject CSS
        const finalHtml = htmlTemplate.replace('<!--STYLES-->', `<style>${styles}</style>`);

        // 2. Inject data and scripts
        const scriptsToInject = `
<script>
    const talks = ${talksData};
    const schedule = ${JSON.stringify(schedule)};
</script>
<script>
    ${appJs}
</script>
        `;
        const finalHtmlWithScripts = finalHtml.replace('<!--SCRIPTS-->', scriptsToInject);

        // 3. Write the final file
        await fs.writeFile(path.join(distDir, 'index.html'), finalHtmlWithScripts);

        console.log('Build successful! Your serverless website is ready in dist/index.html');

    } catch (error) {
        console.error('Error during build process:', error);
    }
}

build();
