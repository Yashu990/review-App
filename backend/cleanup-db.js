const sequelize = require('./config/database');
const Review = require('./models/Review');

async function cleanup() {
    try {
        console.log('--- Database Cleanup Started ---');
        await sequelize.authenticate();
        const reviews = await Review.findAll();
        
        let count = 0;
        for (const review of reviews) {
            const original = review.customerPhone;
            const cleaned = String(original).replace(/\D/g, '').substring(0, 10);
            
            if (original !== cleaned) {
                review.customerPhone = cleaned;
                await review.save();
                console.log(`Updated ID ${review.id}: ${original} -> ${cleaned}`);
                count++;
            }
        }
        
        console.log(`--- Cleanup Finished. ${count} reviews updated. ---`);
        process.exit(0);
    } catch (e) {
        console.error('Cleanup Error:', e);
        process.exit(1);
    }
}

cleanup();
