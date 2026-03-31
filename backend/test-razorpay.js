require('dotenv').config();
const Razorpay = require('razorpay');

async function testRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : null;
  const key_secret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : null;

  console.log('Testing with:');
  console.log('ID:', key_id);
  console.log('Secret (hidden):', key_secret ? (key_secret.substring(0, 4) + '...') : 'Missing');

  if (!key_id || !key_secret) {
    console.log('❌ Error: Missing Key ID or Secret in .env');
    return;
  }

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    console.log('Razorpay instance created.');

    if (!razorpay.orders) {
      console.log('❌ Razorpay orders module not found. Check version.');
      return;
    }

    const order = await razorpay.orders.create({
      amount: 100,
      currency: 'INR',
      receipt: 'test_receipt',
    });
    console.log('✅ Success! Order Created:', order.id);
  } catch (err) {
    console.error('❌ Razorpay Test Failed:', err.message);
    if (err.error && err.error.description) {
        console.error('Description:', err.error.description);
    }
  }
}

testRazorpay();
