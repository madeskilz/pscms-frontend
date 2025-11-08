#!/usr/bin/env node
/**
 * Export backend data to static JSON files for static hosting
 * Generates API response files that frontend can fetch without Node runtime
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
const { Model } = require('objection');

Model.knex(knex);

const OUTPUT_DIR = path.resolve(__dirname, '../../dist/static-api');

async function exportStatic() {
  console.log('[static-export] Starting static API export...');
  
  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'api'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'api/posts'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'api/settings'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'api/menus'), { recursive: true });

  try {
    // Export posts
    console.log('[static-export] Exporting posts...');
    const posts = await knex('posts')
      .where({ status: 'published', type: 'post' })
      .select('*')
      .orderBy('created_at', 'desc');
    
    const postsResponse = {
      data: posts,
      pagination: { page: 1, limit: 20, total: posts.length }
    };
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'api/posts/index.json'),
      JSON.stringify(postsResponse, null, 2)
    );

    // Export individual posts by slug
    for (const post of posts) {
      const postDir = path.join(OUTPUT_DIR, 'api/posts', post.slug);
      fs.mkdirSync(postDir, { recursive: true });
      fs.writeFileSync(
        path.join(postDir, 'index.json'),
        JSON.stringify({ data: post }, null, 2)
      );
    }

    // Export pages
    console.log('[static-export] Exporting pages...');
    const pages = await knex('posts')
      .where({ status: 'published', type: 'page' })
      .select('*');
    
    for (const page of pages) {
      const pageDir = path.join(OUTPUT_DIR, 'api/posts', page.slug);
      fs.mkdirSync(pageDir, { recursive: true });
      fs.writeFileSync(
        path.join(pageDir, 'index.json'),
        JSON.stringify({ data: page }, null, 2)
      );
    }

    // Export settings
    console.log('[static-export] Exporting settings...');
    const settings = await knex('settings').select('*');
    
    for (const setting of settings) {
      const settingDir = path.join(OUTPUT_DIR, 'api/settings', setting.key);
      fs.mkdirSync(settingDir, { recursive: true });
      let value = setting.value;
      try {
        value = JSON.parse(setting.value);
      } catch (e) {
        // Keep as string if not JSON
      }
      fs.writeFileSync(
        path.join(settingDir, 'index.json'),
        JSON.stringify({ key: setting.key, value }, null, 2)
      );
    }

    // Export menus
    console.log('[static-export] Exporting menus...');
    const menus = await knex('menus').select('*');
    
    for (const menu of menus) {
      const menuDir = path.join(OUTPUT_DIR, 'api/menus', menu.name);
      fs.mkdirSync(menuDir, { recursive: true });
      let items = [];
      try {
        items = JSON.parse(menu.items || '[]');
      } catch (e) {
        items = [];
      }
      fs.writeFileSync(
        path.join(menuDir, 'index.json'),
        JSON.stringify({ name: menu.name, items }, null, 2)
      );
    }

    // Create a static routes manifest
    console.log('[static-export] Creating routes manifest...');
    const manifest = {
      posts: posts.map(p => ({ slug: p.slug, title: p.title })),
      pages: pages.map(p => ({ slug: p.slug, title: p.title })),
      settings: settings.map(s => s.key),
      menus: menus.map(m => m.name),
      generatedAt: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'api/manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('[static-export] ✓ Static API export complete!');
    console.log(`[static-export] Files written to: ${OUTPUT_DIR}`);
    console.log(`[static-export] Total: ${posts.length} posts, ${pages.length} pages, ${settings.length} settings, ${menus.length} menus`);
    
  } catch (error) {
    console.error('[static-export] Export failed:', error);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

exportStatic();
