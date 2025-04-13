'use client';

import { handleCodeLogin } from '@/actions/auth';
import { Button } from './ui/button';

//Geminisettiä vähä fixailtuna
export function LoginComponent() {
  return (
    <form
      action={handleCodeLogin}
      className="p-4 border rounded shadow-md max-w-sm mx-auto mt-10"
    >
      <h2 className="text-xl font-semibold mb-4">Login with Code</h2>
      <label htmlFor="code" className="block mb-1 font-medium">
        Enter your login code:
      </label>
      <input
        type="text"
        id="code"
        name="code" // Name must match the key expected in the server action (formData.get('code'))
        required
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-describedby="code-error"
      />

      <Button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600"
      >
        Login with Code
      </Button>
    </form>
  );
}
