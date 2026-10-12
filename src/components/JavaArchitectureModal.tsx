import React, { useState } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import {
  JAVA_CONTROLLER_CODE,
  JAVA_ENTITY_CODE,
  JAVA_SERVICE_CODE
} from '../data/javaCodeTemplates';
import {
  Code2,
  Copy,
  Check,
  X,
  Terminal,
  Layers,
  Database,
  ArrowRight,
  Server
} from 'lucide-react';

export const JavaArchitectureModal: React.FC = () => {
  const { showJavaModal, setShowJavaModal, javaLogs } = useJobPortal();
  const [activeTab, setActiveTab] = useState<'trace' | 'controller' | 'entities' | 'service'>('trace');
  const [copied, setCopied] = useState(false);

  if (!showJavaModal) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveCode = () => {
    if (activeTab === 'controller') return JAVA_CONTROLLER_CODE;
    if (activeTab === 'entities') return JAVA_ENTITY_CODE;
    if (activeTab === 'service') return JAVA_SERVICE_CODE;
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-neutral-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Java Spring Boot 3 & JPA Architecture Engine
                </h2>
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono">
                  JDK 21
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Enterprise backend implementation blueprint powering the WorkSpark recruitment pipeline
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowJavaModal(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('trace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'trace'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live REST API Trace ({javaLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('controller')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'controller'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Spring Controller (Java)</span>
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'entities'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>JPA Entities & Schema</span>
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'service'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Service Layer</span>
            </button>
          </div>

          {activeTab !== 'trace' && (
            <button
              onClick={() => handleCopy(getActiveCode())}
              className="flex items-center gap-1.5 px-3 py-1 text-[11px] rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Java Source'}</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-950 font-mono text-xs">
          {activeTab === 'trace' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-neutral-400 pb-2 border-b border-neutral-800">
                <span className="text-[11px]">
                  Real-time simulated Spring Boot DispatcherServlet HTTP logs:
                </span>
                <span className="text-[11px] tabular-nums">Auto-recorded on every UI action</span>
              </div>

              <div className="space-y-3">
                {javaLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/90 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.method === 'POST'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.method === 'PUT' || log.method === 'PATCH'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-neutral-700 text-neutral-300'
                          }`}
                        >
                          {log.method}
                        </span>
                        <span className="text-white font-semibold">{log.endpoint}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="text-emerald-400 tabular-nums">
                          {log.statusCode} OK
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{log.durationMs}ms</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <span className="text-neutral-500">Controller:</span>
                      <span className="text-amber-300/90">{log.springController}</span>
                    </div>

                    {log.requestPayload && (
                      <div className="bg-neutral-950 p-2 rounded border border-neutral-800/80 text-[11px]">
                        <span className="text-neutral-500 block mb-0.5">Request Body:</span>
                        <span className="text-neutral-300 break-all">{log.requestPayload}</span>
                      </div>
                    )}

                    {log.responsePayload && (
                      <div className="bg-neutral-950 p-2 rounded border border-neutral-800/80 text-[11px]">
                        <span className="text-neutral-500 block mb-0.5">Response JSON:</span>
                        <span className="text-neutral-300 break-all">{log.responsePayload}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre font-mono text-xs p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <code>{getActiveCode()}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>WorkSpark Enterprise Framework: Spring Boot 3.3.4 · Hibernate ORM 6 · Spring Security 6</span>
          <button
            onClick={() => setShowJavaModal(false)}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
