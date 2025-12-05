"use client";
import Link from "next/link";
import { ArrowRight, Shield, CloudOff, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
          BudgetBox
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          An offline-first budgeting app with 3D visuals. Works completely
          offline, auto-saves every keystroke, and syncs when you're back
          online.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6">
            <CloudOff className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Offline-First
            </h3>
            <p className="text-gray-400">
              Works with 0 internet. Never lose your data.
            </p>
          </div>

          <div className="glass-card p-6">
            <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Auto-Save</h3>
            <p className="text-gray-400">Every keystroke is saved instantly.</p>
          </div>

          <div className="glass-card p-6">
            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Insights
            </h3>
            <p className="text-gray-400">
              AI-powered suggestions to optimize your budget.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
        >
          Launch BudgetBox
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-gray-500 text-sm mt-6">
          Demo login:{" "}
          <code className="bg-white/5 px-2 py-1 rounded">
            hire-me@anshumat.org
          </code>
        </p>
      </div>
    </div>
  );
}
