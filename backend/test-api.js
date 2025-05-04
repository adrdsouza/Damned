const http = require('http');

// Get the publishable API key from environment
const API_KEY = 'pk_4a68e1bd85e72212ebbe8364d329891e7bdabcc921912541f37078fcfe197bfe'; // From CLAUDE.md

// Options for the API request
const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/store/payment-providers?region_id=reg_01JRHVWY8KXADW4FW7QHXATGFD',
  method: 'GET',
  headers: {
    'x-publishable-api-key': API_KEY
  }
};

http.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response status code:', res.statusCode);
    try {
      const parsedData = JSON.parse(data);
      console.log('Payment providers response:', JSON.stringify(parsedData, null, 2));
      
      // Count payment providers
      if (parsedData && parsedData.payment_providers) {
        console.log('Number of payment providers:', parsedData.payment_providers.length);
        console.log('Payment provider IDs:', parsedData.payment_providers.map(p => p.id).join(', '));
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error making request:', err.message);
});

// Also check if the NMI plugin is registered in the DB
const { exec } = require('child_process');
exec("cd /root/damneddesigns && sudo -u postgres psql -d medusa-medusaapp -c \"SELECT * FROM payment_provider WHERE id = 'pp_nmi_nmi';\"", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log('NMI plugin in database:');
  console.log(stdout);
});

// Also check region payment provider association
exec("cd /root/damneddesigns && sudo -u postgres psql -d medusa-medusaapp -c \"SELECT * FROM region_payment_provider WHERE payment_provider_id = 'pp_nmi_nmi';\"", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log('NMI region association:');
  console.log(stdout);
});