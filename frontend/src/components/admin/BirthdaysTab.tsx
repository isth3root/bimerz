import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TabsContent } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import moment from "moment-jalaali";

interface Customer {
  id: string;
  name: string;
  nationalCode: string;
  phone: string;
  email: string;
  birthDate: string;
  joinDate: string;
  activePolicies: number;
  status: string;
  score: 'A' | 'B' | 'C' | 'D';
  password?: string;
  role?: string;
}

interface BirthdaysTabProps {
  customers: Customer[];
  loading: boolean;
}

export function BirthdaysTab({ customers, loading }: BirthdaysTabProps) {
  const todayJalaali = moment().format('jMM/jDD');
  const tomorrowJalaali = moment().add(1, 'day').format('jMM/jDD');

  const birthdayCustomers = customers.filter(customer => {
    if (!customer.birthDate) return false;
    const birthJalaali = moment(customer.birthDate, 'jYYYY/jMM/jDD').format('jMM/jDD');
    return birthJalaali === todayJalaali || birthJalaali === tomorrowJalaali;
  });

  return (
    <TabsContent value="birthdays">
      <Card className="shadow-green-100 shadow-xl ring-2 ring-green-200">
        <CardHeader>
          <div>
            {loading ? <Skeleton className="h-6 w-32" /> : <CardTitle>تولدهای امروز و فردا</CardTitle>}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">تاریخ تولد</TableHead>
                <TableHead className="text-right">شماره تماس</TableHead>
                <TableHead className="text-right">نام و نام خانوادگی</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : birthdayCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    <p className="text-gray-500">هیچ تولدی برای امروز یا فردا یافت نشد</p>
                  </TableCell>
                </TableRow>
              ) : (
                birthdayCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.birthDate}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}