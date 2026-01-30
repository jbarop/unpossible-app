import { SEO } from "../components/SEO";

export function Privacy() {
  return (
    <div className="py-8 max-w-3xl mx-auto">
      <SEO
        title="Datenschutzerklärung"
        description="Datenschutzerklärung für Umpossible - Informationen zur Datenverarbeitung und Ihren Rechten."
        canonicalPath="/privacy"
      />
      <h1 className="text-3xl font-heading font-bold mb-8">
        Datenschutzerklärung
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Verantwortlicher</h2>
          <p className="text-[var(--color-text-secondary)]">
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            <br />
            [Name und Kontaktdaten des Betreibers]
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">
            2. Erhobene Daten und Zweck
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Diese Website verwendet ausschließlich ein technisch notwendiges
            Session-Cookie, um die Abstimmungsfunktion zu ermöglichen. Dieses
            Cookie enthält eine zufällig generierte ID, die keiner Person
            zugeordnet werden kann.
          </p>
          <ul className="list-disc pl-6 mt-2 text-[var(--color-text-secondary)]">
            <li>
              <strong>Cookie-Name:</strong> session_id
            </li>
            <li>
              <strong>Zweck:</strong> Verhinderung von Mehrfachabstimmungen
            </li>
            <li>
              <strong>Speicherdauer:</strong> 1 Jahr
            </li>
            <li>
              <strong>Art:</strong> HTTP-only, First-Party-Cookie
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Keine Weitergabe</h2>
          <p className="text-[var(--color-text-secondary)]">
            Es werden keine personenbezogenen Daten an Dritte weitergegeben. Es
            werden keine Tracking- oder Analyse-Cookies verwendet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Ihre Rechte</h2>
          <p className="text-[var(--color-text-secondary)]">
            Sie haben das Recht auf:
          </p>
          <ul className="list-disc pl-6 mt-2 text-[var(--color-text-secondary)]">
            <li>Auskunft über Ihre gespeicherten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung Ihrer Daten</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
            <li>Widerspruch gegen die Verarbeitung</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Kontakt</h2>
          <p className="text-[var(--color-text-secondary)]">
            Bei Fragen zum Datenschutz kontaktieren Sie uns bitte unter:
            <br />
            [E-Mail-Adresse]
          </p>
        </section>
      </div>
    </div>
  );
}
