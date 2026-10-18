/**
 * M Damar Pangestu - Machine Learning & AI Systems Engineer Portfolio
 * Interactive Functionality & Real-time AI Playground Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Switcher (Light / Dark Mode)
  initThemeToggle();

  // 2. Interactive AI Playground
  initPlayground();

  // 3. Project Filter Tabs
  initProjectFilters();

  // 4. Architecture Deep Dive Modal
  initArchitectureModal();

  // 5. Email Copy to Clipboard
  initEmailCopy();

  // 6. Contact Form Simulation
  initContactForm();

  // 7. Mobile Navigation Toggle
  initMobileMenu();
});

/* ===================================================================
   1. THEME SWITCHER
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // If system is dark, default to light as user requested Clean Minimalist (light) default
    root.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Clean Light Mode'}`);
  });
}

/* ===================================================================
   2. INTERACTIVE AI INFERENCE PLAYGROUND
   =================================================================== */
function initPlayground() {
  const input = document.getElementById('playground-input');
  const runBtn = document.getElementById('btn-run-inference');
  const charCount = document.getElementById('char-count');
  const latencyBadge = document.getElementById('demo-latency-text');
  const presetBtns = document.querySelectorAll('.preset-btn');

  // Output elements
  const categoryElem = document.getElementById('res-category');
  const confPercent = document.getElementById('conf-percent');
  const confFill = document.getElementById('conf-fill');
  const sentimentPill = document.getElementById('sentiment-pill');
  const sentimentIcon = document.getElementById('sentiment-icon');
  const sentimentText = document.getElementById('sentiment-text');
  const tokenCountElem = document.getElementById('token-count');
  const throughputElem = document.getElementById('throughput-val');
  const vectorTokensElem = document.getElementById('vector-tokens');

  // Set default initial value from the first active preset
  const defaultPrompt = presetBtns[0]?.getAttribute('data-prompt') || '';
  input.value = defaultPrompt;
  updateCharCount();
  runInference(defaultPrompt);

  // Character counter
  input.addEventListener('input', () => {
    updateCharCount();
  });

  function updateCharCount() {
    charCount.textContent = `${input.value.length} karakter`;
  }

  // Preset button click handling
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const prompt = btn.getAttribute('data-prompt');
      input.value = prompt;
      updateCharCount();
      runInference(prompt);
    });
  });

  // Run Inference button
  runBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) {
      showToast('Silakan masukkan teks atau pilih salah satu preset.');
      input.focus();
      return;
    }
    runInference(text);
  });

  function runInference(text) {
    runBtn.classList.add('loading');
    runBtn.disabled = true;
    latencyBadge.textContent = 'Inferencing...';

    // Simulate real ONNX model inference latency (10ms - 22ms)
    const simulatedLatencyMs = (10 + Math.random() * 8.5).toFixed(1);

    setTimeout(() => {
      runBtn.classList.remove('loading');
      runBtn.disabled = false;
      latencyBadge.textContent = `Inference: ${simulatedLatencyMs}ms (FP16)`;

      // Classify text using rule-based sentiment & intent detection
      const analysis = analyzeInput(text);

      // Update UI
      categoryElem.textContent = analysis.category;
      confPercent.textContent = `${analysis.confidence}%`;
      confFill.style.width = `${analysis.confidence}%`;

      sentimentIcon.textContent = analysis.sentimentIcon;
      sentimentText.textContent = `${analysis.sentimentLabel} (${analysis.sentimentScore})`;
      sentimentPill.style.backgroundColor = analysis.sentimentBg;
      sentimentPill.style.color = analysis.sentimentColor;

      tokenCountElem.textContent = analysis.tokens.length;
      throughputElem.textContent = `${(1200 + Math.floor(Math.random() * 380)).toLocaleString()} tok/s`;

      // Render token chips
      vectorTokensElem.innerHTML = '';
      analysis.tokens.forEach(tok => {
        const span = document.createElement('span');
        span.className = 'v-token';
        span.textContent = tok;
        span.title = `Embedding: [${(Math.random() * 0.8 - 0.4).toFixed(3)}, ${(Math.random() * 0.8 - 0.4).toFixed(3)}, ...]`;
        vectorTokensElem.appendChild(span);
      });

    }, 380); // Realistic short network/compute delay
  }

  function analyzeInput(str) {
    const lower = str.toLowerCase();
    const words = str.match(/\b(\w+)\b/g) || ['token'];

    // Break into mock BPE tokens
    const tokens = [];
    words.forEach(w => {
      if (w.length > 5) {
        tokens.push(w.slice(0, 3));
        tokens.push('##' + w.slice(3));
      } else {
        tokens.push(w);
      }
    });

    let category = 'General Machine Learning Inquiry';
    let confidence = (94.0 + Math.random() * 5.5).toFixed(1);
    let sentimentLabel = 'Neutral Technical';
    let sentimentIcon = '📊';
    let sentimentScore = '0.50';
    let sentimentBg = 'var(--bg-surface-subtle)';
    let sentimentColor = 'var(--text-muted)';

    if (lower.includes('error') || lower.includes('oom') || lower.includes('out-of-memory') || lower.includes('bug') || lower.includes('fail')) {
      category = 'Infrastructure Anomaly & CUDA Memory Fault';
      confidence = (97.5 + Math.random() * 2.2).toFixed(1);
      sentimentLabel = 'Negative (Anomaly Detected)';
      sentimentIcon = '⚠️';
      sentimentScore = '-0.86';
      sentimentBg = 'rgba(239, 68, 68, 0.12)';
      sentimentColor = '#ef4444';
    } else if (lower.includes('latency') || lower.includes('slashed') || lower.includes('reduced') || lower.includes('optimization') || lower.includes('faster') || lower.includes('benchmark')) {
      category = 'Model Latency & Throughput Optimization';
      confidence = (98.4 + Math.random() * 1.5).toFixed(1);
      sentimentLabel = 'Strongly Positive (Optimization)';
      sentimentIcon = '⚡';
      sentimentScore = '+0.95';
      sentimentBg = 'var(--accent-emerald-light)';
      sentimentColor = 'var(--accent-emerald)';
    } else if (lower.includes('vector') || lower.includes('pinecone') || lower.includes('rag') || lower.includes('fastapi') || lower.includes('database') || lower.includes('retrieval')) {
      category = 'Retrieval-Augmented Generation Architecture';
      confidence = (96.8 + Math.random() * 2.8).toFixed(1);
      sentimentLabel = 'Inquisitive Technical Query';
      sentimentIcon = '🔍';
      sentimentScore = '+0.72';
      sentimentBg = 'var(--accent-light)';
      sentimentColor = 'var(--accent-primary)';
    }

    return {
      category,
      confidence,
      sentimentLabel,
      sentimentIcon,
      sentimentScore,
      sentimentBg,
      sentimentColor,
      tokens
    };
  }
}

