// Le demi-gras du contenu : `**ceci**` dans une chaîne met un passage en évidence.
// Réservé à ce qu'un recruteur doit capter en survolant (un résultat, une décision, une échelle) : deux passages au plus par paragraphe.

const MARK = /\*\*(.+?)\*\*/g;

export function Emphasis({ text }: { text: string }) {
  // Le découpage par une capture alterne texte courant (indices pairs) et passages marqués (impairs).
  const parts = text.split(MARK);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong className="font-semibold text-foreground" key={i}>
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
