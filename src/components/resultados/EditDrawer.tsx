import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import SearchPanel from "@/components/SearchPanel";
import { cityByIata } from "@/lib/cities";
import type { SearchParams } from "@/lib/search";

interface EditDrawerProps {
  params: SearchParams;
  onClose: () => void;
}

/**
 * Drawer superior "Editar busca": desce do topo (0.4s, ease varredura) com o
 * SearchPanel da home pré-preenchido. Backdrop ink/70 com blur.
 */
export default function EditDrawer({ params, onClose }: EditDrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] bg-[rgba(6,8,15,0.7)] backdrop-blur-[8px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto pt-[5.5rem] scroller-thin"
      >
        <div className="container-site pb-10">
          <div className="relative mx-auto max-w-3xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar edição de busca"
              className="absolute -top-9 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(237,235,228,0.2)] text-mist transition-colors hover:border-[rgba(240,168,50,0.5)] hover:text-amber"
            >
              <X size={14} />
            </button>
            <SearchPanel
              initial={{
                origem: cityByIata(params.origem) ?? null,
                destino: cityByIata(params.destino) ?? null,
                ida: params.ida,
                volta: params.volta ?? "",
                pax: params.pax,
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
