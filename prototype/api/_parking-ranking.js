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
  const distanceKm = Number(candidate.distance);
  const distanceCopy = Number.isFinite(distanceKm)
    ? distanceKm < 1
      ? `${Math.round(distanceKm * 1000)}m(도보 ${candidate.walk}분)`
      : `${distanceKm.toFixed(1)}km(도보 ${candidate.walk}분)`
    : `도보 ${candidate.walk}분`;
  const cost = Number.isFinite(candidate.estimatedCost) ? candidate.estimatedCost : null;
  const costCopy = cost === null
    ? '요금 정보는 확인이 필요하지만'
    : cost === 0
      ? '무료로 이용할 수 있어'
      : `예상 요금이 ${cost.toLocaleString('ko-KR')}원이라`;
  if (Number.isFinite(temperature) && heatSeverity >= 0.65) {
    return `체감온도 ${temperature.toFixed(1)}℃에 목적지까지 ${distanceCopy}이고 ${costCopy} 종합점수가 높아요`;
  }
  if (Number.isFinite(temperature) && heatSeverity > 0) {
    return `체감온도 ${temperature.toFixed(1)}℃와 목적지까지 ${distanceCopy}, ${costCopy} 추천 순위에 반영했어요`;
  }
  if (Number.isFinite(temperature)) {
    return `체감온도 ${temperature.toFixed(1)}℃로 무난해 목적지까지 ${distanceCopy}와 요금을 균형 있게 비교했어요`;
  }
  return cost === null
    ? `목적지까지 ${distanceCopy}와 요금 데이터의 불확실성을 함께 반영했어요`
    : `목적지까지 ${distanceCopy}이고 ${costCopy} 종합 추천했어요`;
}

module.exports = {
  heatSeverityFor,
  recommendationReason,
  scoreParkingCandidate,
  weatherWeights
};
