# Simulador EOQ — RICOL SAS

Herramienta web interactiva para optimizar las decisiones de importación de **PEAD Alta Soplado** en RICOL SAS, empresa caleña proveedora de materias primas para la industria del plástico.

El simulador implementa el modelo de **Cantidad Económica de Pedido (EOQ)** y permite al equipo de compras explorar escenarios en tiempo real, sin necesidad de conocimientos técnicos en optimización.

---

## ¿Qué hace?

- Calcula el lote óptimo de importación **Q\*** que minimiza el costo total anual de inventario
- Muestra en tiempo real los indicadores clave: pedidos al año, tiempo entre pedidos, costo total y punto de reorden
- Alerta cuando el lote óptimo supera la capacidad física de la bodega (100.000 kg)
- Presenta tres análisis de sensibilidad interactivos: cómo cambia Q\* al variar la demanda o el costo de pedir
- Permite guardar y comparar escenarios explorados

## Modelo matemático

Basado en la Fórmula de Wilson (EOQ clásico):

```
Q* = √(2·D·S / H)
```

| Parámetro | Descripción | Valor base |
|---|---|---|
| D | Demanda anual | 859.300 kg/año |
| S | Costo de pedir por orden | $6.000.000 COP |
| H | Costo de mantener por kg/año | $2.000 COP |
| B | Capacidad de bodega | 500 m² |
| L | Lead time de importación | 30 días |

---

## Configuración

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Base de datos (Supabase)

Ejecuta en el SQL Editor de tu proyecto Supabase:

1. `supabase/schema.sql` — crea las tablas
2. `supabase/seed.sql` — carga el historial de demanda de RICOL SAS (mar 2025 – mar 2026)

El simulador funciona completamente sin Supabase — los cálculos son client-side.

---

## Instalación local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Despliegue

El proyecto está conectado a Vercel. Cada push a `main` genera un deploy automático.

Agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en la configuración de entorno de Vercel.

---

## Stack

- **Next.js 14** con App Router y TypeScript
- **Tailwind CSS** para estilos
- **Chart.js** + react-chartjs-2 para las gráficas
- **Supabase** para persistencia de historial y escenarios
