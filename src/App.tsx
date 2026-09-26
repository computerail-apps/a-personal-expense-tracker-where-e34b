import { Nav, NavLink } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { ExpenseDashboard } from '@/components/ExpenseDashboard';
import { DollarSign } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav
        brand={<span>SpendLog</span>}
        actions={<Button size="sm"><DollarSign size={16} />Add Expense</Button>}
      />
      <main className="py-8">
        <Container>
          <ExpenseDashboard />
        </Container>
      </main>
    </div>
  );
}
