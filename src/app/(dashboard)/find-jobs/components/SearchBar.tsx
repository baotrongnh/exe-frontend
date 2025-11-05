import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
    searchInput: string
    onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSearch: () => void
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function SearchBar({ searchInput, onSearchInputChange, onSearch, onKeyPress }: SearchBarProps) {
    return (
        <div className="bg-card border-b border-border px-8 py-6">
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Job title or keyword"
                        className="pl-10 h-12 text-base"
                        value={searchInput}
                        onChange={onSearchInputChange}
                        onKeyPress={onKeyPress}
                    />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 min-w-[120px]" onClick={onSearch}>
                    Search
                </Button>
            </div>
        </div>
    )
}
