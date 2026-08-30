import { authService } from '../src/modules/auth/auth.service.js';

async function main() {
  try {
    const res = await authService.login({
      identifier: '01012345678',
      password: 'AdminPass123!',
    });
    console.log('✅ LOGIN TEST SUCCESSFUL:', res.user.name, res.accessToken.substring(0, 20));
    process.exit(0);
  } catch (err: any) {
    console.error('❌ LOGIN TEST FAILED:', err);
    process.exit(1);
  }
}

main();
