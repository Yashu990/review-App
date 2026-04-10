
const Business = require('./models/Business');

async function updateCredits() {
  try {
    const business = await Business.findOne({ where: { email: 'desdcv@gmail.com' } });
    if (business) {
      await business.update({ credits: 500 });
      console.log('SUCCESS: Credits updated to 500 for desdcv@gmail.com');
    } else {
      console.log('ERROR: Business not found for email desdcv@gmail.com');
    }
    process.exit(0);
  } catch (err) {
    console.error('DATABASE ERROR:', err);
    process.exit(1);
  }
}

updateCredits();
