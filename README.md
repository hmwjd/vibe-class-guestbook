# Our Class Guestbook

지금부터 나와 함께 '바이브 코딩'으로 완성도 높은 웹페이지를 만들 거야. 너는 나의 전문 웹 개발자 비서야. 

내가 만드는 웹사이트의 주제는 [우리반 방명록]이야. 주로 [우리반 친구들]이 볼 페이지야.

아래에 제공하는 [구조], [기능], [디자인] 조건들을 모두 만족하는 완벽한 하나의 웹페이지를 만들어 줘. 코딩을 공부하려는 게 아니니 코드 설명은 생략하고, 내가 브라우저에서 바로 확인하거나 결과물을 볼 수 있도록 완전한 결과(HTML/CSS/JS 통합 코드)만 출력해 줘.

[1. 구조 요청사항]

- 맨 위(Header): "교실 한 칸, 우리들의 방명록 📝"이라는 큰 제목, 사이트 설명문, 그리고 메뉴 3개 ("방명록 쓰기", "친구들의 한마디 보기", "우리반 약속")를 담은 내비게이션 바를 넣어줘. 각 영역은 구분이 명확하도록 포근한 도트/대시 스타일의 구분선(hr)으로 나눠줘.

- 가운데(Main): 아래의 세 가지 세션이 순서대로 들어가야 해.

  1. 방명록 작성 폼 영역

  2. 친구들이 남긴 이야기(방명록 리스트) 출력 영역

  3. 우리반 방명록 약속(안내문) 영역

- 맨 아래(Footer): "© 2026 우리 반 방명록 Project. Created by 우리반 프론트엔드 개발자" 저작권 표시와 반장에게 건의하라는 안내 문구 추가.

[2. 기능 요청사항]

- 방명록 작성 양식에는 [번호(숫자 입력)], [이름(텍스트 입력)], [내용(남길 한마디, textarea)], [카드 배경색 선택(드롭다운: 노란색, 파란색, 초록색)] 입력을 만들어 줘.

- 사용자가 정보를 입력하고 '등록하기' 버튼을 누르면, 화면 새로고침 없이 자바스크립트(JS)를 통해 메인 화면 아래 '친구들이 남긴 이야기' 컨테이너에 새로운 방명록 카드(<article>)가 동적으로 추가되게 해줘.

- 새로운 카드가 등록될 때마다 상단의 "현재 등록된 방명록: X개"라는 숫자가 자동으로 카운트업(증가)되어야 해.

- 새 카드가 생성될 때 실제 등록되는 순간의 날짜와 시간(예: 2026년 7월 2일 13:10)이 자동으로 계산되어 카드 하단에 표시되어야 해.

- 악의적인 스크립트 실행을 방지하기 위해 입력값은 안전하게 텍스트화(HTML Escape)해서 출력해 주고, 등록이 완료되면 입력 폼은 초기화되면서 새로 쓴 카드로 화면이 부드럽게 스크롤 이동(scrollIntoView)되게 해줘.

- 기본 화면에는 가사 데이터를 담은 예시 카드 3개(1번 김철수-노란색, 15번 이영희-파란색, 7번 박민수-초록색)가 미리 채워져 있어야 해.

[3. 디자인 요청사항]

- 전체 분위기: "따뜻하고 귀여운 파스텔톤"이 나는 요즘 스타일의 세련되고 현대적인 디자인. 스마트폰 모바일 화면에서도 깨지지 않고 잘 보이는 완벽한 반응형 레이아웃이어야 해.

- 글꼴 및 텍스트: 따뜻한 손글씨 감성의 구글 웹폰트 'Gowun Dodum'(고운돋움)을 연동해 주고, 텍스트 색상은 딱딱한 검은색 대신 포근한 초콜릿빛 다크 브라운(#4a3e3d)을 사용해 줘.

- 색상 조합: 전체 배경은 눈이 편안한 크림 화이트/오프화이트(#faf6f0)를 사용하고, 헤더 제목은 파스텔 코랄 레드(#ff8a80), 섹션 제목은 파스텔 살구 오렌지(#ffab91)로 포인트를 줘.

- 카드 디자인: 사용자가 선택한 배경색에 따라 '버터크림 옐로우', '소프트 스카이 블루', '애플 민트 그린' 파스텔톤 색상이 카드 배경과 테두리에 알맞게 매칭되도록 CSS 스타일을 짜줘.

- 디테일 & 효과: 전체적인 사각형 모서리들을 둥글고 몽글몽글하게 처리하고, 은은한 그림자(box-shadow) 효과를 넣어 부드러운 입체감을 살려줘. 메뉴 링크나 등록 버튼, 방명록 카드에 마우스를 올리면 위로 살짝 솟아오르거나 색상이 스르륵 변하는 부드러운 전환 효과(hover transition)를 적용해 줘.

이 조건들을 모두 합친 최종 완성본 웹페이지 통합 코드를 보여줘!

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vibe-class-guestbook.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b183f013-5283-4bb8-a915-1b3febcf816d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
