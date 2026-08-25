const { cleanText, methodNotAllowed, sendJson } = require('./_lib');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  return sendJson(res, 200, {
    kakaoJavaScriptKey: cleanText(process.env.KAKAO_JAVASCRIPT_KEY) || null,
    tmapAvailable: Boolean(cleanText(process.env.TMAP_APP_KEY))
  });
};
