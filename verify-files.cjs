const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const files = [
  {
    path: 'src/hooks/useAuth.ts',
    template: `import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error.message);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};`,
    hash: 'd3c2f1e', // update this after first run
  },
  {
    path: 'src/lib/supabase.ts',
    template: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`,
    hash: 'a9e1b3c', // update this after first run
  },
];

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 7);
}

for (const { path: relPath, template, hash: expected } of files) {
  const fullPath = path.resolve(relPath);
  const actual = fs.existsSync(fullPath)
    ? hash(fs.readFileSync(fullPath, 'utf8'))
    : 'missing';

  if (actual !== expected) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, template.trim());
    console.log(`🔁 Overwritten: ${relPath} (was ${actual}, expected ${expected})`);
  } else {
    console.log(`✅ Verified: ${relPath}`);
  }
}

// .env validation
const envPath = path.resolve('.env');
const requiredKeys = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
if (!fs.existsSync(envPath)) {
  throw new Error('❌ Missing .env file');
}
const envContent = fs.readFileSync(envPath, 'utf8');
for (const key of requiredKeys) {
  if (!envContent.includes(key)) {
    throw new Error(`❌ Missing ${key} in .env`);
  }
}
console.log('✅ .env file validated');