/* ===================================================================
   3. PROJECT FILTER TABS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   4. ARCHITECTURE DEEP DIVE MODAL
   =================================================================== */
const projectData = {
  rag: {
    category: 'LLMs, Agents & RAG',
    title: 'MindWeave: Autonomous Knowledge Graph & RAG Architecture',
    diagram: `[User Query] 
     │
     ▼
[HyDE Generator (Llama-3-8B)] ──> [Dense Query Embedding (BGE-large-en-v1.5)]
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
     [Pinecone Vector Index]                      [Elasticsearch BM25]
     (Cosine Similarity d=1024)                    (Sparse Keyword Retrieval)
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      ▼
                        [Reciprocal Rank Fusion (RRF)]
                                      │
                                      ▼
                          [Cohere Re-Ranker v3]
                                      │
                                      ▼ (Top-K Context)
                    [vLLM Inference Engine (PIM / Speculative)]
                                      │
                                      ▼
                           [Streaming Response Token]`,
    benchmarks: [
      { metric: 'Hallucination Rate', baseline: '14.2%', optimized: '1.1%', change: '-92.2%' },
      { metric: 'P95 Query Latency', baseline: '185ms', optimized: '14ms', change: '-92.4%' },
      { metric: 'Token Generation Throughput', baseline: '320 tok/s', optimized: '1,280 tok/s', change: '+300%' },
      { metric: 'Factual Faithfulness (RAGAS)', baseline: '0.78', optimized: '0.96', change: '+23.0%' }
    ],
    code: `# FastAPI + vLLM Async Streaming Engine
from fastapi import FastAPI
from vllm import AsyncLLMEngine, AsyncEngineArgs, SamplingParams

app = FastAPI(title="MindWeave Inference Gateway")
engine_args = AsyncEngineArgs(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    tensor_parallel_size=2,
    gpu_memory_utilization=0.92,
    quantization="fp8"
)
engine = AsyncLLMEngine.from_engine_args(engine_args)

@app.post("/v1/rag/chat")
async def stream_inference(query: str, retrieved_context: list[str]):
    prompt = build_grounded_prompt(query, retrieved_context)
    sampling_params = SamplingParams(temperature=0.2, max_tokens=1024)
    results = engine.generate(prompt, sampling_params)
    return results`
  },

  vision: {
    category: 'Computer Vision & Medical AI',
    title: 'AuraMed: Real-Time Edge Thoracic Lesion Diagnostic',
    diagram: `[DICOM Scanner Stream (1080p @ 60 FPS)]
     │
     ▼
[CUDA Memory Buffer & Preprocessing (CLAHE + Bilateral Filter)]
     │
     ▼
[Backbone: YOLOv10-X + Modified ResNeSt-101]
     │
     ├─> [Detection Head (Bounding Box & Class Probability)]
     │
     └─> [Segmentation Branch: Lightweight Dual-Attention U-Net]
               │
               ▼
[TensorRT FP16 Engine Execution on NVIDIA Jetson / Edge GPU]
               │
               ▼
[Post-Processing: Non-Maximum Suppression (NMS) in CUDA]
               │
               ▼
[Real-Time Overlay Display (<2ms Inference per Frame)]`,
    benchmarks: [
      { metric: 'Precision (Malignancy)', baseline: '92.4%', optimized: '99.4%', change: '+7.0%' },
      { metric: 'Dice Similarity Coefficient', baseline: '0.892', optimized: '0.988', change: '+10.7%' },
      { metric: 'Inference Speed', baseline: '18 FPS', optimized: '60 FPS (Real-time)', change: '+233%' },
      { metric: 'Memory Footprint (GPU VRAM)', baseline: '7.8 GB', optimized: '2.1 GB (TensorRT)', change: '-73.0%' }
    ],
    code: `// TensorRT C++ Inference Pipeline Snippet
#include "NvInfer.h"
#include <cuda_runtime_api.h>

void executeLesionInference(IExecutionContext* context, void** bindings, cudaStream_t stream) {
    // Zero-copy host to device transfer
    context->enqueueV3(stream);
    cudaStreamSynchronize(stream);
    
    // Compute Dice Segmentation Mask Overlays in parallel CUDA kernel
    launchSegmentationKernel<<<gridDim, blockDim, 0, stream>>>(bindings[1], outMask);
}`
  },

  mlops: {
    category: 'MLOps, Kubernetes & Infrastructure',
    title: 'AutoFlow: Automated Model Retraining & Concept Drift Guard',
    diagram: `[Live Ingestion Stream (1.2M events/day via Kafka)]
     │
     ▼
[Evidently AI Drift Inspector (KS-test / PSI Calculation)]
     │
     ├──> If Drift Metric > 0.15 ──> [Trigger Kubeflow Retraining Pipeline]
     │                                            │
     │                                            ▼
     │                               [Distributed PyTorch Elastic (DDP)]
     │                                            │
     │                                            ▼
     │                               [Automated MLflow Model Validation]
     │                                            │
     │                                            ▼
     │                               [Canary Deployment to Triton Server]
     │                                            │
     │                                            ▼
     │                               [10% -> 50% -> 100% Traffic Shift]
     │
     └──> If Healthy ──────────────> [Log Prometheus Metrics & Continue]`,
    benchmarks: [
      { metric: 'Retraining Trigger Latency', baseline: 'Manual (3 days)', optimized: 'Automated (<5 min)', change: '-99.8%' },
      { metric: 'Serving Availability Uptime', baseline: '99.5%', optimized: '99.98%', change: '+0.48%' },
      { metric: 'Avg Serving Latency', baseline: '45ms', optimized: '12.5ms', change: '-72.2%' },
      { metric: 'GPU Resource Cost', baseline: '$4,800/mo', optimized: '$2,150/mo', change: '-55.2%' }
    ],
    code: `# Kubeflow Pipeline Retrain Trigger Definition
from kfp import dsl

@dsl.pipeline(
    name="AutoFlow Concept Drift Retraining Pipeline",
    description="Automated continuous training upon feature distribution drift."
)
def continuous_training_pipeline(dataset_uri: str, drift_score: float):
    ingest_op = dsl.ContainerOp(
        name="Data-Ingestion",
        image="damar/mlops-ingest:v2.4",
        arguments=["--uri", dataset_uri]
    )
    train_op = dsl.ContainerOp(
        name="PyTorch-Distributed-Train",
        image="damar/pytorch-ddp:latest",
        arguments=["--batch-size", "256", "--epochs", "50"]
    ).after(ingest_op)`
  }
};

