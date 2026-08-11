#!/bin/bash
# sync-schemas.sh
# Script untuk menyinkronkan semua schema.json dari src/ ke dist/
# Jalankan setiap kali ada perubahan schema di Strapi

STRAPI_DIR="/home/biezz/Project/Website/new-agora-acta-with-strapi/AGORAACTA_WEBSITE/strapi-cms"

echo "🔄 Syncing schema files from src/ to dist/..."

# Temukan semua schema.json di src/api dan copy ke dist/src/api
find "$STRAPI_DIR/src/api" -name "schema.json" | while read src_file; do
  # Buat path tujuan dengan mengganti src/ dengan dist/src/
  dst_file="${src_file/\/src\//\/dist\/src\/}"
  dst_dir=$(dirname "$dst_file")
  
  mkdir -p "$dst_dir"
  cp "$src_file" "$dst_file"
  echo "  ✅ $(basename $(dirname $(dirname $src_file)))/$(basename $src_file)"
done

echo ""
echo "✅ Schema sync complete!"
echo ""
echo "🔄 Restarting Strapi to apply changes..."
pm2 restart 2 --update-env

echo ""
echo "⏳ Waiting for Strapi to boot..."
sleep 10

echo ""
echo "🗑️  Clearing content-manager UI cache from database..."
node -e "
const m=require('$STRAPI_DIR/node_modules/mysql2/promise');
async function r(){
  const c=await m.createConnection({
    host: process.env.DATABASE_HOST || '192.168.101.19',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'strapi-osis-agoraacta'
  });
  const [del]=await c.execute('DELETE FROM strapi_core_store_settings WHERE \`key\` LIKE \"%content_manager_configuration%\"');
  console.log('  Cleared', del.affectedRows, 'content-manager config rows from DB');
  await c.end();
}
r().catch(e=>console.error('DB error:', e.message));
" 2>&1

echo ""
echo "🔄 Final restart to pick up fresh config..."
pm2 restart 2 --update-env
echo ""
echo "✅ All done! Refresh your Strapi Admin browser tab (Ctrl+Shift+R)"
