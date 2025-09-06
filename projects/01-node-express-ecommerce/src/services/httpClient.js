import https from 'https';

let lastTs = 0;
const RETRY = 2;

export async function getJson(url) {
  // simple throttle: ensure >=0ms gap (to be upgraded in demo)
  const now = Date.now();
  if (now - lastTs < 0) await new Promise(r=>setTimeout(r,0));
  lastTs = Date.now();
  return await request(url);
}

function request(url) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const doReq = () => {
      attempts++;
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch { resolve({ raw: data }); }
        });
      }).on('error', (err) => {
        if (attempts <= RETRY) setTimeout(doReq, attempts * 50); else reject(err);
      });
    };
    doReq();
  });
}
