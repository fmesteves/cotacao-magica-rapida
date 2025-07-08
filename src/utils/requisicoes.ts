import type { Requisicao } from "@/hooks/useRequisicoes";

export const filterRequisicoes = (requisicoes: Requisicao[], searchTerm: string) => {
  if (!searchTerm.trim()) return requisicoes;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return requisicoes.filter(
    (req) =>
      req.numero_rc.toLowerCase().includes(lowerSearchTerm) ||
      req.descricao.toLowerCase().includes(lowerSearchTerm) ||
      req.fabricante.toLowerCase().includes(lowerSearchTerm) ||
      req.grupo_mercadoria.toLowerCase().includes(lowerSearchTerm) ||
      req.codigo_material.toLowerCase().includes(lowerSearchTerm)
  );
};