'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { costoPedirPoint, costoMantenerPoint, tcCurve, Q_CAP } from '@/lib/eoq';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  D: number;
  S: number;
  Qstar: number;
  Qfinal: number;
}

const N_PTS = 250;
const fmt = (v: number) => Math.round(v).toLocaleString('es-CO');

export default function ChartTC({ D, S, Qstar, Qfinal }: Props) {
  const { labels, cPedir, cMantener, cTotal, qMax } = useMemo(() => {
    const qMax = Math.max(2 * Q_CAP, 2 * Qstar, 50_000);
    const step = qMax / N_PTS;
    const labels: string[] = [];
    const cPedir: number[] = [];
    const cMantener: number[] = [];
    const cTotal: number[] = [];

    for (let i = 1; i <= N_PTS; i++) {
      const q = i * step;
      labels.push(fmt(q));
      cPedir.push(costoPedirPoint(q, D, S));
      cMantener.push(costoMantenerPoint(q));
      cTotal.push(tcCurve(q, D, S));
    }
    return { labels, cPedir, cMantener, cTotal, qMax };
  }, [D, S, Qstar]);

  // Vertical marker at Qfinal
  const markerIdx = Math.round((Qfinal / qMax) * N_PTS) - 1;

  const data = {
    labels,
    datasets: [
      {
        label: 'Costo de pedir (D/Q)·S',
        data: cPedir,
        borderColor: '#2563eb',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Costo de mantener (Q/2)·H',
        data: cMantener,
        borderColor: '#16a34a',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: 'Costo total TC(Q)',
        data: cTotal,
        borderColor: '#1e3a5f',
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: `Q* = ${fmt(Qfinal)} kg`,
        data: labels.map((_, i) => (i === markerIdx ? cTotal[markerIdx] : null)),
        borderColor: '#e65100',
        backgroundColor: '#e65100',
        pointRadius: labels.map((_, i) => (i === markerIdx ? 7 : 0)),
        pointHoverRadius: 9,
        showLine: false,
        type: 'line' as const,
      },
    ],
  };

  const options = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { position: 'bottom' as const, labels: { font: { size: 10 }, boxWidth: 12 } },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ctx.dataset.label.startsWith('Q*')
              ? `TC mínimo: $${fmt(ctx.parsed.y)}`
              : `${ctx.dataset.label}: $${fmt(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Tamaño de lote Q (kg)', font: { size: 10 } },
        ticks: {
          maxTicksLimit: 6,
          font: { size: 9 },
          callback: (_: any, i: number, ticks: any[]) =>
            i % Math.ceil(ticks.length / 5) !== 0 ? null : labels[i],
        },
        grid: { color: '#f0f0f0' },
      },
      y: {
        title: { display: true, text: 'Costo anual (COP)', font: { size: 10 } },
        ticks: {
          font: { size: 9 },
          callback: (v: any) =>
            v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M` : `$${fmt(v)}`,
        },
        grid: { color: '#f0f0f0' },
      },
    },
  };

  return <Line data={data} options={options} />;
}
