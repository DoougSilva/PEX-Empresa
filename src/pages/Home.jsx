import { useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useVideoSound } from '../hooks/useVideoSound'
import { useScrollReveal } from '../hooks/useScrollReveal'
import '../styles/style.css'

export default function Home() {
  const videoRef = useRef(null)
  const boxesColRef = useRef(null)

  const { muted, alternarSom } = useVideoSound(videoRef)
  useScrollReveal(boxesColRef, { debounceResize: 200 })

  return (
    <>
      <Header title="Seja bem-vindo ao Espaço do Colaborador" />

      <main className="home-page-main">
        <section className="home-main">

          {/* ── FLYER — 260 px, altura total entre header e footer ── */}
          <aside className="flyer">
            <div>
              <h2>Nossa Essência</h2>
            </div>
            <div>
              <h3>Missão</h3>
              <p>Ganhar confiança e criar demanda para nossas marcas num mundo digital.</p>
            </div>
            <div>
              <h3>Valores</h3>
              <p>Integridade · Respeito · Inclusão e Diversidade · One Whirlpool · Espírito de Vitória</p>
            </div>
            <div>
              <h3>Visão</h3>
              <p>Ser a melhor empresa de cozinha e lavanderia, em busca constante de melhorar a vida em casa.</p>
            </div>
          </aside>

          {/* ── ÁREA DOS CARDS — container único com grid de 2 colunas ── */}
          <div className="boxes-col" ref={boxesColRef}>

            <div className="box col-left">
              <img src="https://picsum.photos/800/400" alt="Construindo o futuro" />
              <h2>Construindo o Futuro</h2>
              <p>
                Aqui na Whirlpool, acreditamos que o conhecimento é a nossa matéria-prima mais valiosa.
                Investir na aprendizagem contínua não é apenas desenvolver habilidades — é fortalecer o DNA
                da nossa empresa. Quando cada colaborador aprende, a companhia inteira evolui, garantindo
                processos mais seguros e uma entrega de excelência ao mundo.
              </p>
            </div>

            <div className="box col-right video-card">
              <button
                className="btn-floating-sound"
                onClick={alternarSom}
                title="Ativar/Desativar Som"
                aria-label={muted ? 'Ativar som' : 'Desativar som'}
              >
                {muted ? '🔇' : '🔊'}
              </button>
              <div className="video-wrap">
                <video ref={videoRef} autoPlay muted loop playsInline>
                  <source src="/video/paginaprincipal.mp4" type="video/mp4" />
                </video>
              </div>
              <h2>A Arte da Montagem</h2>
              <p>
                Já pensou em transformar um simples produto em desejo de consumo? Entender o passo a passo
                por trás da montagem dos nossos refrigeradores é entender que o seu toque final faz toda a
                diferença na entrega de um momento especial para o cliente.
              </p>
            </div>

            <div className="box col-left">
              <img src="https://picsum.photos/800/401" alt="Segurança e Qualidade" />
              <h2>Segurança e Qualidade: Dois Lados da Mesma Moeda</h2>
              <p>
                Na nossa indústria, a precisão vai além da linha de montagem. Ela está no olhar atento
                à segurança de cada profissional. Manter um ambiente seguro é o que nos permite alcançar
                padrões de qualidade internacionais. Cuidar de quem faz a engrenagem girar é o nosso
                compromisso inegociável.
              </p>
            </div>

            <div className="box col-right">
              <img src="https://picsum.photos/800/402" alt="Inovação Contínua" />
              <h2>Inovação Contínua</h2>
              <p>
                Aqui na Whirlpool, acreditamos que o conhecimento é a nossa matéria-prima mais valiosa.
                Investir na aprendizagem contínua não é apenas desenvolver habilidades — é fortalecer o DNA
                da nossa empresa. Quando cada colaborador aprende, a companhia inteira evolui, garantindo
                processos mais seguros e uma entrega de excelência ao mundo.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