function initArchitectureModal() {
  const modal = document.getElementById('arch-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalBody = document.getElementById('modal-body');
  const archButtons = document.querySelectorAll('.btn-arch');

  archButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (!data) return;

      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;

      let benchmarkRows = data.benchmarks.map(b => `
        <tr>
          <td><strong>${b.metric}</strong></td>
          <td>${b.baseline}</td>
          <td><strong style="color: var(--accent-emerald)">${b.optimized}</strong></td>
          <td><span class="p-tag" style="color: var(--accent-primary)">${b.change}</span></td>
        </tr>
      `).join('');

      modalBody.innerHTML = `
        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-main);">End-to-End System Architecture Flow</h4>
        <pre class="arch-flow-diagram"><code>${escapeHTML(data.diagram)}</code></pre>

        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-main);">Production Performance Benchmarks</h4>
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>Evaluation Metric</th>
              <th>Baseline</th>
              <th>Production Optimized</th>
              <th>Delta / Improvement</th>
            </tr>
          </thead>
          <tbody>
            ${benchmarkRows}
          </tbody>
        </table>

        <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-main);">Core Pipeline Implementation Snippet</h4>
        <pre class="code-snippet"><code>${escapeHTML(data.code)}</code></pre>
      `;

      openModal();
    });
  });

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ===================================================================
   5. EMAIL COPY TO CLIPBOARD
   =================================================================== */
