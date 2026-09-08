const ITENS = [
  { tag: "Alcance", titulo: "Voos para o mundo todo", texto: "Rotas domésticas e internacionais das companhias e agências que distribuímos." },
  { tag: "Preço", titulo: "Taxas já inclusas", texto: "Nada de valor que cresce no checkout. Se a tarifa mudar, avisamos antes." },
  { tag: "Acesso", titulo: "Sem cadastro para buscar", texto: "Conta só para alertas e buscas salvas — nunca para ver preço." },
  { tag: "Reserva", titulo: "Pagamento no parceiro", texto: "Seu cartão vai direto para quem emite o bilhete. Nós não intermediamos." },
];

export default function CompromissosBar() {
  return (
    <section className="container-site py-[clamp(2rem,4vw,3rem)]">
      <div className="grid gap-px overflow-hidden rounded-2xl bg-mist/10 sm:grid-cols-2 lg:grid-cols-4">
        {ITENS.map((c) => (
          <div key={c.tag} className="bg-[#FBF9F3] p-5">
            <p className="mono-data mb-2 text-[11px] uppercase tracking-[0.18em] text-teal-text">{c.tag}</p>
            <p className="text-[15.5px] font-semibold text-mist">{c.titulo}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4B5364]">{c.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
