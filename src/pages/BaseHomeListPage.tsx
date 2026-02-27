import { BasePage } from "./BasePage.tsx";
import type {BaseProps, PageState} from "../types/PageTypes.ts";
import { ListComponent } from "../components/ListComponent.tsx";
import type { SortOption } from "../components/ListComponent.tsx";
import * as React from "react";
import "../stylesheet/HomeListPageStyle.scss"

export type { SortOption };

export abstract class BaseHomeListPage<T extends object, P extends BaseProps = BaseProps, S extends PageState = PageState> extends BasePage<P, S> {
    // Agora retorna apenas a base da URL (ex: "/users/all")
    protected abstract getApiUrl(): string;
    protected abstract getPageTitle(): string;
    protected abstract renderItem(item: T): React.ReactNode;
    protected abstract getSearchableText(item: T): string;
    protected abstract getItemLink(item: T): string;

    protected getSortOptions(): SortOption[] {
        return [];
    }

    protected getSortValue(item: T, field: string): string | number {
        return (item as Record<string, any>)[field] ?? "";
    }

    public constructor(props: P) {
        super(props, {
            loading: false, // O loading agora acontece dentro do ListComponent
            title: ""
        } as unknown as S);
    }

    async componentDidMount() {
        super.componentDidMount();
        this.setState({ title: this.getPageTitle() });
    }

    protected renderContent(): React.ReactNode {
        return (
            <main className="main-home container">
                <div className="title">
                    <h1>{this.getPageTitle()}</h1>
                </div>

                {/* O ListComponent agora é independente */}
                <ListComponent<T>
                    apiUrl={this.getApiUrl()}
                    renderItem={(item) => this.renderItem(item)}
                    getItemLink={(item) => this.getItemLink(item)}
                    getSearchableText={(item) => this.getSearchableText(item)}
                    sortOptions={this.getSortOptions()}
                    getSortValue={(item, field) => this.getSortValue(item, field)}
                />
            </main>
        );
    }
}