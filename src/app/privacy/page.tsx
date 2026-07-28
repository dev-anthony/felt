export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-muted-foreground space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
      <p className="text-xs">Last updated: July 2026</p>
      
      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-base font-semibold text-foreground">1. Information We Collect</h2>
        <p>FELT collects minimal personal information necessary to deliver our services, including email address, account authentication details, and uploaded audio assets for album cover art generation.</p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-base font-semibold text-foreground">2. How We Use Information</h2>
        <p>We process audio files solely to extract acoustic metadata and generate corresponding visual media. Audio files are not used to train public generative models without explicit user consent.</p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-base font-semibold text-foreground">3. Contact Us</h2>
        <p>For questions regarding your data, contact support@mail.usefelt.online.</p>
      </section>
    </main>
  )
}