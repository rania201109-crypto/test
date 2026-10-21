// 단계마다 편집 폴더 1개만 건드렸는지 확인한다. (커밋되지 않은 변경 기준)
import { changedFiles, check } from "./common.mjs";

const SPEC = /^docs\/\d{4}-\d{2}-\d{2}-screen-spec\.md$/;

export const ALLOWED = {
  1: [/^harness\/out\/01\//],
  2: [/^harness\/out\/02\/pages\.json$/, SPEC],
  approve: [/^harness\/out\/02\/approval\.json$/],
  3: [/^styles\//],
  4: [/^app\//],
  "4c": [/^app\//],
  5: [],
};

// 하네스가 자동으로 고치는 파일과 next dev/build가 다시 쓰는 파일은 범위 검사에서 뺀다.
const IGNORE = [/^harness\/out\/state\.json$/, /^harness\/out\/05\//, /^next-env\.d\.ts$/, /^AGENTS\.md$/, /^\.next\//];

export function scopeCheck(stage) {
  const allowed = ALLOWED[stage];
  const bad = changedFiles()
    .filter((f) => !IGNORE.some((r) => r.test(f)))
    .filter((f) => !allowed.some((r) => r.test(f)));
  return check(
    `편집 범위: ${stage}단계 폴더만 변경`,
    bad.length === 0,
    bad.length ? `범위 밖 변경 ${bad.length}개: ${bad.slice(0, 8).join(", ")}` : "범위 밖 변경 없음",
  );
}
