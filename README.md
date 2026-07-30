# Pulso by Codify

MVP de evaluación de cargos para profesionales independientes, homologable a la metodología Codify.

## Deploy

Este proyecto está configurado para deploy estático en Vercel.

## Estructura

- `app/page.tsx` — Componente principal con el formulario de 5 factores, cálculo de score y resultados.
- `app/globals.css` — Estilos base.
- `next.config.js` — Configurado con `output: 'export'` para static site.

## Factores de pesaje

| Factor | Peso |
|--------|------|
| Conocimiento & Expertise | 25% |
| Alcance & Complejidad | 25% |
| Impacto & Resultados | 20% |
| Autonomía & Decisión | 15% |
| Comunicación & Influencia | 15% |

Score máximo: 500 puntos → mapeado a Grades 1-25 y bandas salariales CLP.
