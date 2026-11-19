import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

const root = document.getElementById('root')
if (root) {
  // 标记已挂载，移除 loading 占位
  root.classList.add('loaded')
  ReactDOM.createRoot(root).render(<App />)
}
