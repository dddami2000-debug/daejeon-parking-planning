(function attachMapClustering(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MapClustering = api;
})(typeof window !== 'undefined' ? window : globalThis, function createMapClustering() {
  const DEFAULT_CLUSTER_DISTANCE = 48;

  function pointDistance(left, right) {
    return Math.hypot(Number(left.x) - Number(right.x), Number(left.y) - Number(right.y));
  }

  function clusterProjectedPlaces(items = [], maxDistance = DEFAULT_CLUSTER_DISTANCE) {
    const requestedDistance = Number(maxDistance);
    const distance = Number.isFinite(requestedDistance)
      ? Math.max(0, requestedDistance)
      : DEFAULT_CLUSTER_DISTANCE;
    const normalized = items.map((item, index) => ({ ...item, originalIndex: index }));
    const invalidClusters = normalized
      .filter(item => !Number.isFinite(Number(item.x)) || !Number.isFinite(Number(item.y)))
      .map(item => [item]);
    const sorted = normalized
      .filter(item => Number.isFinite(Number(item.x)) && Number.isFinite(Number(item.y)))
      .sort((left, right) => Number(left.x) - Number(right.x)
        || Number(left.y) - Number(right.y)
        || left.originalIndex - right.originalIndex);
    const clusters = [];

    sorted.forEach(item => {
      let closestCluster = null;
      let closestDistance = Infinity;

      clusters.forEach(cluster => {
        const distances = cluster.map(member => pointDistance(item, member));
        if (!distances.length || distances.some(value => value > distance)) return;
        const averageDistance = distances.reduce((sum, value) => sum + value, 0) / distances.length;
        if (averageDistance < closestDistance) {
          closestCluster = cluster;
          closestDistance = averageDistance;
        }
      });

      if (closestCluster) closestCluster.push(item);
      else clusters.push([item]);
    });

    return [...clusters, ...invalidClusters]
      .map(cluster => cluster.sort((left, right) => left.originalIndex - right.originalIndex))
      .sort((left, right) => left[0].originalIndex - right[0].originalIndex);
  }

  return { DEFAULT_CLUSTER_DISTANCE, clusterProjectedPlaces, pointDistance };
});
