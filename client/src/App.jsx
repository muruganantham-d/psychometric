import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <div className="app-shell">
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;
