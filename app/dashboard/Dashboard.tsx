"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  PiggyBank,
} from "lucide-react";
import { useBudgetStore } from "@/lib/store/budgetStoreSimple";
import { AISuggestions } from "./AISuggestions";

export function Dashboard() {
  const { budget } = useBudgetStore();

  if (!budget) return null;

  // Calculate totals
  const totalExpenses = Object.values(budget.categories).reduce(
    (a, b) => a + b,
    0
  );
  const savings = budget.income - totalExpenses;
  const burnRate =
    budget.income > 0 ? (totalExpenses / budget.income) * 100 : 0;

  // Calculate month-end prediction (assuming 30-day month)
  const daysInMonth = 30;
  const today = new Date();
  const currentDay = today.getDate();
  const dailySpendRate = totalExpenses / currentDay;
  const monthEndPrediction = dailySpendRate * daysInMonth;

  // Data for pie chart
  const pieData = [
    { name: "Bills", value: budget.categories.monthlyBills, color: "#3B82F6" },
    { name: "Food", value: budget.categories.food, color: "#10B981" },
    { name: "Transport", value: budget.categories.transport, color: "#EF4444" },
    {
      name: "Subscriptions",
      value: budget.categories.subscriptions,
      color: "#8B5CF6",
    },
    { name: "Misc", value: budget.categories.miscellaneous, color: "#6B7280" },
  ].filter((item) => item.value > 0);

  // Data for trend bar chart
  const trendData = [
    {
      day: "Week 1",
      spent: totalExpenses * 0.25,
      budget: budget.income * 0.25,
    },
    { day: "Week 2", spent: totalExpenses * 0.5, budget: budget.income * 0.25 },
    {
      day: "Week 3",
      spent: totalExpenses * 0.75,
      budget: budget.income * 0.25,
    },
    { day: "Week 4", spent: totalExpenses, budget: budget.income * 0.25 },
  ];

  // Anomaly detection
  const anomalies = [];

  if (budget.categories.food / budget.income > 0.4) {
    anomalies.push({
      type: "warning",
      message: "Food spending exceeds 40% of income",
      category: "food",
      severity: "high",
    });
  }

  if (budget.categories.subscriptions / budget.income > 0.3) {
    anomalies.push({
      type: "alert",
      message: "Subscriptions are 30% of your income",
      category: "subscriptions",
      severity: "medium",
    });
  }

  if (savings < 0) {
    anomalies.push({
      type: "critical",
      message: "Expenses exceed income this month",
      category: "overall",
      severity: "critical",
    });
  }

  if (burnRate > 100) {
    anomalies.push({
      type: "critical",
      message: "Burn rate exceeds 100%",
      category: "overall",
      severity: "critical",
    });
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Budget Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Updates • Auto-saved Locally
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Burn Rate</h3>
            {burnRate > 100 ? (
              <TrendingUp className="w-5 h-5 text-red-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-500" />
            )}
          </div>
          <p
            className={`text-2xl font-bold ${
              burnRate > 100 ? "text-red-400" : "text-green-400"
            }`}
          >
            {burnRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {burnRate > 100 ? "Above budget" : "Within budget"}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Savings Potential</h3>
            <PiggyBank className="w-5 h-5 text-blue-500" />
          </div>
          <p
            className={`text-2xl font-bold ${
              savings >= 0 ? "text-blue-400" : "text-red-400"
            }`}
          >
            ₹{Math.abs(savings).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {savings >= 0 ? "Available to save" : "Over budget"}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Month-End Prediction</h3>
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            ₹
            {monthEndPrediction.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Based on current spending rate
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Anomalies Detected</h3>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white">{anomalies.length}</p>
          <p className="text-xs text-gray-400 mt-1">
            {anomalies.length === 0 ? "All good!" : "Check suggestions"}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Spending by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) =>
                    `${entry.name}: ${(
                      (entry.value / totalExpenses) *
                      100
                    ).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Amount",
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Monthly Spending Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Amount",
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="spent"
                  name="Actual Spend"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="budget"
                  name="Budgeted"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Projected vs actual spending throughout the month
          </p>
        </div>
      </div>

      {/* AI Suggestions Component */}
      <AISuggestions anomalies={anomalies} />
    </div>
  );
}
