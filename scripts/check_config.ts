const Constants = require('expo-constants');

console.log('=== EAS BUILD CONFIG CHECK ===');
console.log('Project ID:', Constants.expoConfig?.slug);
console.log('All extra config:', JSON.stringify(Constants.expoConfig?.extra, null, 2));
console.log('Supabase URL exists:', !!Constants.expoConfig?.extra?.supabaseUrl);
console.log('Supabase Key exists:', !!Constants.expoConfig?.extra?.supabaseAnonKey);

if (!Constants.expoConfig?.extra?.supabaseUrl) {
    console.error('❌ ERROR: supabaseUrl is missing!');
    process.exit(1);
}