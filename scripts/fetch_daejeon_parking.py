#!/usr/bin/env python3
"""대전 실시간 주차장 OpenAPI를 정규화된 JSON으로 출력한다."""

import argparse
import hashlib
import json
import os
from pathlib import Path
from urllib.request import urlopen
from xml.etree import ElementTree as ET


API_URL = "https://apis.data.go.kr/6300000/pis/parkinglotIF"


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def node_text(item: ET.Element, tag: str) -> str | None:
    node = item.find(tag)
    return node.text.strip() if node is not None and node.text else None


def integer(value: str | None) -> int | None:
    try:
        return int(value) if value not in (None, "") else None
    except ValueError:
        return None


def number(value: str | None) -> float | None:
    try:
        return float(value) if value not in (None, "") else None
    except ValueError:
        return None


def normalize(item: ET.Element) -> dict:
    raw = {child.tag: child.text.strip() if child.text else None for child in item}
    identity = "|".join(str(raw.get(key) or "") for key in ("name", "address", "lat", "lon"))
    return {
        "source_key": hashlib.sha256(identity.encode()).hexdigest()[:32],
        "name": node_text(item, "name"),
        "latitude": number(node_text(item, "lat")),
        "longitude": number(node_text(item, "lon")),
        "address": node_text(item, "address"),
        "phone": node_text(item, "tel"),
        "total_spaces": integer(node_text(item, "totalQty")),
        "available_spaces": integer(node_text(item, "resQty")),
        "fee_type": node_text(item, "type"),
        "base_minutes": integer(node_text(item, "baseTime")),
        "base_fee": integer(node_text(item, "baseRate")),
        "additional_minutes": integer(node_text(item, "addTime")),
        "additional_fee": integer(node_text(item, "addRate")),
        "surcharge_base_minutes": integer(node_text(item, "extraBaseTime")),
        "surcharge_minutes": integer(node_text(item, "extraAddTime")),
        "surcharge_fee": integer(node_text(item, "extraAddRate")),
        "weekday_open": node_text(item, "weekdayOpenTime"),
        "weekday_close": node_text(item, "weekdayCloseTime"),
        "saturday_open": node_text(item, "satOpenTime"),
        "saturday_close": node_text(item, "satCloseTime"),
        "holiday_open": node_text(item, "holidayOpenTime"),
        "holiday_close": node_text(item, "holidayCloseTime"),
        "operating_days": node_text(item, "operDay"),
    }


def fetch_page(service_key: str, page: int, rows: int) -> dict:
    url = f"{API_URL}?serviceKey={service_key}&numOfRows={rows}&pageNo={page}"
    with urlopen(url, timeout=20) as response:
        root = ET.fromstring(response.read())
    code = root.findtext(".//resultCode")
    if code != "00":
        raise RuntimeError(root.findtext(".//resultMsg") or f"API error {code}")
    return {
        "page": page,
        "total": int(root.findtext(".//totalCount") or 0),
        "rows": [normalize(item) for item in root.findall(".//item")],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", type=Path, default=Path(".env"))
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--rows", type=int, default=50, choices=range(1, 51), metavar="1..50")
    args = parser.parse_args()

    load_env(args.env_file)
    service_key = os.environ.get("DAEJEON_PARK_API_KEY", "").strip()
    if not service_key:
        raise SystemExit("DAEJEON_PARK_API_KEY가 필요합니다.")
    print(json.dumps(fetch_page(service_key, args.page, args.rows), ensure_ascii=False, separators=(",", ":")))


if __name__ == "__main__":
    main()
