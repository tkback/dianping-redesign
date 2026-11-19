const imageApi = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

export const visual = (prompt: string, size = 'landscape_4_3') =>
  `${imageApi}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`

export const prompts = [
  '周五晚上，和三个朋友在静安寺附近，想吃顿不吵又有惊喜的饭',
  '一个人，想在上海找家有阳光、适合看书一整天的咖啡馆',
  '周末和爸妈出门，少一点排队，多一点舒服，预算人均三百',
]

export const portraits = [
  {
    name: '阿澄',
    role: '城市漫游者',
    story: '她总在周五找一张不用提高音量、可以聊到打烊的桌子。',
    place: '序·小馆 · 静安寺',
    prompt: prompts[0],
    image: visual('editorial portrait photograph of a stylish young Chinese woman with short black hair laughing naturally at an outdoor cafe in Shanghai, warm late afternoon sunlight, coral jacket, authentic skin texture, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'Leo',
    role: '周末企划人',
    story: '他把新展、独立书店和一顿晚餐，排成一条不赶路的散步路线。',
    place: '西岸美术馆 → 群岛 Books',
    prompt: '想看个展，再随便走到天黑',
    image: visual('editorial portrait photograph of a young Chinese man with round glasses in a contemporary art gallery, relaxed candid expression, cobalt blue overshirt, soft window light, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'Momo',
    role: '灵感收藏家',
    story: '她收藏的不是网红店，是有阳光、插座和一本好书的一下午。',
    place: '白昼咖啡 · 五原路',
    prompt: prompts[1],
    image: visual('editorial portrait photograph of a creative young Chinese woman with long dark hair and silver earrings standing in a modern bookshop, gentle genuine smile, sage green outfit, soft daylight, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: '阿岚',
    role: '风味侦察员',
    story: '他不只追新店，更在意炭火、季节和一桌人能否各取所需。',
    place: '岚山厨房 · 愚园路',
    prompt: '四个人想吃炭火料理，口味不同也能吃得舒服',
    image: visual('editorial portrait photograph of a stylish young Chinese man with short textured hair in a refined open kitchen restaurant, warm amber light, rust orange jacket, candid confident expression, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: '小周',
    role: '城市夜行者',
    story: '他的夜晚从一场新乐队开始，但不必在震耳欲聋里结束。',
    place: '回声 Live → 浮生酒馆',
    prompt: '今晚想听现场，之后找个能继续聊天的地方',
    image: visual('editorial portrait photograph of a creative young Chinese man with earphones around neck on a Shanghai rooftop at blue hour, violet and coral city lights, relaxed candid smile, premium nightlife magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'CC',
    role: '家庭周末主理人',
    story: '她做攻略的第一原则，是让爸妈少排队、多坐一会儿。',
    place: '青西郊野公园 · 青浦',
    prompt: prompts[2],
    image: visual('editorial portrait photograph of a warm young Chinese woman with a ponytail in a green urban park, soft morning sunlight, pale yellow cardigan, natural joyful expression, premium family lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'Ken',
    role: '微醺地图员',
    story: '他记得每家酒馆的音乐声量，也知道哪张桌子最适合续摊。',
    place: '浮生酒馆 · 胶州路',
    prompt: '找一家自然酒好喝、音乐不吵的小酒馆',
    image: visual('editorial portrait photograph of a sophisticated young Chinese man with neat black hair in a small natural wine bar, soft cream and coral interior, gentle window light, candid relaxed expression, premium lifestyle photography, no text, no logos', 'square'),
  },
  {
    name: '阿禾',
    role: '自然出逃者',
    story: '她不做长攻略，一片湖、一段树荫路，就能给周末换个频率。',
    place: '淀山湖环湖道 · 青浦',
    prompt: '不想做攻略，离开城市半天就好',
    image: visual('editorial portrait photograph of an outdoorsy young Chinese woman with shoulder length hair beside a peaceful emerald lake, airy natural daylight, sage outdoor jacket, authentic relaxed smile, premium travel magazine photography, no text, no logos', 'square'),
  },
]

export type Place = {
  id: number
  name: string
  kind: string
  area: string
  score: number
  match: number
  price: string
  distance: string
  image: string
  reason: string
  details: string[]
  tags: string[]
}

export const places: Place[] = [
  {
    id: 1,
    name: '序·小馆',
    kind: '创意江浙菜',
    area: '静安寺',
    score: 4.8,
    match: 96,
    price: '¥268 / 人',
    distance: '步行 6 分钟',
    image: visual('beautiful intimate modern Jiangnan restaurant interior in Shanghai, warm amber pendant lights, sculptural cream walls, a table for four beside a window, subtle greenery, editorial hospitality photography, realistic, no people facing camera, no text, no logos'),
    reason: '聊天声量低于同商圈 78% 的餐厅',
    details: ['四人桌间距宽松', '近期评价提及"有惊喜" 46 次', '周五 19:30 可订'],
    tags: ['适合聊天', '创意菜', '可预订'],
  },
  {
    id: 2,
    name: '岚山厨房',
    kind: '炭火料理',
    area: '愚园路',
    score: 4.7,
    match: 91,
    price: '¥320 / 人',
    distance: '骑行 9 分钟',
    image: visual('refined open charcoal kitchen in a contemporary Shanghai restaurant, chef counter with warm wood and dark stone, delicate plated seasonal dishes, cinematic editorial food photography, realistic, no visible text, no logos'),
    reason: '套餐选择多，四个人也能各取所需',
    details: ['板前与圆桌可选', '近 30 天好评率 94%', '夜宵时段更安静'],
    tags: ['炭火', '多人聚餐', '夜宵'],
  },
  {
    id: 3,
    name: '浮生酒馆',
    kind: '自然酒 · 小食',
    area: '胶州路',
    score: 4.6,
    match: 87,
    price: '¥198 / 人',
    distance: '步行 12 分钟',
    image: visual('small sophisticated natural wine bar in Shanghai at blue hour, intimate tables, soft coral and cream interior, beautiful glassware and share plates, cinematic editorial hospitality photography, realistic, no visible text, no logos'),
    reason: '氛围松弛，饭后还能接着聊一会儿',
    details: ['自然酒选择丰富', '21:00 后无需等位', '适合饭后续摊'],
    tags: ['自然酒', '氛围感', '小聚'],
  },
]

export const truthInsights = {
  氛围: {
    score: 92,
    summary: '"有氛围"不是滤镜，是多数人的共同感受。',
    signals: ['暖光与桌距被反复提及', '工作日 19 点后人声明显增多', '靠窗位更适合拍照，内侧更适合聊天'],
    quote: '不是那种要端着说话的店，灯光好看，但我们聊到打烊也很自在。',
  },
  口味: {
    score: 89,
    summary: '招牌菜表现稳定，清爽口味获得更高共识。',
    signals: ['招牌熟醉蟹推荐率 94%', '近三个月"过咸"反馈下降', '第一次来更适合双人分享套餐'],
    quote: '菜不是只做给镜头看的，熟醉蟹和时蔬都很有记忆点。',
  },
  服务: {
    score: 86,
    summary: '高峰响应略慢，但预订与特殊需求处理可靠。',
    signals: ['预订备注回复通常小于 10 分钟', '生日布置需提前一天沟通', '周末高峰加水平均等待 6 分钟'],
    quote: '提前说了有老人，到店直接安排了更方便的位置，很加分。',
  },
}

export type World = {
  id: string
  name: string
  en: string
  color: string
  secondary: string
  scene: string
  people: string
  budget: string
  prompt: string
  title: string
  description: string
  image: string
  stops: { name: string; meta: string; note: string }[]
}

export const worlds: World[] = [
  {
    id: 'taste',
    name: '吃点好的',
    en: 'TASTE',
    color: '#ff6b3d',
    secondary: '#ffc45e',
    scene: '街角新味与人气小馆',
    people: '2—4 位饭搭子',
    budget: '¥150—350 / 人',
    prompt: '想吃点认真的，但不想太正式',
    title: '今天这顿，吃点有记忆的。',
    description: '不只按菜系找店。把此刻的心情、同桌的人和预算放在一起，让每一餐都有自己的理由。',
    image: visual('overhead editorial photograph of a joyful modern Chinese dinner table with several colorful seasonal shared dishes, friends hands reaching for food, warm ambient restaurant light, authentic premium food magazine style, no text, no logos'),
    stops: [
      { name: '序·小馆', meta: '创意江浙菜 · 静安寺', note: '适合认真聊天的一桌菜' },
      { name: '岚山厨房', meta: '炭火料理 · 愚园路', note: '四种口味也能吃到一起' },
      { name: '浮生酒馆', meta: '自然酒 · 胶州路', note: '把晚餐延长成好夜晚' },
    ],
  },
  {
    id: 'coffee',
    name: '咖啡日常',
    en: 'COFFEE',
    color: '#a8d8b9',
    secondary: '#e9e1a6',
    scene: '阳光窗边与社区咖啡',
    people: '一个人也很好',
    budget: '¥35—80 / 人',
    prompt: '有阳光、有插座，可以慢慢待一下午',
    title: '留一张桌子，给不赶时间的你。',
    description: '把光线、插座、人流和咖啡风味变成能找到的条件，而不只是照片里的美好想象。',
    image: visual('sunlit independent specialty coffee shop in Shanghai, large windows, leafy plants, pale wood tables, one open book and ceramic coffee cup, quiet morning atmosphere, editorial interior photography, no text, no logos'),
    stops: [
      { name: '白昼咖啡', meta: '手冲 · 五原路', note: '10 点前有最好的窗边光' },
      { name: '片刻 Coffee', meta: '社区咖啡 · 新华路', note: '插座充足，久坐也自在' },
      { name: '屿岛烘焙', meta: '咖啡烘焙 · 延平路', note: '浅烘果香是近期高分项' },
    ],
  },
  {
    id: 'art',
    name: '看展散步',
    en: 'CULTURE',
    color: '#b8a5f5',
    secondary: '#f3b7d3',
    scene: '新展、书店与城市转角',
    people: '独处或同频好友',
    budget: '¥0—180 / 人',
    prompt: '想看个展，再随便走到天黑',
    title: '让好奇心，决定今天的路线。',
    description: '从一个展览出发，把附近的书店、建筑和休息点串成一条不赶路的城市散步。',
    image: visual('contemporary art museum interior in Shanghai with monumental colorful abstract installation, a few young visitors seen from behind, dramatic skylight, lavender and blush accents, premium editorial architecture photography, no text, no logos'),
    stops: [
      { name: '西岸美术馆', meta: '当代艺术 · 徐汇滨江', note: '先预约，16 点后光线更好' },
      { name: '群岛 Books', meta: '独立书店 · 乌鲁木齐南路', note: '看完展，适合再待一小时' },
      { name: '衡复风貌馆', meta: '城市建筑 · 复兴西路', note: '把散步变成读懂城市' },
    ],
  },
  {
    id: 'escape',
    name: '附近透口气',
    en: 'ESCAPE',
    color: '#81c9ed',
    secondary: '#aee4d6',
    scene: '水边、森林与短途出走',
    people: '朋友或全家出行',
    budget: '¥200—600 / 人',
    prompt: '不想做攻略，离开城市半天就好',
    title: '不用远方，也能换一口空气。',
    description: '按可用时间和同行人筛选周边目的地，路线、停车、吃饭和休息一次安排清楚。',
    image: visual('peaceful emerald lake and green hills near Shanghai on a clear day, young Chinese friends walking on a wooden lakeside path seen from behind, airy natural light, premium travel editorial photography, no text, no logos'),
    stops: [
      { name: '青西郊野公园', meta: '水上森林 · 青浦', note: '早到一小时，人少很多' },
      { name: '淀山湖环湖道', meta: '湖畔骑行 · 青浦', note: '有树荫的轻松路线' },
      { name: '朱家角新街', meta: '古镇小食 · 朱家角', note: '避开主街也能吃得好' },
    ],
  },
  {
    id: 'night',
    name: '夜晚开场',
    en: 'NIGHT',
    color: '#f29abd',
    secondary: '#8b79ef',
    scene: '天台、现场与深夜小馆',
    people: '同频朋友 2—6 人',
    budget: '¥120—400 / 人',
    prompt: '今晚不想太吵，但也不想太早结束',
    title: '夜晚很长，不必只去一种地方。',
    description: '从音乐、酒、晚餐到末班交通，把"今晚去哪"变成一条真正适合你们的夜间路线。',
    image: visual('stylish Shanghai rooftop gathering at dusk, small group of young Chinese friends laughing, city lights in background, coral and violet ambient lighting, authentic premium nightlife editorial photography, no text, no logos'),
    stops: [
      { name: '回声 Live', meta: '独立现场 · 普陀', note: '今晚 20:30 有一场新乐队' },
      { name: '浮生酒馆', meta: '自然酒 · 胶州路', note: '适合聊天，不用提高音量' },
      { name: '宵夜晚晚', meta: '深夜小馆 · 巨鹿路', note: '营业到 01:30 的温柔收尾' },
    ],
  },
]
