const imageApi = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'

export const visual = (prompt: string, size = 'landscape_4_3') =>
  `${imageApi}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`

export const prompts = [
  '周五晚上，和三个朋友在静安寺附近，想吃顿不吵又有惊喜的饭',
  '一个人，想在上海找家有阳光、适合看书一整天的咖啡馆',
  '周末和爸妈出门，少一点排队，多一点舒服，预算人均三百',
  '想看个展，再随便走到天黑',
]

export const portraits = [
  {
    name: '阿澄',
    wish: '周五，四个人想好好聊',
    prompt: prompts[0],
    image: visual('editorial portrait photograph of a stylish young Chinese woman with short black hair laughing naturally at an outdoor cafe in Shanghai, warm late afternoon sunlight, coral jacket, authentic skin texture, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'Leo',
    wish: '看完展，再走到天黑',
    prompt: prompts[3],
    image: visual('editorial portrait photograph of a young Chinese man with round glasses in a contemporary art gallery, relaxed candid expression, cobalt blue overshirt, soft window light, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'Momo',
    wish: '有阳光和插座，就能待很久',
    prompt: prompts[1],
    image: visual('editorial portrait photograph of a creative young Chinese woman with long dark hair and silver earrings standing in a modern bookshop, gentle genuine smile, sage green outfit, soft daylight, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: '阿岚',
    wish: '四种口味，也能吃到一起',
    prompt: '四个人想吃炭火料理，口味不同也能吃得舒服',
    image: visual('editorial portrait photograph of a stylish young Chinese man with short textured hair in a refined open kitchen restaurant, warm amber light, rust orange jacket, candid confident expression, premium lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: '小周',
    wish: '听完现场，再找个能聊天的地方',
    prompt: '今晚想听现场，之后找个能继续聊天的地方',
    image: visual('editorial portrait photograph of a creative young Chinese man with earphones around neck on a Shanghai rooftop at blue hour, violet and coral city lights, relaxed candid smile, premium nightlife magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'CC',
    wish: '陪爸妈，少排一点队',
    prompt: prompts[2],
    image: visual('editorial portrait photograph of a warm young Chinese woman with a ponytail in a green urban park, soft morning sunlight, pale yellow cardigan, natural joyful expression, premium family lifestyle magazine photography, no text, no logos', 'square'),
  },
  {
    name: 'Ken',
    wish: '酒要好喝，音乐别盖住说话声',
    prompt: '找一家自然酒好喝、音乐不吵的小酒馆',
    image: visual('editorial portrait photograph of a sophisticated young Chinese man with neat black hair in a small natural wine bar, soft cream and coral interior, gentle window light, candid relaxed expression, premium lifestyle photography, no text, no logos', 'square'),
  },
  {
    name: '阿禾',
    wish: '不做攻略，去湖边走半天',
    prompt: '不想做攻略，离开城市半天就好',
    image: visual('editorial portrait photograph of an outdoorsy young Chinese woman with shoulder length hair beside a peaceful emerald lake, airy natural daylight, sage outdoor jacket, authentic relaxed smile, premium travel magazine photography, no text, no logos', 'square'),
  },
]

export type HeroWishPerson = {
  id: string
  name: string
  category: string
  wish: string
  image: string
}

export const heroWishPeople: HeroWishPerson[] = [
  { ...portraits[0], id: 'acheng', category: '朋友聚餐' },
  { ...portraits[1], id: 'leo', category: '看展散步' },
  { ...portraits[2], id: 'momo', category: '独处咖啡' },
  { ...portraits[3], id: 'alan', category: '炭火料理' },
  { ...portraits[4], id: 'xiaozhou', category: '现场音乐' },
  { ...portraits[5], id: 'cc', category: '陪爸妈' },
  { ...portraits[6], id: 'ken', category: '自然酒' },
  { ...portraits[7], id: 'ahe', category: '近郊出走' },
  {
    id: 'lulu',
    name: '露露',
    category: '烘焙',
    wish: '想找个能慢慢揉面的地方，把下午烤得香一点',
    image: `${import.meta.env.BASE_URL}hero-lulu.jpg`,
  },
  {
    id: 'aze',
    name: '阿泽',
    category: '宠物友好',
    wish: '想带小狗出门，也能安心吃顿饭',
    image: `${import.meta.env.BASE_URL}hero-aze.jpg`,
  },
  {
    id: 'xiaoji',
    name: '小季',
    category: '夜骑',
    wish: '想沿着江边骑一圈，再看城市亮灯',
    image: `${import.meta.env.BASE_URL}hero-xiaoji.jpg`,
  },
  {
    id: 'xixi',
    name: '西西',
    category: '周末市集',
    wish: '不赶时间，想去市集淘点生活的小惊喜',
    image: `${import.meta.env.BASE_URL}hero-xixi.jpg`,
  },
  {
    id: 'chenmo',
    name: '陈默',
    category: '独立书店',
    wish: '想找家安静书店，读完最近没看完的书',
    image: `${import.meta.env.BASE_URL}hero-chenmo.jpg`,
  },
  {
    id: 'liangxia',
    name: '梁夏',
    category: '茶馆',
    wish: '想找个清净地方，和妈妈慢慢喝壶茶',
    image: `${import.meta.env.BASE_URL}hero-liangxia.jpg`,
  },
  {
    id: 'yinuo',
    name: '一诺',
    category: '手作体验',
    wish: '想亲手做点什么，把这个周末留下来',
    image: `${import.meta.env.BASE_URL}hero-yinuo.jpg`,
  },
  {
    id: 'xiangbei',
    name: '向北',
    category: '城市漫步',
    wish: '想挑一条没走过的老街，边走边拍',
    image: `${import.meta.env.BASE_URL}hero-xiangbei.jpg`,
  },
  {
    id: 'mumu',
    name: '木木',
    category: '摇摆舞',
    wish: '想学一支摇摆舞，不认识人也能跳得开心',
    image: `${import.meta.env.BASE_URL}hero-mumu.jpg`,
  },
  {
    id: 'xiaoyu',
    name: '小雨',
    category: '城市晨跑',
    wish: '想找条不晒的河边路线，慢慢跑完五公里',
    image: `${import.meta.env.BASE_URL}hero-xiaoyu.jpg`,
  },
  {
    id: 'taotao',
    name: '桃桃',
    category: '亲子剧场',
    wish: '想带孩子看场好戏，也能让他坐得住',
    image: `${import.meta.env.BASE_URL}hero-taotao_1.jpg`,
  },
  {
    id: 'kui',
    name: '阿葵',
    category: '居家花艺',
    wish: '想学一束不费力的桌花，让家里有点新鲜感',
    image: `${import.meta.env.BASE_URL}hero-kui.jpg`,
  },
  {
    id: 'dachuan',
    name: '大川',
    category: '山系露营',
    wish: '想去山里住一晚，装备简单也能睡得舒服',
    image: `${import.meta.env.BASE_URL}hero-dachuan.jpg`,
  },
  {
    id: 'lizi',
    name: '栗子',
    category: '胶片摄影',
    wish: '想带着旧相机扫街，把普通一天留下来',
    image: `${import.meta.env.BASE_URL}hero-lizi.jpg`,
  },
  {
    id: 'asen',
    name: '阿森',
    category: '深夜食堂',
    wish: '加班后想吃碗热的，一个人也不用赶时间',
    image: `${import.meta.env.BASE_URL}hero-asen.jpg`,
  },
  {
    id: 'qiaoqiao',
    name: '乔乔',
    category: '桌游组局',
    wish: '想找几个好相处的人，边玩边认识新朋友',
    image: `${import.meta.env.BASE_URL}hero-qiaoqiao.jpg`,
  },
  {
    id: 'youzi',
    name: '柚子',
    category: '瑜伽舒展',
    wish: '下班后想拉拉筋，把一天的紧绷慢慢放下',
    image: `${import.meta.env.BASE_URL}hero-youzi.jpg`,
  },
  {
    id: 'shitou',
    name: '石头',
    category: '室内攀岩',
    wish: '想第一次试试攀岩，有人教也不用拼体力',
    image: `${import.meta.env.BASE_URL}hero-shitou.jpg`,
  },
  {
    id: 'xiaoman',
    name: '小满',
    category: '社区菜市',
    wish: '想逛个有烟火气的菜市，顺手买齐今晚的菜',
    image: `${import.meta.env.BASE_URL}hero-xiaoman.jpg`,
  },
  {
    id: 'qiaoan',
    name: '乔安',
    category: '爵士黑胶',
    wish: '想找个能认真听歌的地方，把一张唱片听完',
    image: `${import.meta.env.BASE_URL}hero-qiaoan.jpg`,
  },
]

export type Place = {
  id: number
  name: string
  kind: string
  area: string
  score: number
  price: string
  distance: string
  image: string
  reason: string
  details: string[]
}

export const places: Place[] = [
  {
    id: 1,
    name: '序·小馆',
    kind: '创意江浙菜',
    area: '静安寺',
    score: 4.8,
    price: '¥268 / 人',
    distance: '步行 6 分钟',
    image: visual('beautiful intimate modern Jiangnan restaurant interior in Shanghai, warm amber pendant lights, sculptural cream walls, a table for four beside a window, subtle greenery, editorial hospitality photography, realistic, no people facing camera, no text, no logos'),
    reason: '四人桌不挤，聊天不用提高音量',
    details: ['靠窗四人桌坐得宽松', '周五 19:30 可以订到', '熟醉蟹偏甜，适合一起分着尝'],
  },
  {
    id: 2,
    name: '岚山厨房',
    kind: '炭火料理',
    area: '愚园路',
    score: 4.7,
    price: '¥320 / 人',
    distance: '骑行 9 分钟',
    image: visual('refined open charcoal kitchen in a contemporary Shanghai restaurant, chef counter with warm wood and dark stone, delicate plated seasonal dishes, cinematic editorial food photography, realistic, no visible text, no logos'),
    reason: '圆桌能坐开，炭火套餐选择多',
    details: ['板前和四人圆桌都能选', '口味不同，也能各点各的', '21 点以后人声会少一些'],
  },
  {
    id: 3,
    name: '浮生酒馆',
    kind: '自然酒 · 小食',
    area: '胶州路',
    score: 4.6,
    price: '¥198 / 人',
    distance: '步行 12 分钟',
    image: visual('small sophisticated natural wine bar in Shanghai at blue hour, intimate tables, soft coral and cream interior, beautiful glassware and share plates, cinematic editorial hospitality photography, realistic, no visible text, no logos'),
    reason: '饭后不用赶路，21:00 后还能再坐坐',
    details: ['小桌之间留有空隙', '音乐不会盖住说话声', '自然酒可以按杯慢慢试'],
  },
]

export const truthInsights = {
  能不能聊天: {
    summary: '靠窗四人桌能正常说话，七点以后店里热闹，但不用扯着嗓子。',
    signals: ['靠窗和内侧桌距都比较宽松', '周五 19—20 点人声最多', '想安静一点，可以备注靠窗位置'],
    quote: '我们四个人聊到快打烊，也没觉得要端着说话，背景音乐刚刚好。',
  },
  菜合不合口味: {
    summary: '熟醉蟹偏甜，时蔬清爽。第一次来，点几道一起分比单人套餐更合适。',
    signals: ['熟醉蟹酒香甜口，不爱甜可以少点', '时蔬和豆腐口味更清爽', '四个人点五道菜，分量刚好'],
    quote: '菜不是只做给镜头看的，熟醉蟹有记忆点，但偏甜，还好我们是一起分着吃。',
  },
  临时有事怎么办: {
    summary: '订位备注会回复，临时晚到可以先打个电话，店里会帮忙留一小会儿。',
    signals: ['订位备注通常当天回复', '生日或不喝酒可以提前说', '高峰时段临时加座比较困难'],
    quote: '朋友临时晚了二十分钟，提前打电话说了，到店还是坐到了原本订的靠窗桌。',
  },
}

export type World = {
  id: string
  name: string
  en: string
  color: string
  scene: string
  people: string
  budget: string
  prompt: string
  title: string
  description: string
  image: string
  stops: { time: string; name: string; meta: string; note: string }[]
}

export const worlds: World[] = [
  {
    id: 'taste',
    name: '饭后坐坐',
    en: 'FRIDAY NIGHT',
    color: '#ff6b3d',
    scene: '静安寺 · 晚餐与散步',
    people: '阿澄和三位朋友',
    budget: '晚餐人均约 ¥300',
    prompt: prompts[0],
    title: '吃完饭，要不要再去坐坐？',
    description: '先在序·小馆好好吃饭，沿街走一小段，再去浮生酒馆接着聊。不用赶场，也不用把今晚排得太满。',
    image: visual('overhead editorial photograph of a joyful modern Chinese dinner table with several colorful seasonal shared dishes, friends hands reaching for food, warm ambient restaurant light, authentic premium food magazine style, no text, no logos'),
    stops: [
      { time: '19:00', name: '序·小馆', meta: '创意江浙菜 · 静安寺', note: '四人桌不挤，聊天不用提高音量' },
      { time: '20:45', name: '静安寺街头', meta: '饭后散步 · 约 15 分钟', note: '沿着胶州路慢慢走，不急着转场' },
      { time: '21:00', name: '浮生酒馆', meta: '自然酒 · 胶州路', note: '音乐不吵，再坐一会儿刚刚好' },
    ],
  },
  {
    id: 'coffee',
    name: '一个人待下午',
    en: 'SLOW AFTERNOON',
    color: '#a8d8b9',
    scene: '五原路 · 咖啡与书',
    people: '一个人也很好',
    budget: '¥35—80 / 人',
    prompt: prompts[1],
    title: '留一张桌子，给不赶时间的你。',
    description: '先找有阳光的窗边，再确认插座和下午的人流。带一本没看完的书，咖啡喝完也不用着急走。',
    image: visual('sunlit independent specialty coffee shop in Shanghai, large windows, leafy plants, pale wood tables, one open book and ceramic coffee cup, quiet morning atmosphere, editorial interior photography, no text, no logos'),
    stops: [
      { time: '13:00', name: '白昼咖啡', meta: '手冲 · 五原路', note: '早一点到，窗边光线更舒服' },
      { time: '15:00', name: '片刻 Coffee', meta: '社区咖啡 · 新华路', note: '插座充足，久坐也自在' },
      { time: '17:00', name: '屿岛烘焙', meta: '咖啡烘焙 · 延平路', note: '带一包浅烘豆，把下午带回家' },
    ],
  },
  {
    id: 'parents',
    name: '陪爸妈过周末',
    en: 'FAMILY WEEKEND',
    color: '#e9b85f',
    scene: '青浦 · 公园与便饭',
    people: '和爸妈一起',
    budget: '人均约 ¥300',
    prompt: prompts[2],
    title: '少排一点队，多陪爸妈坐一会儿。',
    description: '早一点出门，把长队、赶路和不方便走的路放到一边。中午好好吃饭，下午在水边慢慢走。',
    image: portraits[5].image,
    stops: [
      { time: '09:00', name: '青西郊野公园', meta: '水上森林 · 青浦', note: '早到一小时，人少也有地方坐' },
      { time: '12:00', name: '朱家角新街', meta: '家常小馆 · 朱家角', note: '避开主街，吃饭不用排长队' },
      { time: '15:00', name: '淀山湖环湖道', meta: '湖畔散步 · 青浦', note: '挑一段有树荫的平路，慢慢走' },
    ],
  },
  {
    id: 'art',
    name: '看展再散步',
    en: 'ART & WALK',
    color: '#b8a5f5',
    scene: '徐汇滨江 · 展览与书店',
    people: '一个人或同频好友',
    budget: '¥0—180 / 人',
    prompt: prompts[3],
    title: '看完展，别急着叫车。',
    description: '把展览、江边和一家书店串起来。中间留出坐下来翻几页书的时间，走到天黑也没有关系。',
    image: visual('contemporary art museum interior in Shanghai with monumental colorful abstract installation, a few young visitors seen from behind, dramatic skylight, lavender and blush accents, premium editorial architecture photography, no text, no logos'),
    stops: [
      { time: '14:00', name: '西岸美术馆', meta: '当代艺术 · 徐汇滨江', note: '先预约，16 点后江边光线更柔和' },
      { time: '16:30', name: '群岛 Books', meta: '独立书店 · 乌鲁木齐南路', note: '看完展，适合再翻一小时书' },
      { time: '18:00', name: '衡复风貌馆', meta: '城市建筑 · 复兴西路', note: '沿街慢慢走，把散步留到天黑' },
    ],
  },
  {
    id: 'escape',
    name: '去附近透口气',
    en: 'A LITTLE ESCAPE',
    color: '#81c9ed',
    scene: '湖边、树荫与短途出走',
    people: '朋友或全家出行',
    budget: '¥200—600 / 人',
    prompt: '不想做攻略，离开城市半天就好',
    title: '不用去远方，也能换一口空气。',
    description: '只安排一片湖、一段有树荫的路和一顿便饭。停车和休息点先看清楚，到了以后就不用一直看手机。',
    image: visual('peaceful emerald lake and green hills near Shanghai on a clear day, young Chinese friends walking on a wooden lakeside path seen from behind, airy natural light, premium travel editorial photography, no text, no logos'),
    stops: [
      { time: '09:30', name: '青西郊野公园', meta: '水上森林 · 青浦', note: '早到一小时，人少很多' },
      { time: '13:30', name: '淀山湖环湖道', meta: '湖畔骑行 · 青浦', note: '只走有树荫的轻松路线' },
      { time: '16:00', name: '朱家角新街', meta: '古镇小食 · 朱家角', note: '避开主街也能吃得好' },
    ],
  },
  {
    id: 'night',
    name: '夜晚慢慢聊',
    en: 'AFTER DARK',
    color: '#f29abd',
    scene: '现场、天台与深夜小馆',
    people: '同频朋友 2—6 人',
    budget: '¥120—400 / 人',
    prompt: '今晚不想太吵，但也不想太早结束',
    title: '今晚不用太早结束，也不用一直喊。',
    description: '听完一场现场，换到能正常说话的小酒馆。末班车之前，再留一点时间给宵夜。',
    image: visual('stylish Shanghai rooftop gathering at dusk, small group of young Chinese friends laughing, city lights in background, coral and violet ambient lighting, authentic premium nightlife editorial photography, no text, no logos'),
    stops: [
      { time: '20:30', name: '回声 Live', meta: '独立现场 · 普陀', note: '今晚有一场新乐队' },
      { time: '22:15', name: '浮生酒馆', meta: '自然酒 · 胶州路', note: '适合聊天，不用提高音量' },
      { time: '23:45', name: '宵夜晚晚', meta: '深夜小馆 · 巨鹿路', note: '用一顿热乎宵夜收尾' },
    ],
  },
]
