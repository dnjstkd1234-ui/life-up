import { 
  CoachInfo, 
  CoachingCategoryInfo, 
  EventCalendarItem, 
  NewsNoticeItem, 
  UserReviewItem 
} from '../types';

export const HERO_SLIDES = [
  {
    id: 1,
    tag: 'PREMIUM LIFE AWAKENING',
    title: '더 나은 삶으로 이어지는\n성장과 통찰의 공간,\n라이프업과 함께하세요',
    subtitle: '혼자서만 끙끙 앓던 고민, 이제 끝내세요. 검증된 1:1 맞춤 AI 계몽 멘토와 심층 진단 리포트로 당신의 인지적 맹점을 깨워드립니다.',
    bgImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80',
    primaryCta: '1,990원 1회 리딩 시작하기',
    secondaryCta: '프로그램 자세히 보기',
    highlightBadge: '1,990원 단일 프리미엄 1회권'
  },
  {
    id: 2,
    tag: 'DEEP INSIGHT REPORT',
    title: '단 한 번의 강력한 통찰로\n당신의 하루를 깨우는\n1:1 맞춤 진단 리포트',
    subtitle: '인지 왜곡을 깨부수고 메타인지를 켭니다. 나만을 위한 날카로운 통찰 질문과 실천 미션을 담은 리포트를 받아보세요.',
    bgImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1920&q=80',
    primaryCta: '운명 통찰 리포트 생성',
    secondaryCta: '성공 후기 확인하기',
    highlightBadge: '1,990원 운명 통찰 리포트'
  },
  {
    id: 3,
    tag: 'THE MASTERS PROGRAM',
    title: '번아웃 극복부터 커리어 도약까지\n인생 2막을 여는\n마스터 솔루션',
    subtitle: '국내 최고 전문 멘토진과 설계한 체계적인 메타인지 프로그램으로 방황하던 일상에 확실한 이정표를 세워드립니다.',
    bgImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80',
    primaryCta: '1:1 심층 진단 시작',
    secondaryCta: '혜택 보기',
    highlightBadge: '라이프업 심층 진단 진행 중'
  }
];

export const QUICK_LINKS = [
  {
    id: 'calendar',
    title: '코칭 일정표',
    desc: '이번 달 특강 및 모집 기간',
    icon: 'Calendar',
    badge: '실시간'
  },
  {
    id: 'programs',
    title: '프로그램 안내',
    desc: '맞춤형 코칭 & 챌린지',
    icon: 'FileText',
    badge: 'BEST'
  },
  {
    id: 'directions',
    title: '오시는 길 & 센터',
    desc: '강남 본원 및 온라인 상담실',
    icon: 'MapPin',
    badge: '안내'
  }
];

export const COACH_LIST: CoachInfo[] = [
  {
    id: 'mindset',
    name: '김서연 수석 코치',
    role: '멘탈 힐링 & 자존감 회복 수석 디렉터',
    specialty: '번아웃 회복, 감정 조절, 자아 존중감 강화',
    tagline: '흔들리지 않는 단단한 마음의 중심을 함께 찾습니다.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    experience: '국제코칭연맹(ICF) PCC 인증 / 누적 3,200시간 코칭',
    accentColor: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'career',
    name: '박민우 마스터 코치',
    role: '커리어 도약 & 목표 달성 전문 코치',
    specialty: '이직/승진 로드맵, 프로덕티비티, 실행력 극대화',
    tagline: '막연한 꿈을 현실의 구체적인 결과물로 바꿉니다.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    experience: '전 대기업 HR 디렉터 / 연간 목표달성률 94%',
    accentColor: 'from-indigo-600 to-blue-500'
  },
  {
    id: 'routine',
    name: '이지안 루틴 코치',
    role: '모닝 루틴 & 습관 설계 전문가',
    specialty: '미루는 습관 교정, 시간 관리, 데일리 리추얼',
    tagline: '하루 5분의 작은 실행이 인생의 방향을 바꿉니다.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    experience: '습관 형성 챌린지 10만 수료생 배출',
    accentColor: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'burnout',
    name: '최현석 전문의/상담사',
    role: '스트레스 완화 & 심리 케어 전문의',
    specialty: '직무 스트레스, 대인관계 경계 설정, 불안 해소',
    tagline: '지친 마음에 숨 쉴 수 있는 따뜻한 쉼표를 드립니다.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    experience: '임상심리전문가 1급 / 기업 EAP 전문 상담사',
    accentColor: 'from-sky-600 to-blue-400'
  }
];

