#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(import.meta.dir, '..');
const BACKUP_DIR = path.join(rootDir, '.package-backups');

function restorePackages(): void {
    if (!fs.existsSync(BACKUP_DIR)) {
        console.log('ℹ️  No backup directory found. Nothing to restore.');
        return;
    }
    
    console.log('🔄 Restoring original package.json files...\n');
    
    let restoredCount = 0;
    
    function restoreFiles(dir: string, baseBackupPath: string = BACKUP_DIR): void {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const backupPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                restoreFiles(backupPath, baseBackupPath);
            } else if (entry.name === 'package.json') {
                const relativePath = path.relative(baseBackupPath, backupPath);
                const originalPath = path.join(rootDir, relativePath);
                
                if (fs.existsSync(originalPath)) {
                    fs.copyFileSync(backupPath, originalPath);
                    console.log(`  ✓ Restored ${relativePath}`);
                    restoredCount++;
                }
            }
        }
    }
    
    restoreFiles(BACKUP_DIR);
    
    console.log(`\n✅ Restored ${restoredCount} package.json files`);
}

function cleanupBackups(): void {
    if (fs.existsSync(BACKUP_DIR)) {
        fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
        console.log(`🧹 Cleaned up backup directory`);
    }
}

function main(): void {
    const args = process.argv.slice(2);
    const shouldCleanup = args.includes('--cleanup');
    
    try {
        restorePackages();
        
        if (shouldCleanup) {
            cleanupBackups();
        } else {
            console.log('\nℹ️  Run with --cleanup flag to remove backup directory');
        }
    } catch (error) {
        console.error('❌ Error restoring packages:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();