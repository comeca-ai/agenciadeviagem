import { useEffect } from "react";
import { Link } from "react-router";

const CELULAS = [
  { tag: "O nome", titulo: "Uma pessoa, não uma lenda", texto: "Tandera é a personagem que dá nome à agência: quem conhecia os aviões de fora antes de entrar em um." },
  { tag: "O método", titulo: "Preço não se adivinha, se acompanha", texto: "A tarifa dela caiu de madrugada e voltou no dia seguinte. Por isso verificamos 4× por dia." },
  { tag: "A promessa", titulo: "Preço final antes do clique", texto: "Com taxas, com o nome de quem emite o bilhete, sem surpresa no checkout." },
];

export default function ALenda() {
  useEffect(() => {
    document.title = "Quem é Tandera | Olho de Tandera";
  }, []);

  return (
    <section className="container-site py-[clamp(2rem,4vw,3.5rem)] pb-20">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <p className="mono-data mb-3 text-[12px] uppercase tracking-[0.22em] text-teal-text">A personagem</p>
          <h1 className="mb-5 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.06] tracking-tight">
            Tandera sempre quis andar de avião
          </h1>
          <p className="mb-4 max-w-[54ch] text-[16.5px] leading-relaxed text-[#4B5364]">
            Ela cresceu debaixo da rota de pouso. Sabia o horário dos voos de cor, reconhecia cada companhia pela pintura da cauda e nunca havia entrado em um.
          </p>
          <p className="mb-4 max-w-[54ch] text-[16.5px] leading-relaxed text-[#4B5364]">
            O primeiro bilhete dela não veio de uma promoção anunciada: veio de uma tarifa que caiu numa terça de madrugada e voltou ao preço normal no dia seguinte. Alguém precisou olhar várias vezes por dia para encontrar.
          </p>
          <p className="mb-7 max-w-[54ch] text-[16.5px] leading-relaxed text-[#4B5364]">
            É esse trabalho que a agência faz — e é dela que vem o nome. Tandera é quem espera o preço certo para finalmente embarcar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/#busca" className="inline-flex h-12 items-center rounded-full bg-amber px-6 font-bold text-night">
              Buscar voos
            </Link>
            <Link to="/conta/alertas" className="inline-flex h-12 items-center rounded-full border border-mist/20 px-5 font-semibold text-mist">
              Criar alerta de preço
            </Link>
          </div>
        </div>
        <figure className="m-0">
          <div className="flex aspect-[4/3] items-end overflow-hidden rounded-[20px] bg-night p-8">
            <div>
              <p className="font-display text-4xl font-semibold italic text-[#F7F4EC]">Tandera</p>
              <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-[#C9C3B4]">
                Retrato ainda não publicado. A história cabe no texto — a foto entra quando vocês mandarem o arquivo.
              </p>
            </div>
          </div>
        </figure>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-mist/10 md:grid-cols-3">
        {CELULAS.map((c) => (
          <div key={c.tag} className="bg-[#FBF9F3] p-5">
            <p className="mono-data mb-2 text-[11px] uppercase tracking-[0.18em] text-teal-text">{c.tag}</p>
            <p className="font-semibold text-mist">{c.titulo}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#4B5364]">{c.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