export const COACHING_CATEGORIES: CoachingCategoryInfo[] = [
  {
    id: 'daily_care',
    name: '데일리 모닝 케어',
    badge: '인기 1위',
    description: '매일 아침 8시 카카오톡 알림톡으로 전송되는 맞춤 질문과 하루 실행 미션',
    targetAudience: '작심삼일을 탈출하고 매일 아침 긍정적인 에너지를 채우고 싶은 분',
    starterPrompt: '오늘 하루 나를 가장 설레게 만드는 일은 무엇인가요?'
  },
  {
    id: 'career_boost',
    name: '커리어 & 목표 설계',
    badge: '추천',
    description: '구체적인 커리어 로드맵, 미루기 습관 타파, 비즈니스 몰입 전략 수립',
    targetAudience: '이직, 승진, 새로운 도전을 준비하며 명확한 실행 계획이 필요한 분',
    starterPrompt: '올해 안에 반드시 달성하고 싶은 핵심 목표 1가지는 무엇인가요?'
  },
  {
    id: 'mindset_recovery',
    name: '멘탈 케어 & 자존감',
    badge: '힐링',
    description: '남과의 비교, 자책, 자존감 저하에서 벗어나 나만의 당당한 속도를 찾는 여정',
    targetAudience: '주변 시선에 지치고 내면의 회복탄력성을 높이고 싶은 분',
    starterPrompt: '최근 나를 가장 불안하게 하거나 힘들게 했던 순간은 언제였나요?'
  },
  {
    id: 'habit_routine',
    name: '습관 형성 챌린지',
    badge: '성장',
    description: '운동, 독서, 자기계발 등 21일/66일 자동화 습관 설계 및 매일 피드백',
    targetAudience: '매번 결심만 하고 포기했던 루틴을 완전히 내 것으로 만들고 싶은 분',
    starterPrompt: '내 삶에 가장 정착시키고 싶은 단 하나의 건강한 습관은 무엇인가요?'
  }
];

export const CALENDAR_EVENTS: EventCalendarItem[] = [
  {
    id: 'ev-1',
    day: 5,
    month: 1,
    year: 2025,
    title: '라이프업 신년 성장 챌린지 1기 등록 오픈',
    dateStr: '2025. 01. 20 - 2025. 01. 25',
    category: '모집',
    badgeColor: 'bg-blue-600 text-white',
    linkText: '상세 일정 확인'
  },
  {
    id: 'ev-2',
    day: 16,
    month: 1,
    year: 2025,
    title: '2기 중급 및 마스터반 우선 등록 기간',
    dateStr: '2025. 01. 16 - 2025. 01. 19',
    category: '모집',
    badgeColor: 'bg-indigo-600 text-white',
    linkText: '등록 바로가기'
  },
  {
    id: 'ev-3',
    day: 22,
    month: 1,
    year: 2025,
    title: '직장인 번아웃 힐링 특강 라이브 웨비나',
    dateStr: '2025. 01. 22 - 2025. 01. 28',
    category: '특강',
    badgeColor: 'bg-emerald-600 text-white',
    linkText: '무료 사전예약'
  }
];

