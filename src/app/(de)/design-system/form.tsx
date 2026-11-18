"use client";

export function DesignSystemForm() {
  return (
    <form
      className="mm-form"
      style={{ marginTop: "var(--mm-space-4)", maxWidth: "560px" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mm-form-row">
        <label htmlFor="ds-name">Name</label>
        <input id="ds-name" name="name" type="text" className="mm-form-input" placeholder="Max Mustermann" />
      </div>
      <div className="mm-form-row">
        <label htmlFor="ds-firma">Firma</label>
        <input id="ds-firma" name="firma" type="text" className="mm-form-input" placeholder="Musterfirma GmbH" />
      </div>
      <div className="mm-form-row">
        <label htmlFor="ds-email">E-Mail</label>
        <input id="ds-email" name="email" type="email" className="mm-form-input" placeholder="max@musterfirma.de" />
      </div>
      <div className="mm-form-row">
        <label htmlFor="ds-msg">Nachricht</label>
        <textarea id="ds-msg" name="message" className="mm-form-input" rows={5} placeholder="Wie können wir helfen?" />
      </div>
      <label className="mm-form-checkbox">
        <input type="checkbox" name="dsgvo" required />
        <span>
          Ich willige in die Verarbeitung meiner Daten zum Zweck der Kontaktaufnahme ein.
          Details in der <a href="/datenschutz" style={{ color: "var(--mm-color-primary)" }}>Datenschutzerklärung</a>.
        </span>
      </label>
      <button type="submit" className="mm-btn mm-btn-primary">Nachricht senden</button>
    </form>
  );
}