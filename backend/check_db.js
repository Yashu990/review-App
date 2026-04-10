const Business = require('./models/Business');
const sequelize = require('./config/database');

async function checkCredits(name) {
  try {
    await sequelize.authenticate();
    const biz = await Business.findOne({ where: { name: name } });
    
    if (!biz) {
      console.log(`Business not found: ${name}`);
      // Try searching by part of the name
      const all = await Business.findAll({ attributes: ['name', 'credits', 'plan'] });
      console.log('All Businesses:', JSON.stringify(all, null, 2));
      return;
    }

    console.log('--- DB STATUS ---');
    console.log(`Business: ${biz.name}`);
    console.log(`Credits: ${biz.credits}`);
    console.log(`Plan: ${biz.plan}`);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

checkCredits('BRAIN HUB LIBRARY');
