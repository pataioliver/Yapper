import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const testDir = path.resolve('./tests');
const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

let passed = 0;
let failed = 0;

(async () => {
    for (const file of testFiles) {
        console.log(`\nRunning: ${file}`);
        await new Promise((resolve) => {
            exec(`node ./tests/${file}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(stdout);
                    console.error(stderr);
                    console.log(`❌ ${file} failed`);
                    failed++;
                } else {
                    console.log(stdout);
                    console.log(`✅ ${file} passed`);
                    passed++;
                }
                resolve();
            });
        });
    }
    console.log('\n--- Test Summary ---');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    process.exit(failed > 0 ? 1 : 0);
})();