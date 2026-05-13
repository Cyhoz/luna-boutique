
import { MercadoPagoConfig, Preference } from 'mercadopago';
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testMP() {
  const token = process.env.MP_ACCESS_TOKEN;
  console.log('Token found:', token ? token.substring(0, 10) + '...' : 'NONE');
  
  if (!token) {
    console.error('Error: MP_ACCESS_TOKEN no encontrado en .env.local');
    return;
  }

  try {
    const client = new MercadoPagoConfig({ accessToken: token });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'test-123',
            title: 'Test Item',
            quantity: 1,
            unit_price: 1000,
            currency_id: 'CLP'
          }
        ],
        external_reference: 'test-order-123'
      }
    });

    console.log('Success! Preference ID:', result.id);
  } catch (error: any) {
    console.error('Failed to create preference:');
    console.error(JSON.stringify(error, null, 2));
  }
}

testMP();
