import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { useAppData } from '@/lib/data';
import { Calendar, Plus } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  note?: string;
  spent_at: string; // ISO date
}

export function ExpenseDashboard() {
  const queryClient = useQueryClient();
  const { data: expenses, isLoading, error } = useAppData({
    key: 'expenses',
    mock: [
      { id: '1', amount: 23.5, note: 'Groceries', spent_at: '2024-09-20' },
      { id: '2', amount: 12.99, note: 'Lunch', spent_at: '2024-09-19' },
      { id: '3', amount: 45.0, note: 'Gas', spent_at: '2024-09-18' },
    ],
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const total = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const addMutation = useMutation({
    mutationFn: async (newExp: { amount: number; note?: string }) => {
      // placeholder for real insert; will be wired in phase 2
      return newExp;
    },
    onSuccess: () => {
      setAmount('');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    addMutation.mutate({ amount: amt, note: note.trim() || undefined });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Running total of all logged expenses</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Badge variant="destructive" className="text-h2">
            ${total.toFixed(2)}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                disabled={addMutation.isPending}
              />
            </div>
            <div className="flex-2">
              <Input
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={addMutation.isPending}
              />
            </div>
            <Button type="submit" disabled={addMutation.isPending}>
              <Plus size={16} className="mr-2" />Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <CenteredSpinner label="Loading expenses" />
          ) : error ? (
            <Alert variant="destructive" className="m-4">
              <AlertTitle>Failed to load expenses</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
          ) : !expenses || expenses.length === 0 ? (
            <EmptyState
              icon={<Calendar size={40} />}
              title="No expenses yet"
              description="Add an expense above to start tracking your spending."
            />
          ) : (
            <ul className="divide-y divide-border">
              {expenses.map((exp) => (
                <li key={exp.id} className="flex items-center gap-4 px-6 py-3">
                  <span className="font-mono text-small text-muted-foreground">${exp.amount.toFixed(2)}</span>
                  <span className="flex-1 text-body">{exp.note ?? ''}</span>
                  <span className="text-small text-muted-foreground">{new Date(exp.spent_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
