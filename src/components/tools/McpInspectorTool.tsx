import React, { useState } from 'react';
import { apiUrl } from '../../api';
import { Cpu, Send, RefreshCw, Terminal, CheckCircle2, Play, Code } from 'lucide-react';

export const McpInspectorTool: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'tools/list' | 'tools/call/token' | 'tools/call/search' | 'prompts/list'>('tools/list');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<any>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const getRequestPayload = (methodType: string) => {
    switch (methodType) {
      case 'tools/list':
        return { jsonrpc: '2.0', id: 101, method: 'tools/list', params: {} };
      case 'tools/call/token':
        return {
          jsonrpc: '2.0',
          id: 102,
          method: 'tools/call',
          params: {
            name: 'calculate_token_cost',
            arguments: {
              model: 'inclusionai/ling-2.6-flash',
              inputTokens: 150000,
              outputTokens: 25000,
            },
          },
        };
      case 'tools/call/search':
        return {
          jsonrpc: '2.0',
          id: 103,
          method: 'tools/call',
          params: {
            name: 'search_knowledge_base',
            arguments: {
              keyword: 'MCP Protocol',
            },
          },
        };
      case 'prompts/list':
        return { jsonrpc: '2.0', id: 104, method: 'prompts/list', params: {} };
      default:
        return { jsonrpc: '2.0', id: 100, method: 'tools/list', params: {} };
    }
  };

  const handleSendRpc = async (methodType: typeof selectedMethod) => {
    setSelectedMethod(methodType);
    const reqBody = getRequestPayload(methodType);
    setLastRequest(reqBody);
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl('/api/mcp/simulate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: reqBody }),
      });

      const resData = await response.json();
      setLastResponse(resData);
    } catch (error: any) {
      setLastResponse({ jsonrpc: '2.0', id: reqBody.id, error: { message: error.message } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                MCP (Model Context Protocol) 协议调试抓包器
              </h3>
              <p className="text-xs text-slate-500">基于 JSON-RPC 2.0 规范的标准工具与上下文交互测试</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              MCP Server Status: Online (stdio/http)
            </span>
          </div>
        </div>

        {/* Action Preset Buttons */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            选择发送的 JSON-RPC 协议方法：
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleSendRpc('tools/list')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                selectedMethod === 'tools/list'
                  ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-violet-600" />
                <span>1. tools/list</span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal mt-1">获取可用工具声明清单</p>
            </button>

            <button
              onClick={() => handleSendRpc('tools/call/token')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                selectedMethod === 'tools/call/token'
                  ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-violet-600" />
                <span>2. tools/call (Token计费)</span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal mt-1">调用 Token 成本估算工具</p>
            </button>

            <button
              onClick={() => handleSendRpc('tools/call/search')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                selectedMethod === 'tools/call/search'
                  ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-violet-600" />
                <span>3. tools/call (知识库搜索)</span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal mt-1">调用知识库搜索工具</p>
            </button>

            <button
              onClick={() => handleSendRpc('prompts/list')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                selectedMethod === 'prompts/list'
                  ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5 text-violet-600" />
                <span>4. prompts/list</span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal mt-1">获取预置 Prompt 模板</p>
            </button>
          </div>
        </div>
      </div>

      {/* JSON Frames Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sent Request Frame */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-xs font-mono border-b border-slate-800">
            <span className="text-violet-400 font-bold flex items-center gap-1.5">
              <Terminal className="h-4 w-4" /> Client -&gt; Server (Request Frame)
            </span>
            <span className="text-[10px] text-slate-500">JSON-RPC 2.0</span>
          </div>

          <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed min-h-[220px]">
            <code>
              {lastRequest ? JSON.stringify(lastRequest, null, 2) : '// 点击上方按钮发起 MCP JSON-RPC 请求'}
            </code>
          </pre>
        </div>

        {/* Received Response Frame */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-xs font-mono border-b border-slate-800">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Code className="h-4 w-4" /> Server -&gt; Client (Response Frame)
            </span>
            {isLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />}
          </div>

          <pre className="p-4 overflow-x-auto text-xs font-mono text-indigo-300 leading-relaxed min-h-[220px]">
            <code>
              {isLoading
                ? '// 等待 MCP Server 返回 Response Frame...'
                : lastResponse
                ? JSON.stringify(lastResponse, null, 2)
                : '// 尚未收到 Response Frame'}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