export const NEWS_AND_NOTICES: NewsNoticeItem[] = [
  {
    id: 'news-1',
    category: '수강모집',
    title: '2025년 상반기 1:1 집중 라이프 코칭 3기 신규 모집',
    summary: '새해를 맞이하여 1:1 맞춤 커리어 및 멘탈 케어 집중 수강생을 모집합니다. 선착순 30명 마감.',
    date: '2025.01.18',
    isNew: true
  },
  {
    id: 'news-2',
    category: '공지사항',
    title: '카카오톡 모닝케어 알림톡 시스템 업그레이드 안내',
    summary: '이제 고객님이 원하는 시간(오전 6시~10시)을 10분 단위로 정밀하게 설정하여 맞춤 알림톡을 받으실 수 있습니다.',
    date: '2025.01.15',
    isNew: true
  },
  {
    id: 'news-3',
    category: '언론보도',
    title: '라이프업, "2024 대한민국 자기계발 & 라이프케어 부문 대상" 수상',
    summary: '누적 수강생 1만 2천 명 돌파 및 높은 만족도로 혁신 브랜드 대상을 수상하였습니다.',
    date: '2025.01.10',
    isNew: false
  },
  {
    id: 'news-4',
    category: '공지사항',
    title: '결제 회원 대상 "웰컴 성장 진단 리포트" 발송 개시',
    summary: '리딩을 시작하신 모든 회원님들께 AI 정밀 멘탈 & 메타인지 분석 리포트를 맞춤형으로 제공합니다.',
    date: '2025.01.05',
    isNew: false
  }
];

export const USER_REVIEWS: UserReviewItem[] = [
  {
    id: 'rev-1',
    author: '김*현 님 (30대 직장인)',
    role: '마케팅 팀장',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: '쾌적한 힐링의 장소, 매일 아침이 기다려져요!',
    content: '업무 스트레스로 번아웃이 심했는데, 매일 아침 카톡으로 오는 맞춤 질문에 5분씩 답하면서 제 감정을 객관적으로 보게 됐어요. 2달 만에 에너지를 완전히 되찾았습니다.',
    date: '2025.01.16',
    program: '데일리 모닝케어'
  },
  {
    id: 'rev-2',
    author: '이*우 님 (20대 취준생)',
    role: '신입 개발자 합격',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: '막막했던 취업과 미래 설계에 완벽한 나침반!',
    content: '혼자 준비할 때는 불안감 때문에 늘 미루기만 했는데, 박민우 코치님의 1:1 로드맵 설계 덕분에 우선순위를 정하고 목표했던 IT 대기업 이직에 성공했습니다!',
    date: '2025.01.14',
    program: '커리어 부스트 8주'
  },
  {
    id: 'rev-3',
    author: '최*정 님 (40대 워킹맘)',
    role: '스타트업 대표',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: '모두의 완벽한 쉼터! 가족과 삶의 균형을 찾았습니다',
    content: '일과 육아에 치여 나 자신을 잃어버렸을 때 라이프업을 만났어요. 무조건적인 위로가 아니라 실질적인 시간 관리와 자존감 회복 훈련을 주셔서 진심으로 감사합니다.',
    date: '2025.01.12',
    program: '멘탈 & 자존감 회복'
  },
  {
    id: 'rev-4',
    author: '정*훈 님 (30대 프리랜서)',
    role: '디자이너',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    title: '완벽한 멘탈 코칭! 작심삼일이던 제가 달라졌어요',
    content: '의지박약이라 어떤 습관 앱도 3일을 못 넘겼는데, 라이프업의 1:1 AI 상호작용과 따뜻한 피드백은 차원이 다릅니다. 벌써 100일 연속 모닝 루틴 성공 중입니다.',
    date: '2025.01.09',
    program: '습관 루틴 챌린지'
  }
];

export const PHOTO_GALLERY = [
  {
    id: 'photo-1',
    title: '주말 오프라인 멘탈 힐링 워크숍',
    desc: '서로의 성장을 응원하는 따뜻한 커뮤니티',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photo-2',
    title: '1:1 프라이빗 집중 상담실',
    desc: '편안하고 아늑한 분위기에서 나누는 깊은 대화',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photo-3',
    title: '수강생 목표 달성 축하 파티',
    desc: '변화된 일상을 함께 축하하는 소중한 순간',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80'
  }
];
