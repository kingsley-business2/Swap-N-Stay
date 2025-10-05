// verify-files.js
// Enforces and auto-repairs critical files before build

const fs = require('fs');
const path = require('path');

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
import { supabase } from '@/lib/supabase';

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
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
`,
  },
  {
    path: 'src/lib/supabase.ts',
    template: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`,
  },
];

let repaired = false;

for (const { path: filePath, template } of files) {
  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ ${filePath} missing — restoring from template`);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, template.trim());
    repaired = true;
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8').trim();
  if (content.length < 50 || !content.includes('export')) {
    console.warn(`⚠️ ${filePath} appears broken — restoring from template`);
    fs.writeFileSync(fullPath, template.trim());
    repaired = true;
    continue;
  }

  console.log(`✅ Verified: ${filePath}`);
}

if (repaired) {
  console.log('🔧 Critical files were repaired. Proceeding with build.');
} else {
  console.log('🎉 All critical files are valid.');
}
