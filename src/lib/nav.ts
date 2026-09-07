/** Navega para o painel de busca: scroll suave na home ou rota /#busca. */
export function goToBusca(pathname: string, navigate: (to: string) => void) {
  if (pathname === "/") {
    document.getElementById("busca")?.scrollIntoView({ behavior: "smooth" });
  } else {
    navigate("/#busca");
  }
}
