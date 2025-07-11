import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface RequisicaoFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const RequisicaoFilters = ({ searchTerm, onSearchChange }: RequisicaoFiltersProps) => {
  return (
    <Card className="shadow-soft" style={{border: 'none', borderRadius: 0}}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, material, fabricante, grupo..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};