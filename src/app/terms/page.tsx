export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 text-muted-foreground space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
      <p className="text-xs">Last updated: July 2026</p>
      
      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-base font-semibold text-foreground">1. Acceptable Use</h2>
        <p>By accessing FELT, you agree to generate assets only for media you have ownership of or valid licenses to distribute.</p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-base font-semibold text-foreground">2. Ownership & Rights</h2>
        <p>You retain commercial and copyright ownership of all album artwork successfully generated through your paid credits on FELT.</p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed">
        <h2 className="text-base font-semibold text-foreground">3. Support</h2>
        <p>For account or billing inquiries, reach out to support@mail.usefelt.online.</p>
      </section>
    </main>
  )
}