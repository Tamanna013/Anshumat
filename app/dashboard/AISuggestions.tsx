"use client";

import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useBudgetStore } from "@/lib/store/budgetStoreSimple";

interface Anomaly {
  type: "warning" | "alert" | "critical";
  message: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface AISuggestionsProps {
  anomalies: Anomaly[];
}

export function AISuggestions({ anomalies }: AISuggestionsProps) {
  const { budget } = useBudgetStore();

  if (!budget) return null;

  const totalExpenses = Object.values(budget.categories).reduce(
    (a, b) => a + b,
    0
  );
  const savings = budget.income - totalExpenses;

  // Rule-based suggestions (not GPT, just simple rules)
  const suggestions = [];

  // Rule 1: High food spending
  if (budget.categories.food / budget.income > 0.4) {
    suggestions.push({
      icon: TrendingDown,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      title: "Reduce Food Spending",
      description:
        "Food exceeds 40% of income. Consider meal planning and cooking at home.",
      action: "Try meal prep to save ₹2000-₹3000 this month.",
    });
  }

  // Rule 2: High subscriptions
  if (budget.categories.subscriptions / budget.income > 0.3) {
    suggestions.push({
      icon: TrendingDown,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      title: "Review Subscriptions",
      description: "Subscriptions are 30% of income. Cancel unused services.",
      action: "Audit your subscriptions and cancel at least 2.",
    });
  }

  // Rule 3: Negative savings
  if (savings < 0) {
    suggestions.push({
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      title: "Expenses Exceed Income",
      description: "You're spending more than you earn this month.",
      action: "Review your highest expense categories and reduce by 20%.",
    });
  }

  // Rule 4: Good savings rate
  if (savings > 0 && savings / budget.income > 0.2) {
    suggestions.push({
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      title: "Great Savings Rate!",
      description: `You're saving ₹${savings.toLocaleString()} (${(
        (savings / budget.income) *
        100
      ).toFixed(1)}% of income).`,
      action: "Consider investing 50% of your savings for better returns.",
    });
  }

  // Rule 5: Low transport costs (positive)
  if (budget.categories.transport / budget.income < 0.1) {
    suggestions.push({
      icon: TrendingUp,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      title: "Efficient Transport",
      description: "Transport costs are below 10% of income - great job!",
      action: "Maintain this by using public transport or carpooling.",
    });
  }

  // Default suggestion if no others apply
  if (suggestions.length === 0) {
    suggestions.push({
      icon: Lightbulb,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      title: "Budget On Track",
      description: "Your budget looks healthy. Keep tracking your expenses.",
      action: "Consider setting aside ₹5000 for emergency fund this month.",
    });
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <Lightbulb className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">
            Smart Suggestions
          </h3>
          <p className="text-gray-400">
            Rule-based insights to optimize your budget
          </p>
        </div>
        <div className="ml-auto text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300">
          {anomalies.length} anomaly{anomalies.length !== 1 ? "s" : ""} detected
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${suggestion.bgColor} border-white/10`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${suggestion.bgColor}`}>
                  <Icon className={`w-5 h-5 ${suggestion.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{suggestion.action}</p>
                    <div className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">
                      Rule #{index + 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-sm text-gray-400">
          💡 <strong>Note:</strong> These are rule-based suggestions, not
          AI-generated. For more personalized advice, consider speaking with a
          financial advisor.
        </p>
      </div>
    </div>
  );
}
