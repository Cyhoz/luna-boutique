export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold font-display uppercase tracking-tight mb-12">Privacidad</h1>
        
        <div className="space-y-8 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">Información que Recopilamos</h2>
            <p>
              Recopilamos información personal que usted nos proporciona voluntariamente al registrarse en el sitio, 
              realizar un pedido o suscribirse a nuestro boletín. Esto puede incluir su nombre, dirección de correo electrónico, 
              dirección de envío y detalles de pago.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">Uso de la Información</h2>
            <p>
              Utilizamos la información recopilada para procesar sus transacciones, mejorar nuestra tienda y comunicarnos 
              con usted sobre sus pedidos y ofertas promocionales. Nunca venderemos su información personal a terceros.
            </p>
          </section>

          <section>
            <h2 className="text-zinc-900 dark:text-white font-bold uppercase tracking-widest text-[10px] mb-4">Seguridad de Datos</h2>
            <p>
              Implementamos una variedad de medidas de seguridad para mantener la seguridad de su información personal. 
              Sus datos se almacenan en redes seguras y solo son accesibles por un número limitado de personas con derechos especiales de acceso.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
