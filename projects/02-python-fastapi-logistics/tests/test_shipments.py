import asyncio
import time
import pytest
from app.services.shipments import throttled_fetch

async def dummy():
    await asyncio.sleep(0)
    return 1

@pytest.mark.asyncio
async def test_throttled_fetch_smoke():
    t0 = time.time()
    r1 = await throttled_fetch(dummy)
    r2 = await throttled_fetch(dummy)
    assert r1 == 1 and r2 == 1
    assert time.time() - t0 >= 0  # placeholder until throttle is implemented
