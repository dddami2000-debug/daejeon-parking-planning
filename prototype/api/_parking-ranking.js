function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function heatSeverityFor(apparentTemperature) {
  if (!Number.isFinite(apparentTemperature)) return 0;
  return clamp((apparentTemperature - 25) / 9, 0, 1);
}

function weatherWeights(apparentTemperature) {
  const heatSeverity = heatSeverityFor(apparentTemperature);
  return {
    heatSeverity,
    walk: 0.35 + 0.45 * heatSeverity,
    cost: 0.5 - 0.25 * heatSeverity
  };
}

function scoreParkingCandidate(candidate, weather) {
  const apparentTemperature = weather?.available ? Number(weather.apparentTemperature) : Number.NaN;
  const weights = weatherWeights(apparentTemperature);
  const walkMinutes = Math.max(0, Number(candidate.walk) || 0);
  const walkScore = clamp(walkMinutes / 25, 0, 1);
  const knownCost = Number.isFinite(candidate.estimatedCost);
  const costScore = knownCost ? clamp(candidate.estimatedCost / 6000, 0, 1) : null;
  let weightedScore = walkScore * weights.walk;
  let availableWeight = weights.walk;
  if (knownCost) {
    weightedScore += costScore * weights.cost;
    availableWeight += weights.cost;
  }
  const uncertaintyPenalty = knownCost ? 0 : 0.12;
  const score = (weightedScore / availableWeight + uncertaintyPenalty) * 100;
  return {
    score: Number(score.toFixed(3)),
    breakdown: {
      walkMinutes,
      walkScore: Number(walkScore.toFixed(3)),
      estimatedCost: knownCost ? candidate.estimatedCost : null,
      costScore: costScore === null ? null : Number(costScore.toFixed(3)),
      heatSeverity: Number(weights.heatSeverity.toFixed(3)),
      walkWeight: Number(weights.walk.toFixed(3)),
      costWeight: Number(weights.cost.toFixed(3)),
      uncertaintyPenalty
    }
  };
}

function recommendationReason(candidate, weather) {
  const temperature = weather?.available ? Number(weather.apparentTemperature) : Number.NaN;
  const heatSeverity = heatSeverityFor(temperature);
  if (Number.isFinite(temperature) && heatSeverity >= 0.65) {
    return `체감온도 ${temperature.toFixed(1)}℃ 예상으로 도보 ${candidate.walk}분인 가까운 곳을 우선했어요`;
  }
  if (Number.isFinite(temperature) && heatSeverity > 0) {
    return `체감온도 ${temperature.toFixed(1)}℃와 도보 거리·예상 요금을 함께 반영했어요`;
  }
  if (Number.isFinite(temperature)) {
    return `체감온도 ${temperature.toFixed(1)}℃로 예상돼 거리와 예상 요금을 균형 있게 비교했어요`;
  }
  return candidate.estimatedCost === null
    ? '요금 정보가 불분명해 도보 거리와 데이터 신뢰도를 중심으로 비교했어요'
    : '도보 거리와 예상 요금을 함께 반영했어요';
}

module.exports = {
  heatSeverityFor,
  recommendationReason,
  scoreParkingCandidate,
  weatherWeights
};
