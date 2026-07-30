export default function MetreResult({ metre }) {
  if (!metre) return null

  return (
    <div className="metre-result">
      <h3>
        Métré — {metre.type_bardage_libelle} ({metre.surface_totale} m²)
      </h3>
      {metre.marge_chute_pourcentage > 0 && (
        <p className="metre-marge">
          Surface avec marge de chute ({metre.marge_chute_pourcentage}%) :{' '}
          {metre.surface_avec_marge_chute} m²
        </p>
      )}

      <table className="metre-table">
        <thead>
          <tr>
            <th>Élément</th>
            <th>Nécessaire</th>
            <th>À commander</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vis</td>
            <td>{metre.visserie.vis_necessaires} vis</td>
            <td>
              {metre.visserie.poches_a_commander} poches ({metre.visserie.vis_totales_commandees}{' '}
              vis)
            </td>
          </tr>
          <tr>
            <td>Lisses</td>
            <td>{metre.lisses.ml_necessaires} ml</td>
            <td>
              {metre.lisses.barres_a_commander} barres de 3m ({metre.lisses.ml_totaux_commandes} ml)
            </td>
          </tr>
          <tr>
            <td>Rails</td>
            <td>{metre.rails.ml_necessaires} ml</td>
            <td>
              {metre.rails.barres_a_commander} barres de 3m ({metre.rails.ml_totaux_commandes} ml)
            </td>
          </tr>
          <tr>
            <td>Équerres</td>
            <td colSpan={2}>
              {metre.equerres.total_equerres} équerres ({metre.equerres.nombre_chevrons} chevrons ×{' '}
              {metre.equerres.equerres_par_chevron})
            </td>
          </tr>
        </tbody>
      </table>

      <p className="metre-note">
        Poche(s) et barre(s) de sécurité déjà incluses dans les quantités "à commander".
      </p>
    </div>
  )
}
