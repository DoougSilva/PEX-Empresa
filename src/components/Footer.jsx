const BRANDS = [
  { src: '/icons/brastemp-logo2.png',                          alt: 'Brastemp'   },
  { src: '/icons/everydrop_3C_Black_Web@M_sRGB.png',          alt: 'Everydrop'  },
  { src: '/icons/Gladiator_1C_Black_Web@M_sRGB.png',          alt: 'Gladiator'  },
  { src: '/icons/JennAir_Lockup_V_1C_Black_Web@M_sRGB.png',   alt: 'JennAir'   },
  { src: '/icons/KitchenAid_Logo_1C_Black_Web@M_sRGB.png',    alt: 'KitchenAid' },
  { src: '/icons/Maytag_Wordmark_1C_Black_Web@M_sRGB.png',    alt: 'Maytag'    },
  { src: '/icons/Whirlpool_Brand_2C_Black_Web@M_sRGB.png',    alt: 'Whirlpool'  },
  { src: '/icons/Affresh-NoStarburst_1C_Black@M_sRGB.png',    alt: 'Affresh'   },
  { src: '/icons/Amana_1C_Black_Web@M_sRGB.png',              alt: 'Amana'     },
]

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
