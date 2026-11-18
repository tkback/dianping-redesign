import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BadgeCheck,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Mic,
  Navigation,
  Plus,
  Quote,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UsersRound,
  Vote,
  WandSparkles,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import IntentWorld from './IntentWorld'
import { places, portraits, prompts, truthInsights, worlds } from './data'

const logo = `${import.meta.env.BASE_URL}dianping-official.png`

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 42 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
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
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState(prompts[0])
  const [submittedQuery, setSubmittedQuery] = useState(prompts[0])
  const [selectedPlace, setSelectedPlace] = useState(places[0].id)
  const [saved, setSaved] = useState<number[]>([1])
  const [insightTab, setInsightTab] = useState<keyof typeof truthInsights>('氛围')
  const [activeWorld, setActiveWorld] = useState(0)
  const [worldOpen, setWorldOpen] = useState(false)
  const [votes, setVotes] = useState([2, 1, 1])
  const [voted, setVoted] = useState<number[]>([])
  const [planReady, setPlanReady] = useState(false)
  const [notice, setNotice] = useState('')

  const world = worlds[activeWorld]
  const insight = truthInsights[insightTab]
  const currentPlace = places.find((place) => place.id === selectedPlace) ?? places[0]

  useEffect(() => {
    const updateNav = () => setScrolled(window.scrollY > 28)
    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    return () => window.removeEventListener('scroll', updateNav)
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!worldOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWorldOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [worldOpen])

  const runSearch = (event: FormEvent) => {
    event.preventDefault()
    const nextQuery = query.trim() || prompts[0]
    setQuery(nextQuery)
    setSubmittedQuery(nextQuery)
    setNotice('已根据你的描述更新动态短名单')
    document.getElementById('shortlist')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const voiceDemo = () => {
    const nextIndex = (prompts.indexOf(query) + 1) % prompts.length
    setQuery(prompts[nextIndex])
    setNotice('已填入一条语音灵感 · 演示')
  }

  const toggleSaved = (id: number) => {
    const isSaved = saved.includes(id)
    setSaved((current) => (isSaved ? current.filter((item) => item !== id) : [...current, id]))
    setNotice(isSaved ? '已从短名单移除' : '已加入你的短名单')
  }

  const castVote = (index: number) => {
    if (voted.includes(index)) {
      setVotes((current) => current.map((count, item) => (item === index ? count - 1 : count)))
      setVoted((current) => current.filter((item) => item !== index))
    } else {
      setVotes((current) => current.map((count, item) => (item === index ? count + 1 : count)))
      setVoted((current) => [...current, index])
    }
    setPlanReady(false)
  }

  const useWorldPrompt = () => {
    setQuery(world.prompt)
    setSubmittedQuery(world.prompt)
    setWorldOpen(false)
    setNotice(`已带入「${world.name}」的生活灵感`)
    window.setTimeout(() => {
      document.getElementById('shortlist')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    }, 120)
  }

  const backToSearch = () => {
    document.getElementById('top')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    window.setTimeout(() => searchInput.current?.focus(), reduced ? 0 : 650)
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
          <a href="#shortlist">决策方式</a>
          <a href="#truth">真实内容</a>
          <a href="#worlds">灵感世界</a>
          <a href="#together">一起出发</a>
        </nav>
        <button className="nav-cta" onClick={backToSearch}>
          开始探索 <ArrowUpRight size={16} strokeWidth={1.8} />
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-aurora" aria-hidden="true" />
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Sparkles size={14} /> AI 时代的本地生活决策平台
              <span>CONCEPT 2026</span>
            </motion.div>
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              把城市，过成
              <br />
              <em>你的喜欢。</em>
            </motion.h1>
            <motion.p
              className="hero-intro"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              不再从榜单里将就。说出此刻想要的生活，大众点评把真实体验、城市灵感和朋友的偏好，变成一个刚刚好的答案。
            </motion.p>

            <motion.form
              className="hero-search"
              onSubmit={runSearch}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="search-field">
                <Search size={21} aria-hidden="true" />
                <input
                  ref={searchInput}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="描述你想要的生活"
                  placeholder="说说你现在想去哪、和谁、想要什么感觉…"
                />
                <button type="button" className="voice-button" onClick={voiceDemo} aria-label="填入一条语音灵感演示">
                  <Mic size={19} />
                </button>
              </div>
              <button className="search-submit" type="submit">
                给我答案 <ArrowRight size={18} />
              </button>
            </motion.form>

            <motion.div
              className="prompt-row"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <span>试试这样说</span>
              <button onClick={() => setQuery(prompts[1])}>一个人待一下午</button>
              <button onClick={() => setQuery(prompts[2])}>和爸妈舒服过周末</button>
            </motion.div>
          </div>

          <motion.div
            className="hero-visual"
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <IntentWorld world={worlds[0]} />
            <div className="world-caption world-caption--top">
              <span>今晚</span>
              <strong>松弛一点</strong>
            </div>
            <div className="world-caption world-caption--bottom">
              <AudioLines size={16} />
              <span>"不吵，但要有惊喜"</span>
            </div>
            {portraits.map((person, index) => (
              <motion.figure
                className={`portrait-card portrait-card--${index + 1}`}
                key={person.name}
                animate={reduced ? undefined : { y: [0, index % 2 ? 9 : -10, 0] }}
                transition={{ duration: 5 + index, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img src={person.image} alt={`${person.name}的城市生活肖像`} />
                <figcaption>
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                </figcaption>
              </motion.figure>
            ))}
            <div className="hero-match-card">
              <div className="match-icon"><Check size={18} /></div>
              <div>
                <span>4 个人的偏好已对齐</span>
                <strong>找到 3 个高分答案</strong>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </motion.div>

          <a className="scroll-cue" href="#shortlist">
            <span>看看如何做决定</span>
            <ArrowDown size={17} />
          </a>
        </section>

        <section className="section shortlist-section" id="shortlist">
          <Reveal className="section-heading section-heading--light">
            <div className="section-kicker"><span>01</span> DYNAMIC SHORTLIST</div>
            <div className="heading-grid">
              <h2>不是更多选择，<br /><em>是更少纠结。</em></h2>
              <p>系统理解时间、同行人、预算和没说出口的感觉，把成百上千个结果，收敛成真正适合此刻的动态短名单。</p>
            </div>
          </Reveal>

          <Reveal className="decision-demo" delay={0.08}>
            <div className="demo-topbar">
              <div className="demo-brand"><Sparkles size={17} /> 生活决策台</div>
              <div className="demo-status"><span /> 演示数据 · 实时响应你的选择</div>
              <button onClick={() => setNotice('筛选条件已是最适合当前描述的组合')}>
                <SlidersHorizontal size={16} /> 调整条件
              </button>
            </div>
            <div className="demo-query">
              <span>你的描述</span>
              <p>"{submittedQuery}"</p>
              <div className="understood-tags">
                <span>4 人</span><span>周五晚</span><span>适合聊天</span><span>有惊喜</span>
              </div>
            </div>
            <div className="decision-grid">
              <div className="results-panel">
                <div className="results-title">
                  <div><span>为你收敛到</span><strong>3 个高分答案</strong></div>
                  <span>按此刻匹配度排序</span>
                </div>
                <div className="place-list">
                  {places.map((place, index) => (
                    <motion.article
                      layout
                      className={`place-card ${selectedPlace === place.id ? 'place-card--selected' : ''}`}
                      key={place.id}
                    >
                      <button className="place-main" onClick={() => setSelectedPlace(place.id)} aria-label={`查看${place.name}的决策依据`}>
                        <div className="place-image-wrap">
                          <img src={place.image} alt={`${place.name}的空间与菜品`} loading="lazy" />
                          <span className="place-rank">0{index + 1}</span>
                        </div>
                        <div className="place-info">
                          <div className="place-title-row">
                            <div><h3>{place.name}</h3><p>{place.kind} · {place.area}</p></div>
                            <div className="match-score"><strong>{place.match}%</strong><span>匹配</span></div>
                          </div>
                          <p className="place-reason"><Sparkles size={14} /> {place.reason}</p>
                          <div className="place-meta">
                            <span><Star size={13} fill="currentColor" /> {place.score}</span>
                            <span>{place.price}</span><span>{place.distance}</span>
                          </div>
                        </div>
                      </button>
                      <button
                        className={`place-save ${saved.includes(place.id) ? 'place-save--active' : ''}`}
                        onClick={() => toggleSaved(place.id)}
                        aria-label={saved.includes(place.id) ? `从短名单移除${place.name}` : `收藏${place.name}`}
                      >
                        <Bookmark size={17} fill={saved.includes(place.id) ? 'currentColor' : 'none'} />
                      </button>
                    </motion.article>
                  ))}
                </div>
              </div>
              <aside className="decision-reasons">
                <div className="reason-label">WHY IT FITS</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPlace.id}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3>为什么是<br />「{currentPlace.name}」？</h3>
                    <p className="reason-summary">不是单一评分最高，而是与你此刻的需求重合最多。</p>
                    <ul>
                      {currentPlace.details.map((detail) => <li key={detail}><CheckCircle2 size={17} /> {detail}</li>)}
                    </ul>
                    <div className="reason-route">
                      <Navigation size={18} />
                      <div><strong>{currentPlace.distance}</strong><span>地铁 2 号线 · 静安寺站</span></div>
                    </div>
                    <button className="primary-button" onClick={() => toggleSaved(currentPlace.id)}>
                      {saved.includes(currentPlace.id) ? '已在短名单中' : '加入周末计划'}
                      {saved.includes(currentPlace.id) ? <Check size={17} /> : <ArrowRight size={17} />}
                    </button>
                  </motion.div>
                </AnimatePresence>
              </aside>
            </div>
          </Reveal>
        </section>

        <section className="section truth-section" id="truth">
          <Reveal className="section-heading">
            <div className="section-kicker"><span>02</span> AI TRUTH LENS</div>
            <div className="heading-grid">
              <h2>穿过一千条评价，<br /><em>看见真实共识。</em></h2>
              <p>AI 不替真实体验发言，而是把分散的细节、时间变化和不同人群的感受整理清楚，让种草与避雷都有依据。</p>
            </div>
          </Reveal>

          <div className="truth-layout">
            <Reveal className="truth-visual">
              <img src={places[0].image} alt="真实餐厅体验内容示例" loading="lazy" />
              <div className="truth-photo-badge"><BadgeCheck size={17} /> 到店体验 · 已核验</div>
              <div className="review-float review-float--one">
                <div className="review-avatar">澄</div>
                <div><strong>桌距比想象中舒服</strong><span>昨天 21:14 · 四人用餐</span></div>
              </div>
              <div className="review-float review-float--two">
                <span>近期口味共识</span><strong>94<small>%</small></strong>
              </div>
            </Reveal>

            <Reveal className="truth-panel" delay={0.1}>
              <div className="truth-panel-head">
                <div><ShieldCheck size={20} /><span>AI Truth Lens</span></div>
                <span>演示分析</span>
              </div>
              <div className="truth-volume">
                <strong>2,847</strong>
                <span>条真实评价已阅读<br /><small>过滤 613 条低信息内容</small></span>
              </div>
              <div className="truth-tabs" role="tablist" aria-label="评价分析维度">
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
                  <div className="consensus-score">
                    <span>真实共识度</span>
                    <strong>{insight.score}<small>/100</small></strong>
                  </div>
                  <h3>{insight.summary}</h3>
                  <ul>{insight.signals.map((signal) => <li key={signal}><Check size={15} />{signal}</li>)}</ul>
                  <blockquote><Quote size={20} />{insight.quote}<span>— 来自近期高信息评价</span></blockquote>
                </motion.div>
              </AnimatePresence>
            </Reveal>
          </div>
        </section>

        <section className="section worlds-section" id="worlds">
          <Reveal className="section-heading section-heading--light">
            <div className="section-kicker"><span>03</span> CITY INSPIRATION WORLDS</div>
            <div className="heading-grid">
              <h2>城市不是列表，<br /><em>是此刻的世界。</em></h2>
              <p>从一种生活意图进入，而不是从一个分类进入。悬停感受世界，点击展开一段完整的城市提案。</p>
            </div>
          </Reveal>

          <div className="worlds-explorer">
            <div className="world-list" role="list">
              {worlds.map((item, index) => (
                <button
                  key={item.id}
                  className={`world-option ${activeWorld === index ? 'world-option--active' : ''}`}
                  onMouseEnter={() => setActiveWorld(index)}
                  onFocus={() => setActiveWorld(index)}
                  onClick={() => { setActiveWorld(index); setWorldOpen(true) }}
                  style={{ '--option-color': item.color } as CSSProperties}
                >
                  <span className="world-index">0{index + 1}</span>
                  <span className="world-name"><strong>{item.name}</strong><small>{item.en}</small></span>
                  <span className="world-arrow"><ArrowUpRight size={21} /></span>
                </button>
              ))}
            </div>

            <div className="world-stage">
              <IntentWorld world={world} variant="explorer" />
              <AnimatePresence mode="wait">
                <motion.div
                  className="world-detail-card"
                  key={world.id}
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="world-detail-eyebrow">CURRENT WORLD · {world.en}</span>
                  <h3>{world.prompt}</h3>
                  <div className="world-attributes">
                    <span><MapPin size={14} />{world.scene}</span>
                    <span><UsersRound size={14} />{world.people}</span>
                    <span><Clock3 size={14} />{world.budget}</span>
                  </div>
                  <button onClick={() => setWorldOpen(true)}>进入这个世界 <ArrowRight size={17} /></button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="section together-section" id="together">
          <Reveal className="section-heading">
            <div className="section-kicker"><span>04</span> SHARED CANVAS</div>
            <div className="heading-grid">
              <h2>每个人的想去，<br /><em>都能抵达。</em></h2>
              <p>把群聊里散落的链接、偏好和"随便"放到同一张画布。看见分歧，也看见大家真正共同的期待。</p>
            </div>
          </Reveal>

          <Reveal className="canvas-board">
            <div className="canvas-head">
              <div><span className="live-dot" /> 周五逃跑计划 <small>4 人在线</small></div>
              <div className="collaborators">
                {portraits.map((person) => <img key={person.name} src={person.image} alt={person.name} />)}
                <span>你</span>
                <button onClick={() => setNotice('邀请链接已准备好 · 演示')} aria-label="邀请朋友"><Plus size={17} /></button>
              </div>
            </div>
            <div className="canvas-grid">
              <div className="preference-stream">
                <div className="canvas-column-title">大家的灵感 <span>实时汇总</span></div>
                <div className="preference-card preference-card--coral">
                  <img src={portraits[0].image} alt="阿澄" />
                  <div><strong>阿澄</strong><p>"想吃点有新意的，但不想太正式。"</p><span>#有惊喜 #别太正式</span></div>
                </div>
                <div className="preference-card preference-card--mint">
                  <img src={portraits[1].image} alt="Leo" />
                  <div><strong>Leo</strong><p>"最好能好好聊天，不想整场都在喊。"</p><span>#安静 #四人桌</span></div>
                </div>
                <div className="preference-card preference-card--lilac">
                  <img src={portraits[2].image} alt="Momo" />
                  <div><strong>Momo</strong><p>"如果附近还能喝一杯，就完美了。"</p><span>#可续摊 #步行可达</span></div>
                </div>
                <div className="shared-summary"><Sparkles size={17} /><span>共同偏好已提取：<strong>创意菜、低噪声、附近有酒馆</strong></span></div>
              </div>

              <div className="vote-panel">
                <div className="canvas-column-title">投给共同答案 <span>每人一票 · 演示</span></div>
                {places.map((place, index) => (
                  <div className={`vote-option ${voted.includes(index) ? 'vote-option--active' : ''}`} key={place.id}>
                    <img src={place.image} alt="" />
                    <div><strong>{place.name}</strong><span>{place.match}% 匹配 · {place.distance}</span></div>
                    <button onClick={() => castVote(index)} aria-pressed={voted.includes(index)}>
                      {voted.includes(index) ? <Check size={15} /> : <Vote size={15} />}
                      {votes[index]}
                    </button>
                  </div>
                ))}
                <button className="consensus-button" onClick={() => setPlanReady(true)}>
                  <WandSparkles size={18} /> 生成共识方案 <ArrowRight size={17} />
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
                  <div className="consensus-result-title"><CheckCircle2 size={22} /><div><strong>大家的周五，已经对齐。</strong><span>综合 4 人偏好与当前投票生成</span></div></div>
                  <div className="plan-timeline">
                    <div><span>19:00</span><strong>序·小馆</strong><small>安静四人桌 · 创意江浙菜</small></div>
                    <ChevronRight size={19} />
                    <div><span>21:00</span><strong>浮生酒馆</strong><small>步行 12 分钟 · 不必转场太远</small></div>
                  </div>
                  <button onClick={() => setNotice('共识方案已保存到演示计划')}>保存方案 <Bookmark size={16} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        </section>

        <section className="section creator-section" id="creators">
          <Reveal className="creator-manifesto">
            <div className="section-kicker"><span>05</span> REAL VOICES, REAL CITY</div>
            <h2>每一次真实分享，<br />都让城市<em>少一点猜测。</em></h2>
            <p>让认真体验的人被看见，让不同生活方式都有表达的位置。好内容不只换来一次流量，也应该积累长期的认可与回报。</p>
            <div className="manifesto-actions">
              <button onClick={() => setNotice('创作者计划已加入你的关注 · 演示')}>看看创作者计划 <ArrowUpRight size={18} /></button>
              <span>真实体验 · 多元表达 · 长期激励</span>
            </div>
          </Reveal>
          <div className="creator-cards">
            <Reveal className="creator-story" delay={0.08}>
              <img src={portraits[0].image} alt="城市内容创作者阿澄" loading="lazy" />
              <div className="creator-story-copy">
                <span>城市观察员 · 阿澄</span>
                <h3>"我写的不是网红攻略，<br />是你会怎样度过那两个小时。"</h3>
                <div><span><Heart size={15} /> 2.8k 有用</span><span><MessageCircle size={15} /> 186 讨论</span></div>
              </div>
            </Reveal>
            <Reveal className="creator-values" delay={0.16}>
              <div><span>01</span><strong>体验有依据</strong><p>到店、消费与时间信息，让真实更具体。</p></div>
              <div><span>02</span><strong>表达有个性</strong><p>不只一种审美，也不只一种城市生活。</p></div>
              <div><span>03</span><strong>贡献有回响</strong><p>让每一次"有用"，成为创作者的长期资产。</p></div>
              <Send size={30} />
            </Reveal>
          </div>
        </section>

        <section className="finale">
          <div className="finale-orb finale-orb--one" aria-hidden="true" />
          <div className="finale-orb finale-orb--two" aria-hidden="true" />
          <Reveal className="finale-content">
            <span className="finale-label"><Sparkles size={15} /> YOUR CITY, YOUR WAY</span>
            <h2>下一站，<br /><em>不必将就。</em></h2>
            <p>说说你现在想要什么。城市很大，答案可以刚刚好。</p>
            <button onClick={backToSearch}>开始描述我的生活 <ArrowRight size={20} /></button>
          </Reveal>
          <footer>
            <a className="brand brand--footer" href="#top"><img src={logo} alt="大众点评" /><span>REDESIGN</span></a>
            <p>独立概念 redesign · 非官方产品页面 · 页面内容与数据均为演示</p>
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
              initial={reduced ? false : { opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ '--modal-color': world.color } as CSSProperties}
            >
              <button className="modal-close" onClick={() => setWorldOpen(false)} aria-label="关闭灵感世界" autoFocus><X size={22} /></button>
              <div className="modal-visual">
                <img src={world.image} alt={`${world.name}生活场景`} />
                <div className="modal-visual-label"><span>{world.en}</span><strong>{world.name}</strong></div>
              </div>
              <div className="modal-content">
                <span className="modal-eyebrow">A CITY PROPOSAL FOR YOU</span>
                <h2 id="world-modal-title">{world.title}</h2>
                <p>{world.description}</p>
                <div className="modal-prompt"><Sparkles size={17} />"{world.prompt}"</div>
                <div className="modal-stops">
                  {world.stops.map((stop, index) => (
                    <div key={stop.name}>
                      <span>0{index + 1}</span>
                      <div><strong>{stop.name}</strong><small>{stop.meta}</small></div>
                      <p>{stop.note}</p>
                    </div>
                  ))}
                </div>
                <button className="modal-primary" onClick={useWorldPrompt}>用这个灵感找地方 <ArrowRight size={18} /></button>
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
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
          >
            <CheckCircle2 size={18} /> {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
