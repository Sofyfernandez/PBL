'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { qStarOfS, Q_CAP } from '@/lib/eoq';

const N_PTS = 200;
const S_MIN = 1_000_000;
const S_MAX = 15_000_000;
const fmt = (v: number) => Math.round(v).toLocaleString('es-CO');

interface Props {
  D: number;
  S: number;
}

export default function ChartQvsS({ D, S }: Props) {
  const { labels, qVals, capLine, currentIdx } = useMemo(() => {
    const labels: string[] = [];
    const qVals: number[] = [];
    const capLine: number[] = [];

    for (let i = 0; i <= N_PTS; i++) {
      const sv = S_MIN + (S_MAX - S_MIN) * (i / N_PTS);
      labels.push(fmt(sv));
      qVals.push(qStarOfS(D, sv));
      capLine.push(Q_CAP);
    }

    const currentIdx = Math.round(((S - S_MIN) / (S_MAX - S_MIN)) * N_PTS);
    return { labels, qVals, capLine, currentIdx };
  }, [D, S]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Q*(S)',
        data: qVals,
        borderColor: '#7c3aed',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
      {
        label: 'Q_cap = 100.000 kg',
        data: capLine,
        borderColor: '#e65100',
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
      },
      {
        label: 'S actual',
        data: labels.map((_, i) => (i === currentIdx ? qVals[currentIdx] : null)),
        borderColor: '#1e3a5f',
        backgroundColor: '#1e3a5f',
        pointRadius: labels.map((_, i) => (i === currentIdx ? 8 : 0)),
        pointHoverRadius: 10,
        showLine: false,
        type: 'line' as const,
      },
    ],
  };

  const options = {
    animation: false as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { font: { size: 10 }, boxWidth: 12 } },
      tooltip: {
        callbacks: { label: (ctx: any) => `Q* = ${fmt(ctx.parsed.y)} kg` },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Costo de pedir S (COP/pedido)', font: { size: 10 } },
        ticks: {
          maxTicksLimit: 6, font: { size: 9 },
          callback: (_: any, i: number, ticks: any[]) =>
            i % Math.ceil(ticks.length / 5) !== 0 ? null : labels[i],
        },
        grid: { color: '#f0f0f0' },
      },
      y: {
        title: { display: true, text: 'Lote óptimo Q* (kg)', font: { size: 10 } },
        ticks: { font: { size: 9 }, callback: (v: any) => fmt(v) },
        grid: { color: '#f0f0f0' },
      },
    },
  };

  return <Line data={data} options={options} />;
}
