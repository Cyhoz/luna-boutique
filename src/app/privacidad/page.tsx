import { Shield, Lock, Eye, FileText, Scale } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex p-3 rounded-full bg-accent/10 text-accent mb-4">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-5xl font-serif font-medium text-primary italic leading-tight">Política de Privacidad</h1>
        <p className="text-muted-foreground font-sans font-bold uppercase tracking-[0.2em] text-[10px]">
          Cumplimiento Ley 19.628 - Chile
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-12">
        
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-medium flex items-center gap-3">
            <Lock className="h-5 w-5 text-accent" /> 1. Compromiso de Luna Boutique
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            En **Luna Boutique**, la privacidad de nuestros clientes es sagrada. En cumplimiento con la **Ley N° 19.628 sobre Protección de la Vida Privada** en Chile y los estándares internacionales de GDPR, informamos que los datos proporcionados son tratados con la máxima seguridad y reserva.
          </p>
        </section>

        {/* Finalidad */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-medium flex items-center gap-3">
            <Eye className="h-5 w-5 text-accent" /> 2. Finalidad del Tratamiento
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Sus datos personales (Nombre, RUT, Dirección, Correo) se recolectan exclusivamente para:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
            <li>Procesar y enviar sus pedidos de forma segura.</li>
            <li>Gestionar pagos mediante plataformas certificadas (MercadoPago).</li>
            <li>Enviar actualizaciones sobre el estado de su compra.</li>
            <li>Fines de marketing solo si usted ha otorgado su consentimiento explícito.</li>
          </ul>
        </section>

        {/* Derechos ARCO */}
        <section className="space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-2xl font-serif font-medium flex items-center gap-3 text-primary">
            <Scale className="h-5 w-5 text-accent" /> 3. Sus Derechos ARCO
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Usted tiene el control total sobre su información. En cualquier momento puede ejercer sus derechos **ARCO**:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-xs uppercase tracking-widest block mb-1">Acceso</span>
              <p className="text-[11px] text-muted-foreground italic">Saber qué datos tenemos sobre usted.</p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-xs uppercase tracking-widest block mb-1">Rectificación</span>
              <p className="text-[11px] text-muted-foreground italic">Actualizar o corregir información errónea.</p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-xs uppercase tracking-widest block mb-1">Cancelación</span>
              <p className="text-[11px] text-muted-foreground italic">Solicitar la eliminación de sus datos.</p>
            </div>
            <div className="p-4 bg-background rounded-xl border border-zinc-100 dark:border-zinc-800">
              <span className="font-bold text-xs uppercase tracking-widest block mb-1">Oposición</span>
              <p className="text-[11px] text-muted-foreground italic">Negarse al uso de sus datos para fines específicos.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-4">
            Para ejercer estos derechos, envíe un correo a **privacidad@lunaboutique.store** con el asunto "Derechos ARCO".
          </p>
        </section>

        {/* Seguridad */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-medium flex items-center gap-3">
            <FileText className="h-5 w-5 text-accent" /> 4. Medidas de Seguridad
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Implementamos cifrado SSL de grado bancario, políticas de **Row Level Security (RLS)** y auditoría de accesos constante para prevenir filtraciones o usos no autorizados. Luna Boutique nunca vende ni arrienda sus datos a terceros.
          </p>
        </section>

        <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Última actualización: Mayo 2026 | Luna Boutique Ltda.
          </p>
        </div>
      </div>
    </div>
  )
}
