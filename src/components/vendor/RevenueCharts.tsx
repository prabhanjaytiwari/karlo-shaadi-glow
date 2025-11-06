import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Calendar, Target } from "lucide-react";

interface RevenueChartsProps {
  vendorId: string;
  monthlyData: Array<{
    month: string;
    revenue: number;
    bookings: number;
    avgBookingValue: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
  }>;
  conversionData: {
    inquiries: number;
    bookings: number;
    conversionRate: number;
  };
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export function RevenueCharts({ monthlyData, categoryBreakdown, conversionData }: RevenueChartsProps) {
  const currentMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;
  const previousMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0;
  const revenueGrowth = previousMonthRevenue > 0 
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
    : 0;

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = monthlyData.reduce((sum, item) => sum + item.bookings, 0);
  const avgMonthlyRevenue = monthlyData.length > 0 ? totalRevenue / monthlyData.length : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Avg Monthly</p>
            </div>
            <p className="text-2xl font-bold">₹{Math.round(avgMonthlyRevenue).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+{revenueGrowth}% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
            <p className="text-2xl font-bold">{conversionData.conversionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {conversionData.bookings} of {conversionData.inquiries} inquiries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <p className="text-2xl font-bold">{totalBookings}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Statistics</CardTitle>
              <CardDescription>Bookings and average booking value trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="bookings" 
                    fill="#06b6d4" 
                    name="Bookings"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="avgBookingValue" 
                    fill="#10b981" 
                    name="Avg Value (₹)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Service Category</CardTitle>
              <CardDescription>Distribution of revenue across service types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {categoryBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Peak Season Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Season Insights</CardTitle>
          <CardDescription>Your busiest months and booking patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {monthlyData
              .sort((a, b) => b.bookings - a.bookings)
              .slice(0, 3)
              .map((month, index) => (
                <div key={index} className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-700' :
                      index === 1 ? 'bg-gray-400/20 text-gray-700' :
                      'bg-orange-500/20 text-orange-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <p className="font-semibold">{month.month}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {month.bookings} bookings
                  </p>
                  <p className="text-lg font-bold">
                    ₹{month.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
