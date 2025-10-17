import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, onSnapshot 
} from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';
import { 
    Diamond, CheckCircle, Loader2, Mail, Phone, Home 
} from 'lucide-react';

// --- 1. FIREBASE SETUP & CONTEXT ---
// Global variables provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Context for Authentication and Profile
const AuthContext = createContext({
    user: null,
    profile: null,
    isAuthReady: false,
    userId: null,
});

const useAuth = () => useContext(AuthContext);

// 2. AUTH PROVIDER (Replacing AuthContext.tsx)
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState(null);

    // 2.1. Initial Authentication
    useEffect(() => {
        const authenticate = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase Auth Error:", error);
            }
        };
        authenticate();
    }, []);

    // 2.2. Auth State and Profile Listener
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            const currentUserId = currentUser ? currentUser.uid : crypto.randomUUID();
            setUserId(currentUserId);
            setIsAuthReady(true);
        });

        return () => unsubscribeAuth();
    }, []);

    // 2.3. Profile Data Listener (Tier, Email, etc.)
    useEffect(() => {
        if (!isAuthReady || !user) return;
        
        // Private Data path for user profiles: /artifacts/{appId}/users/{userId}/profile/data
        const profilePath = `artifacts/${appId}/users/${user.uid}/profile/data`;
        const profileDocRef = doc(db, profilePath);

        // Fetch profile data and listen for real-time changes
        const unsubscribeProfile = onSnapshot(profileDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                // Initialize profile if it doesn't exist
                const initialProfile = {
                    email: user.email || 'N/A',
                    tier: 'free',
                    id: user.uid,
                };
                setDoc(profileDocRef, initialProfile, { merge: true })
                    .then(() => setProfile(initialProfile))
                    .catch(e => console.error("Error creating initial profile:", e));
            }
        }, (error) => {
            console.error("Profile Snapshot Error:", error);
            toast.error("Failed to load user profile.");
        });

        return () => unsubscribeProfile();
    }, [isAuthReady, user]);

    const value = { user, profile, isAuthReady, userId };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 3. COMPONENTS (Replacing UpgradeModal.tsx and ErrorBoundary.tsx) ---

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
                    <h1 className="text-3xl font-bold text-red-700 mb-4">
                        Application Error
                    </h1>
                    <p className="text-lg text-red-600 mb-6">
                        Something went wrong. Please refresh the page.
                    </p>
                    <pre className="p-4 bg-red-100 text-red-900 rounded-lg max-w-lg overflow-auto text-sm">
                        {this.state.error && this.state.error.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// UpgradeModal Component
const UpgradeModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="font-bold text-2xl text-primary mb-3">Upgrade Required</h3>
                <p className="text-gray-600 mb-4">
                    This feature is available to **Premium** and **Gold** users only. Upgrade your tier to unlock full access!
                </p>
                
                {/* Admin Contact Info */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm border border-gray-200">
                    <p className="font-semibold mb-1 text-gray-700">Need immediate assistance?</p>
                    <div className='flex items-center gap-1 text-gray-600'>
                        <Mail className="w-4 h-4 text-primary" />
                        <a href="mailto:knsley@gmail.com" className="link link-hover text-sm text-primary font-medium">knsley@gmail.com</a>
                    </div>
                    <div className='flex items-center gap-1 text-gray-600'>
                        <Phone className="w-4 h-4 text-primary" />
                        <a href="tel:+233243266618" className="link link-hover text-sm text-primary font-medium">+233 24 326 6618</a>
                    </div>
                </div>
                
                <div className="mt-6">
                    <button 
                        className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-primary-dark transition-colors"
                        onClick={onClose}
                    >
                        Close & View Plans
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- 4. UPGRADE PAGE (Replacing src/pages/Upgrade.tsx) ---

// Define the upgrade plans
const plans = [
    { name: 'Premium', tier: 'premium', price: 'GHC 50/month', description: 'Access more listings and upload larger media files.' },
    { name: 'Gold', tier: 'gold', price: 'GHC 150/month', description: 'Unlock unlimited access, priority support, and premium visibility.' },
];

const UpgradePage = ({ onNavigate }) => {
    const { user, profile, isAuthReady, userId } = useAuth();
    const [loadingTier, setLoadingTier] = useState(null);
    const currentTier = profile?.tier || 'free';

    const handleUpgrade = useCallback(async (newTier) => {
        if (!user || !isAuthReady) return toast.error('Authentication is not ready. Please wait.');
        
        setLoadingTier(newTier);

        try {
            // MOCK: In a real app, successful payment would precede this DB update.
            // Private Data path: /artifacts/{appId}/users/{userId}/profile/data
            const profilePath = `artifacts/${appId}/users/${user.uid}/profile/data`;
            const profileDocRef = doc(db, profilePath);

            // Update only the tier field
            await setDoc(profileDocRef, { tier: newTier }, { merge: true });
            
            toast.success(`Successfully upgraded to ${newTier.toUpperCase()}! Your profile will update shortly.`);

        } catch (error) {
            console.error('Firestore Upgrade error:', error);
            toast.error(`Upgrade failed: ${error.message || 'Unknown error'}`);
        } finally {
            setLoadingTier(null);
        }
    }, [user, isAuthReady]);

    // Show loading state while profile loads
    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-3 text-gray-600">Loading user data...</p>
            </div>
        );
    }
    
    // User ID Display
    const displayUserId = user ? user.uid : userId;
    
    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Upgrade Your Account Tier</h1>
            <p className="text-gray-500 mb-8">Boost your experience with Premium or Gold features.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mb-8 shadow-sm flex justify-between items-center flex-wrap">
                <div>
                    <p className="font-bold">Your current tier is: 
                        <span className={`ml-2 px-3 py-1 text-sm font-extrabold rounded-full ${currentTier === 'gold' ? 'bg-yellow-100 text-yellow-800' : currentTier === 'premium' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-700'}`}>
                            {currentTier.toUpperCase()}
                        </span>
                    </p>
                    <p className="text-xs mt-1 text-blue-700">
                        User ID: {displayUserId}
                    </p>
                </div>
                <button 
                    onClick={() => onNavigate('home')}
                    className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center text-sm"
                >
                    <Home className="w-4 h-4 mr-1" /> Back to Home
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <div 
                        key={plan.tier} 
                        className={`
                            bg-white rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02]
                            ${currentTier === plan.tier 
                                ? 'border-4 border-primary shadow-2xl ring-4 ring-primary-100' 
                                : 'border border-gray-200 shadow-xl'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-3xl font-bold ${currentTier === plan.tier ? 'text-primary' : 'text-gray-800'}`}>
                                {plan.name}
                            </h2>
                            {plan.tier === 'gold' && <Diamond className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
                            {plan.tier === 'premium' && <CheckCircle className="w-6 h-6 text-indigo-500" />}
                            {currentTier === plan.tier && (
                                <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-full shadow-md">
                                    CURRENT
                                </span>
                            )}
                        </div>
                        
                        <p className="text-5xl font-extrabold my-4 text-gray-900">
                            {plan.price}
                        </p>
                        <p className="text-gray-600 mb-6 border-b pb-4">{plan.description}</p>
                        
                        <div className="card-actions justify-end mt-4">
                            {currentTier === plan.tier ? (
                                <button className="w-full py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg cursor-not-allowed">
                                    Already Subscribed
                                </button>
                            ) : (
                                <button 
                                    className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                                    onClick={() => handleUpgrade(plan.tier)}
                                    disabled={loadingTier !== null}
                                >
                                    {loadingTier === plan.tier ? (
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Processing Payment...
                                        </div>
                                    ) : `Select ${plan.name}`}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <p className="text-sm text-center text-gray-500 mt-12">
                *This is a functional demo using Firestore for state management. Actual financial transactions are mocked.
            </p>

            {/* Contact Support Section */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Dedicated Support</h2>
                <p className="text-gray-600 mb-4">
                    For corporate subscriptions, billing queries, or technical assistance, please contact our administrator directly:
                </p>
                <div className="flex flex-col sm:flex-row sm:gap-8 gap-2 text-gray-700">
                    <p className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">Email:</span> 
                        <a href="mailto:knsley@gmail.com" className="link font-medium hover:text-primary">knsley@gmail.com</a>
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">Phone:</span> 
                        <a href="tel:+233243266618" className="link font-medium hover:text-primary">+233 24 326 6618</a>
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- 5. MAIN APP (Replacing src/main.tsx and App.tsx) ---

// Component for a Protected Feature (e.g., viewing a listing)
const ProtectedFeature = ({ onOpenModal }) => {
    const { profile, isAuthReady } = useAuth();
    const currentTier = profile?.tier || 'free';
    
    // Check if the user has the required tier
    const isAllowed = currentTier === 'premium' || currentTier === 'gold';
    
    // Show a sample feature
    return (
        <div className="p-8 max-w-xl mx-auto bg-white shadow-xl rounded-xl mt-10">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Exclusive Content Preview</h2>
            <p className="text-gray-600 mb-6">This section contains high-resolution media and advanced market analysis.</p>
            
            <div className={`p-6 rounded-lg ${isAllowed ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} border-dashed border-2`}>
                <p className="text-xl font-semibold mb-3">
                    {isAllowed ? 'Welcome, Premium User!' : 'Feature Locked'}
                </p>
                
                {isAllowed ? (
                    <div className="text-green-700">
                        <p>Your current tier **({currentTier.toUpperCase()})** grants you full access.</p>
                        <p className="mt-2 text-sm">Example exclusive content: *Detailed quarterly growth forecast.*</p>
                    </div>
                ) : (
                    <div className="text-red-700">
                        <p>This content requires a **Premium** or **Gold** subscription.</p>
                        <button 
                            onClick={onOpenModal} 
                            className="mt-3 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                        >
                            Upgrade Now to Unlock
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const App = () => {
    // Simple state-based routing
    const [page, setPage] = useState('home');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isAuthReady } = useAuth();

    // The component that will be rendered based on the route
    const renderPage = () => {
        switch (page) {
            case 'upgrade':
                return <UpgradePage onNavigate={setPage} />;
            case 'home':
            default:
                return <ProtectedFeature onOpenModal={() => {
                    setIsModalVisible(true);
                    setPage('upgrade');
                }} />;
        }
    };
    
    // Main UI loading state
    if (!isAuthReady) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="ml-4 text-lg text-gray-600">Initializing application...</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Toaster />
            <div className="p-4 bg-white shadow-lg flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-primary">Service Portal</h1>
                <div className="space-x-4">
                    <button 
                        onClick={() => setPage('home')}
                        className={`text-gray-600 hover:text-primary transition-colors font-medium ${page === 'home' ? 'text-primary border-b-2 border-primary' : ''}`}
                    >
                        Home (Feature)
                    </button>
                    <button 
                        onClick={() => setPage('upgrade')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${page === 'upgrade' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        Upgrade Tier
                    </button>
                </div>
            </div>
            
            <main className="container mx-auto">
                {renderPage()}
            </main>

            <UpgradeModal 
                isVisible={isModalVisible} 
                onClose={() => setIsModalVisible(false)} 
            />
        </div>
    );
};

// Application entry point
export default () => (
    <ErrorBoundary>
        <AuthProvider>
            <App />
        </AuthProvider>
    </ErrorBoundary>
);

