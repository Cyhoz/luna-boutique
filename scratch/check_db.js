const { createClient } = require('@supabase/supabase-js');

// Hardcoded for diagnostic purposes only
const supabaseUrl = 'https://fikylxviqzgtdcuxnelh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpa3lseHZpcXpndGRjdXhuZWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODExMDksImV4cCI6MjA5MzE1NzEwOX0.eugKRvDHJW5tuKRl5F4bC2gi-Gp9aTqNNkjMpXXsu8M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  console.log('--- Checking Database Content ---');
  
  const { data: products, error: pError, count: pCount } = await supabase
    .from('products')
    .select('*', { count: 'exact' });

  if (pError) {
    console.error('Error fetching products:', pError);
  } else {
    console.log('Total products in database:', pCount);
    if (products.length > 0) {
      console.log('Sample product:', {
        id: products[0].id,
        name: products[0].name,
        is_active: products[0].is_active
      });
    }
  }

  const { data: categories, error: cError, count: cCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact' });

  if (cError) {
    console.error('Error fetching categories:', cError);
  } else {
    console.log('Total categories in database:', cCount);
  }

  const { data: variants, error: vError, count: vCount } = await supabase
    .from('product_variants')
    .select('*', { count: 'exact' });

  if (vError) {
    console.error('Error fetching variants:', vError);
  } else {
    console.log('Total product variants in database:', vCount);
  }
}

checkProducts();
