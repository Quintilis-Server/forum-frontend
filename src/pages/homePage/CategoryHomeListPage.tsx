import { BaseHomeListPage, type SortOption } from "../BaseHomeListPage.tsx";
import type { Category } from "../../types/ForumTypes.ts";
import {API_FORUM_ROUTES} from "../../Consts.ts";

export class CategoryHomeListPage extends BaseHomeListPage<Category> {

    protected renderItem(item: Category): React.ReactNode {
        return (
            <>
                <div>
                    <h2>{item.title}</h2>
                    <span>{item.slug}</span>
                </div>
                <div>
                    <p>{item.description}</p>
                    <span>Tópicos: {item.topics.length}</span>
                </div>
            </>
        )
    }

    protected getSearchableText(item: Category): string {
        return `${item.title} ${item.description} ${item.slug}`;
    }

    protected getItemLink(item: Category): string {
        return `/category/${item.id}`;
    }

    protected getSortOptions(): SortOption[] {
        return [
            { label: "Título", field: "title" },
            { label: "Data de criação", field: "created_at" },
            { label: "Ordem", field: "display_order" },
        ];
    }

    protected getApiUrl(): string {
        return `${API_FORUM_ROUTES}/category/all`
    }

    protected getPageTitle(): string {
        return "Categorias"
    }
}