export const titles = [
  {
    id: "small",
    name: "소규모 전시",
  },
  {
    id: "club",
    name: "그리미주아 특별 전시회",
  },
  {
    id: "gallery",
    name: "미술관 소규모 전시",
  },
  {
    id: "test",
    name: "테스트",
  },
];

export const exhibitions: Record<
  string,
  { title: string; arts: { name: string; arts: string[] }[] }
> = {
  small: {
    title: "소규모 전시",
    arts: [],
  },
  club: {
    title: "그리미주아 특별 전시회",
    arts: [],
  },
  gallery: {
    title: "미술관 소규모 전시회",
    arts: [],
  },
  test: {
    title: "테스트 ",
    arts: [
      {
        name: "빈센트 반 고흐",
        arts: ["별이 빛나는 밤", "해바라기"],
      },
      {
        name: "클리드 모네",
        arts: ["인상, 해돋이", "정원의 여인들"],
      },
    ],
  },
};

export const arts: Record<
  string,
  { title: string; images: string[]; artist: string; description: string }
> = {
  "별이 빛나는 밤": {
    title: "별이 빛나는 밤",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/450px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    ],
    description:
      "《별이 빛나는 밤》(영어: The Starry Night)은 네덜란드의 화가 빈센트 반 고흐의 가장 널리 알려진 작품이자 정신병을 앓고 있을 당시 고흐가 그린 그림이다. 1889년 생레미의 정신병원에서 고흐는 정신적 질환으로 인한 고통을 떠올려 그림 속의 소용돌이로 묘사했다.",
    artist: "반 고흐",
  },
  해바라기: {
    title: "해바라기",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vincent_Willem_van_Gogh_128.jpg/450px-Vincent_Willem_van_Gogh_128.jpg",
    ],
    description:
      "《해바라기》는 빈센트 반 고흐가 그린 정물화이다. 이 그림은 두 가지 버전이 있는데, 첫 번째는 1887년 파리에서 그린 바닥에 놓여있는 해바라기이며, 두 번째는 1년 뒤 아를에서 그린 꽃병에 담긴 해바라기이다.",
    artist: "반 고흐",
  },
};
