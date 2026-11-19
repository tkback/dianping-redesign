import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  Quote,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UsersRound,
  Vote,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import { places, portraits, prompts, truthInsights, worlds } from './data'
import HeroWishWorld from './HeroWishWorld'

const logo = `${import.meta.env.BASE_URL}dianping-official.png`

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

type SceneKey = 'dinner' | 'coffee' | 'parents' | 'art'
type DemoStep = 'wish' | 'wishes' | 'conditions' | 'confirm' | 'thinking' | 'answer'

type SceneConfig = {
  person: (typeof portraits)[number]
  worldId: string
  conditions: string[]
  thinking: string[]
}

const sceneConfigs: Record<SceneKey, SceneConfig> = {
  dinner: {
    person: portraits[0],
    worldId: 'taste',
    conditions: ['4 人', '周五晚', '静安寺', '人均约 ¥300', '能聊天', '有点新意'],
    thinking: ['我先把太吵和超预算的店放到一边', '再看看最近去过的人怎么说', '这三家，值得你们挑一挑'],
  },
  coffee: {
    person: portraits[2],
    worldId: 'coffee',
    conditions: ['1 人', '待一下午', '有阳光', '有插座', '适合看书', '不用赶路'],
    thinking: ['我先把拥挤和不便久坐的店放到一边', '再看看窗边光线和插座的位置', '这条咖啡路线，可以慢慢待一下午'],
  },
  parents: {
    person: portraits[5],
    worldId: 'parents',
    conditions: ['和爸妈一起', '周末出门', '少排队', '少走路', '人均约 ¥300', '有地方休息'],
    thinking: ['我先把要排长队和路难走的地方放到一边', '再看看吃饭和休息是不是方便', '这条路线，让爸妈少走一点、多坐一会儿'],
  },
  art: {
    person: portraits[1],
    worldId: 'art',
    conditions: ['1—2 人', '下午出发', '先看展', '附近散步', '有书店', '走到天黑'],
    thinking: ['我先把绕路和太赶的安排放到一边', '再看看闭馆时间和沿途休息的地方', '这条路线，看完展还能慢慢走到天黑'],
  },
}

const heroPeople = [portraits[0], portraits[2], portraits[5], portraits[1]]

const examples = [
  { label: '独处咖啡', prompt: prompts[1] },
  { label: '陪爸妈', prompt: prompts[2] },
  { label: '看展散步', prompt: prompts[3] },
]

