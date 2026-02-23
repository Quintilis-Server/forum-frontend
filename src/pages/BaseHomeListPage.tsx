import { BasePage } from "./BasePage.tsx";
import type { BaseProps, PageState } from "../types/PageTypes.ts";
import { ListComponent } from "../components/ListComponent.tsx";
import type { SortOption } from "../components/ListComponent.tsx";
import * as React from "react";
import "../stylesheet/HomeListPageStyle.scss"

export type { SortOption };

export type BaseHomeListState<T> = PageState & {
    items: T[];
    currentPage: number;
    totalPages: number;
}

export abstract class BaseHomeListPage<T extends object, P extends BaseProps, S extends BaseHomeListState<T>> extends BasePage<P, S> {
    protected abstract getApiUrl(page: number): string;
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

    protected getPageSize(): number {
        return 10;
    }

    public constructor(props: P) {
        super(props, {
            items: [],
            currentPage: 1,
            totalPages: 1,
            loading: true,
            title: ""
        } as unknown as S);
    }

    async componentDidMount() {
        super.componentDidMount();
        this.setState({ title: this.getPageTitle() });
        await this.fetchPage(1);
    }

    protected async fetchPage(page: number) {
        const result = await this.getFromApi<T[]>(this.getApiUrl(page));
        if (result !== null) {
            const items = result.data.data;
            this.setState({
                items: items,
                currentPage: page,
                totalPages: Math.max(1, Math.ceil(items.length / this.getPageSize()))
            } as unknown as Pick<S, keyof S>);
        }
    }

    private handlePageChange = (page: number) => {
        this.fetchPage(page);
    }

    protected renderContent(): React.ReactNode {
        return (
            <main className="main-home container">
                <div className="title">
                    <h1>{this.getPageTitle()}</h1>
                </div>

                <ListComponent<T>
                    items={this.state.items}
                    renderItem={(item) => this.renderItem(item)}
                    getItemLink={(item) => this.getItemLink(item)}
                    getSearchableText={(item) => this.getSearchableText(item)}
                    sortOptions={this.getSortOptions()}
                    getSortValue={(item, field) => this.getSortValue(item, field)}
                    currentPage={this.state.currentPage}
                    totalPages={this.state.totalPages}
                    onPageChange={this.handlePageChange}
                />
            </main>
        );
    }
}