function initEmailCopy() {
  const copyPill = document.getElementById('email-copy-pill');
  const emailText = document.getElementById('engineer-email')?.textContent.trim() || 'muhamaddamarp@gmail.com';
  const copyBtnText = document.getElementById('copy-btn-text');

  copyPill.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailText);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = emailText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      copyBtnText.textContent = 'Copied! ✓';
      showToast('Email disalin ke clipboard: ' + emailText);

      setTimeout(() => {
        copyBtnText.textContent = 'Copy';
      }, 2500);
    } catch (err) {
      showToast('Gagal menyalin email.');
    }
  });
}

/* ===================================================================
   6. CONTACT FORM (FORMSUBMIT.CO INTEGRATION)
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-contact');
  const feedback = document.getElementById('form-feedback');

  if (!form || !submitBtn || !feedback) return;

  const originalBtnHtml = submitBtn.innerHTML;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button & show spinner state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Mengirim Pesan...</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"></path>
      </svg>
    `;

    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const name = (document.getElementById('contact-name')?.value || '').trim();
    const email = (document.getElementById('contact-email')?.value || '').trim();
    const subjectSelect = document.getElementById('contact-subject');
    const subjectText = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : 'Pertanyaan';
    const message = (document.getElementById('contact-message')?.value || '').trim();

    try {
      const response = await fetch('https://formsubmit.co/ajax/muhamaddamarp@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subjectText,
          message: message,
          _subject: `[Portfolio M Damar Pangestu] Pesan dari ${name} (${subjectText})`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        submitBtn.innerHTML = `
          <span>Pesan Terkirim! ✓</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;

        feedback.className = 'form-feedback success';
        feedback.textContent = 'Terima kasih! Pesan Anda telah berhasil terkirim ke email. Saya akan merespons dalam waktu 1x24 jam.';

        form.reset();
        showToast('Pesan berhasil terkirim ke email!');
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        feedback.className = 'form-feedback warning';
        feedback.innerHTML = '⚠️ <strong>Aktivasi Diperlukan:</strong> FormSubmit telah mengirim email konfirmasi ke <strong>muhamaddamarp@gmail.com</strong>. Silakan buka Gmail Anda (cek folder Inbox atau Spam) lalu klik tombol <strong>"Activate Form"</strong>. Setelah itu coba kirim kembali!';
        showToast('Form butuh aktivasi (cek inbox email Anda)');
      } else {
        throw new Error(data.message || 'Gagal mengirim pesan.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Maaf, terjadi kendala saat mengirim pesan. Silakan coba lagi atau kirim langsung via email ke muhamaddamarp@gmail.com.';
      showToast('Gagal mengirim pesan');
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
      }, 4500);
    }
  });
}

/* ===================================================================
   7. MOBILE NAVIGATION TOGGLE
   =================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ===================================================================
   GLOBAL TOAST UTILITY
   =================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
