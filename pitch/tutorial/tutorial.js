// 단계별 시연 튜토리얼: ?stage=1|2|3. 대상 외 영역 딤드, 설명 상자 이전/다음
const STEPS = {
  1: [
    [null, "1차 튜토리얼 · 요청 접수 당일 정리", "주니어 BA 에이전트의 요청 정리부터 시니어 BA 검수까지의 흐름"],
    ["#t1-ticket .quote", "마케터 요청 접수", "Jira 티켓의 한 줄 요청, 양식 강제 없음"],
    ["#t1-verdict", "접수 당일 가능 여부 회신", "가능 여부 · 예상 소요의 즉시 판정, 착수 후 불가 판명 방지"],
    ["#t1-draft", "주니어 BA 초안", "요구사항 추정과 사용 데이터 확인, 데이터 함정 사전 표시"],
    ["#t1-ask", "기본안 첨부 되묻기", "데이터로 정할 수 없는 항목만 질문, 기본안 첨부로 왕복 1회 이내"],
    ["#t1-check", "검수 조건 자동 검사", "시니어 BA 가 과거에 지적한 조건의 자동 적용"],
    ["#t1-review", "시니어 BA 검수", "승인 시 Excel 발송, 지적 시 검수 조건으로 등록"],
    [null, "🏆 1차 완료 · 접수 당일 회신", "반복 요청의 즉시 처리와 검수 조건 축적"],
  ],
  2: [
    [null, "2차 튜토리얼 · 프로모션 효과 판정", "집행 전 기대치 설정부터 대조군 대비 판정 · 다음 제안까지의 흐름"],
    ["#t2-list", "캠페인 목록", "캠페인별 주 지표 · 비교 기간의 집행 전 등록"],
    ["#t2-chart", "대조군 대비 효과", "신뢰구간 막대의 0 걸침 여부로 우연과 효과 구분"],
    ["#t2-detail", "판정 상세", "행사 7일 +40.8% 이나 28일 누적 +2.0%, 구매 시점 이동에 그친 사례"],
    ["#t2-bf-row", "판정 결과", "확대 비권장 판정의 캠페인 목록 반영"],
    ["#t2-next", "BA 선제 제안", "판정 이력 기반 다음 캠페인 제안, 대조군 설계 첨부"],
    [null, "🏆 2차 완료 · 효과 판정", "감이 아닌 판정 이력 기반 집행 기준 확보"],
  ],
  3: [
    [null, "3차 튜토리얼 · 지표 정의 관리", "BA 의 지표 정의 소유와 변경 절차"],
    ["#t3-def", "순매출 단일 정의", "패널별 SQL 대신 한 곳의 정의 참조"],
    ["#t3-opt", "범위 옵션 변경", "매출 범위 합의 결과의 옵션 반영, 직접 클릭 가능"],
    ["#t3-panels", "전 패널 동시 반영", "같은 정의를 쓰는 모든 패널의 합계 일치"],
    ["#t3-reg", "변경 전 회귀 검증", "정의 질문 21개 회귀 통과 후에만 배포 가능"],
    ["#t3-approve", "승인 · 배포", "BA 리더 승인 후 배포, 정의 변경 주체는 BA"],
    [null, "🏆 3차 완료 · BA 자체 운영", "FDE 철수 후에도 BA 의 지표 설정 · 개선 지속"],
  ],
};

const params = new URLSearchParams(location.search);
const stage = params.get("stage") || "1";
document.querySelector(`.stage[data-stage="${stage}"]`).classList.add("on");
const steps = STEPS[stage];
const spot = document.getElementById("spot"), tip = document.getElementById("tip");
const prev = document.getElementById("prev"), next = document.getElementById("next");
let index = Math.min(Math.max(Number(params.get("step") || 1) - 1, 0), steps.length - 1);

function place() {
  const [selector] = steps[index];
  const vw = innerWidth, vh = innerHeight, gap = 14;
  if (!selector) {
    spot.className = "spot center";
    tip.classList.add("center");
    Object.assign(spot.style, { left: `${vw / 2}px`, top: `${vh / 2}px`, width: "0px", height: "0px" });
    return;
  }
  const r = document.querySelector(`.stage.on ${selector}`).getBoundingClientRect();
  spot.className = "spot";
  tip.classList.remove("center");
  Object.assign(spot.style, { left: `${r.left - 6}px`, top: `${r.top - 6}px`, width: `${r.width + 12}px`, height: `${r.height + 12}px` });
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let left, top;
  if (r.right + gap + w < vw) { left = r.right + gap + 6; top = r.top; }
  else if (r.left - gap - w > 0) { left = r.left - gap - w - 6; top = r.top; }
  else if (r.bottom + gap + h < vh) { left = r.left; top = r.bottom + gap + 6; }
  else { left = r.left; top = r.top - gap - h - 6; }
  tip.style.left = `${Math.min(Math.max(left, 8), vw - w - 8)}px`;
  tip.style.top = `${Math.min(Math.max(top, 8), vh - h - 8)}px`;
}

function render() {
  const [, title, body] = steps[index];
  document.getElementById("tip-step").textContent = `STEP ${index + 1} / ${steps.length}`;
  document.getElementById("tip-title").textContent = title;
  document.getElementById("tip-body").textContent = body;
  document.getElementById("tip-dots").innerHTML = steps.map((_, i) => `<i class="${i === index ? "on" : ""}"></i>`).join("");
  prev.disabled = index === 0;
  next.textContent = index === steps.length - 1 ? "처음부터 ↺" : "다음 ▶";
  tip.classList.toggle("done", index === steps.length - 1);
  place();
}

function go(delta) {
  index = (index + delta + steps.length) % steps.length;
  if (delta < 0 && index === steps.length - 1) index = 0;
  render();
}
prev.onclick = () => go(-1);
next.onclick = () => go(1);

// 키보드: ←/→ 는 단계 이동, 처음 · 끝에서는 덱 장 이동으로 전달
addEventListener("keydown", (event) => {
  const toDeck = (key) => parent !== window && parent.postMessage({ deckKey: key }, "*");
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    if (index === steps.length - 1) toDeck("ArrowRight"); else go(1);
  } else if (event.key === "ArrowLeft") {
    if (index === 0) toDeck("ArrowLeft"); else go(-1);
  } else if (["n", "N", "p", "P"].includes(event.key)) toDeck(event.key);
});

// 3차 범위 옵션: 합계 재계산
const BASE = 2901488100, B2B = 282248500, CNSM = 242152900;
function recalc() {
  const b2b = document.getElementById("opt-b2b").checked, cnsm = document.getElementById("opt-cnsm").checked;
  const total = BASE - (b2b ? 0 : B2B) + (cnsm ? CNSM : 0);
  document.querySelectorAll(".tot").forEach((el) => {
    el.textContent = total.toLocaleString("ko-KR");
    el.classList.toggle("chg", total !== BASE);
  });
}
document.querySelectorAll("#opt-b2b, #opt-cnsm").forEach((el) => el.addEventListener("change", recalc));

// 첫 배치와 창 크기 변경 시에는 이동 애니메이션 없이 바로 배치
function placeNow() {
  spot.style.transition = tip.style.transition = "none";
  place();
  requestAnimationFrame(() => requestAnimationFrame(() => { spot.style.transition = tip.style.transition = ""; }));
}
new ResizeObserver(placeNow).observe(document.documentElement);
render();
placeNow();
