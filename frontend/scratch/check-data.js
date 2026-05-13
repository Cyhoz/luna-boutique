const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://fikylxviqzgtdcuxnelh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpa3lseHZpcXpndGRjdXhuZWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU4MTEwOSwiZXhwIjoyMDkzMTU3MTA5fQ.eU3twDZtwniTeh5B4xiZ9_OVeP3BxYtDlSKqX11gqwM'
)

async function checkData() {
  const { data: products, error } = await supabase.from('products').select('*')
  console.log('--- PRODUCTOS ---')
  console.log(products)
  if (error) console.error('Error fetching products:', error)

  const { data: profiles, error: pError } = await supabase.from('profiles').select('*')
  console.log('--- PERFILES ---')
  console.log(profiles)
  if (pError) console.error('Error fetching profiles:', pError)
}

checkData()
