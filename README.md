

# 🗺️ 이거말해 (SayThis)

### AI 기반 여행 회화 생성기

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://say-this.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**해외 여행지에서 필요한 현지 언어 표현을 AI가 실시간으로 생성해주는 웹 애플리케이션**

[🌐 Link](https://say-this.vercel.app/) 



---

## 📖 프로젝트 소개

**이거말해(SayThis)**는 해외 여행을 준비하는 한국인을 위한 AI 기반 여행 회화 생성기입니다.

### 💡 개발 배경

- 여행지마다 필요한 현지 언어 표현이 다르지만, 일반적인 회화책은 실제 상황에 맞지 않는 경우가 많습니다
- 여행 전 매번 관광지별로 필요한 표현을 찾아보는 것이 번거롭습니다
- Google Gemini AI를 활용하여 특정 장소에 맞춤화된 실용적인 회화를 자동 생성합니다

### 🎯 주요 타겟

- 해외 여행을 계획 중인 한국인
- 여행 전 기본적인 현지 언어 표현을 빠르게 학습하고 싶은 사람
- 여러 여행지를 방문할 예정이며 각 장소별 맞춤 회화가 필요한 여행객

---

## ✨ 주요 기능

### 🗺️ 인터랙티브 지도 기반 장소 선택
- Google Maps API를 활용한 직관적인 장소 선택
- 주소 검색 자동완성 기능
- 지도 클릭으로 간편한 마커 추가/삭제

### 🤖 AI 기반 맞춤형 회화 생성
- **Google Gemini AI**를 활용한 실시간 회화 생성
- 선택한 장소의 특성을 반영한 실용적인 표현 제공
- 여러 장소에 대한 회화를 병렬 처리로 빠르게 생성

### 🌏 다국어 지원
- **영어 원문**: 현지에서 사용할 정확한 표현
- **한국어 발음**: 영어를 모르는 사용자도 쉽게 따라 읽을 수 있는 발음 표기
- **한국어 번역**: 표현의 의미를 명확하게 이해

### 🔐 개인정보 보호
- API 키는 브라우저에만 저장 (서버 전송 없음)
- 사용자의 데이터는 어디에도 저장되지 않음

---

## 🛠️ 기술 스택

### Frontend
- **React 19** - 최신 React 기능 활용
- **TypeScript** - 타입 안정성 및 개발 생산성 향상
- **Vite** - 빠른 개발 환경 및 빌드

### APIs & Services
- **Google Gemini API** - AI 기반 회화 생성
- **Google Maps JavaScript API** - 지도 및 장소 검색

### Deployment
- **Vercel** - 자동 배포 및 CDN

### Styling
- **Tailwind CSS** (유틸리티 기반 스타일링)

---

## 📂 프로젝트 구조

```
SayThis/
├── components/           # React 컴포넌트
│   ├── Map.tsx          # Google Maps 통합
│   ├── PhraseCard.tsx   # 회화 카드 UI
│   ├── PlacesAutocomplete.tsx  # 장소 검색 자동완성
│   ├── ApiKeyModal.tsx  # API 키 안내 모달
│   ├── WelcomeNotice.tsx # 환영 안내
│   ├── Loader.tsx       # 로딩 인디케이터
│   └── icons.tsx        # SVG 아이콘 컴포넌트
├── services/            # 비즈니스 로직
│   └── geminiService.ts # Gemini API 통신
├── App.tsx              # 메인 앱 컴포넌트
├── types.ts             # TypeScript 타입 정의
├── index.tsx            # 앱 진입점
└── vite.config.ts       # Vite 설정
```

---

## 🚀 설치 및 실행

### 사전 요구사항

- **Node.js** (v18 이상 권장)
- **Gemini API Key** ([Google AI Studio에서 발급](https://aistudio.google.com/app/apikey))
- **Google Maps API Key** (선택사항, 로컬 개발용)

### 설치 방법

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/SayThis.git
   cd SayThis
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

---

## 📱 사용 방법

### 1️⃣ 지도에서 여행지 선택
- 검색창에 여행지 이름 입력하거나 지도를 직접 클릭
- 마커가 추가되면 해당 장소가 목록에 표시됩니다
- 마커를 다시 클릭하면 삭제됩니다

### 2️⃣ Gemini API 키 입력
- [Google AI Studio](https://aistudio.google.com/app/apikey)에서 무료 API 키 발급
- API 키 입력 후 "저장" 버튼 클릭
- API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다

### 3️⃣ AI 회화 생성
- "AI로 N개 장소 표현 생성하기" 버튼 클릭
- 각 장소에 맞는 실용적인 회화가 자동 생성됩니다
- 영어 원문, 한국어 발음, 한국어 번역이 함께 제공됩니다

---

## 🎨 기술적 특징

### 1. TypeScript 기반 타입 안정성
- 엄격한 타입 체크로 런타임 에러 방지
- IDE 자동완성으로 개발 생산성 향상
- 인터페이스 기반 데이터 구조 설계

```typescript
export interface Place {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number; };
  countryCode: string;
}

export interface Phrase {
  original?: string;
  pronunciation?: string;
  korean: string;
}
```

### 2. Promise.all을 통한 병렬 처리
- 여러 장소의 회화를 동시에 생성
- 순차 처리 대비 대폭 향상된 성능
- 각 API 호출의 실패를 독립적으로 처리

```typescript
const phrasePromises = selectedPlaces.map(place =>
  generateTravelPhrases(place.name, place.countryCode, apiKey)
    .then(phrases => ({ placeId: place.id, data: phrases }))
    .catch(error => ({ placeId: place.id, error }))
);

const results = await Promise.all(phrasePromises);
```

### 3. 사용자 경험 최적화
- **로딩 상태 표시**: 사용자에게 진행 상황 피드백
- **에러 핸들링**: 명확한 에러 메시지 제공
- **Welcome Notice**: 첫 방문 사용자를 위한 안내
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응

### 4. API 키 보안
- 클라이언트 사이드에서만 API 키 관리
- 서버로 전송하지 않아 유출 위험 최소화
- localStorage 활용 (세션 유지)

---

## 🔧 향후 개선 계획

- [ ] **오프라인 모드**: 생성된 회화를 로컬에 저장하여 인터넷 없이도 확인
- [ ] **음성 재생 기능**: TTS를 활용한 발음 듣기
- [ ] **PDF 내보내기**: 생성된 회화를 PDF로 다운로드
- [ ] **카테고리별 회화**: 식당, 교통, 숙박 등 상황별 분류
- [ ] **즐겨찾기 기능**: 자주 사용하는 표현 저장
- [ ] **다국어 UI**: 영어, 일본어, 중국어 등 UI 언어 선택

---


## 📬 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락주세요!


- **Email**: gnhmoney09042@gmail.com


---


**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요! ⭐**

Made with ❤️ by verystrongdeveloper


