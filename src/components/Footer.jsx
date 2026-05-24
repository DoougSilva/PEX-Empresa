import { BRANDS } from '../data/brands'

export default function Footer() {
  return (
    <footer>
      <div className="marcas">
        {BRANDS.map(b => (
          <div className="marca" key={b.alt}>
            <img src={b.src} alt={b.alt} />
          </div>
        ))}
      </div>
      <p className="copyright">© 2026 Treinamento On The Job — Grupo Whirlpool</p>
    </footer>
  )
}
