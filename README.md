# 탄칸린 (Thân Khánh Linh) · 현지화 QA 포트폴리오

한국어(기본) / English / Tiếng Việt 3개 언어를 지원하는 1페이지 정적 포트폴리오입니다.
빌드 도구 없이 `index.html` 하나로 열립니다.

## 파일 구조

```
portfolio/
├─ index.html        페이지 구조
├─ css/style.css     디자인 + 인쇄(Ctrl+P)용 이력서 스타일
├─ js/config.js      ★ 연락처·이력서 링크·졸업년월 입력 (여기만 채우면 됨)
├─ js/i18n.js        ★ 모든 문구 (한국어 / 영어 / 베트남어)
├─ js/main.js        언어 전환, Before/After 데모, 스크롤 효과
└─ assets/           이력서 PDF 등을 넣는 폴더
```

## 1. 로컬에서 열기

- 가장 간단한 방법: `index.html` 파일을 더블클릭 → 브라우저에서 열림
- 특정 언어로 바로 열기: 주소 끝에 `?lang=en` 또는 `?lang=vi` 붙이기

## 2. 내용 수정

- **연락처 / 이력서 PDF / 졸업년월** → `js/config.js`의 `""` 안에 입력
  - 이력서 PDF는 `assets/` 폴더에 넣고 `resumeUrl: "assets/파일이름.pdf"` 로 입력
- **문구 수정** → `js/i18n.js`에서 `ko`, `en`, `vi` 각각 같은 키의 문장을 고치기
- 수정 후 브라우저 새로고침(F5)으로 확인

## 3. GitHub Pages 배포

1. GitHub에서 새 저장소 만들기 (예: `portfolio`, Public)
2. 저장소 화면에서 **Add file → Upload files** → `portfolio` 폴더 *안의* 파일·폴더 전체를 끌어다 놓고 **Commit changes**
   (저장소 맨 위에 `index.html`이 있어야 함)
3. **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `/(root)` → **Save**
4. 1~2분 후 `https://<GitHub아이디>.github.io/portfolio/` 에서 확인

> 저장소 이름을 `<GitHub아이디>.github.io` 로 만들면 주소가 `https://<GitHub아이디>.github.io/` 로 짧아집니다.

## 4. (선택) Vercel 배포

1. https://vercel.com 에 GitHub 계정으로 로그인
2. **Add New → Project** → 위 저장소 선택 → Framework Preset: `Other` → **Deploy**
3. 이후 GitHub에 파일을 올릴 때마다 자동으로 다시 배포됨

## 5. 인쇄 / PDF 이력서

브라우저에서 원하는 언어로 바꾼 뒤 `Ctrl+P`(Mac: `⌘+P`) → 대상: "PDF로 저장".
A4 2페이지 이력서 형태로 출력됩니다. (데모·버튼·메뉴는 자동으로 숨김)
