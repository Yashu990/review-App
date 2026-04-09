const { Business } = require('./models');
const sequelize = require('./config/database');

async function simulateExpiry(email) {
  if (!email) {
    console.error('Please provide an email: node simulate_expiry.js test@example.com');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    const biz = await Business.findOne({ where: { email: email.toLowerCase() } });
    
    if (!biz) {
      console.error('Business not found for email:', email);
      return;
    }

    // Set createdAt to 10 days ago to trigger expiry (7 day limit)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    biz.createdAt = tenDaysAgo;
    await biz.save();
    
    console.log('--- TEST CASE SUCCESS ---');
    console.log(`Business: ${biz.name}`);
    console.log(`Email: ${biz.email}`);
    console.log(`New CreatedAt: ${biz.createdAt}`);
    console.log('Result: The trial is now EXPIRED. Open your mobile app to see the LOCK icon 🔒.');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

const targetEmail = process.argv[2];
simulateExpiry(targetEmail);