function matchScene(value: string): SceneKey | null {
  const text = value.replace(/\s/g, '')
  if (!text || text === prompts[0]) return 'dinner'
  if (text === prompts[1]) return 'coffee'
  if (text === prompts[2]) return 'parents'
  if (text === prompts[3]) return 'art'
  if (/咖啡|独处|看书|一个人.*下午/.test(text)) return 'coffee'
  if (/爸妈|父母|陪爸|陪妈/.test(text)) return 'parents'
  if (/看展|展览|美术馆|散步/.test(text)) return 'art'
  if (/周五|三个朋友|三人|四位朋友|静安寺|不吵|惊喜/.test(text) && /饭|吃|餐厅|晚餐|聚餐/.test(text)) return 'dinner'
  return null
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 34 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })
  const searchInput = useRef<HTMLInputElement>(null)
  const worldReturnFocus = useRef<HTMLButtonElement | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState(prompts[0])
  const [submittedQuery, setSubmittedQuery] = useState(prompts[0])
  const [activeScene, setActiveScene] = useState<SceneKey>('dinner')
  const [demoStep, setDemoStep] = useState<DemoStep>('wish')
  const [demoRun, setDemoRun] = useState(0)
  const [thinkingLine, setThinkingLine] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState(places[0].id)
  const [saved, setSaved] = useState<number[]>([1])
  const [insightTab, setInsightTab] = useState<keyof typeof truthInsights>('能不能聊天')
  const [activeWorld, setActiveWorld] = useState(0)
  const [worldOpen, setWorldOpen] = useState(false)
  const [votes, setVotes] = useState([2, 1, 1])
  const [voted, setVoted] = useState<number[]>([])
  const [planReady, setPlanReady] = useState(false)
  const [helpful, setHelpful] = useState(false)
  const [notice, setNotice] = useState('')

  const world = worlds[activeWorld]
  const insight = truthInsights[insightTab]
  const currentPlace = places.find((place) => place.id === selectedPlace) ?? places[0]
  const currentScene = sceneConfigs[activeScene]
  const sceneWorldIndex = Math.max(0, worlds.findIndex((item) => item.id === currentScene.worldId))
  const sceneWorld = worlds[sceneWorldIndex]
  const savedPlaces = places.filter((place) => saved.includes(place.id))
  const otherWishes = heroPeople.filter((person) => person.name !== currentScene.person.name)

  useEffect(() => {
    const updateNav = () => setScrolled(window.scrollY > 28)
    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    return () => window.removeEventListener('scroll', updateNav)
  }, [])

  useEffect(() => {
    if (reduced) {
      setDemoStep((current) => (current === 'answer' ? 'answer' : 'confirm'))
      return
    }
    setDemoStep('wish')
    const timers = [
      window.setTimeout(() => setDemoStep('wishes'), 1050),
      window.setTimeout(() => setDemoStep('conditions'), 2400),
      window.setTimeout(() => setDemoStep('confirm'), 4000),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [activeScene, demoRun, reduced])

  useEffect(() => {
    if (demoStep !== 'thinking') return
    if (reduced) {
      setDemoStep('answer')
      return
    }
    const timers = [
      window.setTimeout(() => setThinkingLine(1), 700),
      window.setTimeout(() => setThinkingLine(2), 1400),
      window.setTimeout(() => setDemoStep('answer'), 2400),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [demoStep, reduced])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3200)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!worldOpen) return
    const returnTarget = worldReturnFocus.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWorldOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      returnTarget?.focus()
    }
  }, [worldOpen])

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const replayDemo = () => {
    setThinkingLine(0)
    setDemoStep(reduced ? 'confirm' : 'wish')
    setDemoRun((current) => current + 1)
  }

  const runSearch = (event: FormEvent) => {
    event.preventDefault()
    const nextQuery = query.trim()
    const scene = matchScene(nextQuery)
    if (!scene) {
      setNotice('这条心愿还没有预置答案，请选择下方示例，或保留默认的周五晚餐。')
      return
    }
    const matchedQuery = nextQuery || prompts[0]
    setQuery(matchedQuery)
    setSubmittedQuery(matchedQuery)
    setActiveScene(scene)
    setActiveWorld(Math.max(0, worlds.findIndex((item) => item.id === sceneConfigs[scene].worldId)))
    replayDemo()
    goTo('tonight')
  }

  const showAnswer = () => {
    setThinkingLine(0)
    setDemoStep(reduced ? 'answer' : 'thinking')
  }

  const toggleSaved = (id: number) => {
    const isSaved = saved.includes(id)
    setSaved((current) => (isSaved ? current.filter((item) => item !== id) : [...current, id]))
    setNotice(isSaved ? '已从今晚的收藏里移除' : '已收藏，收尾时还能再看到')
  }

  const castVote = (index: number) => {
    if (voted.includes(index)) {
      setVotes((current) => current.map((count, item) => (item === index ? count - 1 : count)))
      setVoted((current) => current.filter((item) => item !== index))
      setNotice('已撤销这一票')
    } else {
      setVotes((current) => current.map((count, item) => (item === index ? count + 1 : count)))
      setVoted((current) => [...current, index])
      setNotice('这一票记下了，再点一次可以撤销')
    }
    setPlanReady(false)
  }

  const openWorld = (trigger: HTMLButtonElement) => {
    worldReturnFocus.current = trigger
    setWorldOpen(true)
  }

  const backToSearch = () => {
    goTo('top')
    searchInput.current?.focus({ preventScroll: true })
  }

  const replayTonight = () => {
    replayDemo()
    goTo('tonight')
  }

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <header className={`topbar ${scrolled ? 'topbar--scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="大众点评 Redesign 首页">
          <img src={logo} alt="大众点评" />
          <span>REDESIGN</span>
        </a>
        <nav className="main-nav" aria-label="主导航">
          <a href="#top">说说今天</a>
          <a href="#tonight">今晚的安排</a>
          <a href="#truth">真实评价</a>
          <a href="#worlds">饭后灵感</a>
          <a href="#together">一起决定</a>
        </nav>
        <button className="nav-cta" onClick={backToSearch}>
          说说今天 <ArrowUpRight size={16} strokeWidth={1.8} />
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-glow hero-glow--one" aria-hidden="true" />
          <div className="hero-glow hero-glow--two" aria-hidden="true" />
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle size={14} /> 把喜欢的生活，说给朋友听
              <span>CONCEPT 2026</span>
            </motion.div>
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              今天，想过成
              <br />
              <em>什么样？</em>
            </motion.h1>
            <motion.p
              className="hero-intro"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              不用想关键词。说说和谁在一起、想做什么，我陪你把这一天安排好。
            </motion.p>

            <motion.form
              className="hero-search"
              onSubmit={runSearch}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
            >
              <div className="search-field">
                <Search size={21} aria-hidden="true" />
                <input
                  ref={searchInput}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="描述今天想怎么过"
                  placeholder="说说和谁在一起、想做什么"
                />
              </div>
              <button className="search-submit" type="submit">
                帮我找找 <ArrowRight size={18} />
              </button>
            </motion.form>

            <motion.div
              className="prompt-row"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <span>也可以试试</span>
              {examples.map((example) => (
                <button type="button" key={example.label} onClick={() => setQuery(example.prompt)}>
                  {example.label}
                </button>
              ))}
            </motion.div>
            <p className="search-note">固定生活场景演示，选一个心愿就能看到对应的整理过程。</p>
          </div>

          <HeroWishWorld />

          <a className="scroll-cue" href="#tonight">
            <span>看看心愿怎么变成安排</span>
            <ArrowDown size={17} />
          </a>
        </section>

        <section className="section tonight-section" id="tonight">
          <Reveal className="section-heading">
            <div className="section-kicker"><span>01</span> FROM A WISH TO A PLAN</div>
            <div className="heading-grid">
              <h2>一个人的心愿，<br /><em>变成今晚的安排。</em></h2>
              <p>先看看别人也在想什么，再回到你的这一天。我会把条件记清楚，等你确认了，再往下找。</p>
            </div>
          </Reveal>

          <Reveal className="wish-demo" delay={0.08}>
            <div className="wish-demo-head">
              <div className="wish-demo-person">
                <img src={currentScene.person.image} alt={currentScene.person.name} />
                <div><strong>{currentScene.person.name}的心愿</strong><span>固定演示 · 确认后才给出答案</span></div>
              </div>
              <button type="button" onClick={replayDemo}><RotateCcw size={15} /> 重看一遍</button>
            </div>

            <div className="wish-demo-stage" aria-live="polite">
              <AnimatePresence mode="wait">
                {demoStep === 'wish' && (
                  <motion.div
                    className="demo-wish-single"
                    key="wish"
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  >
                    <span className="demo-step-label">01 · 一个人的诉求</span>
                    <img src={currentScene.person.image} alt={currentScene.person.name} />
                    <h3>{currentScene.person.name}说</h3>
                    <p>“{submittedQuery}”</p>
                  </motion.div>
                )}

                {demoStep === 'wishes' && (
                  <motion.div
                    className="demo-wish-stream"
                    key="wishes"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  >
                    <span className="demo-step-label">02 · 每个人想要的这一天，都不太一样</span>
                    <div className="wish-stream-grid">
                      {otherWishes.map((person, index) => (
                        <motion.div
                          className="wish-stream-card"
                          key={person.name}
                          initial={reduced ? false : { opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.22, duration: 0.55 }}
                        >
                          <img src={person.image} alt={person.name} />
                          <strong>{person.name}</strong>
                          <p>“{person.prompt}”</p>
                        </motion.div>
                      ))}
                    </div>
                    <p className="wish-stream-note">看过这些心愿，再回到{currentScene.person.name}的这一天。</p>
                  </motion.div>
                )}

                {(demoStep === 'conditions' || demoStep === 'confirm') && (
                  <motion.div
                    className="demo-confirmation"
                    key="confirmation"
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  >
                    <div className="confirmation-query">
                      <span className="demo-step-label">03 · 我记住了</span>
                      <p>“{submittedQuery}”</p>
                      <div className="understood-tags">
                        {currentScene.conditions.map((condition) => <span key={condition}>{condition}</span>)}
                      </div>
                    </div>
                    <div className="confirmation-action">
                      {demoStep === 'conditions' ? (
                        <div className="remembering"><span /><span /><span /> 正在把这些条件放在一起</div>
                      ) : (
                        <>
                          <h3>就按这些，帮你看看今晚怎么安排？</h3>
                          <p>你确认之后，我再继续整理。</p>
                          <button className="confirm-button" type="button" onClick={showAnswer}>
                            看看今晚的安排 <ArrowRight size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {demoStep === 'thinking' && (
                  <motion.div
                    className="demo-thinking"
                    key="thinking"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                  >
                    <span className="demo-step-label">04 · 像朋友一样，帮你多看几眼</span>
                    <h3>你先坐一会儿，我来理一理。</h3>
                    <div className="thinking-lines">
                      {currentScene.thinking.map((line, index) => (
                        <div className={`${thinkingLine === index ? 'active' : ''} ${thinkingLine > index ? 'done' : ''}`} key={line}>
                          {thinkingLine > index ? <Check size={17} /> : <span>{index + 1}</span>}
                          <p>{line}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {demoStep === 'answer' && (
                  <motion.div
                    className="demo-answer"
                    key={`answer-${activeScene}`}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="answer-heading">
                      <CheckCircle2 size={25} />
                      <div>
                        <span>05 · 我帮你先挑好了</span>
                        <h3>{activeScene === 'dinner' ? '这三家，都适合你们慢慢聊。' : sceneWorld.title}</h3>
                      </div>
                    </div>

                    {activeScene === 'dinner' ? (
                      <div className="demo-answer-places">
                        {places.map((place) => (
                          <article key={place.id}>
                            <img src={place.image} alt={`${place.name}的空间与菜品`} />
                            <div><strong>{place.name}</strong><span>{place.kind} · {place.price}</span><p>{place.reason}</p></div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="demo-answer-route">
                        <img src={sceneWorld.image} alt={`${sceneWorld.name}生活场景`} />
                        <div>
                          <span>{sceneWorld.people} · {sceneWorld.budget}</span>
                          <div className="answer-route-stops">
                            {sceneWorld.stops.map((stop) => (
                              <p key={stop.name}><strong>{stop.time}</strong><span>{stop.name}</span><small>{stop.note}</small></p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      className="answer-button"
                      type="button"
                      onClick={() => {
                        if (activeScene === 'dinner') goTo('shortlist')
                        else {
                          setActiveWorld(sceneWorldIndex)
                          goTo('worlds')
                        }
                      }}
                    >
                      {activeScene === 'dinner' ? '看看为什么适合你们' : '看看这条路线'} <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </section>

        <section className="section shortlist-section" id="shortlist">
          <Reveal className="section-heading section-heading--light">
            <div className="section-kicker"><span>02</span> THREE GOOD PLACES</div>
            <div className="heading-grid">
              <h2>这三家，<br /><em>都适合你们慢慢聊。</em></h2>
              <p>四个人，人均三百元左右。我把安静、坐得舒服和一点新意放在前面，留下这三家。</p>
            </div>
          </Reveal>

          <Reveal className="decision-demo" delay={0.08}>
            <div className="demo-topbar">
              <div className="demo-brand"><UsersRound size={17} /> 阿澄和朋友的晚餐</div>
              <div className="demo-status">固定生活案例 · 点一点看看理由</div>
              <button onClick={() => setNotice('本次固定条件：4 人 · 周五晚 · 静安寺 · 人均约 ¥300 · 能聊天 · 有点新意')}>
                <SlidersHorizontal size={16} /> 看看本次条件
              </button>
            </div>
            <div className="demo-query">
              <span>阿澄的周五心愿</span>
              <p>“{activeScene === 'dinner' ? submittedQuery : prompts[0]}”</p>
              <div className="understood-tags">
                <span>4 人</span><span>周五晚</span><span>静安寺</span><span>能聊天</span><span>有点新意</span>
              </div>
            </div>
            <div className="decision-grid">
              <div className="results-panel">
                <div className="results-title">
                  <div><span>不用再看一长串</span><strong>先从这三家挑</strong></div>
                  <span>点一家，看看具体理由</span>
                </div>
                <div className="place-list">
                  {places.map((place, index) => (
                    <motion.article
                      layout
                      className={`place-card ${selectedPlace === place.id ? 'place-card--selected' : ''}`}
                      key={place.id}
                    >
                      <button className="place-main" onClick={() => setSelectedPlace(place.id)} aria-label={`看看${place.name}为什么适合这顿饭`}>
                        <div className="place-image-wrap">
                          <img src={place.image} alt={`${place.name}的空间与菜品`} loading="lazy" />
                          <span className="place-rank">0{index + 1}</span>
                        </div>
                        <div className="place-info">
                          <div className="place-title-row">
                            <div><h3>{place.name}</h3><p>{place.kind} · {place.area}</p></div>
                          </div>
                          <p className="place-reason"><CheckCircle2 size={15} /> {place.reason}</p>
                          <div className="place-meta">
                            <span><Star size={12} fill="currentColor" /> {place.score} 分</span>
                            <span>{place.price}</span><span>{place.distance}</span>
                          </div>
                        </div>
                      </button>
                      <button
                        className={`place-save ${saved.includes(place.id) ? 'place-save--active' : ''}`}
                        onClick={() => toggleSaved(place.id)}
                        aria-label={saved.includes(place.id) ? `取消收藏${place.name}` : `收藏${place.name}`}
                      >
                        <Bookmark size={17} fill={saved.includes(place.id) ? 'currentColor' : 'none'} />
                      </button>
                    </motion.article>
                  ))}
                </div>
              </div>
              <aside className="decision-reasons">
                <div className="reason-label">为什么适合这顿饭</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPlace.id}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3>{currentPlace.name}</h3>
                    <p className="reason-summary">我把你们说的“能好好聊”放在前面，再看了看桌位、订位和最近去过的人怎么说。</p>
                    <ul>
                      {currentPlace.details.map((detail) => <li key={detail}><CheckCircle2 size={17} /> {detail}</li>)}
                    </ul>
                    <div className="reason-route">
                      <Navigation size={18} />
                      <div><strong>{currentPlace.distance}</strong><span>从静安寺站出发，饭后也方便再走走</span></div>
                    </div>
                    <button className="primary-button" onClick={() => toggleSaved(currentPlace.id)}>
                      {saved.includes(currentPlace.id) ? '已收藏这家店' : '收藏这家店'}
                      {saved.includes(currentPlace.id) ? <Check size={17} /> : <Bookmark size={17} />}
                    </button>
                  </motion.div>
                </AnimatePresence>
              </aside>
            </div>
          </Reveal>
        </section>

        <section className="section truth-section" id="truth">
          <Reveal className="section-heading">
            <div className="section-kicker"><span>03</span> NOTES FROM REAL VISITS</div>
            <div className="heading-grid">
              <h2>到底吵不吵，<br /><em>去过的人最有发言权。</em></h2>
              <p>我翻了近期的到店评价，把重复、只有表情和缺少细节的内容放在一边。</p>
            </div>
          </Reveal>

          <div className="truth-layout">
            <Reveal className="truth-visual">
              <img src={places[0].image} alt="序·小馆靠窗四人桌" loading="lazy" />
              <div className="truth-photo-badge"><MessageCircle size={17} /> 阿澄 · 周五四人晚餐</div>
              <div className="review-float review-float--one">
                <div className="review-avatar">澄</div>
                <div><strong>“靠窗这桌，正常说话就听得到。”</strong><span>周五 21:14 · 四人用餐</span></div>
              </div>
              <div className="review-float review-float--two">
                <span>订位便签</span><strong>周五 19:30</strong><small>可以提前订</small>
              </div>
            </Reveal>

            <Reveal className="truth-panel" delay={0.1}>
              <div className="truth-panel-head">
                <div><Quote size={20} /><span>去过的人这样说</span></div>
                <span>近期评价 · 固定演示</span>
              </div>
              <div className="truth-question">
                <MessageCircle size={21} />
                <div><span>这顿饭前，你可能还想问</span><strong>{insightTab}</strong></div>
              </div>
              <div className="truth-tabs" role="tablist" aria-label="想了解的用餐问题">
                {(Object.keys(truthInsights) as (keyof typeof truthInsights)[]).map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={insightTab === tab}
                    className={insightTab === tab ? 'active' : ''}
                    onClick={() => setInsightTab(tab)}
                  >{tab}</button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  className="truth-insight"
                  key={insightTab}
                  initial={reduced ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  role="tabpanel"
                >
                  <h3>{insight.summary}</h3>
                  <ul>{insight.signals.map((signal) => <li key={signal}><Check size={15} />{signal}</li>)}</ul>
                  <blockquote><Quote size={20} />{insight.quote}<span>— 摘自近期有具体细节的到店评价</span></blockquote>
                </motion.div>
              </AnimatePresence>
            </Reveal>
          </div>
        </section>

        <section className="section worlds-section" id="worlds">
          <Reveal className="section-heading section-heading--light">
            <div className="section-kicker"><span>04</span> WHERE TO GO NEXT</div>
            <div className="heading-grid">
              <h2>吃完饭，<br /><em>还想去哪儿坐坐？</em></h2>
              <p>接着今晚去浮生酒馆，也可以换一天，一个人喝咖啡、陪爸妈出门，或者看完展慢慢散步。</p>
            </div>
          </Reveal>

          <div className="worlds-explorer">
            <div className="world-list" aria-label="选择一条生活路线">
              {worlds.map((item, index) => (
                <button
                  key={item.id}
                  className={`world-option ${activeWorld === index ? 'world-option--active' : ''}`}
                  onClick={() => setActiveWorld(index)}
                  aria-pressed={activeWorld === index}
                  style={{ '--option-color': item.color } as CSSProperties}
                >
                  <span className="world-index">0{index + 1}</span>
                  <span className="world-name"><strong>{item.name}</strong><small>{item.en}</small></span>
                  <span className="world-arrow"><ArrowRight size={18} /></span>
                </button>
              ))}
            </div>

            <div className="world-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  className="route-stage"
                  key={world.id}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="route-photo">
                    <img src={world.image} alt={`${world.name}的真实生活场景`} loading="lazy" />
                    <span>{world.en}</span>
                  </div>
                  <div className="route-card">
                    <span className="route-card-kicker">{world.name}</span>
                    <h3>{world.title}</h3>
                    <div className="world-attributes">
                      <span><MapPin size={14} />{world.scene}</span>
                      <span><UsersRound size={14} />{world.people}</span>
                      <span><Clock3 size={14} />{world.budget}</span>
                    </div>
                    <div className="route-timeline">
                      {world.stops.map((stop) => (
                        <div key={stop.name}><span>{stop.time}</span><strong>{stop.name}</strong><small>{stop.meta}</small></div>
                      ))}
                    </div>
                    <button type="button" onClick={(event) => openWorld(event.currentTarget)}>看看这条路线 <ArrowRight size={17} /></button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="section together-section" id="together">
          <Reveal className="section-heading">
            <div className="section-kicker"><span>05</span> PICK A NIGHT TOGETHER</div>
            <div className="heading-grid">
              <h2>四个人，<br /><em>总有一个人说随便。</em></h2>
              <p>阿澄想安静，Leo 想有点新意，Momo 想饭后喝一杯。大家一起挑，今晚就好安排了。</p>
            </div>
          </Reveal>

          <Reveal className="canvas-board">
            <div className="canvas-head">
              <div><MessageCircle size={18} /> 周五晚饭和续摊 <small>4 人 · 固定演示</small></div>
              <div className="collaborators">
                {portraits.slice(0, 3).map((person) => <img key={person.name} src={person.image} alt={person.name} />)}
                <span>你</span>
                <button onClick={() => setNotice('这是四个人的固定演示，直接投票就能体验。')} aria-label="了解四人演示"><Plus size={17} /></button>
              </div>
            </div>
            <div className="canvas-grid">
              <div className="preference-stream">
                <div className="canvas-column-title">大家想要什么 <span>三个人都说了点真心话</span></div>
                <div className="preference-card preference-card--coral">
                  <img src={portraits[0].image} alt="阿澄" />
                  <div><strong>阿澄</strong><p>“想安静一点，好好吃顿饭。”</p><span>能聊天 · 四人桌坐得舒服</span></div>
                </div>
                <div className="preference-card preference-card--mint">
                  <img src={portraits[1].image} alt="Leo" />
                  <div><strong>Leo</strong><p>“最好有点新意，不想吃得太普通。”</p><span>创意菜 · 可以一起分着尝</span></div>
                </div>
                <div className="preference-card preference-card--lilac">
                  <img src={portraits[2].image} alt="Momo" />
                  <div><strong>Momo</strong><p>“饭后如果还能喝一杯，就完美了。”</p><span>饭后喝一杯 · 不用走太远</span></div>
                </div>
                <div className="shared-summary"><Sparkles size={17} /><span>大家都同意的：<strong>坐得舒服、能聊天、饭后不用走太远</strong></span></div>
              </div>

              <div className="vote-panel">
                <div className="canvas-column-title">一起挑一家 <span>再点一次可撤销</span></div>
                {places.map((place, index) => (
                  <div className={`vote-option ${voted.includes(index) ? 'vote-option--active' : ''}`} key={place.id}>
                    <img src={place.image} alt="" />
                    <div><strong>{place.name}</strong><span>{place.price} · {place.distance}</span></div>
                    <button onClick={() => castVote(index)} aria-pressed={voted.includes(index)} aria-label={`${voted.includes(index) ? '撤销投给' : '投给'}${place.name}，当前${votes[index]}票`}>
                      {voted.includes(index) ? <Check size={15} /> : <Vote size={15} />}
                      {votes[index]}
                    </button>
                  </div>
                ))}
                <button className="consensus-button" onClick={() => setPlanReady(true)}>
                  <UsersRound size={18} /> 看看今晚怎么安排 <ArrowRight size={17} />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {planReady && (
                <motion.div
                  className="consensus-result"
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduced ? undefined : { opacity: 0, height: 0 }}
                >
                  <div className="consensus-result-title"><CheckCircle2 size={22} /><div><strong>这个周五，就这么过吧。</strong><span>把大家说的安静、新意和饭后喝一杯都放进去</span></div></div>
                  <div className="plan-timeline">
                    <div><span>19:00</span><strong>序·小馆</strong><small>靠窗四人桌 · 创意江浙菜</small></div>
                    <ChevronRight size={19} />
                    <div><span>21:00</span><strong>浮生酒馆</strong><small>步行 12 分钟 · 再坐着聊一会儿</small></div>
                  </div>
                  <button onClick={() => setNotice('今晚的安排已收藏，收尾摘要也更新了。')}>收藏今晚的安排 <Bookmark size={16} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        </section>

        <section className="section creator-section" id="creators">
          <Reveal className="creator-manifesto">
            <div className="section-kicker"><span>06</span> A NOTE FOR THE NEXT PERSON</div>
            <h2>你认真写过的一顿饭，<br />会帮到下一个<em>饿肚子的人。</em></h2>
            <p>不用写成攻略，也不用每道菜都夸。什么时候去的、坐在哪里、哪道菜不合自己的口味，讲清楚就很有帮助。</p>
            <div className="manifesto-actions">
              <button onClick={() => setNotice('创作者计划入口已为你保留 · 固定演示')}>看看创作者计划 <ArrowUpRight size={18} /></button>
              <span>把一次真实体验，留给下一个需要的人</span>
            </div>
          </Reveal>
          <div className="creator-cards">
            <Reveal className="creator-story" delay={0.08}>
              <div className="creator-review-head">
                <img src={portraits[0].image} alt="阿澄" loading="lazy" />
                <div><strong>阿澄</strong><span>周五 19:30 · 四人用餐 · 序·小馆</span></div>
              </div>
              <blockquote>“靠窗四人桌能正常聊天，熟醉蟹偏甜，周五最好提前订。”</blockquote>
              <p>我们七点四十到，店里已经坐满了。四个人点五道菜刚好，时蔬很清爽。吃到九点多也没有被催，饭后走十二分钟去了浮生酒馆。</p>
              <div className="creator-helpful">
                <button
                  type="button"
                  className={helpful ? 'active' : ''}
                  aria-pressed={helpful}
                  onClick={() => {
                    setHelpful((current) => !current)
                    setNotice(helpful ? '已取消“有用”标记' : '已告诉阿澄：这条评价对你有用')
                  }}
                >
                  <Heart size={16} fill={helpful ? 'currentColor' : 'none'} /> {helpful ? '已标记有用' : '有用'}
                </button>
                <span>{helpful ? '阿澄会看见你的回应' : '觉得这条具体，就告诉阿澄'}</span>
              </div>
            </Reveal>
            <Reveal className="creator-values" delay={0.16}>
              <div><span>01</span><strong>写清楚什么时候去的</strong><p>周五晚和周日下午，可能是两家完全不同的店。</p></div>
              <div><span>02</span><strong>好吃和不好吃都可以写</strong><p>偏甜、偏咸、桌距有点挤，都是下一个人需要的细节。</p></div>
              <div><span>03</span><strong>有人觉得有用，就看得见回应</strong><p>一个“有用”，就能让认真分享的人知道没有白写。</p></div>
            </Reveal>
          </div>
        </section>

        <section className="finale" id="finale">
          <Reveal className="finale-content">
            <span className="finale-label"><Bookmark size={15} /> 今晚收藏夹</span>
            <div className="finale-heading">
              <div><h2>这个周五，<br /><em>就这么过吧。</em></h2><p>把想去的店和大家的安排放在一起，出发前不用再翻一长串聊天记录。</p></div>
              <div className="finale-actions">
                <button onClick={() => goTo('shortlist')}>回到这三家 <ArrowRight size={18} /></button>
                <button onClick={replayTonight}>再看一遍今晚怎么来的 <RotateCcw size={17} /></button>
              </div>
            </div>
            <div className="finale-summary">
              <div>
                <span>你收藏的店 · {savedPlaces.length} 家</span>
                {savedPlaces.length > 0 ? (
                  <ul>{savedPlaces.map((place) => <li key={place.id}><Bookmark size={14} fill="currentColor" />{place.name}<small>{place.kind}</small></li>)}</ul>
                ) : <p>还没有收藏店铺，可以回到这三家再挑一挑。</p>}
              </div>
              <div>
                <span>四个人的安排</span>
                {planReady ? (
                  <div className="finale-plan"><strong>19:00 序·小馆</strong><ChevronRight size={18} /><strong>21:00 浮生酒馆</strong><p>能好好聊天，饭后也不用走太远。</p></div>
                ) : (
                  <div className="finale-plan finale-plan--empty"><p>安排还没整理好，去和大家一起投一票吧。</p><button onClick={() => goTo('together')}>去一起决定 <ArrowRight size={15} /></button></div>
                )}
              </div>
            </div>
          </Reveal>
          <footer>
            <a className="brand brand--footer" href="#top"><img src={logo} alt="大众点评" /><span>REDESIGN</span></a>
            <p>独立概念 redesign · 非官方产品页面 · 页面内容与数据均为固定演示</p>
            <span>© 2026 DP CONCEPT</span>
          </footer>
        </section>
      </main>

      <AnimatePresence>
        {worldOpen && (
          <motion.div
            className="world-modal-backdrop"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            onClick={(event) => { if (event.target === event.currentTarget) setWorldOpen(false) }}
          >
            <motion.div
              className="world-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="world-modal-title"
              initial={reduced ? false : { opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ '--modal-color': world.color } as CSSProperties}
            >
              <button className="modal-close" onClick={() => setWorldOpen(false)} aria-label="关闭路线详情" autoFocus><X size={22} /></button>
              <div className="modal-visual">
                <img src={world.image} alt={`${world.name}生活场景`} />
                <div className="modal-visual-label"><span>{world.en}</span><strong>{world.name}</strong></div>
              </div>
              <div className="modal-content">
                <span className="modal-eyebrow">把这一天，过得不赶一点</span>
                <h2 id="world-modal-title">{world.title}</h2>
                <p>{world.description}</p>
                <div className="modal-prompt"><MessageCircle size={17} />“{world.prompt}”</div>
                <div className="modal-stops">
                  {world.stops.map((stop) => (
                    <div key={stop.name}>
                      <span>{stop.time}</span>
                      <div><strong>{stop.name}</strong><small>{stop.meta}</small></div>
                      <p>{stop.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notice && (
          <motion.div
            className="toast"
            role="status"
            initial={reduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 10 }}
          >
            <CheckCircle2 size={18} /> <span>{notice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
