import { useEffect, useRef } from 'react'

const COULEURS_BARDAGE = {
  composite: '#8b7355',
  bois_naturel: '#a67c52',
  metallique_tole: '#94a3b8',
  metallique_cassette: '#64748b',
  panneau_sandwich: '#93c5fd',
  hpl_fibrociment: '#d4d4d8',
}

export default function Plan2D({ facades }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const largeurCanvas = canvas.width
    const hauteurCanvas = canvas.height

    ctx.clearRect(0, 0, largeurCanvas, hauteurCanvas)

    if (!facades || facades.length === 0) {
      ctx.fillStyle = '#94a3b8'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Aucune façade à afficher', largeurCanvas / 2, hauteurCanvas / 2)
      return
    }

    // Hauteur totale à considérer : hauteur au faîtage pour un pignon, sinon hauteur simple
    const hauteurTotale = (f) =>
      f.type_forme === 'pignon' && f.hauteur_pointe ? f.hauteur_pointe : f.hauteur

    const largeurTotale = facades.reduce((acc, f) => acc + f.largeur, 0)
    const hauteurMax = Math.max(...facades.map(hauteurTotale))

    const marge = 20
    const espaceEntre = 12
    const largeurDisponible = largeurCanvas - marge * 2 - espaceEntre * (facades.length - 1)
    const hauteurDisponible = hauteurCanvas - marge * 2 - 30

    const echelleX = largeurDisponible / largeurTotale
    const echelleY = hauteurDisponible / hauteurMax
    const echelle = Math.min(echelleX, echelleY)

    let x = marge
    const solY = hauteurCanvas - marge

    facades.forEach((f) => {
      const largeurPx = f.largeur * echelle
      const hauteurMurPx = f.hauteur * echelle
      const yMur = solY - hauteurMurPx

      ctx.fillStyle = COULEURS_BARDAGE[f.type_bardage] || '#cbd5e1'
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1.5

      if (f.type_forme === 'pignon' && f.hauteur_pointe) {
        const hauteurPointePx = f.hauteur_pointe * echelle
        const yPointe = solY - hauteurPointePx

        // Rectangle du bas (murs)
        ctx.fillRect(x, yMur, largeurPx, hauteurMurPx)
        ctx.strokeRect(x, yMur, largeurPx, hauteurMurPx)

        // Triangle du dessus (pignon)
        ctx.beginPath()
        ctx.moveTo(x, yMur)
        ctx.lineTo(x + largeurPx / 2, yPointe)
        ctx.lineTo(x + largeurPx, yMur)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#1e293b'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(f.nom, x + largeurPx / 2, yPointe - 6)

        ctx.font = '10px sans-serif'
        ctx.fillStyle = '#475569'
        ctx.fillText(
          `${f.largeur}m — mur ${f.hauteur}m / pointe ${f.hauteur_pointe}m`,
          x + largeurPx / 2,
          solY + 14
        )
      } else {
        ctx.fillRect(x, yMur, largeurPx, hauteurMurPx)
        ctx.strokeRect(x, yMur, largeurPx, hauteurMurPx)

        ctx.fillStyle = '#1e293b'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(f.nom, x + largeurPx / 2, yMur - 6)

        ctx.font = '10px sans-serif'
        ctx.fillStyle = '#475569'
        ctx.fillText(`${f.largeur}×${f.hauteur}m`, x + largeurPx / 2, solY + 14)
      }

      x += largeurPx + espaceEntre
    })

    ctx.strokeStyle = '#94a3b8'
    ctx.beginPath()
    ctx.moveTo(0, solY)
    ctx.lineTo(largeurCanvas, solY)
    ctx.stroke()
  }, [facades])

  return <canvas ref={canvasRef} width={600} height={280} className="plan-2d-canvas" />
}
