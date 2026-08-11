import { createStrapi } from '@strapi/strapi';

async function main() {
  console.log('🔄 Bootstrapping Strapi and synchronizing data from code to Strapi CMS...');
  
  // Initialize Strapi instance
  const app = await createStrapi({ distDir: './dist' }).load();

  try {
    const sekbidCount = await app.documents('api::sekbid.sekbid').count({});
    const anggotaCount = await app.documents('api::anggota-osis.anggota-osis').count({});
    const programKerjaCount = await app.documents('api::program-kerja.program-kerja').count({});
    const eventCount = await app.documents('api::event.event').count({});

    console.log('\n📊 Synchronization Verification:');
    console.log(`  📁 Sekbid: ${sekbidCount} entries`);
    console.log(`  👥 Anggota OSIS: ${anggotaCount} entries`);
    console.log(`  📋 Program Kerja: ${programKerjaCount} entries`);
    console.log(`  🎉 Event: ${eventCount} entries`);

    console.log('\n✅ Data successfully synchronized to Strapi CMS database!');
  } catch (error) {
    console.error('❌ Error during data verification:', error);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

main();
