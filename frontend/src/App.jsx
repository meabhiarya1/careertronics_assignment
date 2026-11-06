import { Sidebar } from './components/Sidebar.jsx';
import { BatchOperationsPage } from './pages/BatchOperationsPage.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <BatchOperationsPage />
      </main>
    </div>
  );
}
