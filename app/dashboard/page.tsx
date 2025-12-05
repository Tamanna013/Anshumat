"use client";

import { BudgetForm } from "@/components/budget/BudgetForm";
import { Dashboard } from "./Dashboard";
import { SyncButton } from "../../lib/sync/SyncButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { useState } from "react";
import { NoSSR } from "@/components/providers/NoSSR";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <NoSSR>
      <div className="min-h-screen">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? "lg:mr-80" : ""
            }`}
          >
            <Tabs defaultValue="budget" className="w-full">
              <TabsList>
                <TabsTrigger value="budget">Budget Editor</TabsTrigger>
                <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
              </TabsList>

              <TabsContent value="budget" className="mt-6">
                <BudgetForm />
              </TabsContent>

              <TabsContent value="dashboard" className="mt-6">
                <Dashboard />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar with Sync Controls */}
          <div
            className={`
            glass-card lg:fixed lg:right-0 lg:top-0 lg:h-screen lg:overflow-y-auto
            ${sidebarOpen ? "lg:w-80" : "lg:w-0"} 
            transition-all duration-300
            lg:border-l lg:border-white/10
          `}
          >
            {/* Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -left-10 top-4 p-2 bg-gray-900/80 backdrop-blur-sm rounded-l-lg border border-white/10 hover:bg-gray-800 transition-all hidden lg:block"
            >
              {sidebarOpen ? (
                <PanelRightClose className="w-4 h-4 text-white" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-white" />
              )}
            </button>

            {sidebarOpen && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Cloud Sync
                  </h3>
                  <p className="text-sm text-gray-400">
                    Sync your budget across devices. Works offline-first, syncs
                    when online.
                  </p>
                </div>

                <SyncButton />

                {/* Offline Information */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white mb-3">
                    Offline Features
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Auto-save every keystroke
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Works with 0 internet
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Syncs automatically when online
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      Never loses your data
                    </li>
                  </ul>
                </div>

                {/* Demo Login Info */}
                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <p className="text-xs text-gray-400 mb-1">Demo Login</p>
                  <p className="text-sm text-white font-mono">
                    hire-me@anshumat.org
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    This user is hard-coded for reviewers to test without
                    registration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NoSSR>
  );
}
