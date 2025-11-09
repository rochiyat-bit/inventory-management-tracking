import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the Inventory Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Needs reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/dashboard/products"
              className="block rounded-md border p-3 hover:bg-gray-50"
            >
              <h3 className="font-medium">Manage Products</h3>
              <p className="text-sm text-muted-foreground">
                View, add, and edit product information
              </p>
            </Link>
            <Link
              href="/dashboard/inventory"
              className="block rounded-md border p-3 hover:bg-gray-50"
            >
              <h3 className="font-medium">Check Inventory</h3>
              <p className="text-sm text-muted-foreground">
                View stock levels across warehouses
              </p>
            </Link>
            <Link
              href="/dashboard/stock-movements"
              className="block rounded-md border p-3 hover:bg-gray-50"
            >
              <h3 className="font-medium">Stock Movements</h3>
              <p className="text-sm text-muted-foreground">
                Record stock in, out, and transfers
              </p>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <div className="rounded-full bg-green-100 p-1">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <p className="font-medium">Stock In - Wireless Mouse</p>
                  <p className="text-muted-foreground">50 units added to Main Warehouse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="rounded-full bg-blue-100 p-1">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Transfer - Office Chair</p>
                  <p className="text-muted-foreground">5 units to Secondary Warehouse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="rounded-full bg-red-100 p-1">
                  <div className="h-2 w-2 rounded-full bg-red-600" />
                </div>
                <div>
                  <p className="font-medium">Stock Out - A4 Paper</p>
                  <p className="text-muted-foreground">20 reams from Main Warehouse</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
