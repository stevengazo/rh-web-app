import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

/**
 * Perfil por dimensión: un radar con el porcentaje de cada escala.
 *
 * @param {Array<{ dimensionName, percentage, average }>} scores
 */
const PsychometricProfileChart = ({ scores = [] }) => {
  const data = scores
    .filter((s) => s?.dimensionName)
    .map((s) => ({
      dimension: s.dimensionName,
      porcentaje: Math.round(Number(s.percentage) || 0),
    }));

  if (data.length < 3) {
    return (
      <p className="rounded-lg bg-surface-alt p-3 text-sm text-ink-muted">
        El radar necesita al menos tres dimensiones con puntaje.
      </p>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#d1d5db" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Porcentaje"
            dataKey="porcentaje"
            stroke="#0F6CBD"
            fill="#7C3AED"
            fillOpacity={0.35}
            isAnimationActive
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PsychometricProfileChart;
