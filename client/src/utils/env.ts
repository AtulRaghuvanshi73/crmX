export const getEnvVariable = (key: string): string => {
  // For client-side code, we need to access the Next.js exposed variables
  const value = process.env[`NEXT_PUBLIC_${key}`];
  
  if (!value) {
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  
  return value;
};

export const BACKEND_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || 'http://localhost:8000';
