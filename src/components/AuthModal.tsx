import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User as UserIcon, Shield, Check, Award, AlertCircle, Key } from "lucide-react";
import { UserProfile } from "../types";
import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  user: UserProfile;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess, user }: AuthModalProps) {
  const [authView, setAuthView] = useState<"login" | "signup" | "forgot" | "profile">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customAvatar, setCustomAvatar] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync state if viewing profile
  useEffect(() => {
    if (isOpen) {
      if (user.isLoggedIn) {
        setAuthView("profile");
        setName(user.name);
        setCustomAvatar(user.avatar);
      } else {
        setAuthView("login");
        setName("");
        setEmail("");
        setPassword("");
        setErrorMsg("");
        setSuccessMsg("");
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Firebase Firestore User Profile synchronization
  const syncUserProfile = async (firebaseUser: any, defaultName?: string) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    try {
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          name: data.name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
          email: firebaseUser.email || "",
          avatar: data.avatar || firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          isLoggedIn: true,
          memberSince: data.memberSince || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          plan: (data.plan as any) || "Free"
        };
      } else {
        // Create new profile doc in Firestore
        const newProfile = {
          uid: firebaseUser.uid,
          name: defaultName || firebaseUser.displayName || firebaseUser.email.split("@")[0],
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          plan: "Free",
          memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
        };
        await setDoc(userDocRef, newProfile);
        return {
          name: newProfile.name,
          email: newProfile.email,
          avatar: newProfile.avatar,
          isLoggedIn: true,
          memberSince: newProfile.memberSince,
          plan: "Free" as const
        };
      }
    } catch (err: any) {
      console.warn("Firestore sync warning (standard rules might not be fully active yet):", err);
      // Local fallback if Firestore read fails
      return {
        name: firebaseUser.displayName || defaultName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        isLoggedIn: true,
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        plan: "Free" as const
      };
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const syncedProfile = await syncUserProfile(result.user);
      onLoginSuccess(syncedProfile);
      setSuccessMsg("Logged in with Google successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Google Authentication error:", err);
      setErrorMsg(err.message || "Failed to log in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (authView === "login") {
      if (!email || !password) {
        setErrorMsg("Please fill in all fields.");
        setLoading(false);
        return;
      }
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const syncedProfile = await syncUserProfile(userCredential.user);
        onLoginSuccess(syncedProfile);
        setSuccessMsg("Logged in successfully! Welcome back.");
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 1500);
      } catch (err: any) {
        console.error("Sign-in error:", err);
        let friendlyErr = err.message;
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          friendlyErr = "Invalid email or password.";
        } else if (err.code === "auth/configuration-not-found") {
          friendlyErr = "Email/Password sign-in is disabled. Please ensure it is enabled in your Firebase Console, or log in with Google.";
        }
        setErrorMsg(friendlyErr);
      } finally {
        setLoading(false);
      }
    } else if (authView === "signup") {
      if (!name || !email || !password) {
        setErrorMsg("Please fill in all details.");
        setLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set display name in Auth
        await updateProfile(userCredential.user, {
          displayName: name
        });
        const syncedProfile = await syncUserProfile(userCredential.user, name);
        onLoginSuccess(syncedProfile);
        setSuccessMsg("Account created! Enjoy 50 free startup credits.");
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 1500);
      } catch (err: any) {
        console.error("Signup error:", err);
        let friendlyErr = err.message;
        if (err.code === "auth/email-already-in-use") {
          friendlyErr = "This email is already registered.";
        } else if (err.code === "auth/weak-password") {
          friendlyErr = "Password must be at least 6 characters long.";
        } else if (err.code === "auth/configuration-not-found") {
          friendlyErr = "Email/Password registration is disabled in Firebase Console. Please try Google Login.";
        }
        setErrorMsg(friendlyErr);
      } finally {
        setLoading(false);
      }
    } else if (authView === "forgot") {
      if (!email) {
        setErrorMsg("Please enter your registered email.");
        setLoading(false);
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Reset request issued. Check your email inbox.");
        setTimeout(() => {
          setSuccessMsg("");
          setAuthView("login");
        }, 2000);
      } catch (err: any) {
        console.error("Password reset error:", err);
        setErrorMsg(err.message || "Failed to trigger recovery message.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: name,
          photoURL: customAvatar || undefined
        });

        // Sync to firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, {
          name: name,
          avatar: customAvatar || currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
        }, { merge: true });
      }

      onLoginSuccess({
        ...user,
        name: name,
        avatar: customAvatar || user.avatar
      });
      setSuccessMsg("Profile details updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err: any) {
      console.error("Save profile error:", err);
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (user.isLoggedIn && authView === "profile") {
      return (
        <div className="space-y-6 text-left">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Your ScriptForge Profile</h3>
            <p className="text-xs text-slate-400">Manage your creator parameters and workspace levels.</p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              alt={user.name}
              className="h-14 w-14 rounded-full border-2 border-indigo-500/50 shadow-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-white truncate">{user.name}</h4>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-[10px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                <Award className="h-3 w-3" />
                <span>{user.plan} Account Tier</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Creative Maven"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Custom Avatar Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... (or blank for default)"
                value={customAvatar}
                onChange={(e) => setCustomAvatar(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white hover:from-indigo-500 hover:to-purple-500 transition-colors shadow-lg shadow-indigo-500/10 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile Details"}
            </button>
          </form>

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Joined: {user.memberSince || "July 2026"}</span>
            <span>Plan: {user.plan}</span>
          </div>
        </div>
      );
    }

    if (authView === "login") {
      return (
        <div className="space-y-6 text-left">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Welcome Back</h3>
            <p className="text-xs text-slate-400">Unlock your AI scripting workspace instantly.</p>
          </div>

          {/* Social Sign-In (Recommended default) */}
          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.52 5.52 0 0 1 8.4 13c0-3.047 2.473-5.518 5.51-5.518c1.353 0 2.58.49 3.536 1.29l3.018-3.017A9.5 9.5 0 0 0 13.91 3C8.44 3 4 7.44 4 12.91c0 5.47 4.44 9.91 9.91 9.91c5.7 0 9.47-4.01 9.47-9.63c0-.62-.05-1.23-.16-1.9H12.24Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-850"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Or credentials</span>
            <div className="flex-grow border-t border-slate-850"></div>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthView("forgot")}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-indigo-500/10 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In Securely"}
            </button>
          </form>

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="border-t border-slate-900 pt-4 text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <button
              onClick={() => setAuthView("signup")}
              className="font-bold text-indigo-400 hover:text-indigo-300"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      );
    }

    if (authView === "signup") {
      return (
        <div className="space-y-6 text-left">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Create Account</h3>
            <p className="text-xs text-slate-400">Join top content producers and claim your free credits.</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg shadow-indigo-500/10 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign Up For Free"}
            </button>
          </form>

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="border-t border-slate-900 pt-4 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <button
              onClick={() => setAuthView("login")}
              className="font-bold text-indigo-400 hover:text-indigo-300"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    if (authView === "forgot") {
      return (
        <div className="space-y-6 text-left">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Reset Password</h3>
            <p className="text-xs text-slate-400">Enter your email and we'll transmit a secure reset link.</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-bold text-white hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Dispatch Recovery Link"}
            </button>
          </form>

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="border-t border-slate-900 pt-4 text-center text-xs text-slate-400">
            Back to{" "}
            <button
              onClick={() => setAuthView("login")}
              className="font-bold text-indigo-400 hover:text-indigo-300"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {renderContent()}
      </div>
    </div>
  );
}
