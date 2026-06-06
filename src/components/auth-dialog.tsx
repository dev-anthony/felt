"use client";
// 'use client';

// import { useState } from 'react';
// import { Mail, Lock, User } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';

// interface AuthDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
//   const [mode, setMode] = useState<'signin' | 'signup'>('signin');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle auth logic here
//     console.log(mode === 'signin' ? { email, password } : { name, email, password });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent 
//         className="bg-background border-foreground/20 p-0 !rounded-none"
//         style={{
//           borderRadius: '0 !important',
//         }}
//       >
//         <DialogHeader className="px-8 py-6 border-b border-foreground/10">
//           <DialogTitle className="text-foreground font-display text-xl tracking-tight">
//             {mode === 'signin' ? 'Sign In' : 'Create Account'}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="px-8 py-6">
//           {/* Tab Toggle */}
//           <div className="flex gap-2 mb-6 p-1 bg-foreground/5 rounded-lg">
//             <button
//               onClick={() => {
//                 setMode('signin');
//                 setName('');
//                 setEmail('');
//                 setPassword('');
//               }}
//               className={`flex-1 py-2 px-3 text-sm font-mono tracking-wider transition-all ${
//                 mode === 'signin'
//                   ? 'bg-foreground text-background'
//                   : 'text-foreground hover:text-accent'
//               }`}
//             >
//               SIGN IN
//             </button>
//             <button
//               onClick={() => {
//                 setMode('signup');
//                 setName('');
//                 setEmail('');
//                 setPassword('');
//               }}
//               className={`flex-1 py-2 px-3 text-sm font-mono tracking-wider transition-all ${
//                 mode === 'signup'
//                   ? 'bg-foreground text-background'
//                   : 'text-foreground hover:text-accent'
//               }`}
//             >
//               SIGN UP
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4 mb-6">
//             {mode === 'signup' && (
//               <div className="space-y-2">
//                 <label className="text-xs font-mono tracking-wider text-muted-foreground uppercase block">
//                   Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                   <Input
//                     type="text"
//                     placeholder="Your name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="pl-9 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent/50 !rounded-none"
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="space-y-2">
//               <label className="text-xs font-mono tracking-wider text-muted-foreground uppercase block">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-9 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent/50 !rounded-none"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-xs font-mono tracking-wider text-muted-foreground uppercase block">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pl-9 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-accent/50 !rounded-none"
//                   required
//                 />
//               </div>
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-foreground text-background hover:bg-accent hover:text-foreground font-mono text-xs tracking-widest uppercase mt-6 !rounded-none"
//             >
//               {mode === 'signin' ? 'Sign In' : 'Create Account'}
//             </Button>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="flex-1 h-px bg-foreground/10" />
//             <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">OR</span>
//             <div className="flex-1 h-px bg-foreground/10" />
//           </div>

//           {/* Google Auth */}
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full bg-foreground/5 border-foreground/20 text-foreground hover:bg-foreground/10 font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 !rounded-none"
//           >
//           Google
//             {mode === 'signin' ? 'Sign In with Google' : 'Sign Up with Google'}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [view, setView] = React.useState<"sign-in" | "create-account">("sign-in");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overriding default shadcn radius values completely with rounded-none */}
      <DialogContent className="rounded-none border border-border bg-popover max-w-sm sm:max-w-md p-8 gap-6">
        
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="font-display italic text-3xl font-medium tracking-tight text-foreground">
            {view === "sign-in" ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs text-muted-foreground tracking-wide">
            {view === "sign-in" 
              ? "Enter your credentials to enter the gallery workspace." 
              : "Sign up to start translating sound characteristics into art."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 font-sans">
          {view === "create-account" && (
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Name</label>
              <Input 
                type="text" 
                placeholder="Name" 
                className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Email address</label>
            <Input 
              type="email" 
              placeholder="name@domain.com" 
              className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              className="rounded-none border-input bg-transparent text-sm focus-visible:ring-0 focus-visible:border-accent text-foreground placeholder:text-muted-foreground/40 h-10"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-none h-10 bg-foreground text-background font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-colors mt-2"
          >
            {view === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="relative font-sans my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest">
            <span className="bg-popover px-3 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => {}}
          className="w-full rounded-none h-10 border-border bg-transparent text-foreground font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-foreground/5 transition-colors"
        >
          {/* Minimalist raw vector icon for Google */}
          <svg className="mr-2 h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </Button>

        <div className="text-center font-sans text-xs text-muted-foreground mt-2">
          {view === "sign-in" ? (
            <>
              New to the platform?{" "}
              <button 
                onClick={() => setView("create-account")}
                className="text-accent underline underline-offset-2 hover:text-foreground font-medium"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button 
                onClick={() => setView("sign-in")}
                className="text-accent underline underline-offset-2 hover:text-foreground font-medium"
              >
                Sign In
              </button>
            </>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}