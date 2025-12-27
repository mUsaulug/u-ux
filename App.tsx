
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SmartComplaintViewer from './components/SmartComplaintViewer';
import AIInsightCard from './components/AIInsightCard';
import ResponseEditor from './components/ResponseEditor';
import ActionBar from './components/ActionBar';
import ChatBot from './components/ChatBot';
import { ComplaintData, CustomerSegment, ComplaintState, Priority } from './types';
import { analyzeComplaint } from './services/geminiService';

// Initial Mock Data to simulate current task
const INITIAL_COMPLAINT: ComplaintData = {
  id: "CMP-2024-8921",
  timestamp: "2024-02-14T10:30:00Z",
  customerName: "Ahmet Yılmaz",
  customerSegment: CustomerSegment.VIP_PLATINUM,
  originalText: "Kredi kartımdan Apple Store harcaması çekilmiş, ben yapmadım! İade istiyorum hemen!",
  maskedText: "Kredi kartımdan [MERCHANT] harcaması çekilmiş, ben yapmadım! İade istiyorum hemen!",
  piiTags: ["MERCHANT"]
};

const App: React.FC = () => {
  const [state, setState] = useState<ComplaintState>({
    complaint: INITIAL_COMPLAINT,
    analysis: null,
    suggestion: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  });

  const [draftResponse, setDraftResponse] = useState('');

  const runAnalysis = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeComplaint(state.complaint.originalText);
      setState(prev => ({
        ...prev,
        analysis: result.analysis,
        suggestion: result.suggestion,
        isLoading: false
      }));
      setDraftResponse(result.suggestion.responseDraft);
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Analiz sırasında hata oluştu.' }));
    }
  }, [state.complaint.originalText]);

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    // Simulate API call
    setTimeout(() => {
        alert('Şikayet başarıyla çözüldü ve yanıt gönderildi.');
        setState(prev => ({ ...prev, isSubmitting: false }));
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-slate-900">
      <Header />
      
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: The Truth */}
        <section className="w-[40%] border-r border-slate-200 bg-zinc-50 flex flex-col relative z-0">
          <SmartComplaintViewer data={state.complaint} />
        </section>

        {/* Right Panel: Workspace */}
        <section className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
            <AIInsightCard 
                analysis={state.analysis} 
                isLoading={state.isLoading} 
            />
            
            <ResponseEditor 
                suggestion={state.suggestion} 
                onTextChange={setDraftResponse} 
            />

            {/* Empty space filler for scroll */}
            <div className="h-24" />
          </div>

          <ActionBar 
            onApprove={handleApprove}
            onHold={() => {}}
            onReject={() => {}}
            isReady={!!state.analysis && !state.isLoading}
            confidenceScore={state.analysis?.confidenceScore || 0}
          />
        </section>
      </main>

      <ChatBot />

      {state.isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-slate-900">Yanıt İletiliyor...</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
