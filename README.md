# 세온 메디컬센터 — VELTOWEB SAMPLE PROJECT

실제 병원이 아닌 웹디자인 포트폴리오용 가상 프리미엄 메디컬센터 사이트입니다. 의료진, 수치, 후기, 전화번호, 주소는 모두 SAMPLE 정보입니다.

## 바로 실행하기

1. 이 폴더를 VS Code로 엽니다.
2. `index.html`을 선택합니다.
3. Live Server 확장 프로그램의 `Open with Live Server`를 누릅니다.

별도의 설치나 빌드 명령은 없습니다. HTML, CSS, JavaScript만 사용했습니다.

## 파일 구성

```text
seon-medical-center/
├─ index.html
├─ style.css
├─ script.js
├─ README.md
└─ images/
   ├─ hero.jpg
   ├─ doctor-01.jpg
   ├─ facility-01.jpg
   ├─ facility-02.jpg
   ├─ facility-03.jpg
   ├─ treatment-01.jpg
   ├─ treatment-02.jpg
   └─ IMAGE-GUIDE.md
```

## 이름과 문구 바꾸기

VS Code에서 `Ctrl + Shift + H`를 눌러 전체 찾기/바꾸기를 사용하세요.

- 한글 병원명: `세온`
- 영문 병원명: `SEON`
- 전화번호: `02.000.0000`과 `0200000000`
- 주소: `서울특별시 강남구 테헤란로 000`
- 대표원장: `김도윤`

주요 색상은 `style.css` 맨 위의 `:root` 변수에서 한 번에 변경할 수 있습니다.

## 이미지 바꾸기

`images` 폴더에서 같은 파일명으로 교체하면 바로 적용됩니다. 권장 크기와 용도는 `images/IMAGE-GUIDE.md`에 정리되어 있습니다.

## GitHub Pages 배포

1. 이 폴더 안의 파일을 GitHub 저장소 최상위에 업로드합니다.
2. 저장소의 `Settings → Pages`로 이동합니다.
3. `Deploy from a branch`를 선택합니다.
4. 사용할 브랜치와 `/ (root)`를 선택하고 저장합니다.

주의:

- `index.html`은 반드시 저장소 최상위에 두세요.
- 파일명 대소문자와 HTML 속 이미지 경로가 정확히 같아야 합니다.
- 상대 경로(`./images/...`)를 사용하므로 프로젝트형 Pages 주소에서도 작동합니다.
- 수정 후 예전 화면이 보이면 `Ctrl + F5`로 강력 새로고침하세요.
- 실제 고객용으로 사용할 때는 SAMPLE 표시와 가상 정보를 실제 정보로 바꾸되, 의료광고 관련 법규를 별도로 확인하세요.

## 포함된 인터랙션

- 2~3초 인트로와 커튼 전환
- Hero 글자 Reveal과 Cinematic Zoom
- Glass Header와 Scroll Progress
- 방향별 Section Reveal과 이미지 Clip Reveal
- 숫자 Counting Animation
- 카드 Stagger와 Hover Motion
- Sticky 강조 문구와 스크롤 기반 단어 변화
- 가로 드래그 시설 갤러리
- 후기 Marquee
- Custom Cursor, Magnetic Button, Back To Top
- 모바일 Full Screen Menu
- 모션 감소 설정 대응
